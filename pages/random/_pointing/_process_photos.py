#!/usr/bin/env python3
"""Turn a game's originals in _photos_raw/ into game-ready photos and update its data-photos.js.

    python3 _process_photos.py singapointing              # only new / changed originals
    python3 _process_photos.py chiangmai_pointing --force # redo everything

The first argument is the game's folder: a name in pages/random/ (as above) or any path.
It works the same from any directory, e.g. from the repo root:
    python3 pages/random/_pointing/_process_photos.py singapointing

For each image in <game>/_photos_raw/ (subfolders included) this:
  1. reads its GPS position from the EXIF tags; photos without one, or outside the game's
     area, are skipped (the area is `view` in the game's config.js, or `bounds` if it
     has no view; an already-processed copy of a skipped photo is removed),
  2. rotates it upright (phones store rotation as a tag, not in the pixels),
  3. centre-crops it to a square (no stretching) and shrinks it to SIZE x SIZE,
     then picks the best WebP quality that keeps the file under MAX_KB,
  4. saves it as photos/<name>.webp with ALL metadata stripped (no GPS, time, camera),
  5. records file + lat/lon in data-photos.js.

data-photos.js is the source of truth for coordinates, since the published WebPs carry
no EXIF. Existing entries (hand-added captions, the mock photos, ...) are kept as long
as their file still exists in photos/; entries whose file is gone are dropped.

HEIC/HEIF (iPhone) files are converted with macOS's built-in `sips`, so those need a Mac.
Needs Pillow (pip install pillow). Leading underscore => Jekyll does not publish this.
"""
import io
import json
import re
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

from PIL import Image, ImageOps

SIZE = 700         # output edge length in px
MAX_KB = 80        # each photo's file-size budget...
MAX_QUALITY = 85   # ...reached by stepping WebP quality down from here
MIN_QUALITY = 15   # ...but never below this (a photo may then end up over budget)

def game_dir():
    names = [a for a in sys.argv[1:] if not a.startswith("-")]
    if len(names) != 1:
        sys.exit(__doc__)
    p = Path(names[0]).expanduser()
    for d in (p, Path(__file__).resolve().parent.parent / names[0]):   # a path, or a name in pages/random/
        if d.is_dir():
            return d.resolve()
    sys.exit(f"no game folder called {names[0]!r}")


def game_area():
    """[[south, west], [north, east]] from config.js: `view`, else `bounds`; None = anywhere."""
    cfg = HERE / "config.js"
    if not cfg.exists():
        return None
    text = cfg.read_text()
    for key in ("view", "bounds"):
        m = re.search(r"^\s*" + key + r"\s*:\s*(\[\s*\[[^\]]*\]\s*,\s*\[[^\]]*\]\s*\])", text, re.M)
        if m:
            return json.loads(m.group(1))
    return None


def inside(ll, area):
    return area is None or (area[0][0] <= ll[0] <= area[1][0] and area[0][1] <= ll[1] <= area[1][1])


HERE = game_dir()
AREA = game_area()
RAW = HERE / "_photos_raw"
PHOTOS = HERE / "photos"
OUT = HERE / "data-photos.js"
EXTS = {".jpg", ".jpeg", ".png", ".webp", ".tif", ".tiff", ".heic", ".heif"}
HEIC = {".heic", ".heif"}
GPS_IFD = 0x8825


def to_deg(dms, ref):
    d, m, s = (float(x) for x in dms)
    v = d + m / 60 + s / 3600
    return -v if str(ref).upper() in ("S", "W") else v


def open_image(path, tmpdir):
    """Pillow can't read HEIC here, so convert those to a temporary JPEG first."""
    if path.suffix.lower() in HEIC:
        if not shutil.which("sips"):
            raise RuntimeError("HEIC needs macOS `sips`")
        tmp = Path(tmpdir) / (path.stem + ".jpg")
        subprocess.run(["sips", "-s", "format", "jpeg", "-s", "formatOptions", "best",
                        str(path), "--out", str(tmp)], check=True, capture_output=True)
        path = tmp
    im = Image.open(path)
    im.load()
    return im


