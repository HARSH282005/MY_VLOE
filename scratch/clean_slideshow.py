import os

filepath = 'c:/ANTIGRAVITY/PLUTO/index.html'
with open(filepath, 'r', encoding='utf-8') as f:
    lines = f.readlines()

out = []
skip = False
for line in lines:
    if '<link rel="stylesheet" href="/src/slideshow.css">' in line:
        continue
    if '<script src="/src/slideshow.js"></script>' in line:
        continue
    if '<!-- SLIDESHOW EXPERIENCE -->' in line:
        skip = True
    if not skip:
        out.append(line)
    if skip and '<!-- Big Letter Container -->' in line:
        skip = False
        out.append(line)

with open(filepath, 'w', encoding='utf-8') as f:
    f.writelines(out)
