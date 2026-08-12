# Baseline de performance — antes del refactor

Medido el 2026-08-11 sobre `main` en el commit `4fbd24d`, con `pnpm build`
(Next 16.1.6, Turbopack). Sirve como punto de comparación para las fases del
refactor de `/prototype/homepage-v2` y `/prototype/quantum-security`.

## Bundle

| Métrica | Baseline |
|---|---|
| Total `.next/static/chunks` | **5.9 MB** |
| Chunks de 879 KB | **3** (`0_gorp4d--16c.js`, `0u-jy6u-cllra.js`, `0v1vy9rw_j8fm.js`) |
| Siguiente chunk | 700 KB |
| CSS (bundle único: admin + sitio + prototipos) | **171 KB** |

Los tres chunks de 879 KB son el SDK de `unicornstudio-react`
(`node_modules/unicornstudio-react/dist/next.mjs`, 912 KB en disco) replicado
una vez por entrypoint que lo importa estáticamente: `sections/LatestUpdates.tsx`
(consumido por `PrototypeHomepageView` y `HomepageV2View`) y
`views/FlowCompareView.tsx`.

## Fuentes

**9 `<link rel="preload" as="font">` = 427 KB en TODA página**, idéntico en
`/`, `/prototype/homepage-v2` y `/prototype/quantum-security`:

| Familia | Faces | Peso | Uso real |
|---|---|---|---|
| Geist Variable | 1 | 69.6 KB | solo `.admin-wrapper` (`globals.css:464-467`) |
| PP Neue Montreal | 4 | ~200 KB | Book y Medium en todo el sitio; Bold e Italic a auditar |
| Kepler Std | 4 | ~158 KB | solo acentos (`accent-serif`/`accent-display`), casi todos bajo el fold |

## Assets

| Asset | Peso |
|---|---|
| `public/prototype/v2/hero-descent.mp4` | **13.3 MB**, hoy con `preload="auto"` |
| `public/prototype/v2/stories/*.png` | 6 imágenes de 0.87–1.24 MB (~6 MB), las 6 montadas a la vez |
| `public/unicorn-scene-{green,blue,red}.json` | 78 KB, servidos sin `Cache-Control` |

## Coste algorítmico por frame (medido leyendo el código, no perfilado)

| Sitio | Trabajo por frame |
|---|---|
| `quantum/quantumLattice.ts:130-153` | doble bucle O(n²) sobre ~208 nodos ≈ 43 000 iteraciones, y `glowOf` se recalcula dentro → **~90 000 `Math.exp()`** |
| `home-v2/QuantumBars.tsx:113-149` | ~340 spans de `SplitText`, ~170 tweens animando `color` (propiedad de paint) |
| `quantum/ThreatSequence.tsx:466-491` | `borderColor` animado en 7 elementos de hasta 112 vw × 112 vw |
| `quantum/NavPillQuantum.tsx:59-62` | `querySelectorAll` + 1 `getBoundingClientRect()` por sección oscura, por rAF de scroll |
| `home-v2/NearStack.tsx:186-188` | 2 forced reflows por `mousemove` (`getBoundingClientRect` + `offsetHeight`) |
| `quantum/wordField.ts:323-347` | 90–210 timelines nuevas por tanda, cada una con 3 tweens de `color` |

## Perfil de scroll (a capturar en el navegador)

Método para comparar entre fases — DevTools → Performance:

1. Cargar la página, esperar a que las fuentes hagan swap.
2. Grabar y hacer un scroll completo a velocidad constante (rueda, no arrastre de
   la barra) hasta el pie.
3. Anotar: nº de frames > 16 ms, tiempo total en `Recalculate Style`, en `Paint` y
   en `Composite Layers`.
4. Repetir con CPU throttling 4× para simular móvil.

Los tramos a vigilar: el hero con scrub de video en `homepage-v2`, y en
`quantum-security` los tres sticky consecutivos
(`StatementWipe → ThreatSequence → MathStatement`) más el hero con el canvas del
lattice.
