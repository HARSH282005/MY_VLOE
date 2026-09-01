import os
import glob
from rembg import remove
from PIL import Image

upload_dir = r"C:\Users\SACHITYA\.gemini\antigravity-ide\brain\6f8d5894-2f35-4fe3-b19c-dc06b9f06660\.user_uploaded"
public_dir = r"c:\ANTIGRAVITY\PLUTO\public"

# Get all files in upload dir
files = glob.glob(os.path.join(upload_dir, "*"))
# Sort by modified time descending
files.sort(key=os.path.getmtime, reverse=True)

# The first 4 files are the corners
corners = files[:4]

for i, corner_path in enumerate(corners):
    print(f"Processing {corner_path}...")
    try:
        input_image = Image.open(corner_path)
        output_image = remove(input_image)
        output_path = os.path.join(public_dir, f"corner_{i+1}.png")
        output_image.save(output_path)
        print(f"Saved to {output_path}")
    except Exception as e:
        print(f"Error processing {corner_path}: {e}")
