from fastapi import APIRouter
from pydantic import BaseModel
import openai
import os

router = APIRouter()
openai.api_key = os.getenv("OPENAI_API_KEY")

conversation_history = []


class Question(BaseModel):
    question: str


@router.post("/ask")
async def ask_question(q: Question):
    try:
        # Agregar mensaje del usuario
        conversation_history.append({"role": "user", "content": q.question})

        # Respuesta del modelo
        response = openai.chat.completions.create(
            model="gpt-5-mini",
            messages=conversation_history
        )

        answer = response.choices[0].message.content
        conversation_history.append({"role": "assistant", "content": answer})

        # Limpiar historial cada 20 mensajes
        if len(conversation_history) >= 20:
            conversation_history.clear()

        return {"answer": answer}

    except Exception as e:
        return {"error": str(e)}
