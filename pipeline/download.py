"""Descarga las fuentes de `sources.py` a data/raw (idempotente)."""
import subprocess
import zipfile
from pathlib import Path

from sources import SOURCES

RAW = Path(__file__).resolve().parent.parent / "data" / "raw"


def fetch(url: str, dest: Path) -> None:
    if dest.exists() and dest.stat().st_size > 0:
        return
    print(f"descargando {dest.name}")
    subprocess.run(["curl", "-sSL", "--retry", "4", "-m", "3600", "-o", str(dest), url], check=True)


def main() -> None:
    RAW.mkdir(parents=True, exist_ok=True)
    for key, src in SOURCES.items():
        url = src["url"]
        name = url.split("/")[-1].split("?")[0]
        if name.endswith(".zip"):
            archive = RAW / name
            fetch(url, archive)
            with zipfile.ZipFile(archive) as z:
                z.extractall(RAW)
        elif key == "aridez":
            archive = RAW / "aridity_v31.zip"
            fetch(url, archive)
            with zipfile.ZipFile(archive) as z:
                z.extractall(RAW)
        else:
            fetch(url, RAW / src["file"])


if __name__ == "__main__":
    main()
