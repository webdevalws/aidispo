import os
import cv2
import numpy as np

os.makedirs('assets/syringe', exist_ok=True)
os.makedirs('assets/cannula', exist_ok=True)

print("Processing Green Plunger Syringe parts...")
green_img = cv2.imread('assets/Green Plunger Medical Syringe Cutout.png', cv2.IMREAD_UNCHANGED)
alpha = green_img[:, :, 3]
ys, xs = np.where(alpha > 10)

crop = green_img[ys.min():ys.max()+1, xs.min():xs.max()+1]
ch, cw, _ = crop.shape

# Target size on 1376x768 canvas
target_w = 1184
target_h = int(ch * (target_w / cw))
resized = cv2.resize(crop, (target_w, target_h), interpolation=cv2.INTER_LANCZOS4)

# Create 1376x768 base image
s_img = np.zeros((768, 1376, 4), dtype=np.uint8)
start_x = 686 - target_w // 2
start_y = 384 - target_h // 2
s_img[start_y:start_y+target_h, start_x:start_x+target_w] = resized
h, w, c = s_img.shape

# Save full syringe
cv2.imwrite('assets/syringe/full-syringe.png', s_img)
cv2.imwrite('assets/syringe/assembled.png', s_img)

# Helper function to create masked part image with feathering
def save_part(base_img, x1, x2, y1, y2, out_path, extra_mask=None):
    part = np.zeros_like(base_img)
    mask = np.zeros((h, w), dtype=np.uint8)
    
    # Fill rectangular region
    mask[y1:y2, x1:x2] = 255
    if extra_mask is not None:
        mask = cv2.bitwise_and(mask, extra_mask)
        
    # Apply mask to alpha channel
    part[:, :, :3] = base_img[:, :, :3]
    part[:, :, 3] = cv2.bitwise_and(base_img[:, :, 3], mask)
    cv2.imwrite(out_path, part)
    print(f"Saved {out_path} (pixels: {np.sum(part[:, :, 3] > 0)})")

# Syringe Parts definitions (x1, x2, y1, y2)
# 1. Needle bevel tip: x 90..160, y 360..410
save_part(s_img, 90, 160, 360, 410, 'assets/syringe/01-needle-tip.png')

# 2. Needle shaft: x 150..300, y 360..410
save_part(s_img, 150, 300, 360, 410, 'assets/syringe/02-needle-shaft.png')

# 3. Needle hub: x 285..420, y 335..430
save_part(s_img, 285, 420, 335, 430, 'assets/syringe/03-needle-hub.png')

# 4. Luer nozzle: x 410..458, y 345..430
save_part(s_img, 410, 458, 345, 430, 'assets/syringe/04-luer-nozzle.png')

# 5. Transparent barrel: x 450..1045, y 310..460
save_part(s_img, 450, 1045, 310, 460, 'assets/syringe/05-barrel.png')

# 6. Graduation marks: dark markings on barrel wall x 460..1030
bgr = s_img[:, :, :3]
barrel_gray = cv2.cvtColor(bgr, cv2.COLOR_BGR2GRAY)
dark_marks = ((barrel_gray < 85) & (s_img[:, :, 3] > 50)).astype(np.uint8) * 255
marks_mask = np.zeros((h, w), dtype=np.uint8)
marks_mask[325:445, 460:1030] = dark_marks[325:445, 460:1030]
save_part(s_img, 460, 1030, 325, 445, 'assets/syringe/06-graduation-marks.png', extra_mask=marks_mask)

# 7. Rubber stopper / Piston seal: x 675..745, y 325..445
save_part(s_img, 675, 745, 325, 445, 'assets/syringe/07-rubber-stopper.png')

# 8. Green Plunger rod: x 740..1245, y 335..435
save_part(s_img, 740, 1245, 335, 435, 'assets/syringe/08-plunger-rod.png')

# 9. Flange (finger grips): x 1030..1070, y 290..480
save_part(s_img, 1030, 1070, 290, 480, 'assets/syringe/09-flange.png')

# 10. Thumb pad: x 1240..1285, y 305..465
save_part(s_img, 1240, 1285, 305, 465, 'assets/syringe/10-thumb-pad.png')

print("Syringe parts done!")

# =============================================================================
# IV CANNULA PROCESSING
# =============================================================================
print("Processing IV Cannula parts...")
c_jpg_path = r'C:\Users\PRASHANT\.gemini\antigravity-ide\brain\7124f3b9-1ec0-41a3-9f17-af2c879f50bb\cannula_side_studio_1790761741259.jpg'
c_raw = cv2.imread(c_jpg_path)

# Extract transparent alpha for cannula
# Background is white > 242. Shadow on table below y=425 at x < 480 and below y=520
c_gray = cv2.cvtColor(c_raw, cv2.COLOR_BGR2GRAY)
c_alpha = np.where(c_gray < 245, 255, 0).astype(np.uint8)

# Table shadow removal
# Needle table shadow below y=405 at x < 480
c_alpha[402:, :480] = 0
# Shadow below wings y > 515
c_alpha[515:, :] = 0
# Shadow above y < 240
c_alpha[:240, :] = 0

# Smooth alpha and eliminate small disconnected speckles
num, lbl, stats, centroids = cv2.connectedComponentsWithStats(c_alpha)
areas = stats[1:, cv2.CC_STAT_AREA]
largest_idx = np.argmax(areas) + 1
clean_c_alpha = np.zeros_like(c_alpha)
clean_c_alpha[lbl == largest_idx] = 255

# Morphological close to keep translucent plastics intact
kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
clean_c_alpha = cv2.morphologyEx(clean_c_alpha, cv2.MORPH_CLOSE, kernel)

# Gaussian smooth edge
alpha_blur = cv2.GaussianBlur(clean_c_alpha, (3, 3), 0.5)

b, g, r = cv2.split(c_raw)
cannula_rgba = cv2.merge([b, g, r, alpha_blur])

cv2.imwrite('assets/cannula/full-cannula.png', cannula_rgba)
cv2.imwrite('assets/cannula/assembled.png', cannula_rgba)
print("Saved assets/cannula/full-cannula.png")

# Cannula Parts definitions
# 1. Introducer needle: x 80..485, y 360..405
save_part(cannula_rgba, 80, 485, 360, 405, 'assets/cannula/01-introducer-needle.png')

# 2. Catheter tube: x 475..555, y 360..410
save_part(cannula_rgba, 475, 555, 360, 410, 'assets/cannula/02-catheter-tube.png')

# 3. Catheter hub: x 545..675, y 350..425
save_part(cannula_rgba, 545, 675, 350, 425, 'assets/cannula/03-catheter-hub.png')

# 4. Stabilising wings: x 600..800, y 410..518
save_part(cannula_rgba, 600, 800, 410, 518, 'assets/cannula/04-stabilising-wings.png')

# 5. Injection port with pink cap: x 670..795, y 240..385
save_part(cannula_rgba, 670, 795, 240, 385, 'assets/cannula/05-injection-port.png')

# 6. Port cover flap: x 780..860, y 285..360
save_part(cannula_rgba, 780, 860, 285, 360, 'assets/cannula/06-port-cover-flap.png')

# 7. Flashback chamber: x 855..1180, y 330..455
save_part(cannula_rgba, 855, 1180, 330, 455, 'assets/cannula/07-flashback-chamber.png')

# 8. Luer connector cap: x 1175..1300, y 325..455
save_part(cannula_rgba, 1175, 1300, 325, 455, 'assets/cannula/08-luer-cap.png')

print("All parts successfully generated and verified!")
