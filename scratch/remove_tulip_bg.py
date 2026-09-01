import sys
from rembg import remove
import os

input_path = r"C:\ANTIGRAVITY\PLUTO\public\tulip_note_bg.jpg"
output_path = r"C:\ANTIGRAVITY\PLUTO\public\tulip_note_bg_transparent.png"

try:
    print(f"Removing background from {input_path}...")
    with open(input_path, 'rb') as i:
        with open(output_path, 'wb') as o:
            input_data = i.read()
            output_data = remove(input_data)
            o.write(output_data)
    print(f"Processed {input_path} to {output_path}")
except Exception as e:
    print(f"Error processing {input_path}: {e}")
