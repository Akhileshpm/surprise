#!/usr/bin/env python3
"""Crop rose images to bouquet shape, remove backgrounds, export compressed WebP."""

from collections import deque
from pathlib import Path
from PIL import Image, ImageDraw

ASSETS = Path(__file__).resolve().parent.parent / "src" / "assets"

SOURCES = {
    "white": ASSETS / "roses-white.png",
    "pink": ASSETS / "roses-pink.png",
    "red": ASSETS / "roses-red.png",
}

OUTPUT_SIZE = (420, 560)
WEBP_QUALITY = 82


def color_distance(c1, c2):
    return sum(abs(a - b) for a, b in zip(c1, c2))


def sample_background(img, samples=12):
    w, h = img.size
    px = img.load()
    points = [
        (0, 0),
        (w - 1, 0),
        (0, h - 1),
        (w - 1, h - 1),
        (w // 2, 0),
        (w // 2, h - 1),
        (0, h // 2),
        (w - 1, h // 2),
        (w // 4, 0),
        (3 * w // 4, 0),
        (w // 4, h - 1),
        (3 * w // 4, h - 1),
    ]
    colors = [px[x, y][:3] for x, y in points[:samples]]
    avg = tuple(sum(c[i] for c in colors) // len(colors) for i in range(3))
    return avg


def remove_background_flood(img, tolerance=42, white_roses=False):
    img = img.convert("RGBA")
    w, h = img.size
    px = img.load()
    bg = sample_background(img)
    visited = [[False] * w for _ in range(h)]
    queue = deque()

    def matches_bg(x, y):
        r, g, b, a = px[x, y]
        if a < 5:
            return True
        dist = color_distance((r, g, b), bg)
        if white_roses:
            # Only remove near-pure background whites, not cream rose petals
            brightness = (r + g + b) / 3
            saturation = max(r, g, b) - min(r, g, b)
            if brightness > 248 and saturation < 8:
                return True
            return dist <= min(tolerance, 22)
        return dist <= tolerance

    for x in range(w):
        for y in (0, h - 1):
            if matches_bg(x, y):
                queue.append((x, y))
                visited[y][x] = True
    for y in range(h):
        for x in (0, w - 1):
            if not visited[y][x] and matches_bg(x, y):
                queue.append((x, y))
                visited[y][x] = True

    while queue:
        x, y = queue.popleft()
        px[x, y] = (px[x, y][0], px[x, y][1], px[x, y][2], 0)
        for nx, ny in ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)):
            if 0 <= nx < w and 0 <= ny < h and not visited[ny][nx]:
                if matches_bg(nx, ny):
                    visited[ny][nx] = True
                    queue.append((nx, ny))

    return img


def content_bbox(img, padding=6):
    w, h = img.size
    px = img.load()
    min_x, min_y, max_x, max_y = w, h, 0, 0
    found = False

    for y in range(h):
        for x in range(w):
            if px[x, y][3] > 24:
                found = True
                min_x = min(min_x, x)
                min_y = min(min_y, y)
                max_x = max(max_x, x)
                max_y = max(max_y, y)

    if not found:
        return (0, 0, w, h)

    return (
        max(0, min_x - padding),
        max(0, min_y - padding),
        min(w, max_x + padding),
        min(h, max_y + padding),
    )


def crop_to_bouquet(img):
    bbox = content_bbox(img)
    cropped = img.crop(bbox)
    w, h = cropped.size
    target_ratio = OUTPUT_SIZE[0] / OUTPUT_SIZE[1]

    if w / h > target_ratio:
        new_w = int(h * target_ratio)
        left = (w - new_w) // 2
        cropped = cropped.crop((left, 0, left + new_w, h))

    return cropped.resize(OUTPUT_SIZE, Image.Resampling.LANCZOS)


def apply_bouquet_mask(img):
    """Taper edges into a rounded bouquet silhouette."""
    w, h = img.size
    mask = Image.new("L", (w, h), 0)
    draw = ImageDraw.Draw(mask)

    # Rounded bouquet outline — wider at top, gathered at bottom
    draw.polygon(
        [
            (w * 0.08, h * 0.02),
            (w * 0.92, h * 0.02),
            (w * 0.78, h * 0.55),
            (w * 0.62, h * 0.92),
            (w * 0.38, h * 0.92),
            (w * 0.22, h * 0.55),
        ],
        fill=255,
    )
    draw.ellipse((w * 0.28, h * 0.88, w * 0.72, h * 1.02), fill=255)

    img = img.copy()
    img.putalpha(Image.composite(img.split()[3], Image.new("L", (w, h), 0), mask))
    return img


def cleanup_fringe(img, white_roses=False):
    """Remove pale halos left from background removal."""
    if white_roses:
        return img
    px = img.load()
    w, h = img.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if a < 20:
                continue
            brightness = (r + g + b) / 3
            saturation = max(r, g, b) - min(r, g, b)
            # Only remove very pale, low-sat fringes touching transparency
            if brightness > 230 and saturation < 30:
                neighbors_transparent = 0
                for nx, ny in ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)):
                    if 0 <= nx < w and 0 <= ny < h and px[nx, ny][3] < 30:
                        neighbors_transparent += 1
                if neighbors_transparent >= 2:
                    px[x, y] = (r, g, b, 0)
    return img


def remove_checkerboard(img, white_roses=False):
    if white_roses:
        return img
    px = img.load()
    w, h = img.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if a < 5:
                continue
            sat = max(r, g, b) - min(r, g, b)
            avg = (r + g + b) / 3
            if sat < 14 and 100 < avg < 248:
                px[x, y] = (r, g, b, 0)
    return img


def remove_isolated_checkerboard(img):
    """Remove internal checkerboard/gray backdrop without touching rose petals."""
    px = img.load()
    w, h = img.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if a < 5:
                continue
            sat = max(r, g, b) - min(r, g, b)
            avg = (r + g + b) / 3
            if sat < 12 and 115 < avg < 205:
                px[x, y] = (r, g, b, 0)
                continue
            if sat < 8 and avg > 246:
                transparent_neighbors = sum(
                    1
                    for nx, ny in ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1))
                    if 0 <= nx < w and 0 <= ny < h and px[nx, ny][3] < 30
                )
                if transparent_neighbors >= 2:
                    px[x, y] = (r, g, b, 0)
    return img


def remove_white_backdrop(img):
    """Remove white backdrop far from rose leaves, petals, and shadows."""
    px = img.load()
    w, h = img.size
    dist = [[999999] * w for _ in range(h)]
    queue = deque()

    def is_rose_structure(r, g, b, a):
        if a < 128:
            return False
        sat = max(r, g, b) - min(r, g, b)
        avg = (r + g + b) / 3
        if g > r + 8 and g > b + 8:
            return True
        if avg < 222:
            return True
        if sat >= 18:
            return True
        return False

    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if is_rose_structure(r, g, b, a):
                dist[y][x] = 0
                queue.append((x, y))

    def can_travel(r, g, b, a):
        if a < 128:
            return False
        sat = max(r, g, b) - min(r, g, b)
        avg = (r + g + b) / 3
        if avg >= 232 and sat < 16:
            return False
        return True

    while queue:
        x, y = queue.popleft()
        for nx, ny in ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)):
            if 0 <= nx < w and 0 <= ny < h:
                r, g, b, a = px[nx, ny]
                if can_travel(r, g, b, a) and dist[ny][nx] > dist[y][x] + 1:
                    dist[ny][nx] = dist[y][x] + 1
                    queue.append((nx, ny))

    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if a < 128:
                continue
            sat = max(r, g, b) - min(r, g, b)
            avg = (r + g + b) / 3
            if avg >= 218 and sat < 18 and dist[y][x] > 5:
                px[x, y] = (r, g, b, 0)
            elif avg >= 246 and sat < 10:
                px[x, y] = (r, g, b, 0)

    return img


def process(name, source):
    print(f"Processing {name}...")
    white_roses = name == "white"
    img = Image.open(source)
    img = remove_background_flood(img, white_roses=white_roses)
    img = crop_to_bouquet(img)
    img = apply_bouquet_mask(img)
    if white_roses:
        img = remove_isolated_checkerboard(img)
        img = remove_white_backdrop(img)
    img = remove_checkerboard(img, white_roses=white_roses)
    img = cleanup_fringe(img, white_roses=white_roses)

    out_webp = ASSETS / f"bouquet-{name}.webp"
    out_png = ASSETS / f"bouquet-{name}.png"
    img.save(out_webp, "WEBP", quality=WEBP_QUALITY, method=6)
    img.save(out_png, "PNG", optimize=True)

    webp_kb = out_webp.stat().st_size / 1024
    src_kb = source.stat().st_size / 1024
    print(f"  {source.name}: {src_kb:.0f} KB -> webp {webp_kb:.0f} KB")


def main():
    for name, source in SOURCES.items():
        if source.exists():
            process(name, source)


if __name__ == "__main__":
    main()
