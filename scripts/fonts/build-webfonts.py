#!/usr/bin/env python3
"""Genera los .woff2 que el sitio sirve, a partir de las fuentes compradas.

Se corre A MANO y su salida se commitea — NO entra a `prebuild`. Motivo: parte
de las fuentes de origen están gitignoradas (ver docs/fonts.md), así que en CI
este script no tendría de dónde leer. El build consume los `.woff2` ya
commiteados en `assets/fonts/<familia>/`, nunca este script.

Python y no un `.mjs` como el resto de `scripts/`: fontTools es la única forma de
subsettear sin sumar una dependencia npm, y ya está en el python3 del sistema
(requiere `fonttools` + `brotli`).

    python3 scripts/fonts/build-webfonts.py            # todos los perfiles
    python3 scripts/fonts/build-webfonts.py montreal   # uno solo
    python3 scripts/fonts/build-webfonts.py kepler --all

`--all` convierte la familia completa de origen a woff2 sin subsettear, a
`_fonts/<perfil>/` (gitignorado) — para tener a mano un master que hoy no se
usa. Solo aplica a perfiles cuyo origen son OTF de escritorio.

## Las dos familias necesitan subsets opuestos

No es la misma receta con distintos archivos, y por eso el subset se declara por
perfil en vez de compartirse:

  · **Kepler** tiene ~410 de sus 731 glifos en el Private Use Area — versalitas,
    swashes, ornamentos y cifras alternativas que Adobe mapeó ahí. Subsettear por
    rango unicode no la baja (quedan 655 de 731); la palanca son las features.

  · **Montreal** no tiene nada en el PUA: sus 1352 glifos son cobertura de
    idiomas real (434 de latín básico y extendido, 173 de latin ext additional,
    124 de cirílico, 77 de griego). Acá la palanca es el rango unicode.

## Qué features se conservan, y por qué eso no puede romper nada

Las que un navegador aplica **por defecto** son `kern liga clig calt ccmp locl
mark mkmk rlig`, y están todas en las listas de abajo. El resto (`aalt`, `ss01`,
`ss02`, `dlig`…) solo se activa si el CSS las pide explícitamente con
`font-feature-settings` o `font-variant-*`, y nadie en el repo lo hace. Las de
cifras (`tnum pnum onum lnum frac numr dnom sups subs sinf ordn zero case`) se
conservan igual porque son justo las que mapean a las utilidades de Tailwind
(`tabular-nums`, `slashed-zero`, `ordinal`, `diagonal-fractions`), que sí se usan.
"""

from __future__ import annotations  # el python3 del sistema puede ser < 3.10

import argparse
import io
import sys
from pathlib import Path

try:
    from fontTools.ttLib import TTFont
    from fontTools import subset
except ImportError:
    sys.exit("Falta fontTools. Instalar con: pip3 install 'fonttools[woff]' brotli")

ROOT = Path(__file__).resolve().parents[2]

# ── Rangos unicode ────────────────────────────────────────────────────────────

# Kepler: latín completo. No trae griego ni cirílico, así que no hay más que
# preservar. Es una serif de acento — aparece en un puñado de headings escritos
# por nosotros, no en contenido del CMS.
KEPLER_UNICODES = ",".join([
    "U+0000-00FF", "U+0100-024F", "U+0259", "U+0131", "U+0152-0153",
    "U+02BB-02BC", "U+02C6", "U+02DA", "U+02DC", "U+1E00-1EFF",
    "U+2000-206F", "U+2074", "U+20A0-20CF", "U+2113", "U+2122",
    "U+2191", "U+2193", "U+2212", "U+2215", "U+FEFF", "U+FFFD",
])

