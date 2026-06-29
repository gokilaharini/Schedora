from db import get_connection

def get_all_rooms():
    """
    Returns all active rooms.
    """
    connection = get_connection()

    if connection is None:
        return None

    cursor = connection.cursor(dictionary=True)

    query = """
        SELECT
            room_id,
            room_name,
            capacity,
            location,
            status
        FROM rooms
        WHERE is_active = TRUE
        ORDER BY room_name
    """

    cursor.execute(query)

    rooms = cursor.fetchall()

    cursor.close()
    connection.close()

    return rooms


from db import get_connection


def get_available_rooms(start_time=None, end_time=None):

    connection = get_connection()

    if connection is None:
        return {
            "success": False,
            "status": 500,
            "message": "Database connection failed."
        }

    cursor = connection.cursor(dictionary=True)

    try:

        if start_time is None or end_time is None:

            query = """
                SELECT
                    r.room_id,
                    r.room_name,
                    r.capacity,
                    r.location
                FROM rooms r
                WHERE
                    r.is_active = TRUE
                    AND r.status = 'available'
                    AND NOT EXISTS (
                        SELECT 1
                        FROM bookings b
                        WHERE b.room_id = r.room_id
                        AND b.status = 'confirmed'
                        AND NOW() BETWEEN b.start_time AND b.end_time
                    )
                ORDER BY r.room_name
            """

            cursor.execute(query)


        else:

            query = """
                SELECT
                    r.room_id,
                    r.room_name,
                    r.capacity,
                    r.location
                FROM rooms r
                WHERE
                    r.is_active = TRUE
                    AND r.status = 'available'
                    AND NOT EXISTS (
                        SELECT 1
                        FROM bookings b
                        WHERE b.room_id = r.room_id
                        AND b.status = 'confirmed'
                        AND (
                            b.start_time < %s
                            AND b.end_time > %s
                        )
                    )
                ORDER BY r.room_name
            """

            cursor.execute(
                query,
                (
                    end_time,
                    start_time
                )
            )

        rooms = cursor.fetchall()

        return {
            "success": True,
            "status": 200,
            "message": "Available rooms fetched successfully.",
            "data": rooms
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

def add_room(room_name, capacity, location):

    connection = get_connection()

    if connection is None:
        return {
            "success": False,
            "status": 500,
            "message": "Database connection failed."
        }

    cursor = connection.cursor(dictionary=True)

    try:

        # Check if room already exists
        query = """
            SELECT room_id
            FROM rooms
            WHERE room_name = %s
            AND is_active = TRUE
        """

        cursor.execute(query, (room_name,))

        room = cursor.fetchone()

        if room:

            return {
                "success": False,
                "status": 409,
                "message": "Room already exists."
            }

        insert_query = """
            INSERT INTO rooms
            (
                room_name,
                capacity,
                location
            )
            VALUES (%s,%s,%s)
        """

        cursor.execute(
            insert_query,
            (
                room_name,
                capacity,
                location
            )
        )

        connection.commit()

        return {
            "success": True,
            "status": 201,
            "message": "Room added successfully."
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

def update_room(room_id, room_name, capacity, location, status):

    connection = get_connection()

    if connection is None:
        return {
            "success": False,
            "status": 500,
            "message": "Database connection failed."
        }

    cursor = connection.cursor(dictionary=True)

    try:

        room_query = """
            SELECT room_id
            FROM rooms
            WHERE room_id=%s
            AND is_active=TRUE
        """

        cursor.execute(room_query, (room_id,))

        if cursor.fetchone() is None:

            return {
                "success": False,
                "status": 404,
                "message": "Room not found."
            }

        update_query = """
            UPDATE rooms
            SET
                room_name=%s,
                capacity=%s,
                location=%s,
                status=%s
            WHERE room_id=%s
        """

        cursor.execute(
            update_query,
            (
                room_name,
                capacity,
                location,
                status,
                room_id
            )
        )

        connection.commit()

        return {
            "success": True,
            "status": 200,
            "message": "Room updated successfully."
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

def delete_room(room_id):

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
            SELECT room_id
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


        booking_query = """
            SELECT booking_id
            FROM bookings
            WHERE room_id = %s
            AND status = 'confirmed'
            FOR UPDATE
        """

        cursor.execute(booking_query, (room_id,))

        booking = cursor.fetchone()

        if booking:

            connection.rollback()

            return {
                "success": False,
                "status": 409,
                "message": "Cannot delete room. Active bookings exist."
            }


        delete_query = """
            UPDATE rooms
            SET is_active = FALSE
            WHERE room_id = %s
        """

        cursor.execute(delete_query, (room_id,))

        connection.commit()

        return {
            "success": True,
            "status": 200,
            "message": "Room deleted successfully."
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