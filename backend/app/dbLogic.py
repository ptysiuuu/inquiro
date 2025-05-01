from fastapi import FastAPI
from pydantic import BaseModel
import asyncpg
import openai
import os
from pgvector.asyncpg import register_vector
from dotenv import load_dotenv


load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")


class DocumentIn(BaseModel):
    content: str
    name: str

async def get_db():
    conn = await asyncpg.connect(DATABASE_URL)
    await register_vector(conn)
    return conn

async def get_embedding(text: str):
    response = openai.embeddings.create(
        model="text-embedding-ada-002",
        input=text
    )
    return response.data[0].embedding
