from fastapi import FastAPI, HTTPException, Depends, Path
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from app.dbLogic import DocumentIn, get_db, get_embedding
from typing import List
from app.auth_utils import get_current_user
import os
import requests
import firebase_admin
import textwrap
from firebase_admin import credentials


CHUNK_SIZE = 1000

cred = credentials.Certificate("inquiro-ddef8-firebase-adminsdk-fbsvc-bca8667a34.json")
firebase_admin.initialize_app(cred)

load_dotenv()
app = FastAPI()


class MessageHistoryItem(BaseModel):
    role: str  # 'user' or 'bot'
    content: str

class MessageRequest(BaseModel):
    message: str
    history: List[MessageHistoryItem]


origins = [
    "http://localhost:5173",
    "localhost:5173",
    "https://inquiro-1-rai1.onrender.com",
    "https://inquiro-lrza.onrender.com",
    "https://inquiro-two.vercel.app"
]

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


@app.get("/", tags=["root"])
async def read_root() -> dict:
    return {"message": "Hello"}


@app.post("/chat")
async def chat_with_openai(request: MessageRequest, user=Depends(get_current_user)):
    user_id = user['user_id']

    headers = {
        "Authorization": f"Bearer {OPENAI_API_KEY}",
        "Content-Type": "application/json"
    }
    context = [
                {
                "role": "system",
                "content": "You are a helpful assistant designed to answer questions based on the provided context from documents submited by users."
                },
            ]

    for item in request.history:
        if isinstance(item, MessageHistoryItem):
            if item.role == "bot":
                item.role = "assistant"
            context.append(item.dict())

    docs = await get_context(request.message, user_id)

    if not docs:
        context += [
            {
                "role": "system",
                "content": "The user's query did not match any of his documents, inform them politely and answer to the best of your abilities."
            }
            ]
    else:
        context += docs

    full_message = context + [{"role": "user", "content": request.message}]
    print(context)
    payload = {
        "model": "gpt-3.5-turbo",
        "messages": full_message
    }

    try:
        response = requests.post(
            "https://api.openai.com/v1/chat/completions",
            headers=headers,
            json=payload,
            timeout=10
        )
        response.raise_for_status()
        data = response.json()

        reply = data["choices"][0]["message"]["content"]
        return {"reply": reply}

    except requests.RequestException as e:
        print(e.response.text)
        raise HTTPException(status_code=500, detail=f"Error while communicating with OpenAI: {e}")


@app.post("/documents")
async def add_document(doc: DocumentIn, user=Depends(get_current_user)):
    user_id = user['user_id']
    conn = await get_db()
    try:
        result = await conn.fetchrow(
            "INSERT INTO documents (name, user_id) VALUES ($1, $2) RETURNING id",
            doc.name, user_id
        )
        document_id = result['id']

        chunks = textwrap.wrap(doc.content, CHUNK_SIZE)

        for i, chunk in enumerate(chunks):
            embedding = await get_embedding(chunk)
            await conn.execute(
                """
                INSERT INTO document_chunks (document_id, chunk_index, content, embedding)
                VALUES ($1, $2, $3, $4)
                """,
                document_id, i, chunk, embedding
            )

        return {"status": "ok", "chunks": len(chunks), "document_id": document_id}

    finally:
        await conn.close()


@app.get("/documents")
async def get_documents(user=Depends(get_current_user)):
    user_id = str(user['user_id'])
    conn = await get_db()
    try:
        rows = await conn.fetch(
            """
            SELECT id, name, user_id
            FROM documents
            WHERE user_id = $1::TEXT
            """,
            user_id
        )
        results = [{"id": r["id"], "name": r["name"]} for r in rows]

        return {"docs": results}
    finally:
        await conn.close()


@app.delete("/documents/{document_id}")
async def delete_document(document_id: int, user=Depends(get_current_user)):
    user_id = user['user_id']
    conn = await get_db()
    try:
        deleted = await conn.fetchrow(
            """
            DELETE FROM documents
            WHERE id = $1 AND user_id = $2
            RETURNING id, name
            """,
            document_id, user_id
        )
        if not deleted:
            raise HTTPException(status_code=404, detail="Document not found")

        await conn.execute(
            """
            DELETE FROM document_chunks
            WHERE document_id = $1
            """,
            document_id
        )

        return deleted

    finally:
        await conn.close()


async def get_context(query: str, user_id, top_k: int = 3):
    conn = await get_db()
    try:
        query_embedding = await get_embedding(query)

        rows = await conn.fetch(
            """
            SELECT dc.id, dc.content, dc.embedding
            FROM document_chunks dc
            JOIN documents d ON dc.document_id = d.id
            WHERE dc.embedding <-> $1 < 0.6 AND d.user_id = $2
            ORDER BY dc.embedding <-> $1
            LIMIT $3
            """,
            query_embedding, user_id, top_k
        )

        context = [{"role": "system", "content": r["content"]} for r in rows]

        return context
    finally:
        await conn.close()
