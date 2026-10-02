import cv2
import numpy as np

def clean_side_syringe(img_path, out_path):
    img = cv2.imread(img_path, cv2.IMREAD_COLOR)
    h, w, _ = img.shape
    
    lab = cv2.cvtColor(img, cv2.COLOR_BGR2LAB)
    
    # Border background sample
    border_mask = np.ones((h, w), dtype=bool)
    border_mask[40:h-40, 40:w-40] = False
    
    bg_l = np.median(lab[border_mask, 0])
    bg_a = np.median(lab[border_mask, 1])
    bg_b = np.median(lab[border_mask, 2])
    
    diff_l = lab[:, :, 0].astype(np.float32) - bg_l
    diff_a = lab[:, :, 1].astype(np.float32) - bg_a
    diff_b = lab[:, :, 2].astype(np.float32) - bg_b
    delta_e = np.sqrt(diff_l**2 + diff_a**2 + diff_b**2)
    
    # Syringe threshold
    mask = (delta_e > 15.0).astype(np.uint8) * 255
    
    # Morphological closing
    kernel_close = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (19, 19))
    closed = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, kernel_close)
    
    contours, _ = cv2.findContours(closed, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    final_mask = np.zeros((h, w), dtype=np.uint8)
    if contours:
        contours = sorted(contours, key=cv2.contourArea, reverse=True)
        for cnt in contours:
            if cv2.contourArea(cnt) > 2000:
                cv2.drawContours(final_mask, [cnt], -1, 255, thickness=cv2.FILLED)
                
    # Smooth edges
    final_mask_blur = cv2.GaussianBlur(final_mask, (7, 7), 1.5)
    
    # Zero out outer 20px perimeter
    final_mask_blur[:25, :] = 0
    final_mask_blur[-25:, :] = 0
    final_mask_blur[:, :25] = 0
    final_mask_blur[:, -25:] = 0
    
    b, g, r = cv2.split(img)
    rgba = cv2.merge([b, g, r, final_mask_blur])
    cv2.imwrite(out_path, rgba)
    print(f"Cleaned syringe side cutout saved to {out_path}")

clean_side_syringe("d:/3d/new2/assets/syringe_side.jpg", "d:/3d/new2/assets/syringe_side.png")