# Montreal: TODO menos cirílico (U+0400-052F) y griego (U+0370-03FF, U+1F00-1FFF).
# Se queda hasta el vietnamita y cada símbolo que la fuente trae, porque Montreal
# renderiza contenido que escriben los editores en el CMS, no copy que
# controlamos. Los diacríticos combinables (U+0300-036F) van enteros a
# propósito: macOS produce texto en NFD, donde "é" son dos codepoints, y sin
# ellos ese texto sale roto.
MONTREAL_UNICODES = ",".join([
    "U+0000-036F", "U+0E3F", "U+1E00-1EFF", "U+2000-2BFF", "U+2C60-2C7F",
    "U+A720-A7FF", "U+FB00-FB4F", "U+FEFF", "U+FFFD",
])
# U+0E3F es el símbolo del baht, suelto en medio del bloque tailandés. Se
# conserva por una razón puntual: en cripto se usa informalmente para bitcoin, y
# la fuente lo trae. Es un glifo.

# ── Features ──────────────────────────────────────────────────────────────────

DEFAULT_ON = ["kern", "liga", "clig", "calt", "ccmp", "locl", "rlig"]
POSITIONING = ["mark", "mkmk", "case", "cpsp"]
FIGURES = ["onum", "pnum", "tnum", "lnum", "frac", "numr", "dnom",
           "sups", "subs", "sinf", "ordn", "zero"]

FEATURES = DEFAULT_ON + POSITIONING + FIGURES

# ── Perfiles ──────────────────────────────────────────────────────────────────

PROFILES = {
    # Kepler va en los masters de ANCHO NORMAL, Subhead y Display, en 400 normal
    # e itálica.
    #
    # Los nombres de archivo conservan el sufijo del master a propósito: es lo
    # que deja ver de un vistazo que `--font-serif` no apunta al master de texto,
    # y por qué no puede hacerlo. Que caiga en Subhead no es un parche por falta
    # de opción, es un mejor encaje óptico: alimenta text-h1-serif (44–88px),
    # text-h2-serif (34–60px) y accent-serif (1.18em de un heading), y el master
    # de texto está dibujado para 9–13pt. Subhead lo está para ~14–24pt.
    #
    # ── Por qué NO son las condensed ───────────────────────────────────────
    #
    # Lo fueron hasta acá, heredado del kit de Typekit que esto reemplazó (que
    # servía `kepler-std-condensed-display` y `-subhead`). El problema es que
    # `--text-serif--optical-scale` compensa ALTURA y no ancho, y las condensed
    # son ~25% más angostas:
    #
    #                          x-height   avance medio
    #     Montreal (la sans)      510          520
    #     Kepler CnItSubh         433          360      ×1.18 → 425  (−18%)
    #     Kepler ItSubh           433          450      ×1.18 → 531  (+2%)
    #
    # O sea que con las condensed el acento quedaba con la x-height correcta y
    # el ancho de otra fuente, y se leía chico al lado de la sans. Subir la
    # escala no lo arregla: para igualar el avance haría falta 1.44, y ahí la
    # x-height se va 22% por encima de la de Montreal. Se cambia un desbalance
    # por otro — la palanca era el master, no el tamaño.
    "kepler": {
        "src": ROOT / "public" / "fonts" / "kepler-font",
        "out": ROOT / "assets" / "fonts" / "kepler",
        "ext": ".otf",
        "full_family": True,  # el origen son OTF de escritorio: --all tiene sentido
        "unicodes": KEPLER_UNICODES,
        "faces": [
            ("KeplerStd-Subh", "--font-kepler · 400 normal"),
            ("KeplerStd-ItSubh", "--font-kepler · 400 italic"),
            ("KeplerStd-Disp", "--font-kepler-display · 400 normal"),
            ("KeplerStd-ItDisp", "--font-kepler-display · 400 italic"),
        ],
        "verify_repo": False,  # solo aparece en headings que escribimos nosotros
    },
    # El origen ya es woff2 (viene así del vendor), así que acá no hay conversión
    # de formato: todo el trabajo es el subset.
    "montreal": {
        "src": ROOT / "assets" / "fonts" / "_originals" / "pp-neue-montreal",
        "out": ROOT / "assets" / "fonts" / "montreal",
        "ext": ".woff2",
        "full_family": False,
        "unicodes": MONTREAL_UNICODES,
        "faces": [
            ("PPNeueMontreal-Book", "--font-sans · 400 normal"),
            ("PPNeueMontreal-BookItalic", "--font-sans · 400 italic"),
            ("PPNeueMontreal-Medium", "--font-sans · 500"),
            ("PPNeueMontreal-Bold", "--font-sans · 700"),
        ],
        # Montreal renderiza CADA palabra del sitio, así que la cobertura se
        # verifica contra el texto real del repo en vez de confiar en el rango.
        "verify_repo": True,
    },
    # La mono de la misma familia. Mismo origen woff2 del vendor y mismo rango
    # unicode que la sans, por una razón concreta: parte de lo que se dibuja en
    # mono son los TAGS del blog, que los escriben los editores en el CMS. Un
    # rango más chico sería apostar a que nadie escriba un tag con acento.
    #
    # ── Regular y no Book ──────────────────────────────────────────────────
    #
    # Ojo con esto si se comparan los dos perfiles: la sans sirve `Book`, que es
    # usWeightClass 350 declarado como 400 (ver la nota en lib/fonts.ts). La
    # mono trae AMBAS —Book a 350 y Regular a 400— así que acá el 400 nominal
    # existe de verdad y no hace falta repetir esa rareza. Cambiar esto a Book
    # por simetría con la sans daría un mono más liviano que su propio peso
    # declarado.
    #
    # ── Por qué dos faces y no una ─────────────────────────────────────────
    #
    # Casi todos los usos de `font-mono` van en peso normal, pero un par se
    # combinan con `text-eyebrow`, que es weight 500. Sin la face Medium el
    # navegador sintetiza ese peso, que en una monoespaciada se nota más que en
    # una proporcional porque engorda el trazo sin poder ensanchar el avance.
    # No van itálicas: no hay un solo uso en el repo.
    "montreal-mono": {
        "src": ROOT / "assets" / "fonts" / "_originals" / "pp-neue-montreal-mono",
        "out": ROOT / "assets" / "fonts" / "montreal-mono",
        "ext": ".woff2",
        "full_family": False,
        "unicodes": MONTREAL_UNICODES,
        "faces": [
            ("PPNeueMontrealMono-Regular", "--font-mono · 400"),
            ("PPNeueMontrealMono-Medium", "--font-mono · 500"),
        ],
        # A diferencia de la sans, este chequeo es una cota MUY por lo alto: el
        # verificador junta todos los caracteres del repo, y la mono solo dibuja
        # una fracción de ellos. Se deja activado igual porque compara contra lo
        # que la fuente de origen sí traía, así que no puede dar un falso
        # positivo — solo avisa de más.
        "verify_repo": True,
    },
}


