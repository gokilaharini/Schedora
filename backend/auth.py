import jwt
import datetime
from functools import wraps
from flask import request, jsonify, g

from config import SECRET_KEY

def generate_token(user):

    payload = {
        "id": user["id"],
        "role": user["role"],
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=2)
    }

    token = jwt.encode(
        payload,
        SECRET_KEY,
        algorithm="HS256"
    )

    return token


def verify_token(token):

    try:

        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=["HS256"]
        )

        return payload

    except jwt.ExpiredSignatureError:

        return {
            "success": False,
            "message": "Token expired."
        }

    except jwt.InvalidTokenError:

        return {
            "success": False,
            "message": "Invalid token."
        }


def login_required(func):

    @wraps(func)
    def wrapper(*args, **kwargs):

        auth_header = request.headers.get("Authorization")

        if not auth_header:

            return jsonify({
                "success": False,
                "message": "Authorization header is missing."
            }), 401

        if not auth_header.startswith("Bearer "):

            return jsonify({
                "success": False,
                "message": "Invalid Authorization header."
            }), 401

        token = auth_header.split(" ")[1]

        user = verify_token(token)

        if user is None:

            return jsonify({
                "success": False,
                "message": "Invalid or expired token."
            }), 401

        g.user = user

        return func(*args, **kwargs)

    return wrapper


def admin_required(func):

    @wraps(func)
    @login_required
    def wrapper(*args, **kwargs):

        if g.user["role"] != "admin":

            return jsonify({
                "success": False,
                "message": "Admin access required."
            }), 403

        return func(*args, **kwargs)

    return wrapper