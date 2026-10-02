import os
os.environ["OPENBLAS_NUM_THREADS"] = "1"
os.environ["OMP_NUM_THREADS"] = "1"

import cv2
import numpy as np

img = cv2.imread("assets/syringe_side.jpg")
h, w, _ = img.shape

# Let's inspect the original test_grabcut_side mask
# We want to refine the mask with exact syringe geometry:
# 1. Needle: x: 80 to 300, y: 380 to 388
# 2. Needle Hub: x: 300 to 450, y: 340 to 425
# 3. Clear barrel: x: 450 to 1045, y: 344 to 435
# 4. Flange: x: 1045 to 1065, y: 306 to 463
# 5. Plunger rod: x: 1065 to 1250, y: 368 to 403
# 6. Plunger thumb rest: x: 1250 to 1275, y: 325 to 442

# Let's verify the exact bottom edge of the barrel at x=700:
# Let's look at the gradient and color
barrel_slice = img[425:455, 700]
print("Barrel bottom pixels at x=700:")
for dy, bgr in enumerate(barrel_slice):
    y = 425 + dy
    print(f"y={y}: BGR={bgr}")
