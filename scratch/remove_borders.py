import cv2
import numpy as np
from PIL import Image

def remove_white_border(image_path, output_path):
    # Load image with alpha channel
    img = cv2.imread(image_path, cv2.IMREAD_UNCHANGED)
    if img is None or img.shape[2] != 4:
        print(f"Skipping {image_path}, no alpha channel.")
        return

    # Extract channels
    b, g, r, a = cv2.split(img)

    # Create a mask of the "white" pixels (you can adjust this threshold)
    # White is high values in R, G, B
    white_mask = (r > 200) & (g > 200) & (b > 200) & (a > 0)
    white_mask = white_mask.astype(np.uint8) * 255

    # Create a mask of the exterior (transparent areas)
    exterior_mask = (a == 0).astype(np.uint8) * 255

    # We want to find white pixels that are connected to the exterior.
    # To do this, we can dilate the exterior mask, and wherever it intersects with the white mask,
    # we turn those white pixels into exterior (transparent), and repeat.
    # A simpler way is to just find all white pixels that are within a certain distance of the edge.
    
    # Distance transform from the non-transparent pixels
    # Actually, we want distance from transparent pixels.
    # Inverse of alpha mask: 0 for transparent, 255 for opaque.
    _, alpha_thresh = cv2.threshold(a, 0, 255, cv2.THRESH_BINARY)
    dist_transform = cv2.distanceTransform(alpha_thresh, cv2.DIST_L2, 5)

    # Let's say any white pixel within 30 pixels of the edge should become transparent.
    # This will eat away the white border but stop at black lines or non-white colors.
    border_white = (white_mask == 255) & (dist_transform < 30)

    # Set alpha to 0 for these pixels
    a[border_white] = 0

    # Also, we can do a slight morphological opening on the alpha channel to remove tiny artifacts
    kernel = np.ones((3,3), np.uint8)
    a = cv2.morphologyEx(a, cv2.MORPH_OPEN, kernel)

    # Merge back
    result = cv2.merge((b, g, r, a))

    # Save
    cv2.imwrite(output_path, result)
    print(f"Processed {image_path} -> {output_path}")

# Process the three sticker images
remove_white_border("c:/ANTIGRAVITY/PLUTO/public/spiderman.png", "c:/ANTIGRAVITY/PLUTO/public/spiderman.png")
remove_white_border("c:/ANTIGRAVITY/PLUTO/public/cat1.png", "c:/ANTIGRAVITY/PLUTO/public/cat1.png")
remove_white_border("c:/ANTIGRAVITY/PLUTO/public/cat2.png", "c:/ANTIGRAVITY/PLUTO/public/cat2.png")
