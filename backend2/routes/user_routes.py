from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from db.mongo_client import db
from bson import ObjectId
import bcrypt

router = APIRouter()

# Colecciones
users_col = db["users"]
messages_col = db["messages"]
games_col = db["games"]

# ---------------------------
# 🔹 Modelos de entrada
# ---------------------------
class Register(BaseModel):
    username: str
    password: str

class Login(BaseModel):
    username: str
    password: str

class Message(BaseModel):
    username: str
    sender: str
    text: str
    game_number: int
    question_number: int

class GameUpdate(BaseModel):
    username: str
    game_number: int
    question_number: int
    correct_count: int
    highest_score: int


# ---------------------------
# 🔐 Funciones auxiliares
# ---------------------------
def hash_password(password: str) -> bytes:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())

def verify_password(password: str, hashed: bytes) -> bool:
    return bcrypt.checkpw(password.encode("utf-8"), hashed)

def get_user(username: str):
    return users_col.find_one({"username": username})


# ---------------------------
# 👤 Registro de usuario
# ---------------------------
@router.post("/register")
def register_user(data: Register):
    if get_user(data.username):
        raise HTTPException(status_code=400, detail="Username already exists")

    hashed_pw = hash_password(data.password)
    users_col.insert_one({
        "username": data.username,
        "password": hashed_pw,
        "best_score": 0,
        "current_game": 1,
        "stats": {"total_games": 0, "total_correct": 0}
    })
    return {"message": "User registered successfully!"}


# ---------------------------
# 🔓 Inicio de sesión
# ---------------------------
@router.post("/login")
def login_user(data: Login):
    user = get_user(data.username)
    if not user or not verify_password(data.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid username or password")

    return {"message": "Login successful!"}


# ---------------------------
# 💬 Guardar mensaje
# ---------------------------
@router.post("/save_message")
def save_message(data: Message):
    user = get_user(data.username)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    messages_col.insert_one({
        "user_id": user["_id"],
        "sender": data.sender,
        "text": data.text,
        "game_number": data.game_number,
        "question_number": data.question_number
    })
    return {"message": "Message saved successfully!"}


# ---------------------------
# 🧮 Actualizar progreso de juego
# ---------------------------
@router.post("/update_game")
def update_game(data: GameUpdate):
    user = get_user(data.username)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Guardar o actualizar el juego actual
    games_col.update_one(
        {"user_id": user["_id"], "game_number": data.game_number},
        {"$set": {
            "question_number": data.question_number,
            "correct_count": data.correct_count
        }},
        upsert=True
    )

    # Actualizar récord personal
    if data.highest_score > user.get("best_score", 0):
        users_col.update_one(
            {"_id": user["_id"]},
            {"$set": {"best_score": data.highest_score}}
        )

    return {"message": "Game progress updated successfully!"}


# ---------------------------
# 📊 Obtener estadísticas
# ---------------------------
@router.get("/get_stats/{username}")
def get_stats(username: str):
    user = get_user(username)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Buscar juegos y mensajes asociados
    games = list(games_col.find({"user_id": user["_id"]}, {"_id": 0}))
    messages = list(messages_col.find({"user_id": user["_id"]}, {"_id": 0}))

    return {
        "username": username,
        "best_score": user.get("best_score", 0),
        "total_games": user.get("stats", {}).get("total_games", 0),
        "total_correct": user.get("stats", {}).get("total_correct", 0),
        "games": games,
        "messages": messages
    }
