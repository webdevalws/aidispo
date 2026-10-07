"""
=============================================================================
AI-DISPO® Custom Syringe Cursor Generator Script
=============================================================================
This script processes the raw image 'assets/new curs1.png', crops transparent
padding, tilts/rotates the syringe to the desired angle, enhances clarity/sharpness,
aligns the needle tip hotspot, and exports high-definition cursor PNG assets.
=============================================================================
"""

import sys
from PIL import Image, ImageFilter, ImageEnhance

# CONFIGURATION PARAMETERS
INPUT_IMAGE = 'assets/new curs1.png'
OUTPUT_MAIN = 'assets/custom_syringe_cursor.png'
OUTPUT_64 = 'assets/custom_syringe_cursor_64.png'
OUTPUT_56 = 'assets/custom_syringe_cursor_56.png'
OUTPUT_48 = 'assets/custom_syringe_cursor_48.png'

# Syringe Rotation Angle (negative = tilt barrel down-right, needle up-left)
ROTATION_ANGLE = -32

# Sharpness & Contrast Enhancement Multipliers
SHARPNESS_FACTOR = 2.8
CONTRAST_FACTOR = 1.25

# Scale Factor (0.90 = 90% of current size)
SCALE_FACTOR = 0.90

# Hotspot alignment margin from top-left (px)
HOTSPOT_MARGIN = 4

def generate_cursor(input_path=INPUT_IMAGE, angle=ROTATION_ANGLE):
    print(f"Loading source image: {input_path}")
    im = Image.open(input_path)
    
    # 1. Crop tight non-transparent bounding box
    bbox = im.getbbox()
    cropped = im.crop(bbox)
    print(f"Cropped source bbox size: {cropped.size}")
    
    # 2. Rotate syringe by angle (-32 deg tilts body to the right, needle up-left)
    rotated = cropped.rotate(angle, expand=True, resample=Image.Resampling.BICUBIC)
    rc = rotated.crop(rotated.getbbox())
    print(f"Rotated bounding box size: {rc.size}")
    
    def process_size(size):
        # Calculate aspect-fit dimensions inside (size - HOTSPOT_MARGIN) * SCALE_FACTOR
        max_dim = (size - HOTSPOT_MARGIN) * SCALE_FACTOR
        scale = max_dim / max(rc.width, rc.height)
        new_w = max(1, int(rc.width * scale))
        new_h = max(1, int(rc.height * scale))
        
        resized = rc.resize((new_w, new_h), Image.Resampling.LANCZOS)
        
        # Apply sharpness and contrast enhancements
        resized = ImageEnhance.Sharpness(resized).enhance(SHARPNESS_FACTOR)
        resized = ImageEnhance.Contrast(resized).enhance(CONTRAST_FACTOR)
        
        # Locate exact top-left needle tip pixel
        pixels = resized.load()
        non_zero = [(x, y) for y in range(resized.height) for x in range(resized.width) if pixels[x, y][3] > 80]
        tip_x, tip_y = min(non_zero, key=lambda p: p[0] + p[1])
        
        # Calculate shift to align tip pixel to HOTSPOT_MARGIN (e.g. 4, 4)
        shift_x = HOTSPOT_MARGIN - tip_x
        shift_y = HOTSPOT_MARGIN - tip_y
        
        # Create final transparent canvas
        canvas = Image.new('RGBA', (size, size), (0, 0, 0, 0))
        
        # Subtle dual contrast contour outline
        stroke_mask = Image.new('RGBA', (size, size), (0, 0, 0, 0))
        stroke_mask.paste(resized, (shift_x, shift_y))
        
        alpha = stroke_mask.split()[3]
        outline_alpha = alpha.filter(ImageFilter.GaussianBlur(0.7))
        outline_layer = Image.new('RGBA', (size, size), (255, 255, 255, 250))
        outline_layer.putalpha(outline_alpha)
        
        canvas.paste(outline_layer, (0, 0), outline_layer)
        canvas.paste(resized, (shift_x, shift_y), resized)
        
        # Verify final tip coordinates
        cpixels = canvas.load()
        cnon_zero = [(x, y) for y in range(size) for x in range(size) if cpixels[x, y][3] > 100]
        final_tip = min(cnon_zero, key=lambda p: p[0] + p[1])
        print(f"-> Generated {size}x{size} cursor (Needle Tip Hotspot = {final_tip})")
        return canvas

    c64 = process_size(64)
    c64.save(OUTPUT_64)
    c64.save(OUTPUT_MAIN)
    
    c56 = process_size(56)
    c56.save(OUTPUT_56)
    
    c48 = process_size(48)
    c48.save(OUTPUT_48)
    
    print("\nCustom syringe cursors updated successfully!")

if __name__ == '__main__':
    generate_cursor()
