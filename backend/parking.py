import json
import cv2
import numpy as np

from ultralytics import YOLO
from ultralytics.utils import LOGGER, checks
from ultralytics.utils.plotting import Annotator


# -------------------------------
# Parking Points Selection Tool
# -------------------------------

class ParkingPtsSelection:
    def __init__(self):
        checks.check_requirements("tkinter")

        import tkinter as tk
        from tkinter import filedialog, messagebox

        self.tk = tk
        self.filedialog = filedialog
        self.messagebox = messagebox

        self.setup_ui()
        self.initialize_properties()
        self.master.mainloop()

    def setup_ui(self):
        self.master = self.tk.Tk()
        self.master.title("Parking Zones Points Selector")
        self.master.resizable(False, False)

        self.canvas = self.tk.Canvas(self.master, bg="white")
        self.canvas.pack(side=self.tk.BOTTOM)

        button_frame = self.tk.Frame(self.master)
        button_frame.pack(side=self.tk.TOP)

        for text, cmd in [
            ("Upload Image", self.upload_image),
            ("Remove Last BBox", self.remove_last_bounding_box),
            ("Save", self.save_to_json),
        ]:
            self.tk.Button(button_frame, text=text, command=cmd).pack(side=self.tk.LEFT)

    def initialize_properties(self):
        self.image = self.canvas_image = None
        self.rg_data, self.current_box = [], []
        self.imgw = self.imgh = 0
        self.canvas_max_width, self.canvas_max_height = 1020, 500

    def upload_image(self):
        from PIL import Image, ImageTk

        file_path = self.filedialog.askopenfilename(
            filetypes=[("Image Files", "*.png *.jpg *.jpeg")]
        )
        if not file_path:
            return

        self.image = Image.open(file_path)
        self.imgw, self.imgh = self.image.size

        aspect_ratio = self.imgw / self.imgh
        canvas_width = (
            min(self.canvas_max_width, self.imgw)
            if aspect_ratio > 1
            else int(self.canvas_max_height * aspect_ratio)
        )
        canvas_height = (
            min(self.canvas_max_height, self.imgh)
            if aspect_ratio <= 1
            else int(canvas_width / aspect_ratio)
        )

        self.canvas.config(width=canvas_width, height=canvas_height)
        self.canvas_image = ImageTk.PhotoImage(
            self.image.resize((canvas_width, canvas_height), Image.LANCZOS)
        )

        self.canvas.create_image(0, 0, anchor=self.tk.NW, image=self.canvas_image)
        self.canvas.bind("<Button-1>", self.on_canvas_click)

        self.rg_data.clear()
        self.current_box.clear()

    def on_canvas_click(self, event):
        self.current_box.append((event.x, event.y))
        self.canvas.create_oval(event.x - 3, event.y - 3,
                                event.x + 3, event.y + 3,
                                fill="red")

        if len(self.current_box) == 4:
            self.rg_data.append(self.current_box.copy())
            self.draw_box(self.current_box)
            self.current_box.clear()

    def draw_box(self, box):
        for i in range(4):
            self.canvas.create_line(
                box[i], box[(i + 1) % 4],
                fill="blue", width=2
            )

    def remove_last_bounding_box(self):
        if not self.rg_data:
            self.messagebox.showwarning("Warning", "No bounding boxes to remove.")
            return
        self.rg_data.pop()
        self.redraw_canvas()

    def redraw_canvas(self):
        self.canvas.delete("all")
        self.canvas.create_image(0, 0,
                                 anchor=self.tk.NW,
                                 image=self.canvas_image)
        for box in self.rg_data:
            self.draw_box(box)

    def save_to_json(self):
        scale_w = self.imgw / self.canvas.winfo_width()
        scale_h = self.imgh / self.canvas.winfo_height()

        data = [
            {
                "points": [
                    (int(x * scale_w), int(y * scale_h))
                    for x, y in box
                ]
            }
            for box in self.rg_data
        ]

        with open("bounding_boxes.json", "w") as f:
            json.dump(data, f, indent=4)

        self.messagebox.showinfo(
            "Success",
            "Bounding boxes saved to bounding_boxes.json"
        )


# -------------------------------
# Parking Management System
# -------------------------------

class ParkingManagement:
    def __init__(self, **kwargs):
        self.model = YOLO(kwargs.get("model", "yolov8n.pt"))
        self.json_file = kwargs.get("json_file")

        if not self.json_file:
            LOGGER.warning("Json file missing!")
            raise ValueError("Json file path cannot be empty")

        with open(self.json_file) as f:
            self.json = json.load(f)

        self.pr_info = {"Occupancy": 0, "Available": 0}

        self.line_width = 2
        self.arc = (0, 255, 0)   # available
        self.occ = (0, 0, 255)   # occupied
        self.dc = (255, 0, 189)  # centroid

    def process_data(self, im0):

        results = self.model(im0)

        boxes = results[0].boxes
        xyxy = boxes.xyxy.cpu().numpy() if boxes is not None else []
        clss = boxes.cls.cpu().numpy() if boxes is not None else []

        es, fs = len(self.json), 0
        annotator = Annotator(im0, self.line_width)

        for region in self.json:
            pts_array = np.array(region["points"],
                                 dtype=np.int32).reshape((-1, 1, 2))
            rg_occupied = False

            for box, cls in zip(xyxy, clss):
                xc = int((box[0] + box[2]) / 2)
                yc = int((box[1] + box[3]) / 2)

                dist = cv2.pointPolygonTest(pts_array,
                                            (xc, yc),
                                            False)

                if dist >= 0:
                    cv2.circle(im0, (xc, yc),
                               radius=self.line_width * 4,
                               color=self.dc,
                               thickness=-1)

                    rg_occupied = True
                    break

            fs, es = (fs + 1, es - 1) if rg_occupied else (fs, es)

            cv2.polylines(im0, [pts_array],
                          isClosed=True,
                          color=self.occ if rg_occupied else self.arc,
                          thickness=2)

        self.pr_info["Occupancy"] = fs
        self.pr_info["Available"] = es

        return im0