from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import mysql.connector
import os
import bcrypt

app = FastAPI()

origins = ["http://localhost:3000", "localhost:3000"]

mydb = mysql.connector.connect(
    host=os.getenv("MYSQL_HOST", "localhost"),
    port=os.getenv("MYSQL_PORT", 3306),
    user=os.getenv("MYSQL_USER", "root"),
    passwd=os.getenv("MYSQL_PWD", ""),
    database=os.getenv("MYSQL_DB", "task_management"),
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", tags=["root"])
async def read_root() -> dict:
    return {"message": "Welcome to your todo list."}


@app.get("/todos", tags=["todos"])
async def get_todos() -> dict:
    cursor = mydb.cursor()
    cursor.execute(
        "SELECT t.*, u.email FROM todos AS t LEFT JOIN users AS u ON t.user_id = u.id"
    )
    result = cursor.fetchall()
    return {"data": result}


@app.post("/todos", tags=["todos"])
async def add_todo(todo: dict) -> dict:
    cursor = mydb.cursor()
    sql = "INSERT INTO todos (id, item, user_id) VALUES (%s, %s, %s)"
    val = (todo["id"], todo["item"], todo["user_id"])
    cursor.execute(sql, val)
    mydb.commit()
    return {"data": {"Todo added successfully."}}


@app.put("/todos/{id}", tags=["todos"])
async def update_todo(id: int, body: dict) -> dict:
    cursor = mydb.cursor()
    sql = "UPDATE todos SET item = %s WHERE id=%s"
    val = (body["item"], id)
    cursor.execute(sql, val)
    mydb.commit()
    return {"data": f"Todo with id {id} has been updated."}


@app.delete("/todos/{id}", tags=["todos"])
async def delete_todo(id: int) -> dict:
    cursor = mydb.cursor()
    cursor.execute(f"DELETE FROM todos WHERE id = {id}")
    mydb.commit()
    return {"data": f"Todo with id {id} deleted successfully"}


@app.post("/signup", tags=["users"])
async def register(user: dict) -> dict:
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(user["password"].encode("utf-8"), bytes(salt))
    email = f"{user['email']}"
    cursor = mydb.cursor()
    sql = "INSERT INTO users (email, password, role_id) VALUES (%s, %s, %s)"
    val = (email, hashed_password, 2)
    cursor.execute(sql, val)
    mydb.commit()
    cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
    result = cursor.fetchone()
    return {"user": result}


@app.post("/login", tags=["users"])
async def login(user: dict) -> dict:
    cursor = mydb.cursor()
    email = f"{user['email']}"
    cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
    current_user = cursor.fetchone()
    current_password = current_user[2]
    if bcrypt.checkpw(
        user["password"].encode("utf8"),
        bytes(current_password.replace("b'", "").replace("'", ""), "utf-8"),
    ):
        return {"user": current_user}
    return {"message": "Password does not match!"}