def to_woff2(src: Path, dst: Path, unicodes: str | None, features: list | None):
    """Subsetea y guarda como woff2. Con unicodes=None hace conversión pura.

    No toca métricas: `recalc_bounds` y `recalc_timestamp` quedan en su default
    (False), así que hhea/OS-2 salen idénticos y el layout no se mueve un píxel.
    """
    font = TTFont(src)
    before = len(font.getGlyphOrder())

    if unicodes is not None:
        options = subset.Options()
        options.layout_features = features
        options.name_IDs = ["*"]  # conserva los nombres, útil para depurar
        options.notdef_outline = True
        subsetter = subset.Subsetter(options=options)
        subsetter.populate(unicodes=subset.parse_unicodes(unicodes))
        subsetter.subset(font)

    font.flavor = "woff2"
    buf = io.BytesIO()
    font.save(buf)  # a memoria primero: si falla, no deja un archivo a medias
    dst.parent.mkdir(parents=True, exist_ok=True)
    dst.write_bytes(buf.getvalue())
    return before, len(font.getGlyphOrder()), buf.tell(), set(font.getBestCmap())


def cmap_of(path: Path) -> set:
    return set(TTFont(path, lazy=True).getBestCmap())


# Extensiones donde puede vivir texto que el sitio termina renderizando.
SCAN_DIRS = ["app", "components", "lib"]
SCAN_EXTS = {".tsx", ".ts", ".mdx", ".md"}


