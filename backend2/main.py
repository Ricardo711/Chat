from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import openai
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

openai.api_key = os.getenv("OPENAI_API_KEY")

conversation_history = []

class Question(BaseModel):
    question: str

@app.post("/ask")
async def ask_question(q: Question):
    try:
        # Add user message
        conversation_history.append({"role": "user", "content": q.question})

        # Generate model response
        response = openai.chat.completions.create(
            model="gpt-5-mini",
            messages=conversation_history
        )

        answer = response.choices[0].message.content
        conversation_history.append({"role": "assistant", "content": answer})

        
        if len(conversation_history) >= 20:
            conversation_history.clear()

        return {"answer": answer}

    except Exception as e:
        return {"error": str(e)}



