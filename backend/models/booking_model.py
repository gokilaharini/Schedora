from db import get_connection
from datetime import datetime

def book_room(user_id, room_id, title, start_time, end_time):

    connection = get_connection()

    if connection is None:
        return {
            "success": False,
            "status": 500,
            "message": "Database connection failed."
        }

    cursor = connection.cursor(dictionary=True)

    try:

        connection.start_transaction(isolation_level="READ COMMITTED")


        room_query = """
            SELECT room_id, status
            FROM rooms
            WHERE room_id = %s
            AND is_active = TRUE
            FOR UPDATE
        """

        cursor.execute(room_query, (room_id,))
        room = cursor.fetchone()

        if room is None:

            connection.rollback()

            return {
                "success": False,
                "status": 404,
                "message": "Room not found."
            }

        if room["status"] != "available":

            connection.rollback()

            return {
                "success": False,
                "status": 409,
                "message": "Room is unavailable."
            }


        overlap_query = """
            SELECT booking_id
            FROM bookings
            WHERE room_id = %s
            AND status='confirmed'
            AND (
                start_time < %s
                AND end_time > %s
            )
            FOR UPDATE
        """

        cursor.execute(
            overlap_query,
            (
                room_id,
                end_time,
                start_time
            )
        )

        if cursor.fetchone():

            connection.rollback()

            return {
                "success": False,
                "status": 409,
                "message": "Room already booked for the selected time."
            }


        insert_query = """
            INSERT INTO bookings
            (
                user_id,
                room_id,
                title,
                start_time,
                end_time
            )
            VALUES (%s, %s, %s, %s, %s)
        """

        cursor.execute(
            insert_query,
            (
                user_id,
                room_id,
                title,
                start_time,
                end_time
            )
        )
        booking_id = cursor.lastrowid

        connection.commit()

        return {
            "success": True,
            "status": 201,
            "message": "Room booked successfully.",
            "data": {
                "booking_id": booking_id
            }
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

def get_user_bookings(user_id):

    connection = get_connection()

    if connection is None:
        return None

    cursor = connection.cursor(dictionary=True)

    query = """
        SELECT
            b.booking_id,
            b.title,
            r.room_id,
            r.room_name,
            r.location,
            b.start_time,
            b.end_time,
            b.status
        FROM bookings b
        JOIN rooms r
            ON b.room_id = r.room_id
        WHERE b.user_id = %s
        ORDER BY b.start_time DESC
    """

    cursor.execute(query, (user_id,))

    bookings = cursor.fetchall()
    now = datetime.now()

    for booking in bookings:

        if (
            booking["status"] == "confirmed"
            and booking["end_time"] < now
        ):
            booking["status"] = "completed"

    cursor.close()
    connection.close()

    return bookings

def edit_booking(booking_id, user_id, room_id, start_time, end_time):

    connection = get_connection()

    if connection is None:
        return {
            "success": False,
            "status": 500,
            "message": "Database connection failed."
        }

    cursor = connection.cursor(dictionary=True)

    try:

        connection.start_transaction()

        room_query = """
            SELECT room_id, status
            FROM rooms
            WHERE room_id = %s
            AND is_active = TRUE
            FOR UPDATE
        """

        cursor.execute(room_query, (room_id,))
        room = cursor.fetchone()

        if room is None:

            connection.rollback()

            return {
                "success": False,
                "status": 404,
                "message": "Room not found."
            }

        if room["status"] != "available":

            connection.rollback()

            return {
                "success": False,
                "status": 409,
                "message": "Room is unavailable."
            }


        overlap_query = """
            SELECT booking_id
            FROM bookings
            WHERE room_id = %s
            AND booking_id <> %s
            AND status = 'confirmed'
            AND (
                start_time < %s
                AND end_time > %s
            )
            FOR UPDATE
        """

        cursor.execute(
            overlap_query,
            (
                room_id,
                booking_id,
                end_time,
                start_time
            )
        )

        overlap = cursor.fetchone()

        if overlap:

            connection.rollback()

            return {
                "success": False,
                "status": 409,
                "message": "Room already booked."
            }


        # STEP 3 : Lock Current Booking and Verify Ownership

        booking_query = """
            SELECT
                booking_id,
                user_id,
                room_id
            FROM bookings
            WHERE booking_id = %s
            FOR UPDATE
        """

        cursor.execute(
            booking_query,
            (
                booking_id,
            )
        )

        booking = cursor.fetchone()
        if booking is None:

            connection.rollback()

            return {
                "success": False,
                "status": 404,
                "message": "Booking not found."
            }


        if booking["user_id"] != user_id:

            connection.rollback()

            return {
                "success": False,
                "status": 403,
                "message": "You are not authorized to edit this booking."
            }


        update_query = """
            UPDATE bookings
            SET
                room_id=%s,
                start_time=%s,
                end_time=%s
            WHERE booking_id=%s
        """

        cursor.execute(
            update_query,
            (
                room_id,
                start_time,
                end_time,
                booking_id
            )
        )

        booking_id = cursor.lastrowid

        connection.commit()

        return {
            "success": True,
            "status": 201,
            "message": "Room booked successfully.",
            "data": {
                "booking_id": booking_id
            }
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

def cancel_booking(booking_id, user_id):

    connection = get_connection()

    if connection is None:
        return {
            "success": False,
            "status": 500,
            "message": "Database connection failed."
        }

    cursor = connection.cursor(dictionary=True)

    try:

        connection.start_transaction(isolation_level="READ COMMITTED")


        booking_query = """
            SELECT
                booking_id,
                user_id,
                room_id,
                status
            FROM bookings
            WHERE booking_id = %s
            FOR UPDATE
        """

        cursor.execute(booking_query, (booking_id,))
        booking = cursor.fetchone()

        if booking is None:

            connection.rollback()

            return {
                "success": False,
                "status": 404,
                "message": "Booking not found."
            }


        if booking["user_id"] != user_id:

            connection.rollback()

            return {
                "success": False,
                "status": 403,
                "message": "You are not authorized to edit this booking."
            }

        if booking["status"] == "cancelled":

            connection.rollback()

            return {
                "success": False,
                "status": 409,
                "message": "Booking is already cancelled."
            }


        update_query = """
            UPDATE bookings
            SET status = 'cancelled'
            WHERE booking_id = %s
        """

        cursor.execute(update_query, (booking_id,))

        connection.commit()

        return {
            "success": True,
            "status": 200,
            "message": "Booking cancelled successfully."
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

def get_all_bookings():

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
                b.booking_id,
                u.id AS user_id,
                u.name AS user_name,
                b.title,
                r.room_id,
                r.room_name,
                r.location,
                b.start_time,
                b.end_time,
                b.status,
                b.created_at
            FROM bookings b
            INNER JOIN users u
                ON b.user_id = u.id
            INNER JOIN rooms r
                ON b.room_id = r.room_id
            ORDER BY b.created_at DESC
        """

        cursor.execute(query)

        bookings = cursor.fetchall()
        now = datetime.now()

        for booking in bookings:

            if (
                booking["status"] == "confirmed"
                and booking["end_time"] < now
            ):
                booking["status"] = "completed"


        return {
            "success": True,
            "status": 200,
            "message": "Bookings fetched successfully.",
            "data": bookings
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