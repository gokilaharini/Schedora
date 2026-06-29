from datetime import datetime

DATETIME_FORMATS = (
    "%Y-%m-%d %H:%M:%S",
    "%Y-%m-%d %H:%M",
)


def parse_booking_datetime(value):

    for fmt in DATETIME_FORMATS:
        try:
            return datetime.strptime(value, fmt)
        except ValueError:
            continue

    return None


def validate_booking_time(start_time, end_time):
    """
    Validate booking start and end times.
    Accepts YYYY-MM-DD HH:MM or YYYY-MM-DD HH:MM:SS.
    """
    start = parse_booking_datetime(start_time)
    end = parse_booking_datetime(end_time)

    if start is None or end is None:

        return {
            "success": False,
            "message": "Invalid datetime format. Use YYYY-MM-DD HH:MM."
        }

    if end <= start:

        return {
            "success": False,
            "message": "End time must be later than start time."
        }

    if start <= datetime.now():

        return {
            "success": False,
            "message": "Booking must be scheduled for a future time."
        }

    return {
        "success": True
    }
