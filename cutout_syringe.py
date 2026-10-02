import cv2
import numpy as np

def clean_cutout(img_path, out_path):
    img = cv2.imread(img_path, cv2.IMREAD_COLOR)
    h, w, _ = img.shape
    
    # Convert to grayscale and LAB color space
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    lab = cv2.cvtColor(img, cv2.COLOR_BGR2LAB)
    
    # Background color estimation from border samples (50px wide border)
    border_mask = np.ones((h, w), dtype=bool)
    border_mask[60:h-60, 60:w-60] = False
    
    bg_l = np.median(lab[border_mask, 0])
    bg_a = np.median(lab[border_mask, 1])
    bg_b = np.median(lab[border_mask, 2])
    
    # Compute delta-E color distance from background
    diff_l = lab[:, :, 0].astype(np.float32) - bg_l
    diff_a = lab[:, :, 1].astype(np.float32) - bg_a
    diff_b = lab[:, :, 2].astype(np.float32) - bg_b
    delta_e = np.sqrt(diff_l**2 + diff_a**2 + diff_b**2)
    
    # Also find edges with Canny
    edges = cv2.Canny(gray, 20, 70)
    kernel_dil = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
    dilated_edges = cv2.dilate(edges, kernel_dil, iterations=1)
    
    # Syringe mask threshold (strict on background)
    # The syringe is clearly distinct from cream background
    mask = (delta_e > 16.0).astype(np.uint8) * 255
    mask = cv2.bitwise_or(mask, dilated_edges)
    
    # Perform morphological closing to fill internal transparent holes inside the syringe barrel/plastic
    kernel_close = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (15, 15))
    closed = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, kernel_close)
    
    # Find contours and keep the main syringe object
    contours, hierarchy = cv2.findContours(closed, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    final_mask = np.zeros((h, w), dtype=np.uint8)
    if contours:
        # Sort contours by area
        contours = sorted(contours, key=cv2.contourArea, reverse=True)
        # Combine large contours that belong to the syringe & needle
        for cnt in contours:
            area = cv2.contourArea(cnt)
            if area > 1200: # Syringe parts (barrel, plunger, needle hub, needle tip)
                cv2.drawContours(final_mask, [cnt], -1, 255, thickness=cv2.FILLED)
    
    # Smooth mask edges with bilateral / Gaussian blur for flawless anti-aliasing
    final_mask_blur = cv2.GaussianBlur(final_mask, (5, 5), 1.5)
    
    # Clear outer border pixels completely to guarantee zero card border
    final_mask_blur[:15, :] = 0
    final_mask_blur[-15:, :] = 0
    final_mask_blur[:, :15] = 0
    final_mask_blur[:, -15:] = 0
    
    # Create RGBA output
    b, g, r = cv2.split(img)
    rgba = cv2.merge([b, g, r, final_mask_blur])
    
    cv2.imwrite(out_path, rgba)
    print(f"Successfully processed {img_path} -> {out_path}")

clean_cutout("d:/3d/new2/assets/syringe_hero.jpg", "d:/3d/new2/assets/syringe_hero.png")
clean_cutout("d:/3d/new2/assets/syringe_side.jpg", "d:/3d/new2/assets/syringe_side.png")
