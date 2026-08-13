# Comentarios de revisión sobre el sitio (SitePing)

Permite que el equipo —que no es técnico y no tiene cuenta en ningún lado— deje
comentarios anclados a un elemento concreto de cualquier página, sobre staging o
sobre producción. El triage se hace desde `/admin/feedback`.

Está montado sobre [SitePing](https://github.com/NeosiaNexus/SitePing) (MIT),
autohospedado dentro de esta misma app: no hay servicio externo ni coste por
asiento.

## Cómo se usa

1. Entrá a **`/admin/feedback`** y copiá el **link de revisión**.
2. Mandáselo a quien tenga que comentar.
3. Esa persona lo abre una vez. A partir de ahí ve el widget en todo el sitio
   durante 30 días, en ese navegador. No necesita cuenta ni instalar nada.
4. Los comentarios aparecen en `/admin/feedback` para resolverlos o borrarlos.

Para salir del modo revisión (y comprobar cómo ve la página un visitante
normal): `fetch("/review", { method: "DELETE" })` desde la consola.

## Variables de entorno

```bash
SITEPING_API_KEY=       # firma las operaciones destructivas (PATCH/DELETE)
REVIEW_ACCESS_SECRET=   # firma los links de revisión
```

Las dos son obligatorias. **En producción SitePing lanza al arrancar si falta
`SITEPING_API_KEY`** — se niega a exponer una superficie destructiva sin
autenticar, y hace bien.

Rotar `REVIEW_ACCESS_SECRET` **invalida todos los links de revisión emitidos**.
Es la única forma de revocar: los tokens son autocontenidos y no se guardan en
la base, así que no se pueden revocar de a uno.

## Cómo está armado

| Pieza | Archivo |
|---|---|
| Firma y verificación de tokens | `lib/review-access.ts` |
| Nombres de cookie (cliente-safe) | `lib/review-cookies.ts` |
| Canje del link | `app/review/route.ts` |
| Handler compartido | `lib/siteping-handler.ts` |
| Endpoint del widget | `app/api/siteping/route.ts` |
| Endpoint del inbox | `app/api/admin/siteping/route.ts` |
| Widget | `components/site/ReviewWidget.tsx` |
| Inbox | `components/admin/FeedbackInbox.tsx` + `app/admin/feedback/page.tsx` |
| Capturas a R2 | `lib/siteping-screenshots.ts` |
| Tablas | `SitepingFeedback`, `SitepingAnnotation` en el schema de cms-core |

### Las tres decisiones que no son obvias

**1. El endpoint está cerrado, aunque SitePing lo abra.** SitePing deja `POST`
público por diseño (su widget corre sin autenticar). Sobre un sitio en
producción eso significa que cualquiera que descubra `/api/siteping` puede
escribir en la base. El gate por cookie vive en la ruta, delante del handler.

**2. La `apiKey` nunca llega al navegador.** `SitepingInbox` es un componente de
cliente; si le pasáramos la key, cualquiera con las devtools abiertas tendría
permiso de borrado sobre todo el feedback. Por eso el inbox apunta a
`/api/admin/siteping`, que valida la sesión de NextAuth y recién entonces firma
la petición del lado del servidor.

**3. Hay dos cookies, y una no es redundante.** `near_review` es el token
firmado y `httpOnly` — el único que autoriza. `near_review_ui` es un espejo
legible por JS y sin valor secreto, que solo le dice al cliente que monte el
widget. Existe para no romper el ISR: si el layout leyera la cookie real con
`cookies()`, Next marcaría toda la sección `(site)` como dinámica y el blog
perdería su render estático. Falsificar la cookie espejo muestra la UI y devuelve
403 en el primer request.

## Permisos

| Quién | Puede |
|---|---|
| Link de revisión | Crear y leer comentarios (con los emails de los demás **redactados**) |
| Sesión CMS `VIEWER` | Leer el inbox |
| Sesión CMS `ADMIN` / `EDITOR` | Cambiar estados y borrar |

## Limitación conocida: las capturas de vídeo y WebGL salen en blanco

SitePing captura con `html2canvas`, que **no puede renderizar `<video>` ni
canvas WebGL**. En este repo eso afecta a:

- `home-v2/HeroVideo` y `quantum/FieldBreak` — los dos `<video>`
- `ShineField` / `glyphShine` — WebGL2 (`glContext.ts` no usa
  `preserveDrawingBuffer`, y está bien que no lo use: activarlo cuesta
  rendimiento en todas las visitas)
- Los covers de Unicorn Studio en `LatestUpdates`

Los canvas **2D** (`quantumLattice`, `wordField`, `shardField`) sí se capturan.

En la práctica pesa poco: la captura es del rectángulo anotado más contexto, no
de la página entera, así que un comentario sobre un titular o un botón sale
perfecto. Solo si se comenta encima del vídeo el recorte sale vacío — **y el
comentario queda igualmente anclado**, porque el anclaje es del DOM y no depende
de la imagen.

Si algún día molesta, la salida es sustituir `html2canvas` por la Screen Capture
API (`getDisplayMedia`), que compone el sistema y sí ve vídeo y WebGL. Cuesta un
permiso del navegador por captura y parchear el widget.

## Riesgo a tener presente

SitePing tiene un solo mantenedor y va por la 0.x. Las versiones están
**fijadas** en `package.json` a propósito — un `^` puede traer un cambio de API
sin aviso. Antes de actualizar, leer su changelog y revisar si los modelos de
Prisma cambiaron de forma.

La superficie que usamos es pequeña (dos tablas y un handler), así que el plan B
—mantenerlo nosotros o reemplazarlo— no es dramático.
