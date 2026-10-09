import os
import re

HEADER_LANG_HTML = '''      <div class="lang-switcher-wrap" id="headerLangSwitcher">
        <button class="lang-switcher-trigger" type="button" aria-haspopup="true" aria-expanded="false" aria-label="Select Language">
          <span class="lang-btn-current-flag">
            <svg viewBox="0 0 60 40" width="22" height="15" class="lang-flag-svg" style="border-radius:2px;box-shadow:0 0 1px rgba(0,0,0,0.3);"><rect width="60" height="40" fill="#012169"/><path d="M0,0 L60,40 M60,0 L0,40" stroke="#fff" stroke-width="8"/><path d="M0,0 L60,40 M60,0 L0,40" stroke="#C8102E" stroke-width="4"/><path d="M30,0 v40 M0,20 h60" stroke="#fff" stroke-width="12"/><path d="M30,0 v40 M0,20 h60" stroke="#C8102E" stroke-width="6"/></svg>
          </span>
          <span class="lang-btn-current-code">EN</span>
          <svg class="lang-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>
        <div class="lang-dropdown" role="menu">
          <div class="lang-dropdown-inner"></div>
        </div>
      </div>\n'''

MOBILE_LANG_HTML = '''
      <!-- Mobile Language Selector -->
      <div class="mobile-lang-box">
        <span class="mobile-lang-label">Language / Region</span>
        <div class="lang-switcher-wrap" id="mobileLangSwitcher">
          <button class="lang-switcher-trigger" type="button" aria-haspopup="true" aria-expanded="false" aria-label="Select Language">
            <span class="lang-btn-current-flag">
              <svg viewBox="0 0 60 40" width="22" height="15" class="lang-flag-svg" style="border-radius:2px;box-shadow:0 0 1px rgba(0,0,0,0.3);"><rect width="60" height="40" fill="#012169"/><path d="M0,0 L60,40 M60,0 L0,40" stroke="#fff" stroke-width="8"/><path d="M0,0 L60,40 M60,0 L0,40" stroke="#C8102E" stroke-width="4"/><path d="M30,0 v40 M0,20 h60" stroke="#fff" stroke-width="12"/><path d="M30,0 v40 M0,20 h60" stroke="#C8102E" stroke-width="6"/></svg>
            </span>
            <span class="lang-btn-current-code">EN</span>
            <svg class="lang-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
          <div class="lang-dropdown" role="menu">
            <div class="lang-dropdown-inner"></div>
          </div>
        </div>
      </div>'''

SCRIPT_TAG = '  <script src="lang-switcher.js"></script>\n'

def process_html_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content

    # 1. Insert header lang switcher if not already present
    if 'id="headerLangSwitcher"' not in content:
        # Match <div class="nav-right">\n      <a href="contact.html"
        pattern = r'(<div class="nav-right">\s*)(<a href="contact\.html"[^>]*>)'
        if re.search(pattern, content):
            content = re.sub(pattern, r'\1' + HEADER_LANG_HTML + r'      \2', content, count=1)
        else:
            # Try alternate match inside .nav-right
            pattern_alt = r'(<div class="nav-right">)'
            content = re.sub(pattern_alt, r'\1\n' + HEADER_LANG_HTML, content, count=1)

    # 2. Insert mobile lang box if not already present
    if 'mobile-lang-box' not in content:
        # Insert before </div>\s*<div class="mobile-nav-footer">
        pattern_mob = r'(\s*)(</div>\s*<div class="mobile-nav-footer">)'
        if re.search(pattern_mob, content):
            content = re.sub(pattern_mob, MOBILE_LANG_HTML + r'\n    \2', content, count=1)

    # 3. Insert lang-switcher.js script tag if not present
    if 'src="lang-switcher.js"' not in content:
        if '<script src="app.js"></script>' in content:
            content = content.replace('<script src="app.js"></script>', SCRIPT_TAG + '  <script src="app.js"></script>')
        elif '<script src="product-engine.js"></script>' in content:
            content = content.replace('<script src="product-engine.js"></script>', '<script src="product-engine.js"></script>\n' + SCRIPT_TAG)
        elif '</body>' in content:
            content = content.replace('</body>', SCRIPT_TAG + '</body>')

    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated: {os.path.basename(filepath)}")
    else:
        print(f"No change needed: {os.path.basename(filepath)}")

def main():
    directory = r'd:\3d\new2'
    for fname in sorted(os.listdir(directory)):
        if fname.endswith('.html') and not fname.startswith('stored-'):
            fpath = os.path.join(directory, fname)
            process_html_file(fpath)

if __name__ == '__main__':
    main()
