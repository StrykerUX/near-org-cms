# Fuentes

## Qué sirve qué

| Token del DS | Familia | Faces |
|---|---|---|
| `--font-sans` | PP Neue Montreal | Book (400), BookItalic, Medium (500), Bold (700) |
| `--font-serif` | Kepler Std **Subhead** | Subh (400), ItSubh |
| `--font-display` | Kepler Std **Display** | Disp (400), ItDisp |
| `--font-mono` | PP Neue Montreal Mono | Regular (400), Medium (500) |

Las cuatro se registran con `next/font/local` en `lib/fonts.ts`, leyendo
de `assets/fonts/<familia>/`. Sus CSS vars se exponen en el `className` del
`<html>` en `app/layout.tsx` y `app/globals.css` las consume en el `@theme
inline`.

### Por qué Kepler va en Subhead y no en el master de texto

Kepler tiene dos masters registrados porque los masters ópticos son dibujos
distintos, no dos tamaños del mismo. Qué escala usa cuál lo deciden las
`@utility text-*-serif` / `accent-*` de `app/globals.css`.

`--font-serif` alimenta `text-h1-serif` (44–88px), `text-h2-serif` (34–60px) y
`accent-serif` (1.18em de un heading). El master de texto está dibujado para
9–13pt — estaba mal usado. Subhead lo está para ~14–24pt.

### Por qué NO son las condensed

Lo fueron hasta que se midió el desbalance que el equipo de diseño venía
reportando: el acento itálico se leía **más chico** que la sans que lo rodea.

El diagnóstico intuitivo es subir el tamaño, y es el equivocado. Todos los
masters de Kepler comparten x-height (433) y cap-height (654), así que
`--text-serif--optical-scale: 1.18` —que compensa la x-height de Kepler contra
la de Montreal (510)— ya dejaba la ALTURA exacta. Lo que no compensa es el
ancho, y ahí las condensed son ~25% más angostas:

| | x-height | avance medio | avance ×1.18 |
|---|---|---|---|
| Montreal (la sans) | 510 | 520 | — |
| Kepler **Cn**ItSubh | 433 | 360 | 425 · **−18%** |
| Kepler ItSubh | 433 | 450 | 531 · +2% |

O sea: el acento tenía la altura correcta y el ancho de otra fuente. Subir la
escala no lo arregla — para igualar el avance del condensed hace falta `1.44`, y
a esa escala la x-height se va **22% por encima** de la de Montreal. Se cambia un
desbalance por otro.

La palanca era el master, no el tamaño. Con los de ancho normal el `1.18` iguala
las dos cosas a la vez.

**Si el acento vuelve a leerse mal, medí antes de tocar el token.** Es el
instrumento para la altura y nada más; comprobá si lo que está descalzado es el
ancho, el peso o el master óptico.

Si alguna vez hace falta un Kepler *condensado*, sigue estando en los OTF: solo
Display y Subhead lo traen (no existe `KeplerStd-Cn` de texto ni `CnCapt`), y lo
más cerca para texto corrido es semicondensed (`KeplerStd-Scn`, minúsculas a 435
milésimas de em contra 357 de la condensed).

## Dónde vive cada cosa

```
assets/fonts/
  montreal/       ← los 4 subsets que sirve el sitio    (195KB, commiteados)
  montreal-mono/  ← ídem, 2 faces                        (53KB, commiteados)
  kepler/         ← ídem                                (156KB, commiteados)
  _originals/
    pp-neue-montreal/       ← familia completa del vendor (commiteada)
    pp-neue-montreal-mono/  ← ídem

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
- **Montreal Mono** usa el MISMO rango que la sans, y por el mismo motivo: parte
  de lo que se dibuja en mono son los tags del blog, que los escriben los
  editores en el CMS. Trae 2320 glifos —más que la sans— así que el recorte pega
  más fuerte: 138KB → **53KB** en dos faces.

  Dos faces y no cuatro porque casi todos los usos de `font-mono` van en peso
  normal; los que no, se combinan con `text-eyebrow`, que es weight 500. Sin esa
  segunda face el navegador sintetiza el peso, y en una monoespaciada se nota más
  que en una proporcional: engorda el trazo sin poder ensanchar el avance.

  Y sirve `Regular`, no `Book`. No es una inconsistencia con la sans — es que en
  esta familia el 400 nominal existe de verdad (Book es 350, igual que en la
  sans), así que no hay por qué repetir el 350-declarado-400.

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

- El chequeo de regresión junta los caracteres del CÓDIGO FUENTE, sin distinguir
  comentario de JSX. Un `π` o un `θ` escrito en un comentario para explicar una
  fórmula lo hace fallar, aunque no se dibuje en ninguna parte. La respuesta
  correcta es escribirlo en ASCII, no ampliar el rango: el subset se elige por lo
  que el sitio RENDERIZA. Pasó dos veces; si vuelve a pasar seguido, conviene que
  el verificador ignore comentarios.
- `assets/fonts/_originals/pp-neue-montreal/` no trae documento de licencia, a
  diferencia de Kepler. Las licencias de Pangram Pangram normalmente permiten
  self-host y subsetting, pero no hay nada contra qué verificarlo en el repo.
- `public/fonts/kepler-font/` sigue ahí porque es donde lo dejó quien compró las
  fuentes. Está gitignorado, así que no se despliega — pero en `pnpm dev` el
  servidor local sí lo sirve. Moverlo a `assets/fonts/_originals/` dejaría
  `public/fonts/` sin existir.
