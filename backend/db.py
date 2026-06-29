import mysql.connector
from mysql.connector import Error
from config import DB_CONFIG

def get_connection():
    """
    Creates and returns a MySQL database connection.
    Returns None if the connection fails.
    """

    try:
        connection = mysql.connector.connect(
            host=DB_CONFIG["host"],
            user=DB_CONFIG["user"],
            password=DB_CONFIG["password"],
            database=DB_CONFIG["database"]
        )

        if connection.is_connected():
            return connection

    except Error as e:
        print(f"Database Connection Error: {e}")
        return None