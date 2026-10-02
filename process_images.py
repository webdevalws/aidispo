import numpy as np
from PIL import Image

def extract_transparent_png(input_path, output_path, bg_color_est=None):
    img = Image.open(input_path).convert("RGBA")
    data = np.array(img, dtype=np.float32)
    
    # Sample corner pixels to determine true background color
    corners = np.concatenate([
        data[:30, :30, :3].reshape(-1, 3),
        data[:30, -30:, :3].reshape(-1, 3),
        data[-30:, :30, :3].reshape(-1, 3),
        data[-30:, -30:, :3].reshape(-1, 3)
    ], axis=0)
    
    bg = np.median(corners, axis=0)
    print(f"Detected background color for {input_path}: RGB {bg}")
    
    rgb = data[:, :, :3]
    diff = np.sqrt(np.sum((rgb - bg) ** 2, axis=-1))
    
    # Thresholds for transparent background & smooth edge transition
    # Soft shadow preservation + syringe opacity
    alpha = np.zeros_like(diff)
    
    # Areas clearly distinct from background
    mask_solid = diff > 26.0
    mask_feather = (diff >= 4.0) & (diff <= 26.0)
    
    alpha[mask_solid] = 255.0
    alpha[mask_feather] = (diff[mask_feather] - 4.0) / (26.0 - 4.0) * 255.0
    
    # Adjust RGB to remove background tint at edges
    # For translucent plastic / shadow
    out_data = np.zeros_like(data, dtype=np.uint8)
    out_data[:, :, :3] = np.clip(rgb, 0, 255).astype(np.uint8)
    out_data[:, :, 3] = np.clip(alpha, 0, 255).astype(np.uint8)
    
    result = Image.fromarray(out_data, "RGBA")
    result.save(output_path, "PNG")
    print(f"Saved transparent PNG to {output_path}")

extract_transparent_png("d:/3d/new2/assets/syringe_hero.jpg", "d:/3d/new2/assets/syringe_hero.png")
extract_transparent_png("d:/3d/new2/assets/syringe_side.jpg", "d:/3d/new2/assets/syringe_side.png")
