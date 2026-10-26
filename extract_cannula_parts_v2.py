"""Cut the Gemini cannula part renders (white background) into transparent parts.

Clear plastic is keyed with colour-to-alpha against white, so it stays see-through
and looks identical on the light stage. Solid parts (steel, pink cap, white luer
cap) get a filled silhouette with a soft edge so they never turn see-through.

Usage: python extract_cannula_parts_v2.py [out_dir]
"""
import sys
import numpy as np
from PIL import Image
from scipy import ndimage

SRC_DIR = 'assets/cannula cl anim'
OUT_DIR = sys.argv[1] if len(sys.argv) > 1 else 'assets/cannula/v2'

# How each render is keyed: 'clear' = colour-to-alpha, 'solid' = filled silhouette
PARTS = {
    'needle': 'needle',             # steel shaft solid, clear needle hub keyed
    'catheter-hub': 'clear',
    'port-cap': 'port-cap',         # saturated pink cap solid, translucent flap keyed
    'flashback': 'clear',
    'luer-cap': 'solid',
}
NEEDLE_HUB_START = 2240             # x in needle.png where the clear needle hub begins
CAP_SATURATION = 0.22               # pink cap vs translucent flap in port-cap.png


def load(name):
    rgb = np.array(Image.open(f'{SRC_DIR}/{name}.png').convert('RGB')).astype(np.float32)
    mx = rgb.max(axis=2)
    mn = rgb.min(axis=2)
    sat = np.where(mx > 0, (mx - mn) / np.maximum(mx, 1), 0)
    return rgb, mn, sat


def background_mask(mn, sat):
    """Near-white pixels connected to the image border."""
    near_white = (mn >= 246) & (sat < 0.05)
    labels, _ = ndimage.label(near_white)
    border = np.unique(np.concatenate([labels[0], labels[-1], labels[:, 0], labels[:, -1]]))
    return np.isin(labels, border[border > 0])


def colour_to_alpha(rgb):
    """Exact inverse of compositing over white: alpha from the darkest channel."""
    alpha = (255.0 - rgb.min(axis=2)) / 255.0
    alpha = np.where(alpha < 0.02, 0, alpha)
    safe = np.maximum(alpha, 1e-4)[..., None]
    fg = np.clip((rgb - 255.0 * (1 - alpha[..., None])) / safe, 0, 255)
    return fg, alpha


def solid_alpha(obj):
    """Filled silhouette, softened by about a pixel at the edge."""
    filled = ndimage.binary_fill_holes(obj)
    return ndimage.gaussian_filter(filled.astype(np.float32), 0.7)


def cut(name, mode, out_dir):
    rgb, mn, sat = load(name)
    obj = ~background_mask(mn, sat)
    fg_clear, a_clear = colour_to_alpha(rgb)
    a_solid = solid_alpha(obj)
    h, w = mn.shape

    if mode == 'clear':
        fg, alpha = fg_clear, a_clear * obj
    elif mode == 'solid':
        fg, alpha = rgb, a_solid
    else:
        if mode == 'needle':
            solid_zone = np.zeros((h, w), bool)
            solid_zone[:, :NEEDLE_HUB_START] = True
        else:  # port-cap
            solid_zone = ndimage.binary_closing(sat > CAP_SATURATION, iterations=3)
            solid_zone = ndimage.binary_fill_holes(solid_zone)
        alpha = np.where(solid_zone, a_solid, a_clear * obj)
        fg = np.where(solid_zone[..., None], rgb, fg_clear)

    rgba = np.dstack([fg, alpha * 255]).astype(np.uint8)
    img = Image.fromarray(rgba)
    bbox = img.getchannel('A').point(lambda v: 255 if v > 8 else 0).getbbox()
    pad = 8
    bbox = (max(bbox[0] - pad, 0), max(bbox[1] - pad, 0), min(bbox[2] + pad, w), min(bbox[3] + pad, h))
    out = img.crop(bbox)
    out.save(f'{out_dir}/{name}.png', optimize=True)
    print(name, 'crop', bbox, 'size', out.size)


