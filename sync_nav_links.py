import os
import glob
import re

html_files = glob.glob('*.html')

for filepath in html_files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Update dropdown subtitles for Other Product
    content = re.sub(
        r'Gloves,\s*Tape,\s*Transfusion\s*&amp;\s*Tubing',
        'Gloves, Medical Tape &amp; Blood Transfusion',
        content
    )
    content = re.sub(
        r'Gloves,\s*Tape\s*&amp;\s*Stopcocks',
        'Gloves, Medical Tape &amp; Blood Transfusion',
        content
    )

    # 2. Update dropdown subtitles for Upcoming Product
    content = re.sub(
        r"Ryle's\s*Tube,\s*Scalp\s*Vein\s*&amp;\s*Pens",
        "Urine Bag, Ryle's Tube, Scalp Vein &amp; Diaper",
        content
    )
    content = re.sub(
        r"Ryle's\s*Tube,\s*Scalp\s*Vein\s*&amp;\s*Dialysis",
        "Urine Bag, Ryle's Tube, Scalp Vein &amp; Diaper",
        content
    )
    content = re.sub(
        r"Ryle's\s*Tube\s*&amp;\s*Scalp\s*Vein\s*Sets",
        "Urine Bag, Ryle's Tube, Scalp Vein &amp; Diaper",
        content
    )

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

print(f"Updated {len(html_files)} HTML files!")