def gps_of(im):
    gps = im.getexif().get_ifd(GPS_IFD)
    if not gps or 2 not in gps or 4 not in gps:
        return None
    return round(to_deg(gps[2], gps.get(1, "N")), 6), round(to_deg(gps[4], gps.get(3, "E")), 6)


def square(im):
    im = ImageOps.exif_transpose(im).convert("RGB")
    return ImageOps.fit(im, (SIZE, SIZE), Image.LANCZOS, centering=(0.5, 0.5))


def save_within_budget(im, dst):
    """Highest quality (in steps of 5) that fits MAX_KB; returns the quality used."""
    for q in range(MAX_QUALITY, MIN_QUALITY - 1, -5):
        buf = io.BytesIO()
        im.save(buf, "WEBP", quality=q, method=6)   # method 6 = slowest, smallest
        if buf.tell() <= MAX_KB * 1024:
            break
    dst.write_bytes(buf.getvalue())
    return q


def load_entries():
    if not OUT.exists():
        return []
    m = re.search(r"=\s*(\[.*\])\s*;?\s*$", OUT.read_text(), re.S)
    try:
        return json.loads(m.group(1))
    except Exception:
        sys.exit(f"couldn't parse {OUT.name}; fix or delete it and rerun")


def write_entries(entries):
    entries = sorted(entries, key=lambda e: e["file"])
    body = ",\n".join("  " + json.dumps(e, ensure_ascii=False) for e in entries)
    OUT.write_text(
        "// Photo pool for this game. Maintained by _process_photos.py, but safe to edit by\n"
        "// hand. `file` is relative to this folder; `caption` is optional and is shown on\n"
        "// the answer marker.\n"
        f"window.POINTING_PHOTOS = [\n{body}\n];\n"
    )


def main():
    force = "--force" in sys.argv
    PHOTOS.mkdir(exist_ok=True)
    entries = {e["file"]: e for e in load_entries()}
    done, skipped, unchanged = [], [], 0

    raws = sorted(p for p in RAW.rglob("*") if p.is_file() and p.suffix.lower() in EXTS) \
        if RAW.exists() else []
    seen = {}
    with tempfile.TemporaryDirectory() as tmpdir:
        for src in raws:
            dst = PHOTOS / (src.stem + ".webp")
            rel = dst.relative_to(HERE).as_posix()
            if rel in seen:
                skipped.append(f"{src.name} (same name as {seen[rel]})")
                continue
            seen[rel] = src.name
            if (not force and rel in entries and dst.exists()
                    and dst.stat().st_mtime >= src.stat().st_mtime
                    and inside((entries[rel]["lat"], entries[rel]["lon"]), AREA)):
                unchanged += 1
                continue
            try:
                im = open_image(src, tmpdir)
                ll = gps_of(im)
                if ll is None:
                    skipped.append(f"{src.name} (no GPS tag)")
                    continue
                if not inside(ll, AREA):
                    skipped.append(f"{src.name} (outside the game's area: {ll[0]}, {ll[1]})")
                    if dst.exists():
                        dst.unlink()          # so it also leaves data-photos.js below
                    continue
                q = save_within_budget(square(im), dst)
            except Exception as e:
                skipped.append(f"{src.name} ({e})")
                continue
            e = entries.get(rel, {})
            e.update({"file": rel, "lat": ll[0], "lon": ll[1]})
            entries[rel] = e
            done.append(f"{src.name} -> {rel}  ({ll[0]}, {ll[1]}, {dst.stat().st_size // 1024} KB @ q{q})")

    gone = [f for f in entries if not (HERE / f).exists()]
    for f in gone:
        del entries[f]
    write_entries(entries.values())

    for d in done:
        print("  processed", d)
    for s in skipped:
        print("  skipped  ", s)
    for g in gone:
        print("  dropped  ", g, "(file no longer exists)")
    if AREA:
        print(f"game area: {AREA[0]} to {AREA[1]} (from config.js)")
    print(f"{len(done)} processed, {unchanged} unchanged, {len(skipped)} skipped; "
          f"{len(entries)} photos in {OUT.name}")


if __name__ == "__main__":
    main()
