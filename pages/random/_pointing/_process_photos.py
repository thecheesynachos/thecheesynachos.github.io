#!/usr/bin/env python3
"""Sort the original photos in _pointing/_photos_raw/ into the pointing games, game-ready.

    python3 pages/random/_pointing/_process_photos.py           # only new / changed originals
    python3 pages/random/_pointing/_process_photos.py --force   # redo everything

(It works the same from any directory.) Throw every original, whichever game it's for,
into pages/random/_pointing/_photos_raw/; subfolders are fine, e.g. to keep two photos
that share a name. The games are the folders in pages/random/ whose config.js sets up a
pointing game. Each game's photo area is `view` in its config.js, or `bounds` if it has
no view.

For each original this:
  1. reads its GPS position from the EXIF tags and picks the game whose area contains it
     (if areas overlap, the first game alphabetically); originals without a GPS tag, or
     outside every game's area, are left out,
  2. rotates it upright (phones store rotation as a tag, not in the pixels),
  3. centre-crops it to a square (no stretching) and shrinks it to SIZE x SIZE,
     then picks the best WebP quality that keeps the file under MAX_KB,
  4. saves it as <game>/photos/<name>.webp with ALL metadata stripped (no GPS, time, camera),
  5. records file + lat/lon in <game>/data-photos.js.

Then each game's pool is tidied: entries whose file is gone, or whose position is outside
the game's area (say, after the area was made smaller), are removed, photo and all.
Taking an original out of _photos_raw/ does NOT take it out of its game: delete
<game>/photos/<name>.webp for that, and the next run drops it from data-photos.js.

data-photos.js is the source of truth for coordinates, since the published WebPs carry
no EXIF. Other entries there (hand-added captions, ...) are kept.

_photos_raw/.processed.json remembers where each original was taken, so unchanged
originals aren't re-read on every run. It's safe to delete: the next run re-reads them all.

HEIC/HEIF (iPhone) files are converted with macOS's built-in `sips`, so those need a Mac.
Needs Pillow (pip install pillow). Leading underscore => Jekyll does not publish this,
nor the _photos_raw/ folder.
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

ROOT = Path(__file__).resolve().parent          # pages/random/_pointing
RAW = ROOT / "_photos_raw"
MANIFEST = RAW / ".processed.json"
EXTS = {".jpg", ".jpeg", ".png", ".webp", ".tif", ".tiff", ".heic", ".heif"}
HEIC = {".heic", ".heif"}
GPS_IFD = 0x8825


# --- the games ---

def read_area(cfg):
    """[[south, west], [north, east]] from config.js: `view`, else `bounds`; None if neither."""
    text = cfg.read_text()
    for key in ("view", "bounds"):
        m = re.search(r"^\s*" + key + r"\s*:\s*(\[\s*\[[^\]]*\]\s*,\s*\[[^\]]*\]\s*\])", text, re.M)
        if m:
            return json.loads(m.group(1))
    return None


def inside(ll, area):
    return area is not None and (area[0][0] <= ll[0] <= area[1][0] and area[0][1] <= ll[1] <= area[1][1])


class Game:
    def __init__(self, folder):
        self.dir = folder
        self.name = folder.name
        self.photos = folder / "photos"
        self.out = folder / "data-photos.js"
        self.area = read_area(folder / "config.js")
        self.entries = {e["file"]: e for e in self.load_entries()}
        self.done, self.removed, self.unchanged = [], [], 0

    def load_entries(self):
        if not self.out.exists():
            return []
        m = re.search(r"=\s*(\[.*\])\s*;?\s*$", self.out.read_text(), re.S)
        try:
            return json.loads(m.group(1))
        except Exception:
            sys.exit(f"couldn't parse {self.out}; fix or delete it and rerun")

    def write_entries(self):
        entries = sorted(self.entries.values(), key=lambda e: e["file"])
        body = ",\n".join("  " + json.dumps(e, ensure_ascii=False) for e in entries)
        self.out.write_text(
            "// Photo pool for this game. Maintained by _process_photos.py, but safe to edit by\n"
            "// hand. `file` is relative to this folder; `caption` is optional and is shown on\n"
            "// the answer marker.\n"
            f"window.POINTING_PHOTOS = [\n{body}\n];\n"
        )

    def tidy(self):
        """Drop entries whose photo is gone or that lie outside the game's area."""
        for rel, e in list(self.entries.items()):
            f = self.dir / rel
            if not f.exists():
                self.removed.append(f"{rel} (file no longer exists)")
            elif self.area and not inside((e["lat"], e["lon"]), self.area):
                f.unlink()
                self.removed.append(f"{rel} (outside the game's area: {e['lat']}, {e['lon']})")
            else:
                continue
            del self.entries[rel]


