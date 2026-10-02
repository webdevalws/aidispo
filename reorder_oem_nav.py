import glob
import re

html_files = glob.glob('*.html')

for filepath in html_files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    is_oem_active = (filepath == 'oem.html')
    oem_desktop_active_cls = ' active' if is_oem_active else ''
    oem_mobile_active_cls = ' active' if is_oem_active else ''

    # 1. Remove any existing oem.html link in desktop nav and mobile nav
    content = re.sub(r'<a\s+href="oem\.html"\s+class="nav-link[^"]*">OEM\s*/\s*ODM</a>\s*\n?', '', content)
    content = re.sub(r'<a\s+href="oem\.html"\s+class="mobile-nav-link[^"]*">.*?</a>\s*\n?', '', content)

    # 2. Insert OEM / ODM right before E-Catalogue in Desktop Nav
    oem_desktop_link = f'<a href="oem.html" class="nav-link{oem_desktop_active_cls}">OEM / ODM</a>\n      '
    content = re.sub(
        r'(<a\s+href="catalogue\.html"[^>]*class="[^"]*nav-link[^"]*"[^>]*>E-Catalogue</a>)',
        f'{oem_desktop_link}\\1',
        content,
        count=1
    )

    # 3. Insert OEM / ODM right before E-Catalogue in Mobile Nav
    oem_mobile_link = f'<a href="oem.html" class="mobile-nav-link{oem_mobile_active_cls}">OEM / ODM</a>\n      '
    content = re.sub(
        r'(<a\s+href="catalogue\.html"[^>]*class="[^"]*mobile-nav-link[^"]*"[^>]*>E-Catalogue</a>)',
        f'{oem_mobile_link}\\1',
        content,
        count=1
    )

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

print(f"Reordered OEM / ODM before E-Catalogue across all {len(html_files)} HTML files!")
