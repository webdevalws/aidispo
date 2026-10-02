import glob
import re

html_files = glob.glob('*.html')

for filepath in html_files:
    if filepath == 'oem.html':
        continue
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Add OEM link to nav-center if not present
    if 'href="oem.html"' not in content:
        # Desktop Nav
        content = re.sub(
            r'(<a\s+href="about\.html"\s+class="nav-link[^"]*">About Us</a>)',
            r'<a href="oem.html" class="nav-link">OEM / ODM</a>\n      \1',
            content,
            count=1
        )
        # Mobile Nav
        content = re.sub(
            r'(<a\s+href="about\.html"\s+class="mobile-nav-link[^"]*">About Us</a>)',
            r'<a href="oem.html" class="mobile-nav-link">OEM / Contract Manufacturing</a>\n      \1',
            content,
            count=1
        )
        # Footer Links (under Explore Products)
        content = re.sub(
            r'(<li><a\s+href="upcoming-products\.html"[^>]*>.*?</a></li>)',
            r'\1\n            <li><a href="oem.html">OEM &amp; Contract Manufacturing</a></li>',
            content,
            count=1
        )

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

print("Updated navigation with OEM link across all pages!")