def find_games():
    games = []
    for d in sorted(ROOT.parent.iterdir()):
        cfg = d / "config.js"
        if d.is_dir() and cfg.exists() and "POINTING_CONFIG" in cfg.read_text():
            games.append(Game(d))
    return games


# --- one photo ---

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


# --- the run ---

def load_manifest():
    try:
        return json.loads(MANIFEST.read_text())
    except Exception:
        return {}


def main():
    args = sys.argv[1:]
    if any(a != "--force" for a in args):
        sys.exit(__doc__)
    force = "--force" in args

    games = find_games()
    if not games:
        sys.exit(f"no pointing games found in {ROOT.parent}")
    for g in games:
        if g.area is None:
            print(f"warning: {g.name}/config.js has no `view` or `bounds`, so no photos go to it")

    RAW.mkdir(exist_ok=True)
    old = {} if force else load_manifest()
    manifest = {}
    raws = sorted(p for p in RAW.rglob("*") if p.is_file() and p.suffix.lower() in EXTS)
    claimed = {}                       # (game, photos/x.webp) -> original that made it
    problems, no_gps, outside = [], [], []

    with tempfile.TemporaryDirectory() as tmpdir:
        for src in raws:
            key = src.relative_to(RAW).as_posix()
            st = src.stat()
            im = None
            rec = old.get(key)
            fresh = not (rec and rec.get("mtime") == st.st_mtime and rec.get("size") == st.st_size)
            if fresh:                  # new or changed original: read where it was taken
                try:
                    im = open_image(src, tmpdir)
                except Exception as e:
                    problems.append(f"{key} ({e})")
                    continue
                ll = gps_of(im)
                rec = {"mtime": st.st_mtime, "size": st.st_size,
                       "lat": ll[0] if ll else None, "lon": ll[1] if ll else None}
            manifest[key] = rec

            if rec["lat"] is None:
                no_gps.append(key)
                continue
            ll = (rec["lat"], rec["lon"])
            g = next((g for g in games if inside(ll, g.area)), None)
            if g is None:
                outside.append(f"{key} ({ll[0]}, {ll[1]})")
                continue

            dst = g.photos / (src.stem + ".webp")
            rel = dst.relative_to(g.dir).as_posix()
            if (g.name, rel) in claimed:
                problems.append(f"{key} (same name as {claimed[g.name, rel]}, also for {g.name};"
                                f" rename one of them)")
                continue
            claimed[g.name, rel] = key

            e = g.entries.get(rel)
            if (not force and e and dst.exists() and dst.stat().st_mtime >= st.st_mtime
                    and (e["lat"], e["lon"]) == ll):
                g.unchanged += 1
                continue
            try:
                if im is None:
                    im = open_image(src, tmpdir)
                g.photos.mkdir(exist_ok=True)
                q = save_within_budget(square(im), dst)
            except Exception as ex:
                problems.append(f"{key} ({ex})")
                continue
            note = ""
            if e and (e["lat"], e["lon"]) != ll:   # e.g. iPhone numbers repeat over the years
                note = f"  REPLACED the photo of that name taken at {e['lat']}, {e['lon']}"
            e = e or {}
            e.update({"file": rel, "lat": ll[0], "lon": ll[1]})
            g.entries[rel] = e
            g.done.append(f"{key} -> {rel}  ({ll[0]}, {ll[1]}, {dst.stat().st_size // 1024} KB @ q{q}){note}")

    MANIFEST.write_text(json.dumps(manifest, indent=1, sort_keys=True) + "\n")

    for g in games:
        g.tidy()
        g.write_entries()
        print(f"{g.name}: {len(g.done)} processed, {g.unchanged} unchanged, "
              f"{len(g.removed)} removed; {len(g.entries)} photos in its pool")
        for d in g.done:
            print("  processed", d)
        for r in g.removed:
            print("  removed  ", r)
        if g.area:
            print(f"  area: {g.area[0]} to {g.area[1]}")

    print(f"{len(raws)} originals in {RAW.relative_to(ROOT.parent.parent.parent)}/")
    if outside:
        print(f"  {len(outside)} not in any game's area:")
        for o in outside:
            print("    ", o)
    if no_gps:
        print(f"  {len(no_gps)} without a GPS tag: {', '.join(no_gps)}")
    for p in problems:
        print("  skipped  ", p)


if __name__ == "__main__":
    main()
