# Fuentes

## Qué sirve qué

| Token del DS | Familia | Faces |
|---|---|---|
| `--font-sans` | PP Neue Montreal | Book (400), BookItalic, Medium (500), Bold (700) |
| `--font-serif` | Kepler Std, master de **texto** | Regular (400), Italic |
| `--font-display` | Kepler Std, master **Display** | Disp (400), ItDisp |
| `--font-mono` | *ninguna* | Cae en `ui-monospace, Menlo` del sistema |

Las tres primeras se registran con `next/font/local` en `lib/fonts.ts`, leyendo
de `assets/fonts/<familia>/`. Sus CSS vars se exponen en el `className` del
`<html>` en `app/layout.tsx` y `app/globals.css` las consume en el `@theme
inline`.

Kepler tiene dos masters registrados porque son dibujos distintos, no dos
tamaños del mismo: el de texto está hecho para 9–13pt y el Display para 24pt+.
Qué escala usa cuál lo deciden las `@utility text-*-serif` / `accent-*` de
`app/globals.css`.

## Dónde vive cada cosa

```
assets/fonts/
  montreal/     ← los 4 subsets que sirve el sitio      (195KB, commiteados)
  kepler/       ← ídem                                   (156KB, commiteados)
  _originals/
    pp-neue-montreal/       ← familia completa del vendor (commiteada)
    pp-neue-montreal-mono/  ← ídem, hoy sin uso

public/fonts/
  kepler-font/  ← los 168 OTF de escritorio     (GITIGNORADO, no está en el repo)

_fonts/         ← conversiones completas a woff2 (GITIGNORADO)
```

**Nada de esto vive en `public/`.** Todo lo que está ahí Next lo publica tal cual
en una URL adivinable; desde `assets/` sale como `/_next/static/media/<hash>.woff2`
y solo lo que el build efectivamente registra.

Las dos familias reciben trato distinto en git, y la razón no es capricho:

- **Montreal** son webfonts, ya estaban commiteadas desde el fork de
  `near-ai-web` y su historial las conserva igual. Se movieron de `public/` a
  `assets/fonts/_originals/` para que dejen de publicarse, pero siguen
  trackeadas: sacarlas de git no achicaría el repo (el historial las tiene) y sí
  haría que quien clone no pueda regenerar los subsets.
- **Kepler** son 168 OTF de **escritorio**, 30MB, que nunca estuvieron en git y
  cuyo EULA (`Licenses/2275/`, un Monotype *"Font Software For Desktop"*)
  prohíbe explícitamente servir la fuente desde un servidor. Se quedan en la
  máquina de quien tiene la licencia. El self-host se hace sobre una licencia
  web aparte.

## Regenerar los subsets

Requiere `fonttools` + `brotli` en el `python3` del sistema, y —para el perfil
`kepler`— los OTF en `public/fonts/kepler-font/`.

```bash
python3 scripts/fonts/build-webfonts.py            # los dos perfiles
python3 scripts/fonts/build-webfonts.py montreal   # uno solo
python3 scripts/fonts/build-webfonts.py kepler --all   # familia completa → _fonts/
```

El script **no** entra a `prebuild` ni a CI: no tendría de dónde leer. El build
depende de los `.woff2` commiteados, no de él.

### Las dos familias necesitan subsets opuestos

No es la misma receta con distintos archivos, y por eso cada perfil declara el
suyo:

- **Kepler** tiene ~410 de sus 731 glifos en el Private Use Area — versalitas,
  swashes, ornamentos y cifras alternativas que Adobe mapeó ahí. Subsettear por
  rango unicode no la baja (quedan 655 de 731); la palanca son las features.
  Resultado: 459KB → **156KB**.
- **Montreal** no tiene nada en el PUA: sus 1352 glifos son cobertura de idiomas
  real (434 de latín, 173 de latin ext additional, 124 de cirílico, 77 de
  griego). Acá la palanca es el rango unicode. Resultado: 324KB → **195KB**.

De Montreal se descartan **cirílico y griego**, 204 codepoints para los que el
sitio no tiene ni contenido ni plan. Si alguna vez aparecen, caen a la fuente de
sistema — se ven distintos, no desaparecen. Todo el latín se queda, incluido el
vietnamita, cada símbolo que la fuente trae y los diacríticos combinables
(`U+0300-036F`): macOS produce texto en NFD, donde "é" son dos codepoints, y sin
ellos ese texto saldría roto.

### Por qué el recorte de features no puede romper nada

Las features que un navegador aplica **por defecto** son `kern liga clig calt
ccmp locl mark mkmk rlig`, y están todas en la lista que el script conserva. El
resto (`aalt`, `ss01`, `ss02`, `dlig`…) solo se activa si el CSS las pide con
`font-feature-settings` o `font-variant-*`, y nadie en el repo lo hace. Las de
cifras (`tnum pnum onum lnum frac numr dnom sups subs sinf ordn zero case`) se
conservan igual porque son las que mapean a las utilidades de Tailwind
(`tabular-nums`, `slashed-zero`, `ordinal`, `diagonal-fractions`), que sí se usan.

### El chequeo de regresión

Al subsettear Montreal, el script recorre `app/`, `components/` y `lib/`,
junta cada carácter que aparece en el código fuente y falla si alguno **que la
fuente de origen sí dibujaba** quedó afuera del subset.

Es una comparación contra el original y no cobertura absoluta a propósito: un
carácter que Montreal nunca tuvo (⚠, 🔒, ─) ya caía a la fuente de sistema antes
de todo esto, así que reportarlo sería ruido. Lo que no puede pasar es que algo
que hoy se dibuja con esta fuente deje de dibujarse.

Es una cota por lo bajo — el contenido del CMS vive en la base de datos, no en el
repo — pero atrapa el caso real: que un subset se coma un carácter que ya está en
uso y nadie lo note hasta verlo en producción.

## Historial

Kepler venía de un kit de Typekit (`use.typekit.net/gtm1rhn.css`) cargado con un
`<link>` en el `<head>` de `app/layout.tsx`. El kit servía 56 faces (14 familias
× 400/700 × normal/itálica) de las cuales el sitio usaba 4, y lo hacía con
`font-display: auto` — o sea bloqueando el paint hasta ~3s, más un round-trip
extra (DNS + TLS + el CSS del kit) antes de que el `.woff2` pudiera empezar a
bajar. Ese fue el motivo del cambio, más que el peso.

Montreal ya era self-hosteada y no tenía problema de carga; lo suyo fue solo el
subset y salir de `public/`.

## Pendientes

- `--font-mono` es del sistema y `font-mono` se usa en ~25 lugares (eyebrows,
  fechas y tags del blog, más los bloques de código de `/brand`), así que hoy
  rinde distinto en macOS, Windows y Linux. `assets/fonts/_originals/pp-neue-montreal-mono/`
  está listo para cuando se decida.
- `assets/fonts/_originals/pp-neue-montreal/` no trae documento de licencia, a
  diferencia de Kepler. Las licencias de Pangram Pangram normalmente permiten
  self-host y subsetting, pero no hay nada contra qué verificarlo en el repo.
- `public/fonts/kepler-font/` sigue ahí porque es donde lo dejó quien compró las
  fuentes. Está gitignorado, así que no se despliega — pero en `pnpm dev` el
  servidor local sí lo sirve. Moverlo a `assets/fonts/_originals/` dejaría
  `public/fonts/` sin existir.
