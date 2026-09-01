import os
from rembg import remove
from PIL import Image

upload_dir = r"C:\Users\SACHITYA\.gemini\antigravity-ide\brain\6f8d5894-2f35-4fe3-b19c-dc06b9f06660\.user_uploaded"
public_dir = r"c:\ANTIGRAVITY\PLUTO\public"

img_path = os.path.join(upload_dir, "media_1788260618213.jpg")
print(f"Processing {img_path}...")
input_image = Image.open(img_path)
output_image = remove(input_image)
output_path = os.path.join(public_dir, "white_lilies.png")
output_image.save(output_path)
print(f"Saved {output_path}")

