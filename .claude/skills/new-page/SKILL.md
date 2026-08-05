---
name: "Nueva página"
description: "Crea una página de marketing nueva (page.tsx + page.meta.ts + View) y regenera el manifiesto de rutas en un solo paso."
inputs:
  - name: slug
    type: string
    required: true
    description: "Segmento de ruta en kebab-case, ej: pricing, about-us. Se usa tal cual como URL: /pricing."
  - name: title
    type: string
    required: true
    description: "Título legible de la página, ej: Pricing. Se usa en el manifiesto y en el placeholder inicial."
invocationType: "user"
---

# Nueva página

Crea una página de marketing nueva de punta a punta: los 3 archivos que
necesita, coherentes entre sí, y el manifiesto de rutas ya regenerado — ver
`components/sections/README.md` para el catálogo de secciones disponibles.

## Qué hacer

1. Correr `node scripts/new-page.mjs <slug> "<título>"` con los valores que
   dio la persona. El script:
   - Valida el slug (kebab-case, no reservado, no existente).
   - Crea `app/(site)/<slug>/page.tsx` y `page.meta.ts`.
   - Crea `components/views/<Slug>View.tsx` con un placeholder.
   - Regenera el manifiesto de rutas automáticamente.
2. Si el script falla (slug inválido, reservado, o ya existe), mostrar el
   mensaje de error tal cual — ya es accionable, no hace falta reformularlo.
3. Si tiene éxito, decirle a la persona:
   - La página ya vive en `/<slug>` (correr `pnpm dev` para verla).
   - El único archivo que le corresponde editar ahora es
     `components/views/<Slug>View.tsx` — ahí compone la página combinando
     secciones de `components/sections/*` (ver el README de esa carpeta
     para el catálogo disponible y el contrato).
   - Si necesita que la página aparezca en el menú (header/footer) o en el
     sitemap, edite `nav`/`sitemap` en el `page.meta.ts` recién creado
     (trae `nav: {header:false, footer:false}` por defecto — hay que
     activarlo a propósito).
4. **Normalmente no hace falta editar `app/(site)/<slug>/page.tsx`.** Ya
   queda completo y correcto — es la pieza que conecta el meta con la vista.
   Si la página necesita datos de servidor (fetch, DB), ahí sí se edita:
   agregar el fetch siguiendo el patrón de `lib/queries/*` y pasarlo como
   prop al `view`.

## Ejemplo

Pedido: "quiero una página de pricing"
→ `node scripts/new-page.mjs pricing "Pricing"`
