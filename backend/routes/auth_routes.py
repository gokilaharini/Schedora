from flask import Blueprint, request, jsonify
from models.user_model import login_user, create_user
from auth import generate_token

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/login", methods=["POST"])
def login():

    data = request.get_json()

    if not data:
        return jsonify({
            "success": False,
            "message": "Request body is required."
        }), 400

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({
            "success": False,
            "message": "Email and password are required."
        }), 400

    result = login_user(email, password)

    if not result["success"]:
        return jsonify({
            "success": False,
            "message": result["message"]
        }), result["status"]

    token = generate_token(result["user"])

    return jsonify({
        "success": True,
        "message": "Login successful.",
        "token": token,
        "user": {
            "id": result["user"]["id"],
            "name": result["user"]["name"],
            "email": result["user"]["email"],
            "role": result["user"]["role"]
        }
    }), 200


@auth_bp.route("/signup", methods=["POST"])
def signup():

    data = request.get_json()

    if not data:
        return jsonify({
            "success": False,
            "message": "Request body is required."
        }), 400

    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    if not name or not email or not password:
        return jsonify({
            "success": False,
            "message": "Name, email, and password are required."
        }), 400

    result = create_user(name, email, password)

    if not result["success"]:
        return jsonify({
            "success": False,
            "message": result["message"]
        }), result["status"]

    return jsonify({
        "success": True,
        "message": result["message"]
    }), result["status"]