# ---------------------------------------------------------------------------
# Assembly layout. World units = catheter-hub cut-out pixels. Scales come from
# mating features: cap skirt over the port stem, chamber nose into the hub's rear
# connector, luer plug into the chamber thread, needle shaft inside the catheter.
# x/y is the part's top-left corner in the assembled device.
# ---------------------------------------------------------------------------
EXPORT_SCALE = 0.5                   # world px -> exported image px (retina-sharp on desktop)
HUB_AXIS_Y = 330                     # catheter centre line
LAYOUT = {
    'catheter-hub': {'scale': 1.0, 'x': 0, 'y': 0},
    # cap skirt pressed down over the stem
    'port-cap': {'scale': 0.69, 'x': 1745 - 304 * 0.69, 'y': 200 - 618 * 0.69},
    'flashback': {'scale': 0.583, 'x': 2458, 'y': HUB_AXIS_Y - 601 * 0.583},
    # screwed fully onto the chamber thread: cap body starts where the chamber ends
    'luer-cap': {'scale': 0.425, 'x': 2458 + 2457 * 0.583 - 880 * 0.425, 'y': HUB_AXIS_Y - 400 * 0.425},
}
# The needle keeps its bevel tip and hub proportions; only the plain shaft is
# lengthened so the tip pokes out past the catheter and the hub sits in the chamber
NEEDLE = {'scale': 0.72, 'tip_end': 150, 'hub_start': 2200, 'tip_x': -55, 'hub_x': 2498, 'axis_y': 113.5}


def export(img, scale, sx=None):
    sx = scale if sx is None else sx
    w = max(1, round(img.width * sx * EXPORT_SCALE))
    h = max(1, round(img.height * scale * EXPORT_SCALE))
    return img.resize((w, h), Image.LANCZOS)


def build_needle(img):
    n = NEEDLE
    s = n['scale']
    shaft_len = (n['hub_x'] - n['tip_x']) - n['tip_end'] * s
    stretch = shaft_len / (n['hub_start'] - n['tip_end'])
    pieces = [
        export(img.crop((0, 0, n['tip_end'], img.height)), s),
        export(img.crop((n['tip_end'], 0, n['hub_start'], img.height)), s, stretch),
        export(img.crop((n['hub_start'], 0, img.width, img.height)), s),
    ]
    out = Image.new('RGBA', (sum(p.width for p in pieces), pieces[0].height))
    x = 0
    for p in pieces:
        out.alpha_composite(p, (x, 0))
        x += p.width
    world_w = out.width / EXPORT_SCALE
    return out, {'x': n['tip_x'], 'y': HUB_AXIS_Y - n['axis_y'] * s, 'w': world_w, 'h': img.height * s}


def layout(cut_dir):
    import json
    placed = {}
    for name, spec in LAYOUT.items():
        img = Image.open(f'{cut_dir}/{name}.png')
        export(img, spec['scale']).save(f'{OUT_DIR}/{name}.png', optimize=True)
        placed[name] = {'x': spec['x'], 'y': spec['y'], 'w': img.width * spec['scale'], 'h': img.height * spec['scale']}
    needle_img, placed['needle'] = build_needle(Image.open(f'{cut_dir}/needle.png'))
    needle_img.save(f'{OUT_DIR}/needle.png', optimize=True)
    placed = {k: {kk: round(vv, 1) for kk, vv in v.items()} for k, v in placed.items()}
    print(json.dumps(placed, indent=1))
    return placed


if __name__ == '__main__':
    import os
    import tempfile
    os.makedirs(OUT_DIR, exist_ok=True)
    cut_dir = tempfile.mkdtemp()
    for name, mode in PARTS.items():
        cut(name, mode, cut_dir)
    layout(cut_dir)
