from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, EmailStr
from sqlalchemy import text
from database import SessionLocal
import bcrypt
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost:5174",   # Vite frontend
    "http://127.0.0.1:5174",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # THIS FIXES OPTIONS ISSUE
    allow_headers=["*"],
)


class SignupRequest(BaseModel):
    full_name: str
    email: EmailStr
    password: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    full_name: str
    email: EmailStr

@app.post("/api/signup")
def signup(payload: SignupRequest):
    if len(payload.password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters.")
    db = SessionLocal()
    try:
        # check existing email
        check = db.execute(text("SELECT id FROM users WHERE email = :email"), {"email": payload.email}).fetchone()
        if check:
            raise HTTPException(status_code=400, detail="Email already registered.")
        pw_hash = bcrypt.hashpw(payload.password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
        insert = text("INSERT INTO users (full_name, email, password_hash) VALUES (:full_name, :email, :password_hash)")
        db.execute(insert, {"full_name": payload.full_name, "email": payload.email, "password_hash": pw_hash})
        db.commit()
        # fetch the new user id
        new = db.execute(text("SELECT id FROM users WHERE email = :email"), {"email": payload.email}).fetchone()
        user_id = new[0] if new else None
        return {"message": "User created successfully", "user_id": user_id}
    finally:
        db.close()

@app.post("/api/login")
def login(payload: LoginRequest):
    db = SessionLocal()
    try:
        row = db.execute(text("SELECT id, full_name, email, password_hash FROM users WHERE email = :email"), {"email": payload.email}).fetchone()
        if not row:
            raise HTTPException(status_code=401, detail="Invalid credentials.")
        user_id, full_name, email, password_hash = row
        if not bcrypt.checkpw(payload.password.encode("utf-8"), password_hash.encode("utf-8")):
            raise HTTPException(status_code=401, detail="Invalid credentials.")
        return {"message": "Login successful", "user": {"id": user_id, "full_name": full_name, "email": email}}
    finally:
        db.close()

@app.get("/api/states")
def get_states():
    db = SessionLocal()
    try:
        rows = db.execute(text("SELECT id, name, capital, region, slogan, population, landmarks FROM states ORDER BY name")).fetchall()
        states = []
        for r in rows:
            states.append({
                "id": r[0],
                "name": r[1],
                "capital": r[2],
                "region": r[3],
                "slogan": r[4],
                "population": r[5],
                "landmarks": r[6]
            })
        return states
    finally:
        db.close()
