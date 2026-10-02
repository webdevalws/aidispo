import os
os.environ["OPENBLAS_NUM_THREADS"] = "1"
os.environ["OMP_NUM_THREADS"] = "1"

import cv2
import numpy as np

print("Starting clean extraction of all syringe assets...")

# =============================================================================
# 1. CLEAN SYRINGE HERO (assets/syringe_hero.png)
# =============================================================================
# Original syringe_hero.png has 3 connected components:
# Component 1 (size ~124k): The actual floating syringe
# Component 2 & 3: The ground shadow streak below y=640
hero = cv2.imread("assets/syringe_hero.png", cv2.IMREAD_UNCHANGED)
if hero is not None:
    alpha = hero[:, :, 3]
    num, lbl, stats, centroids = cv2.connectedComponentsWithStats((alpha > 15).astype(np.uint8))
    # Find the largest component (excluding 0 which is background)
    areas = stats[1:, cv2.CC_STAT_AREA]
    largest_idx = np.argmax(areas) + 1
    
    clean_alpha = np.zeros_like(alpha)
    clean_alpha[lbl == largest_idx] = alpha[lbl == largest_idx]
    
    # Also explicitly zero out anything below y=640 in the shadow zone (x: 200 to 1200)
    # The syringe needle hub at the bottom-left reaches up to y=650 at x < 350.
    # The shadow streak is at x > 350 and y > 635.
    clean_alpha[635:, 350:] = 0
    
    hero[:, :, 3] = clean_alpha
    cv2.imwrite("assets/syringe_hero.png", hero)
    print("Cleaned assets/syringe_hero.png - table shadow streak completely removed!")

# =============================================================================
# 2. CLEAN SYRINGE SIDE (assets/syringe_side.png)
# =============================================================================
# syringe_side.jpg contains:
# - Background vignette on top right (x > 1100, y < 220)
# - Syringe in the middle (x: 80 to 1280, y: 295 to 465)
# - Ground contact shadow below y=440 under barrel, y > 464 under flange
side_jpg = cv2.imread("assets/syringe_side.jpg")
if side_jpg is not None:
    h, w, _ = side_jpg.shape
    
    # Run GrabCut on the tight syringe bounding box
    mask = np.zeros((h, w), np.uint8)
    rect = (75, 290, 1225, 180)
    bgdModel = np.zeros((1, 65), np.float64)
    fgdModel = np.zeros((1, 65), np.float64)
    cv2.grabCut(side_jpg, mask, rect, bgdModel, fgdModel, 6, cv2.GC_INIT_WITH_RECT)
    
    grab_mask = np.where((mask == 1) | (mask == 3), 255, 0).astype(np.uint8)
    
    # Remove shadow under the clear barrel (x: 450 to 1045, below y=442)
    # The barrel bottom wall highlight is at y=440-442. Below y=442 is the table shadow.
    grab_mask[443:, 450:1045] = 0
    
    # Remove shadow under the needle (x: 80 to 300, below y=390)
    grab_mask[390:, 80:300] = 0
    
    # Remove shadow under the needle hub (x: 300 to 450, below y=428)
    grab_mask[428:, 300:450] = 0
    
    # Remove shadow under the plunger rod (x: 1065 to 1250, below y=405)
    grab_mask[405:, 1065:1250] = 0
    
    # Remove shadow under the plunger thumb pad (x: 1250 to 1285, below y=442)
    grab_mask[442:, 1250:] = 0
    
    # Remove shadow under the flange (x: 1045 to 1065, below y=465)
    grab_mask[465:, 1045:1065] = 0
    
    # Zero out anything outside y in [295..465]
    grab_mask[:295, :] = 0
    grab_mask[466:, :] = 0
    
    # Fill internal transparent barrel gaps
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (7, 7))
    grab_mask = cv2.morphologyEx(grab_mask, cv2.MORPH_CLOSE, kernel)
    
    # Keep only the single largest connected component (the syringe)
    num, lbl, stats, centroids = cv2.connectedComponentsWithStats(grab_mask)
    areas = stats[1:, cv2.CC_STAT_AREA]
    largest_idx = np.argmax(areas) + 1
    
    clean_side_alpha = np.zeros_like(grab_mask)
    clean_side_alpha[lbl == largest_idx] = 255
    
    # Soft anti-aliased edge
    clean_side_alpha_blur = cv2.GaussianBlur(clean_side_alpha, (3, 3), 0.8)
    
    b, g, r = cv2.split(side_jpg)
    side_rgba = cv2.merge([b, g, r, clean_side_alpha_blur])
    cv2.imwrite("assets/syringe_side.png", side_rgba)
    print("Cleaned assets/syringe_side.png - top right corner and bottom shadow completely removed!")

# =============================================================================
# 3. CLEAN SYRINGE MACRO (assets/syringe_macro.png)
# =============================================================================
macro_jpg = cv2.imread("assets/syringe_macro.jpg")
if macro_jpg is not None:
    h, w, _ = macro_jpg.shape
    
    mask = np.zeros((h, w), np.uint8)
    rect = (150, 240, 1150, 220) # y from 240 to 460
    bgdModel = np.zeros((1, 65), np.float64)
    fgdModel = np.zeros((1, 65), np.float64)
    cv2.grabCut(macro_jpg, mask, rect, bgdModel, fgdModel, 6, cv2.GC_INIT_WITH_RECT)
    
    grab_mask = np.where((mask == 1) | (mask == 3), 255, 0).astype(np.uint8)
    
    # Needle metal cannula is between y=330 and y=430.
    # Hub bottom curve ends at y=450.
    # Under cannula (x: 150 to 800), zero out anything below y=435
    grab_mask[435:, 150:800] = 0
    # Under hub (x: 800 to 1300), zero out anything below y=458
    grab_mask[458:, 800:] = 0
    # Zero out above y=235 and below y=460
    grab_mask[:235, :] = 0
    grab_mask[460:, :] = 0
    
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (7, 7))
    grab_mask = cv2.morphologyEx(grab_mask, cv2.MORPH_CLOSE, kernel)
    
    num, lbl, stats, centroids = cv2.connectedComponentsWithStats(grab_mask)
    areas = stats[1:, cv2.CC_STAT_AREA]
    largest_idx = np.argmax(areas) + 1
    
    clean_macro_alpha = np.zeros_like(grab_mask)
    clean_macro_alpha[lbl == largest_idx] = 255
    
    clean_macro_alpha_blur = cv2.GaussianBlur(clean_macro_alpha, (3, 3), 0.8)
    
    b, g, r = cv2.split(macro_jpg)
    macro_rgba = cv2.merge([b, g, r, clean_macro_alpha_blur])
    cv2.imwrite("assets/syringe_macro.png", macro_rgba)
    print("Cleaned assets/syringe_macro.png - macro table shadow completely removed!")

print("All 3 assets cleaned and saved successfully!")
