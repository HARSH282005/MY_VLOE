import sys
from rembg import remove
import os

input_dir = r"C:\Users\SACHITYA\.gemini\antigravity-ide\brain\968e7713-a011-4dee-aae5-2d2a4606a27b\.user_uploaded"
output_dir = r"C:\ANTIGRAVITY\PLUTO\public"

images = [
    ("media_1788214801773.jpg", "sticker4.png"),
    ("media_1788214804206.jpg", "sticker5.png"),
    ("media_1788214807283.jpg", "sticker6.png"),
    ("media_1788214810065.jpg", "sticker7.png"),
    ("media_1788214812881.jpg", "sticker8.png")
]

for src_name, dest_name in images:
    src = os.path.join(input_dir, src_name)
    dest = os.path.join(output_dir, dest_name)
    try:
        with open(src, 'rb') as i:
            with open(dest, 'wb') as o:
                input_data = i.read()
                output_data = remove(input_data)
                o.write(output_data)
        print(f"Processed {src} to {dest}")
    except Exception as e:
        print(f"Error processing {src}: {e}")
