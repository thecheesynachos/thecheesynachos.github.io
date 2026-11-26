#!/usr/bin/env python3
"""Rebuild data-map.js (the Map Game's world outlines) from Natural Earth.

Local tool, not published (the leading underscore keeps Jekyll from copying it).

    curl -o countries-50m.json https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-50m.json
    python3 -I _make_map.py countries-50m.json > data-map.js

The input is the world-atlas TopoJSON build of Natural Earth 1:50m (public domain).
It holds both a `land` object and a `countries` object over shared arcs, so:

  * land rings     -> window.CITYPIN_MAP      (filled, and stroked as the coastline)
  * country borders-> window.CITYPIN_BORDERS  (only arcs shared by two countries, so
                      each border is stored once and coastlines aren't drawn twice)

Points are quantised to 1/SCALE of a degree, thinned with Douglas-Peucker at TOL
degrees, then delta-encoded as zigzag varints over a base64 alphabet. Decoded shape of
each string: repeated [point count, first point (absolute), then (dLon, dLat) deltas].
citypin.js has the matching decoder; keep SCALE in step with MAP_SCALE there.
"""
import json
import sys

SCALE = 100       # 1/100 degree ≈ 1 km
TOL = 0.015       # simplification tolerance in degrees (≈ 1.5 km); 0 keeps every point
MIN_POINTS = 4    # drop specks of land smaller than this after simplification
B64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"


def decode_arcs(topo):
    sx, sy = topo["transform"]["scale"]
    tx, ty = topo["transform"]["translate"]
    out = []
    for arc in topo["arcs"]:
        x = y = 0
        pts = []
        for dx, dy in arc:
            x += dx
            y += dy
            pts.append((x * sx + tx, y * sy + ty))
        out.append(pts)
    return out


def ring_from(arcs, idxs):
    pts = []
    for i in idxs:
        a = arcs[i] if i >= 0 else arcs[~i][::-1]
        pts.extend(a if not pts else a[1:])
    return pts


def polygons(geom):
    if geom["type"] == "Polygon":
        return [geom["arcs"]]
    if geom["type"] == "MultiPolygon":
        return geom["arcs"]
    return []


def unwrap(pts):
    """Make longitudes continuous across the antimeridian (the decoder does the same)."""
    out, prev = [], None
    for lon, lat in pts:
        if prev is not None:
            while lon - prev > 180:
                lon -= 360
            while prev - lon > 180:
                lon += 360
        prev = lon
        out.append((lon, lat))
    return out


def simplify(pts, tol):
    if tol <= 0 or len(pts) < 3:
        return pts
    keep = [False] * len(pts)
    keep[0] = keep[-1] = True
    stack = [(0, len(pts) - 1)]
    while stack:
        a, b = stack.pop()
        (x1, y1), (x2, y2) = pts[a], pts[b]
        dx, dy = x2 - x1, y2 - y1
        L = (dx * dx + dy * dy) ** 0.5
        best, bi = -1.0, -1
        for i in range(a + 1, b):
            x, y = pts[i]
            d = abs(dy * (x - x1) - dx * (y - y1)) / L if L else ((x - x1) ** 2 + (y - y1) ** 2) ** 0.5
            if d > best:
                best, bi = d, i
        if best > tol:
            keep[bi] = True
            stack.append((a, bi))
            stack.append((bi, b))
    return [p for p, k in zip(pts, keep) if k]


def simplify_ring(pts, tol):
    # a closed ring has no natural endpoints: split it at the point farthest from the start
    if len(pts) < 8:
        return pts
    x0, y0 = pts[0]
    far = max(range(len(pts)), key=lambda i: (pts[i][0] - x0) ** 2 + (pts[i][1] - y0) ** 2)
    return simplify(pts[:far + 1], tol)[:-1] + simplify(pts[far:], tol)


def quantise(pts):
    out = []
    for lon, lat in pts:
        q = (round(lon * SCALE), round(lat * SCALE))
        if not out or q != out[-1]:
            out.append(q)
    return out


def varint(v, buf):
    z = (v << 1) ^ (v >> 63)
    while True:
        c = z & 31
        z >>= 5
        if z:
            buf.append(B64[c | 32])
        else:
            buf.append(B64[c])
            return


def encode(lines):
    buf = []
    for pts in lines:
        varint(len(pts), buf)
        px = py = 0
        for x, y in pts:
            varint(x - px, buf)
            varint(y - py, buf)
            px, py = x, y
    s = "".join(buf)
    return "\n".join(s[i:i + 100] for i in range(0, len(s), 100))


def main(path):
    topo = json.load(open(path))
    arcs = decode_arcs(topo)

    land = []
    for g in topo["objects"]["land"]["geometries"]:
        for poly in polygons(g):
            for ring in poly:
                q = quantise(simplify_ring(unwrap(ring_from(arcs, ring)), TOL))
                if len(q) > 1 and q[0] == q[-1]:
                    q.pop()
                if len(q) >= MIN_POINTS:
                    land.append(q)

    # arcs used by two different countries are land borders
    users = {}
    for gi, g in enumerate(topo["objects"]["countries"]["geometries"]):
        for poly in polygons(g):
            for ring in poly:
                for i in ring:
                    users.setdefault(i if i >= 0 else ~i, set()).add(gi)
    borders = []
    for i, who in sorted(users.items()):
        if len(who) >= 2:
            q = quantise(simplify(unwrap(arcs[i]), TOL))
            if len(q) >= 2:
                borders.append(q)

    npts = sum(map(len, land)), sum(map(len, borders))
    sys.stderr.write("land: %d rings, %d points; borders: %d lines, %d points\n"
                     % (len(land), npts[0], len(borders), npts[1]))
    print("// The Map Game — world map geometry. Not hand-editable: regenerate it with")
    print("// _make_map.py (instructions at the top of that file).")
    print("//")
    print("// Natural Earth 1:50m (public domain), via the world-atlas TopoJSON build: land")
    print("// polygons in CITYPIN_MAP, borders between countries in CITYPIN_BORDERS. Points are")
    print("// quantised to 1/%d of a degree and delta-encoded as zigzag varints over a base64" % SCALE)
    print("// alphabet, wrapped to fixed-width lines purely so this file opens nicely")
    print("// (citypin.js ignores the line breaks). Decoded shape: repeated [point count, then")
    print("// that many (dLon, dLat) pairs].")
    print()
    print("window.CITYPIN_MAP = `\n" + encode(land) + "\n`;")
    print()
    print("window.CITYPIN_BORDERS = `\n" + encode(borders) + "\n`;")


if __name__ == "__main__":
    main(sys.argv[1])
