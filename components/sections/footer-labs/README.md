# `footer-labs/` — dos pruebas sobre el footer real

Alimenta **tres rutas**: `/prototype/footer-labs` (el índice) y una por prueba.

## Qué se está probando

El mecanismo del footer **ya está decidido**: es el takeover de
`components/site/SiteFooter.tsx` — wipe negro a pantalla completa, panel de
links, wordmark a sangre. Lo que sigue abierto es más chico y más incómodo:

> El wordmark mide, de alto, un **cuarto del ANCHO** del viewport. En una
> pantalla ancha y baja (1920×800: 486px de logo) el panel y el logo no entran
> los dos enteros. ¿Qué cede?

Las dos rutas son dos respuestas a eso:

| | Ruta | Qué hace | Qué mirar |
|---|---|---|---|
| **01** | `veil` | Un degradado **del color del fondo** cae sobre el wordmark desde su borde superior, y el logo queda pegado al borde inferior de la página: no termina ahí, se mete debajo | Dónde dejan de leerse las letras. El velo se mide contra la caja del propio logo, así que sigue al alto que el reparto vertical le dé |
| **02** | `compact` | Se va el headline y los dos grupos con sub-secciones —Resources y About— se abren en dos columnas. El panel encoge y el alto que devuelve se lo queda el logo | Cuánto crece el logo de verdad, y si una columna de links sigue leyéndose como columna cuando va de a dos |

## No hay secciones de footer acá

**Esa es la decisión de diseño del lab.** Las dos rutas montan
`components/site/SiteFooter.tsx` y le pasan un `variant`:

```tsx
<SiteFooter variant="veil" />
```

Antes esta carpeta tenía seis footers alternativos completos (`FooterSheet`,
`FooterGlyph`, `FooterAscend`, `FooterReveal`, `FooterKinetic`, `FooterStack`),
cada uno con su mecanismo de entrada y su copia de los links — más un `GROUPS`
propio acá para que las seis dijeran lo mismo. Se borraron: el mecanismo dejó
de estar en discusión, y un footer copiado se desincroniza del real al primer
cambio. Con `variant`, la prueba **es** el footer de producción con una
variación, y no puede mentir sobre él.

El precio: cada variante nueva es un valor más en `SiteFooterVariant` y unos
condicionales dentro de `SiteFooter`. Es aceptable mientras sean dos o tres y
las tres compartan casi todo. Si alguna necesita desviarse de verdad del
layout, el camino es sacarla a su propia sección — no llenar el footer de
producción de ramas.

## Lo que quedó de la tanda anterior

- **`footerScene.ts`** — `enterExit`, el helper de entrada/salida contra el
  borde del documento. Ya no lo usa ningún footer, pero **los ocho
  `mural-labs` lo importan**: no se borra sin mudarlo primero.
- **`LabFiller.tsx`** — el relleno tonto que va encima del footer en cada ruta,
  para que se llegue a él después de scrollear una página entera, que es como
  se ve de verdad.
- **`footerLabContent.ts`** — la ficha de cada prueba. Ya no lleva copia de los
  links: salen del footer real.

## Una ruta por variante, no las dos apiladas

El footer se dispara contra **el fondo del documento**, y solo hay un fondo del
documento: apiladas, la primera se comería a la segunda. Está explicado en
`components/views/footer-labs/FooterLabShell.tsx`, que es también donde vive el
contrato de z-index (`z-10` para la hoja de contenido, `z-30` para el takeover).

`PrototypeFooterSlot` excluye `/prototype/footer-labs` **por prefijo**, así que
una ruta nueva del lab no monta además el footer del sitio sin que haya que
acordarse de nada.
