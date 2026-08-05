# Fase 0 — Divergencias visuales entre las 3 páginas de listado de blog

Documento de referencia para la Fase 2 (librería de secciones) y Fase 3 (separar
fetching de composición). Cada divergencia listada aquí tiene una decisión
tomada — la Fase 2 no debe introducir ningún cambio visual que no esté en esta
lista.

Verificado contra el HTML servido en dev (`/blog`, `/blog/category/announcements`,
`/blog/tag/web3`) capturado en la Fase 0. **Nota:** la base de datos de desarrollo
no tiene posts publicados hoy, así que las divergencias de `PostCard` (2, 6) se
verificaron leyendo el código fuente, no el HTML renderizado — no hay ningún
`<article>` real en el baseline para diffear. Cuando existan posts, repetir la
captura y confirmar visualmente antes de dar por buena la Fase 2.

| # | Divergencia | `blog/page.tsx` | `category/[slug]` | `tag/[tag]` | Decisión para `PageHero`/`PostCard` |
|---|---|---|---|---|---|
| 1 | Altura del hero | `min-h-[420px]` | `min-h-[360px]` | `min-h-[360px]` | Prop `size?: "lg" \| "md"` — `"lg"` = 420px (blog index), `"md"` = 360px (category/tag). Default `"md"`. |
| 1b | Padding inferior del bloque de texto (**no detectado en la primera pasada, encontrado al implementar la Fase 2**) | `pb-16 lg:pb-24` | `pb-16 lg:pb-20` | `pb-16 lg:pb-20` | Atado al mismo mapa que `size` — `"lg"` incluye `pb-24`, `"md"` incluye `pb-20`. No es una prop nueva, viaja junto con `size`. |
| 2 | Texto eyebrow del hero | `"NEAR AI BLOG"` | `"Category"` | `"Tag"` | Prop `eyebrow: string` — texto libre, cada página pasa el suyo. |
| 3 | Segundo párrafo bajo el eyebrow | Sí, subcopy fija ("Insights on private AI…") | No — solo el conteo `{total} post(s)` | No — solo el conteo | Prop `description?: ReactNode` opcional. El conteo de posts NO va dentro de `PageHero` (es un dato, no copy) — se renderiza aparte, fuera de la sección, como hoy. |
| 4 | `sizes` del `<Image>` de la card | `"(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"` | `"(max-width: 640px) 100vw, 33vw"` | (no incluido en el código verificado, usa el mismo patrón de card) | Unificar al valor más completo (el de `blog/page.tsx`) — es información puramente de rendimiento de carga, no un cambio visual perceptible. Ver §Decisión abajo. |
| 5 | Texto del CTA en la card | `"Read →"` | `"Read more →"` | `"Read more →"` (mismo patrón que category) | Prop `ctaLabel?: string`, default `"Read more →"`. `blog/page.tsx` pasa `"Read →"` explícito para no cambiar su copy actual. |
| 6 | Metadata mostrada arriba del título de la card | Eyebrow con nombre de categoría (`post.categories[0].name`), si existe | Fecha de publicación arriba (sin categoría) | (mismo patrón que category, sin categoría) | Prop `metaPosition?: "category-top" \| "date-top"`. `blog/page.tsx` usa `"category-top"` (y sigue mostrando la fecha abajo, junto al CTA, como hoy); category/tag usan `"date-top"`. |
| 7 | Mensaje del empty state | `"No posts yet. Check back soon."` | `"No posts in this category yet."` | `"No posts with this tag yet."` | Prop `message: string` — texto libre, sin default; cada página debe pasar el suyo explícitamente. |

## Decisión sobre el punto 4 (`sizes`)

Es la única divergencia que no es "copy o layout" sino una pista de rendimiento
para el navegador (qué tamaño de imagen descargar según el viewport). No tiene
efecto visual — afecta qué variante de imagen se descarga. Se unifica al valor
de `blog/page.tsx` (`"(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"`)
para las tres páginas, ya que es estrictamente más preciso que el de `category`
(cubre el breakpoint intermedio `lg` que la card sí usa: `sm:grid-cols-2 lg:grid-cols-3`).
`PostCard` no expone esto como prop — queda hardcodeado dentro de la sección.

## Fuera de esta lista (confirmado idéntico, no requiere decisión)

- El grid: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6` — igual en las 3.
- El wrapper de card: `rounded-[1.5rem] overflow-hidden border border-[#CAC8C8] bg-[#ECECEC] hover:shadow-lg` — igual en las 3.
- La paginación (Previous/Next + "Page X of Y") — igual en las 3, solo cambia la construcción del `href` (con o sin querystring extra), que ya está resuelto en el diseño de `Pagination` (Fase 2: recibe `basePath + params`, construye el href internamente).
- El símbolo `✦` y el estilo del empty state — igual en las 3.
