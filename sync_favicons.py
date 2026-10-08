import os
import re

workspace = 'd:\\3d\\new2'

# Tag for standard pages:
favicon_tags = '''  <link rel="icon" type="image/png" href="assets/brand-logo.png">
  <link rel="shortcut icon" type="image/png" href="assets/brand-logo.png">
  <link rel="apple-touch-icon" href="assets/brand-logo.png">'''

# Tag for admin pages:
admin_favicon_tags = '''  <link rel="icon" type="image/png" href="../assets/brand-logo.png">
  <link rel="shortcut icon" type="image/png" href="../assets/brand-logo.png">
  <link rel="apple-touch-icon" href="../assets/brand-logo.png">'''

html_files = [os.path.join(workspace, f) for f in os.listdir(workspace) if f.endswith('.html')]
admin_index = os.path.join(workspace, 'admin', 'index.html')
if os.path.exists(admin_index):
    html_files.append(admin_index)

icon_regex = re.compile(r'\s*<link rel="(?:icon|shortcut icon|apple-touch-icon)".*?>', re.IGNORECASE)

updated = []
for filepath in html_files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    is_admin = 'admin' in filepath
    tags_to_use = admin_favicon_tags if is_admin else favicon_tags

    # Remove existing icon tags
    cleaned = icon_regex.sub('', content)

    # Insert tags before </head>
    if '</head>' in cleaned:
        new_content = cleaned.replace('</head>', f'{tags_to_use}\n</head>')
        if new_content != content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            updated.append(os.path.basename(filepath) + (' (admin)' if is_admin else ''))

print(f"Updated favicons in {len(updated)} files:")
for u in updated:
    print(f" - {u}")
