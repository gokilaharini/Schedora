from models.room_model import get_all_rooms, get_available_rooms
from auth import login_required
from utils.validators import validate_booking_time
from flask import Blueprint, request, jsonify

room_bp = Blueprint("room", __name__)

@room_bp.route("/rooms", methods=["GET"])
@login_required
def view_rooms():

    rooms = get_all_rooms()

    if rooms is None:
        return jsonify({
            "success": False,
            "message": "Unable to fetch rooms."
        }), 500

    return jsonify({
        "success": True,
        "count": len(rooms),
        "rooms": rooms
    }), 200

@room_bp.route("/rooms/available", methods=["GET"])
@login_required
def available_rooms():

    start_time = request.args.get("start_time")
    end_time = request.args.get("end_time")

    if start_time or end_time:

        if not start_time or not end_time:

            return jsonify({
                "success": False,
                "message": "Both start_time and end_time are required."
            }), 400

        validation = validate_booking_time(start_time, end_time)

        if not validation["success"]:
            return jsonify(validation), 400

    result = get_available_rooms(
        start_time,
        end_time
    )

    return jsonify({
        "success": result["success"],
        "message": result["message"],
        "data": result["data"]
    }), result["status"]
