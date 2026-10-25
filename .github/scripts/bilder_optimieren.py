"""Verkleinert hochgeladene Bilder automatisch.

- längste Seite höchstens 1600 Pixel (Startbild: 2400, So geht's: 1400)
- Drehung aus dem Handy-Foto wird übernommen, danach werden alle Zusatzdaten
  (Aufnahmeort/GPS, Kamera, Datum) entfernt
- Bilder, die schon klein genug und sauber sind, bleiben unberührt
  (so entsteht keine Endlosschleife)
"""
import sys
from pathlib import Path
from PIL import Image, ImageOps

# Ordner und die größte erlaubte Seitenlänge in Pixel
ORDNER = {
    "img/aktuell": 1600, "img/personen": 1600, "img/hof": 1600,
    "img/galerie": 1600, "img/uploads": 1600,
    "img/start": 2400, "img/sogehts": 1400,
}
QUALITAET = 82


def hat_zusatzdaten(im):
    if im.format == "JPEG":
        return bool(im.getexif()) or "exif" in im.info
    if im.format in ("PNG", "WEBP"):
        return bool(im.getexif()) or "exif" in im.info
    return False


def bearbeiten(pfad: Path, MAX_SEITE: int) -> bool:
    try:
        with Image.open(pfad) as im:
            format_ = im.format
            gross = max(im.size) > MAX_SEITE
            gedreht = im.getexif().get(0x0112, 1) not in (None, 1)
            unsauber = hat_zusatzdaten(im)
            if not (gross or gedreht or unsauber):
                return False
            bild = ImageOps.exif_transpose(im)
            if max(bild.size) > MAX_SEITE:
                bild.thumbnail((MAX_SEITE, MAX_SEITE), Image.LANCZOS)
            if format_ == "JPEG":
                bild = bild.convert("RGB")
                bild.save(pfad, "JPEG", quality=QUALITAET, optimize=True, progressive=True)
            elif format_ == "PNG":
                bild.save(pfad, "PNG", optimize=True)
            elif format_ == "WEBP":
                bild.save(pfad, "WEBP", quality=QUALITAET)
            else:
                return False
        print("verkleinert:", pfad)
        return True
    except Exception as fehler:  # kaputte Datei darf den Ablauf nicht stoppen
        print("übersprungen:", pfad, fehler, file=sys.stderr)
        return False


def main():
    geaendert = 0
    for ordner, maximum in ORDNER.items():
        for pfad in sorted(Path(ordner).rglob("*")):
            if pfad.is_file() and pfad.suffix.lower() in {".jpg", ".jpeg", ".png", ".webp"}:
                geaendert += bearbeiten(pfad, maximum)
    print(f"{geaendert} Bild(er) angepasst")


main()
