"""Parte el FeatureCollection del OTBN (una sola línea, 1,35 GB) en un GeoJSON por feature, en streaming.
Uso: python3 -I split_otbn.py <entrada.geojson> <directorio_salida>"""
import sys
from pathlib import Path

src, outdir = sys.argv[1], Path(sys.argv[2])
outdir.mkdir(parents=True, exist_ok=True)
MARK = b'{"type":"Feature","id":"otbn_nacional.'
n = 0


def flush(chunk, last=False):
    global n
    chunk = chunk.rstrip()
    if last:  # quita el cierre del FeatureCollection y los metadatos finales
        end = chunk.rfind(b'],"totalFeatures"')
        if end < 0:
            end = chunk.rfind(b']')
        chunk = chunk[:end]
    chunk = chunk.rstrip(b',')
    (outdir / f"f{n:03d}.geojson").write_bytes(b'{"type":"FeatureCollection","features":[' + chunk + b']}')
    n += 1


buf = b""
started = False
with open(src, "rb") as f:
    while True:
        b = f.read(64 << 20)
        if not b:
            break
        buf += b
        while True:
            i = buf.find(MARK, 1 if started else 0)
            if i < 0:
                break
            if not started:
                buf = buf[i:]
                started = True
                continue
            flush(buf[:i])
            buf = buf[i:]
flush(buf, last=True)
print(n, "features")
