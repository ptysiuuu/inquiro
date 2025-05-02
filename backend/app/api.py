from fastapi import FastAPI, HTTPException, Depends, Path
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from dbLogic import DocumentIn, get_db, get_embedding
from typing import List
from auth_utils import get_current_user
import os
import requests


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
        embedding = await get_embedding(doc.content)
        await conn.execute(
            "INSERT INTO documents (content, embedding, user_id, name) VALUES ($1, $2, $3, $4)",
            doc.content, embedding, user_id, doc.name
        )
        return {"status": "ok"}
    finally:
        await conn.close()


@app.get("/documents")
async def get_documents(user=Depends(get_current_user)):
    user_id = user['user_id']
    conn = await get_db()
    try:
        rows = await conn.fetch(
            """
            SELECT id, content, user_id, name
            FROM documents
            WHERE user_id = $1
            """,
            user_id
        )
        results = [{"id": r["id"], "content": r["content"], "name": r["name"]} for r in rows]

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
            RETURNING id, name, content
            """,
            document_id, user_id
        )
        if not deleted:
            raise HTTPException(status_code=404, detail="Document not found")

        return deleted

    finally:
        await conn.close()


async def get_context(query: str, user_id, top_k: int = 3):
    conn = await get_db()
    try:
        query_embedding = await get_embedding(query)
        rows = await conn.fetch(
            """
            SELECT id, content, user_id
            FROM documents
            WHERE embedding <-> $1 < 0.6 AND user_id = $3
            ORDER BY embedding <-> $1
            LIMIT $2
            """,
            query_embedding, top_k, user_id
        )
        results = [{"id": r["id"], "content": r["content"]} for r in rows]

        context = [{"role": "system", "content": doc['content']} for doc in results]

        return context
    finally:
        await conn.close()
