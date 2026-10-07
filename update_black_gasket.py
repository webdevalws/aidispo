"""
=============================================================================
AI-DISPO® Syringe Black Rubber Gasket Recoloring Engine
=============================================================================
This script converts the 3-ring rubber stopper (gasket) inside the syringe barrel
from green to high-precision medical-grade black rubber (#1A1E24 / #323842)
with realistic specular ring highlights and shadow contours.
=============================================================================
"""

import cv2
import numpy as np

def convert_gasket_to_black(image_path, gasket_x_range=None, convert_full_plunger=False):
    img = cv2.imread(image_path, cv2.IMREAD_UNCHANGED)
    if img is None:
        print(f"Skipping (not found): {image_path}")
        return
        
    hsv = cv2.cvtColor(img[:, :, :3], cv2.COLOR_BGR2HSV)
    # Detect all green pixels in the image
    green_mask = cv2.inRange(hsv, (30, 25, 25), (90, 255, 255))
    if img.shape[2] == 4:
        green_mask = cv2.bitwise_and(green_mask, img[:, :, 3])

    h, w = img.shape[:2]
    
    if gasket_x_range is not None:
        mask_target = np.zeros_like(green_mask)
        x_min, x_max = gasket_x_range
        mask_target[:, x_min:x_max] = green_mask[:, x_min:x_max]
    elif not convert_full_plunger:
        # Default relative X range for gasket (approx 46% to 55% of image width)
        mask_target = np.zeros_like(green_mask)
        x_min = int(w * 0.46)
        x_max = int(w * 0.55)
        mask_target[:, x_min:x_max] = green_mask[:, x_min:x_max]
    else:
        mask_target = green_mask

    result = img.copy()
    gray = cv2.cvtColor(img[:, :, :3], cv2.COLOR_BGR2GRAY).astype(float) / 255.0

    # Rich medical black rubber palette (#14171A to #404854 with specular highlights)
    target_val = 14 + (gray * 185)
    target_val = np.clip(target_val, 12, 215).astype(np.uint8)

    # Feather mask edges for smooth non-jagged blending
    mask_f = cv2.GaussianBlur(mask_target, (5, 5), 1.2).astype(float) / 255.0

    for c in range(3):
        channel = result[:, :, c].astype(float)
        result[:, :, c] = np.clip(channel * (1.0 - mask_f) + target_val * mask_f, 0, 255).astype(np.uint8)

    cv2.imwrite(image_path, result)
    print(f"Updated black rubber gasket: {image_path}")

if __name__ == '__main__':
    # 1. Primary interactive simulator image (assets/syringe_with_needle_aligned.png)
    # Gasket is at X = 785 to 925
    convert_gasket_to_black('assets/syringe_with_needle_aligned.png', gasket_x_range=(785, 925))

    # 2. Syringe Side view (assets/syringe_side.png)
    # Gasket is at X = 635 to 745 out of 1376
    convert_gasket_to_black('assets/syringe_side.png', gasket_x_range=(635, 745))

    # 3. Syringe Hero view (assets/syringe_hero.png)
    convert_gasket_to_black('assets/syringe_hero.png', gasket_x_range=(635, 745))

    # 4. Rubber Stopper component (assets/syringe/07-rubber-stopper.png)
    convert_gasket_to_black('assets/syringe/07-rubber-stopper.png', convert_full_plunger=True)

    # 5. Assembled syringe assets
    convert_gasket_to_black('assets/syringe/assembled.png')
    convert_gasket_to_black('assets/syringe/full-syringe.png')
    convert_gasket_to_black('assets/prod_syringe.jpg')

    print("\nAll syringe gasket images successfully updated with medical black rubber!")
