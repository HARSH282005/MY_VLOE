import cv2
import numpy as np

def remove_white_border(image_path, output_path):
    img = cv2.imread(image_path, cv2.IMREAD_UNCHANGED)
    if img is None or img.shape[2] != 4:
        print(f"Skipping {image_path}, no alpha channel.")
        return

    b, g, r, a = cv2.split(img)
    white_mask = (r > 200) & (g > 200) & (b > 200) & (a > 0)
    white_mask = white_mask.astype(np.uint8) * 255

    _, alpha_thresh = cv2.threshold(a, 0, 255, cv2.THRESH_BINARY)
    dist_transform = cv2.distanceTransform(alpha_thresh, cv2.DIST_L2, 5)

    border_white = (white_mask == 255) & (dist_transform < 40)
    a[border_white] = 0

    kernel = np.ones((3,3), np.uint8)
    a = cv2.morphologyEx(a, cv2.MORPH_OPEN, kernel)

    result = cv2.merge((b, g, r, a))
    cv2.imwrite(output_path, result)
    print(f"Processed {image_path} -> {output_path}")

remove_white_border(r"c:\ANTIGRAVITY\PLUTO\public\tulip_note_bg_transparent.png", r"c:\ANTIGRAVITY\PLUTO\public\tulip_note_bg_transparent.png")
