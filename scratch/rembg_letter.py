import sys
from rembg import remove
import os

input_path = r"C:\Users\SACHITYA\.gemini\antigravity-ide\brain\968e7713-a011-4dee-aae5-2d2a4606a27b\.user_uploaded\media_1788215622306.jpg"
output_path = r"C:\ANTIGRAVITY\PLUTO\public\small_letter.png"

try:
    with open(input_path, 'rb') as i:
        with open(output_path, 'wb') as o:
            input_data = i.read()
            output_data = remove(input_data)
            o.write(output_data)
    print(f"Processed {input_path} to {output_path}")
except Exception as e:
    print(f"Error processing {input_path}: {e}")
