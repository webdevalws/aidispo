import re
import os

footer_path = 'd:\\3d\\new2\\footer.html'
with open(footer_path, 'r', encoding='utf-8') as f:
    footer_content = f.read().strip()

workspace = 'd:\\3d\\new2'
html_files = [f for f in os.listdir(workspace) if f.endswith('.html') and f != 'footer.html']

footer_regex = re.compile(r'<footer class="site-footer">.*?</footer>', re.DOTALL)

updated_count = 0
for filename in html_files:
    filepath = os.path.join(workspace, filename)
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    if footer_regex.search(content):
        new_content = footer_regex.sub(footer_content, content)
        if new_content != content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Updated footer in {filename}")
            updated_count += 1
        else:
            print(f"Footer already up to date in {filename}")
    else:
        print(f"No footer found in {filename}")

print(f"\nDone! Updated {updated_count} files.")
