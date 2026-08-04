---
name: "Nueva página"
description: "Crea una página de marketing nueva (page.tsx + page.meta.ts + View) sin tocar nada dentro de app/ a mano."
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

Crea una página de marketing nueva de punta a punta, sin que quien la pida
tenga que escribir nada dentro de `app/` (zona bloqueada para la zona
diseñadores — ver `.claude/settings.json` y `components/sections/README.md`).

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
4. **No editar `app/(site)/<slug>/page.tsx` a mano.** Ya está completo y
   correcto — es la pieza que conecta el meta con la vista. Si algo ahí
   parece necesitar un cambio, es señal de que el pedido en realidad
   necesita datos de servidor (fetch, DB) y hay que hablarlo con el
   ingeniero, no editarlo directamente.

## Ejemplo

Pedido: "quiero una página de pricing"
→ `node scripts/new-page.mjs pricing "Pricing"`
