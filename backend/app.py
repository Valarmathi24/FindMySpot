from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import mysql.connector
import pandas as pd
from flask_bcrypt import Bcrypt
import os

app = Flask(__name__)
app.secret_key = "your_secret_key"
bcrypt = Bcrypt(app)

# Allow React frontend to connect
CORS(app)

# --- IN-MEMORY STORAGE (Temporary until you add a MySQL table for bookings) ---
all_bookings_db = []

# ---------------- DATABASE CONNECTION ---------------- #

def get_db_connection():
    db = mysql.connector.connect(
        host="localhost",
        user="root",
        password="Nagavalar@123"
    )
    cursor = db.cursor()
    cursor.execute("CREATE DATABASE IF NOT EXISTS parking_system")
    cursor.close()
    db.close()

    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="Nagavalar@123",
        database="parking_system"
    )

# ---------------- CREATE TABLES ---------------- #

def create_tables():
    db = get_db_connection()
    cursor = db.cursor()

    # USERS TABLE
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    # ADMINS TABLE
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS admins (
            id INT AUTO_INCREMENT PRIMARY KEY,
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    # PARKING RECORDS (Sensor Data)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS parking_records (
            id INT AUTO_INCREMENT PRIMARY KEY,
            available_spaces INT NOT NULL,
            occupied_spaces INT NOT NULL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    """)

    db.commit()
    cursor.close()
    db.close()

create_tables()

# ---------------- AUTHENTICATION APIs ---------------- #

@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.get_json(force=True)
    email = data.get("email")
    password = data.get("password")
    role = data.get("role")

    if not email or not password or not role:
        return jsonify({"success": False, "message": "Fields missing"}), 400

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    db = get_db_connection()
    cursor = db.cursor()

    try:
        table = "users" if role == "user" else "admins"
        cursor.execute(f"INSERT INTO {table} (email, password) VALUES (%s,%s)", (email, hashed_password))
        db.commit()
        return jsonify({"success": True, "message": "Signup successful"})
    except mysql.connector.IntegrityError:
        return jsonify({"success": False, "message": "Email already exists"})
    finally:
        cursor.close()
        db.close()

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    role = data.get("role")

    db = get_db_connection()
    cursor = db.cursor()
    table = "users" if role == "user" else "admins"
    
    cursor.execute(f"SELECT id, password FROM {table} WHERE email=%s", (email,))
    account = cursor.fetchone()
    cursor.close()
    db.close()

    if account and bcrypt.check_password_hash(account[1], password):
        return jsonify({"success": True, "message": "Login successful"})
    return jsonify({"success": False, "message": "Invalid credentials"}), 401

# ---------------- SENSOR DATA APIs ---------------- #

@app.route('/api/dashboard', methods=['GET'])
def dashboard():
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM parking_records ORDER BY timestamp DESC LIMIT 10")
    data = cursor.fetchall()
    cursor.close()
    db.close()
    return jsonify(data)

@app.route('/api/add_parking_data', methods=['POST'])
def add_parking_data():
    data = request.get_json()
    available = data.get("available_spaces")
    occupied = data.get("occupied_spaces")
    db = get_db_connection()
    cursor = db.cursor()
    cursor.execute("INSERT INTO parking_records (available_spaces, occupied_spaces) VALUES (%s,%s)", (available, occupied))
    db.commit()
    cursor.close()
    db.close()
    return jsonify({"success": True})

# ---------------- NEW: BOOKING SYNC APIs ---------------- #

@app.route('/api/sync_booking', methods=['POST'])
def sync_booking():
    try:
        new_booking = request.json
        if not new_booking:
            return jsonify({"error": "No data received"}), 400
            
        all_bookings_db.append(new_booking)
        print(f"Sync Success: {new_booking.get('transactionId')}")
        return jsonify({"message": "Booking synced", "status": "success"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/all_bookings', methods=['GET'])
def get_all_bookings():
    # Returns the list of manual user bookings to the AdminDashboard
    return jsonify(all_bookings_db)

# ---------------- REPORT GENERATION ---------------- #

@app.route('/api/download_report')
def download_report():
    db = get_db_connection()
    cursor = db.cursor()
    cursor.execute("SELECT id, available_spaces, occupied_spaces, timestamp FROM parking_records")
    data = cursor.fetchall()
    cursor.close()
    db.close()

    df = pd.DataFrame(data, columns=["ID", "Available", "Occupied", "Timestamp"])
    df['Timestamp'] = pd.to_datetime(df['Timestamp'])
    df['Date'] = df['Timestamp'].dt.date
    df['Time'] = df['Timestamp'].dt.time
    df = df[["ID", "Date", "Time", "Available", "Occupied"]]

    file_path = "parking_report.xlsx"
    df.to_excel(file_path, index=False)
    return send_file(file_path, as_attachment=True)

if __name__ == '__main__':
    app.run(host="127.0.0.1", port=5000, debug=True)