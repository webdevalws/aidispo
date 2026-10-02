import cv2
import numpy as np
from PIL import Image

# Load source image (20G Pink IV Cannula)
img = cv2.imread('assets/real_cannula_clean.png', cv2.IMREAD_UNCHANGED)
b, g, r, a = cv2.split(img)
rgb = cv2.merge([b, g, r])

# Convert RGB to HSV
hsv = cv2.cvtColor(rgb, cv2.COLOR_BGR2HSV)
h, s, v = cv2.split(hsv)

# Create mask for pink/magenta colored parts:
# Pink is typically H in [150, 180] or [0, 15] in OpenCV HSV (where H is 0-180), with S > 30
# Note that the clear chamber and steel needle have very low saturation (S < 35)
pink_mask1 = (h >= 145) & (s > 30) & (a > 20)
pink_mask2 = (h <= 15) & (s > 30) & (a > 20) & (r > g + 20)
color_mask = (pink_mask1 | pink_mask2) & (v > 30)

# Smooth the mask slightly for clean edges
mask_float = color_mask.astype(np.float32)
mask_blur = cv2.GaussianBlur(mask_float, (3, 3), 0)

# Define target gauges and their ISO colors
# OpenCV Hue range is 0-180
# 14G Orange: H ~ 12-14, High Sat
# 16G Grey: Desaturate colored part (S ~ 5-15, V adjusted)
# 18G Green: H ~ 60-70 (Emerald/Clinical Green)
# 20G Pink: Original
# 22G Blue: H ~ 105-115 (Clinical Blue)
# 24G Yellow: H ~ 25-30 (Bright Clinical Yellow)
# 26G Purple: H ~ 135-145 (Medium Purple)

gauges = {
    '14G': {'type': 'hue', 'target_h': 13, 's_scale': 1.25, 'v_scale': 1.05},
    '16G': {'type': 'grey', 's_scale': 0.08, 'v_scale': 0.95},
    '18G': {'type': 'hue', 'target_h': 65, 's_scale': 1.15, 'v_scale': 1.0},
    '20G': {'type': 'orig'},
    '22G': {'type': 'hue', 'target_h': 105, 's_scale': 1.2, 'v_scale': 1.05},
    '24G': {'type': 'hue', 'target_h': 26, 's_scale': 1.3, 'v_scale': 1.15},
    '26G': {'type': 'hue', 'target_h': 140, 's_scale': 1.2, 'v_scale': 0.95}
}

for gauge, cfg in gauges.items():
    if cfg['type'] == 'orig':
        out_img = img.copy()
    elif cfg['type'] == 'grey':
        new_h = h.copy()
        new_s = (s.astype(np.float32) * cfg['s_scale']).clip(0, 255).astype(np.uint8)
        new_v = (v.astype(np.float32) * cfg['v_scale']).clip(0, 255).astype(np.uint8)
        new_hsv = cv2.merge([new_h, new_s, new_v])
        new_bgr = cv2.cvtColor(new_hsv, cv2.COLOR_HSV2BGR)
        
        # Blend using soft mask
        alpha_factor = mask_blur[:, :, np.newaxis]
        blended = (new_bgr.astype(np.float32) * alpha_factor + rgb.astype(np.float32) * (1.0 - alpha_factor)).astype(np.uint8)
        out_img = cv2.merge([blended[:, :, 0], blended[:, :, 1], blended[:, :, 2], a])
    else:
        new_h = np.where(color_mask, np.uint8(cfg['target_h']), h)
        new_s = np.where(color_mask, (s.astype(np.float32) * cfg['s_scale']).clip(0, 255).astype(np.uint8), s)
        new_v = np.where(color_mask, (v.astype(np.float32) * cfg['v_scale']).clip(0, 255).astype(np.uint8), v)
        new_hsv = cv2.merge([new_h, new_s, new_v])
        new_bgr = cv2.cvtColor(new_hsv, cv2.COLOR_HSV2BGR)
        
        # Blend using soft mask
        alpha_factor = mask_blur[:, :, np.newaxis]
        blended = (new_bgr.astype(np.float32) * alpha_factor + rgb.astype(np.float32) * (1.0 - alpha_factor)).astype(np.uint8)
        out_img = cv2.merge([blended[:, :, 0], blended[:, :, 1], blended[:, :, 2], a])

    filename = f'assets/cannula_{gauge.lower()}.png'
    cv2.imwrite(filename, out_img)
    print(f'Generated {filename} successfully!')
