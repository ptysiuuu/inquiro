from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import os
import requests


load_dotenv()
app = FastAPI()

class MessageRequest(BaseModel):
    message: str


origins = [
    "http://localhost:5173",
    "localhost:5173"
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
async def chat_with_openai(request: MessageRequest):
    headers = {
        "Authorization": f"Bearer {OPENAI_API_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": "gpt-3.5-turbo",
        "messages": [
            {"role": "user", "content": request.message}
        ]
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
        raise HTTPException(status_code=500, detail=f"Błąd podczas komunikacji z OpenAI: {e}")