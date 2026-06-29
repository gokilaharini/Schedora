from models.booking_model import book_room, get_user_bookings, edit_booking, cancel_booking
from flask import Blueprint, request, jsonify, g
from utils.validators import validate_booking_time
from auth import login_required

booking_bp = Blueprint("booking", __name__)


@booking_bp.route("/book", methods=["POST"])
@login_required
def create_booking():

    data = request.get_json()

    if not data:

        return jsonify({
            "success": False,
            "message": "Request body is required."
        }), 400
    user_id = g.user["id"]
    room_id = data.get("room_id")
    start_time = data.get("start_time")
    end_time = data.get("end_time")
    title = data.get("title")

    if not all([room_id, title, start_time, end_time]):

        return jsonify({
            "success": False,
            "message": "All fields are required."
        }), 400
    
    validation = validate_booking_time(start_time, end_time)

    if not validation["success"]:
        return jsonify(validation), 400

    result = book_room(
        user_id,
        room_id,
        title,
        start_time,
        end_time
    )

    response = {
        "success": result["success"],
        "message": result["message"]
    }

    if "data" in result:
        response["data"] = result["data"]

    return jsonify(response), result["status"]


@booking_bp.route("/bookings", methods=["GET"])
@login_required
def view_my_bookings():

    user_id = g.user["id"]

    bookings = get_user_bookings(user_id)

    if bookings is None:

        return jsonify({
            "success": False,
            "message": "Unable to fetch bookings."
        }), 500

    return jsonify({
        "success": True,
        "count": len(bookings),
        "bookings": bookings
    }), 200

@booking_bp.route("/booking/edit/<int:booking_id>", methods=["PUT"])
@login_required
def update_booking(booking_id):

    data = request.get_json()

    if not data:

        return jsonify({
            "success": False,
            "message": "Request body is required."
        }), 400

    room_id = data.get("room_id")
    start_time = data.get("start_time")
    end_time = data.get("end_time")

    if not all([room_id, start_time, end_time]):

        return jsonify({
            "success": False,
            "message": "All fields are required."
        }), 400
    
    validation = validate_booking_time(start_time, end_time)

    if not validation["success"]:
        return jsonify(validation), 400

    user_id = g.user["id"]
    result = edit_booking(
        booking_id,
        user_id,
        room_id,
        start_time,
        end_time
    )
    response = {
        "success": result["success"],
        "message": result["message"]
    }

    if "data" in result:
        response["data"] = result["data"]

    return jsonify(response), result["status"]

@booking_bp.route("/booking/cancel/<int:booking_id>", methods=["PUT"])
@login_required
def cancel_user_booking(booking_id):
    user_id = g.user["id"]
    result = cancel_booking(booking_id, user_id)

    return jsonify({
        "success": result["success"],
        "message": result["message"]
    }), result["status"]

