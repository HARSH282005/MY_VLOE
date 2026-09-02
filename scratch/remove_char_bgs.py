import os
from rembg import remove
from PIL import Image

def process_image(input_path, output_path):
    print(f"Processing {input_path}...")
    try:
        input_image = Image.open(input_path)
        output_image = remove(input_image)
        output_image.save(output_path)
        print(f"Saved to {output_path}")
    except Exception as e:
        print(f"Error processing {input_path}: {e}")

if __name__ == "__main__":
    files = [
        "public/sprite_pink.jpg",
        "public/sprite_red.jpg",
        "public/sprite_frog.jpg"
    ]
    
    for file in files:
        if os.path.exists(file):
            out_file = file.replace(".jpg", ".png")
            process_image(file, out_file)
        else:
            print(f"File not found: {file}")