def repo_codepoints() -> set:
    """Cada codepoint que aparece en el código fuente del sitio.

    Es una aproximación por lo bajo (el contenido del CMS vive en la base, no
    acá), pero atrapa el caso real: que un subset se coma un carácter que ya
    estamos usando hoy en copy, y que nadie lo note hasta verlo en producción.
    """
    cps = set()
    for d in SCAN_DIRS:
        for path in (ROOT / d).rglob("*"):
            if path.suffix in SCAN_EXTS and path.is_file():
                cps |= set(map(ord, path.read_text(encoding="utf-8", errors="ignore")))
    return {c for c in cps if c > 0x20}  # los de control no se dibujan


def build(name: str, profile: dict, full: bool) -> int:
    src_dir = profile["src"]
    if not src_dir.is_dir():
        sys.exit(
            f"No existe {src_dir.relative_to(ROOT)} — ver docs/fonts.md.\n"
            "Las fuentes de origen no están todas en el repo, a propósito."
        )

    if full:
        if not profile["full_family"]:
            sys.exit(f"--all no aplica a `{name}`: su origen ya es woff2, no hay nada que convertir.")
        out = ROOT / "_fonts" / name
        faces = [(p.stem, "") for p in sorted(src_dir.glob(f"*{profile['ext']}"))]
        unicodes, features = None, None
        print(f"── {name} · familia completa, conversión pura → {out.relative_to(ROOT)}")
    else:
        out = profile["out"]
        faces = profile["faces"]
        unicodes, features = profile["unicodes"], FEATURES
        print(f"── {name} · subset → {out.relative_to(ROOT)}")

    total = 0
    was_total = 0
    before_cmap: set = set()   # unión de lo que las fuentes de origen cubrían
    after_cmap = None          # intersección de lo que quedó, cara por cara
    for stem, note in faces:
        src = src_dir / f"{stem}{profile['ext']}"
        if not src.is_file():
            sys.exit(f"Falta {src.relative_to(ROOT)}")
        was = src.stat().st_size
        before_cmap |= cmap_of(src)
        before, after, size, cmap = to_woff2(src, out / f"{stem}.woff2", unicodes, features)
        total += size
        was_total += was
        after_cmap = cmap if after_cmap is None else after_cmap & cmap
        glyphs = f"{after}/{before}" if unicodes else str(after)
        delta = f"  ({size / was - 1:+.0%})" if profile["ext"] == ".woff2" else ""
        print(f"   {stem:28s} {glyphs:>9s} glifos  {size / 1024:6.1f}KB{delta}  {note}")

    saved = f"  (antes {was_total / 1024:.0f}KB)" if profile["ext"] == ".woff2" else ""
    print(f"   {len(faces)} faces · {total / 1024:.0f}KB{saved}")

    if not full and profile["verify_repo"] and after_cmap is not None:
        # REGRESIÓN, no cobertura absoluta: un carácter que la fuente de origen
        # tampoco tenía ya caía a la fuente de sistema antes de este script, así
        # que reportarlo sería ruido. Lo que no puede pasar es que algo que HOY
        # se dibuja con esta fuente deje de hacerlo.
        lost = sorted((repo_codepoints() & before_cmap) - after_cmap)
        if lost:
            print(f"\n   ✗ REGRESIÓN: {len(lost)} caracteres que el repo usa dejaron de estar:")
            for cp in lost[:40]:
                print(f"       U+{cp:04X}  {chr(cp)!r}")
            return 1
        dropped = len(before_cmap - after_cmap)
        print(f"   ✓ sin regresión: los {dropped} codepoints descartados no aparecen en el repo")
    return 0


def main() -> int:
    ap = argparse.ArgumentParser(description="Genera los woff2 que sirve el sitio.")
    ap.add_argument("profile", nargs="?", choices=sorted(PROFILES), help="por defecto, todos")
    ap.add_argument("--all", action="store_true", help="familia completa sin subsettear → _fonts/")
    args = ap.parse_args()

    names = [args.profile] if args.profile else sorted(PROFILES)
    if args.all and not args.profile:
        sys.exit("--all necesita un perfil explícito.")

    status = 0
    for name in names:
        status |= build(name, PROFILES[name], args.all)
        print()
    return status


if __name__ == "__main__":
    raise SystemExit(main())
