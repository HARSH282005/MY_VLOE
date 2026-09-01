import os
from rembg import remove
from PIL import Image

public_dir = r"c:\ANTIGRAVITY\PLUTO\public"
img_path = os.path.join(public_dir, "corner_tl_new_2.png")
print(f"Processing {img_path}...")
input_image = Image.open(img_path)
output_image = remove(input_image)
output_image.save(img_path)
print(f"Saved {img_path}")
