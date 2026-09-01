import sys
from rembg import remove
from PIL import Image

images = [
    ("c:/ANTIGRAVITY/PLUTO/public/slideshow1.jpg", "c:/ANTIGRAVITY/PLUTO/public/slideshow1.png"),
    ("c:/ANTIGRAVITY/PLUTO/public/slideshow2.jpg", "c:/ANTIGRAVITY/PLUTO/public/slideshow2.png"),
    ("c:/ANTIGRAVITY/PLUTO/public/slideshow3.jpg", "c:/ANTIGRAVITY/PLUTO/public/slideshow3.png")
]

for src, dest in images:
    try:
        with open(src, 'rb') as i:
            with open(dest, 'wb') as o:
                input_data = i.read()
                output_data = remove(input_data)
                o.write(output_data)
        print(f"Processed {src} to {dest}")
    except Exception as e:
        print(f"Error processing {src}: {e}")
