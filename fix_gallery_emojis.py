import re

with open('gallery.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update filter bar HTML with clean SVG icons and zero emojis
old_filter_bar = """        <!-- Interactive Category Filter Bar -->
        <div class="gallery-filter-bar">
          <button class="gallery-filter-btn active" data-filter="all">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
            All Showcase
          </button>
          <button class="gallery-filter-btn" data-filter="factory">
            🏭 Factory Tour &amp; Cleanrooms
          </button>
          <button class="gallery-filter-btn" data-filter="events">
            🌐 Global Events &amp; Expos
          </button>
          <button class="gallery-filter-btn" data-filter="certifications">
            📜 Certifications &amp; Standards
          </button>
          <button class="gallery-filter-btn" data-filter="products">
            💉 Sterile Products
          </button>
        </div>"""

new_filter_bar = """        <!-- Interactive Category Filter Bar -->
        <div class="gallery-filter-bar">
          <button class="gallery-filter-btn active" data-filter="all">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
            All Showcase
          </button>
          <button class="gallery-filter-btn" data-filter="factory">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/></svg>
            Factory Tour &amp; Cleanrooms
          </button>
          <button class="gallery-filter-btn" data-filter="events">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="m4.93 4.93 4.24 4.24M14.83 9.17l4.24-4.24M14.83 14.83l4.24 4.24M9.17 14.83l-4.24 4.24"/></svg>
            Global Events &amp; Expos
          </button>
          <button class="gallery-filter-btn" data-filter="certifications">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            Certifications &amp; Standards
          </button>
          <button class="gallery-filter-btn" data-filter="products">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m18 2 4 4-12 12-4-4L18 2zM15 5l4 4M2 22l4-4"/></svg>
            Sterile Products
          </button>
        </div>"""

if old_filter_bar in content:
    content = content.replace(old_filter_bar, new_filter_bar)

# 2. Remove emojis from section headers
content = content.replace('<span>🏭 Factory Tour &amp; Cleanroom Plant</span>', '<span>Factory Tour &amp; Cleanroom Plant</span>')
content = content.replace('<span>🌐 Global Medical Expos &amp; Events</span>', '<span>Global Medical Expos &amp; Events</span>')
content = content.replace('<span>📜 Regulatory Certifications &amp; Accreditations</span>', '<span>Regulatory Certifications &amp; Accreditations</span>')
content = content.replace('<span>💉 Sterile Medical Products Showcase</span>', '<span>Sterile Medical Products Showcase</span>')

with open('gallery.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("gallery.html updated successfully without emojis and with clean static filter bar!")
