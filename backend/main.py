import cv2
import mysql.connector
import time
from datetime import datetime
from parking import ParkingManagement

# Database Connection Function
def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="Nagavalar@123",
        database="parking_system"
    )

# Initialize Parking Management System
cap = cv2.VideoCapture("Edited.mp4")
parking_manager = ParkingManagement(
    model="yolo11s.pt",
    classes=[2],
    json_file="bounding_boxes.json",
)

last_update_time = time.time()  # Track last database update
update_interval = 30  # Update database every 30 seconds

while cap.isOpened():
    ret, im0 = cap.read()
    if not ret:
        break
    
    im01 = cv2.resize(im0, (1080, 600))
    im0 = parking_manager.process_data(im01)
    
    # Extract detected parking info
    available_spaces = parking_manager.pr_info.get("Available", 0)
    occupied_spaces = parking_manager.pr_info.get("Occupancy", 0)
    
    # Check if it's time to update the database
    if time.time() - last_update_time >= update_interval:
        try:
            db = get_db_connection()
            cursor = db.cursor()
            timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            
            cursor.execute(
                "INSERT INTO parking_records (available_spaces, occupied_spaces, timestamp) VALUES (%s, %s, %s)",
                (available_spaces, occupied_spaces, timestamp)
            )
            db.commit()
            cursor.close()
            db.close()
            last_update_time = time.time()
            print(f"Updated DB: {available_spaces} available, {occupied_spaces} occupied at {timestamp}")
        except Exception as e:
            print(f"Database update failed: {e}")
    
    cv2.imshow("Parking Management", im0)
    if cv2.waitKey(1) & 0xFF == 27:
        break

cap.release()
cv2.destroyAllWindows()
