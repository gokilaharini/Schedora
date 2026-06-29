from werkzeug.security import generate_password_hash
from db import get_connection

connection = get_connection()
cursor = connection.cursor()

users = [
    ("Admin", "admin", "admin@gmail.com", "admin123"),
    ("John", "user", "john@gmail.com", "john123"),
    ("Alice", "user", "alice@gmail.com", "alice123"),
    ("Bob", "user", "bob@gmail.com", "bob123"),
    ("Charlie", "user", "charlie@gmail.com", "charlie123"),
]

for name, role, email, password in users:

    cursor.execute("""
        INSERT INTO users
        (name, role, email, password)
        VALUES (%s, %s, %s, %s)
    """, (
        name,
        role,
        email,
        generate_password_hash(password)
    ))

connection.commit()

cursor.close()
connection.close()

print("Users inserted successfully.")