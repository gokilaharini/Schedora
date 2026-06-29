from werkzeug.security import check_password_hash, generate_password_hash
from db import get_connection

def login_user(email, password):

    connection = get_connection()

    if connection is None:
        return {
            "success": False,
            "status": 500,
            "message": "Database connection failed."
        }

    cursor = connection.cursor(dictionary=True)

    try:

        query = """
            SELECT
                id,
                name,
                email,
                password,
                role
            FROM users
            WHERE email = %s
        """

        cursor.execute(query, (email,))
        user = cursor.fetchone()

        if user is None:

            return {
                "success": False,
                "status": 401,
                "message": "Invalid email or password."
            }

        if not check_password_hash(user["password"], password):

            return {
                "success": False,
                "status": 401,
                "message": "Invalid email or password."
            }
        
        user.pop("password")

        return {
            "success": True,
            "status": 200,
            "user": user
        }

    except Exception as e:

        return {
            "success": False,
            "status": 500,
            "message": str(e)
        }

    finally:

        cursor.close()
        connection.close()


def create_user(name, email, password):

    connection = get_connection()

    if connection is None:
        return {
            "success": False,
            "status": 500,
            "message": "Database connection failed."
        }

    cursor = connection.cursor(dictionary=True)

    try:

        check_query = """
            SELECT id
            FROM users
            WHERE email = %s
        """

        cursor.execute(check_query, (email,))
        existing_user = cursor.fetchone()

        if existing_user is not None:

            return {
                "success": False,
                "status": 409,
                "message": "An account with this email already exists."
            }

        hashed_password = generate_password_hash(password)

        insert_query = """
            INSERT INTO users (name, email, password, role)
            VALUES (%s, %s, %s, 'user')
        """

        cursor.execute(
            insert_query,
            (name, email, hashed_password)
        )

        connection.commit()

        return {
            "success": True,
            "status": 201,
            "message": "Account created successfully."
        }

    except Exception as e:

        connection.rollback()

        return {
            "success": False,
            "status": 500,
            "message": str(e)
        }

    finally:

        cursor.close()
        connection.close()