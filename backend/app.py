from flask import Flask
from routes.auth_routes import auth_bp
from routes.room_routes import room_bp
from routes.booking_routes import booking_bp
from routes.admin_routes import admin_bp
from flask_cors import CORS

app = Flask(__name__)

CORS(
    app,
    resources={
        r"/*": {
            "origins": "http://localhost:5173"
        }
    }
)

app.register_blueprint(auth_bp)
app.register_blueprint(room_bp)
app.register_blueprint(booking_bp)
app.register_blueprint(admin_bp)

if __name__ == "__main__":
    app.run(debug=True)
