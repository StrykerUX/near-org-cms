# `hero-x` — la apertura común de las nueve páginas

Nueve páginas del sitio abren con la misma pieza: shader layerflow a pantalla
completa, titular abajo a la izquierda, cuerpo y salida a la derecha, y el
encuadre que se recoge en una tarjeta al scrollear.

**No es un laboratorio.** Está montado en las nueve páginas reales.

| Página | Ruta | `page=` |
|---|---|---|
| Protocol | `/protocol` | `protocol` |
| Chain Abstraction | `/chain-abstraction` | `chain` |
| Quantum Security | `/quantum-security` | `quantum` |
| History | `/about` | `about` |
| Community | `/community` | `community` |
| Economics | `/economics` | `economics` |
| Ecosystem | `/ecosystem` | `ecosystem` |
| Governance | `/governance` | `governance` |
| NEAR Foundation | `/near-foundation` | `foundation` |

## De dónde sale

De `protocol-labs/heroes/HeroLayerflow`, el hero de `/prototype/protocol-a`.
Copiado y no importado, por la regla de laboratorios: desde acá deja de moverse
con él, y el lab queda como registro de dónde estaba el diseño.

## Qué varía entre una página y otra

**La paleta no cambia. Las capas no cambian.** Las nueve comparten exactamente
los cinco colores y exactamente nueve carriles. El layout y la animación
también son idénticos.

Lo que cambia es dónde apunta el campo, con cuánta fuerza y qué dibuja:

| Familia | Uniformes |
|---|---|
| **Dirección** | el punto de fuga al que apuntan las estrías, y el ángulo por el que entra la sombra |
| **Intensidad** | contraste, piso, cuánto pesa el degradé sobre el campo, cómo se reparte la rampa |
| **Motivo** | frecuencia, curvatura y su tamaño, estirado, detalle fino, ancho de la juntura, velocidad |

El color y el conteo de carriles son lo que hace que la superficie se
**reconozca**; el resto es lo que hace que se **distinga**. Con nueve paletas
cada página tenía un shader propio y la familia se perdía: se leían como nueve
piezas parecidas en vez de como la misma pieza en nueve estados.

La consecuencia práctica es que estos presets se pueden empujar mucho más lejos
de lo que se podrían empujar nueve paletas. `u_curl` va de 0.55 en quantum
—estrías casi rectas, lo más cerca de una rejilla que el shader llega a
dibujar— a 2.1 en community, y nadie duda de que es el mismo material.

### El único límite duro: dónde cae la luz

`u_gradAngle` es lo más tentador de mover y lo que menos margen tiene. El
titular está abajo a la izquierda en las nueve y va en tinta, así que necesita
el papel más limpio del cuadro justo ahí. Los nueve valores viven entre **0.44 y
0.94 radianes** (25°–54°), que es el arco en el que la sombra cierra arriba a la
derecha.

Fuera de ese arco el hero no se rompe: se vuelve ilegible, que es peor porque no
avisa. Si alguna vez hay que abrirlo, la salida es mover el titular.

`u_focus` sí se mueve a gusto —de −0.34 en about a 1.9 en ecosystem— porque
orienta las **estrías** y no la luz. Es el parámetro con más rendimiento visual
por unidad de riesgo.

## Los tres archivos

```
HeroX.tsx          el componente. Una prop: `page`.
heroXContent.ts    la copy de las nueve, normalizada
heroXPresets.ts    PALETTE + LAYERS + BASE, y las nueve variaciones
```

**La copy no se inventa: se reacomoda.** Cada página guardaba su hero como le
convino —`headline` + `sub` + `standfirst` en about, `primary`/`secondary` en
community, solo el subtítulo en chain, nada en quantum y protocol— y el hero X
pide siempre las mismas cinco piezas. `heroXContent.ts` las normaliza con las
palabras que ya estaban.

Lo único nuevo es **dónde corta el titular** entre el tramo sans y el serif.
Tres páginas ya venían partidas en su propio componente y sus cortes están
transcritos; las otras seis se cortaron acá. Es una decisión de composición, y
por eso vive con el layout y no con la copy. Si alguien reescribe un titular en
el módulo de su página, este corte hay que revisarlo a mano: no se puede
derivar.

## Los heroes que reemplaza

Los nueve siguen en el árbol y ya no los monta nadie:

```
about/a/AboutHero          community/a/HubHero        governance/GovernanceHero
protocol/ProtocolHero      economics/a/Hero           foundation/a/HandoffHero
chain/ChainHero            ecosystem/EcosystemHero    quantum/QuantumHero
```

No se borraron a propósito: el hero X hay que juzgarlo con las nueve páginas
delante, y hasta que eso pase el anterior es lo único que dice de dónde se
viene. **Cuando el hero X se dé por bueno, se borran** — la regla del repo es
que dos archivos que dicen ser el mismo componente divergen sin que nadie se
entere.

Ojo con dos: `chain/ChainHero` mide 450 líneas y `quantum/QuantumHero` 185 —
llevan escena propia además del layout, así que borrarlos se lleva más que un
hero. Y `quantum/CtaPill` **sí se sigue usando**: lo importa este hero.

## Lo que queda fuera

`/` no entra: monta `HomeView`, que es el índice del repo y no tiene hero de
marketing. Tampoco `/blog` (listado, tiene su `PageHero`), `/design-system` ni
las trece rutas que todavía son `StubView`.
