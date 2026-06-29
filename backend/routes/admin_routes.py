from models.room_model import add_room, update_room, delete_room
from models.booking_model import get_all_bookings
from auth import admin_required
from flask import Blueprint, request, jsonify

admin_bp = Blueprint("admin", __name__)

@admin_bp.route("/rooms", methods=["POST"])
@admin_required
def create_room():

    data = request.get_json()

    if not data:

        return jsonify({
            "success": False,
            "message": "Request body is required."
        }), 400

    room_name = data.get("room_name")
    capacity = data.get("capacity")
    location = data.get("location")

    if not all([room_name, capacity, location]):

        return jsonify({
            "success": False,
            "message": "All fields are required."
        }), 400

    result = add_room(
        room_name,
        capacity,
        location
    )

    return jsonify({
        "success": result["success"],
        "message": result["message"]
    }), result["status"]

@admin_bp.route("/rooms/<int:room_id>", methods=["PUT"])
@admin_required
def edit_room(room_id):

    data = request.get_json()

    room_name = data.get("room_name")
    capacity = data.get("capacity")
    location = data.get("location")
    status = data.get("status")

    result = update_room(
        room_id,
        room_name,
        capacity,
        location,
        status
    )

    return jsonify({
        "success": result["success"],
        "message": result["message"]
    }), result["status"]

@admin_bp.route("/rooms/<int:room_id>", methods=["DELETE"])
@admin_required
def remove_room(room_id):

    result = delete_room(room_id)

    return jsonify({
        "success": result["success"],
        "message": result["message"]
    }), result["status"]


@admin_bp.route("/admin/bookings", methods=["GET"])
@admin_required
def view_all_bookings():

    result = get_all_bookings()

    return jsonify({
        "success": result["success"],
        "message": result["message"],
        "data": result.get("data", [])
    }), result["status"]
