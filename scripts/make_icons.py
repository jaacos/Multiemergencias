"""Genera los iconos PNG de la PWA (192, 512, maskable y apple-touch)."""
from PIL import Image, ImageDraw
import os

OUT = os.path.join(os.path.dirname(__file__), '..', 'public', 'icons')
S = 1024  # se dibuja grande y se reduce (antialias)

def draw(safe):
    img = Image.new('RGB', (S, S), '#0f172a')
    d = ImageDraw.Draw(img)
    r = int(S * safe / 2)
    c = S // 2
    d.ellipse([c - r, c - r, c + r, c + r], fill='#dc2626')
    a, b = int(r * 0.30), int(r * 0.70)  # grosor / largo medio de la cruz
    d.rectangle([c - a, c - b, c + a, c + b], fill='white')
    d.rectangle([c - b, c - a, c + b, c + a], fill='white')
    return img

normal = draw(0.80)
maskable = draw(0.56)  # zona segura del 80 % para iconos maskable
for name, img, size in [
    ('icon-192.png', normal, 192), ('icon-512.png', normal, 512),
    ('icon-maskable-512.png', maskable, 512), ('apple-touch-icon.png', normal, 180)]:
    img.resize((size, size), Image.LANCZOS).save(os.path.join(OUT, name))
