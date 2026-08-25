# `hero-x` — la apertura común de las nueve páginas

Nueve páginas del sitio abren con la misma pieza: shader layerflow a pantalla
completa, titular abajo a la izquierda, cuerpo y salida a la derecha, y el
encuadre que se recoge en una tarjeta al scrollear.

**No es un laboratorio.** Está montado en las nueve páginas reales.

| Página | Ruta | `page=` |
|---|---|---|
| Protocol | `/blockchain` | `protocol` |
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

El layout y la animación son **idénticos** en las nueve. Cambian cuatro cosas, y
solo cuatro:

| | Qué hace |
|---|---|
| La rampa de color | Las cinco paradas. Es lo que da la temperatura. |
| El ángulo de la luz | De qué esquina entra la sombra. |
| Las capas | Cuántas franjas cruzan el campo (5 a 16). |
| El estirado | Cuánto se funden las estrías de cada capa. |

Todo lo demás sale de `BASE` en `heroXPresets.ts` y no se toca. Es lo que hace
que las nueve aperturas se lean como la misma pieza: si además variaran el
contraste, el grano, la deriva y el foco, cada página tendría un shader propio y
la familia se perdería.

**Ninguna rampa llega al blanco ni al negro**, y ninguna oscurece pronto. Debajo
hay un titular en tinta, así que el tono profundo aparece en UNA esquina —la que
el ángulo deja en sombra— y el resto del cuadro es papel. Una página que
oscurezca antes se queda sin sitio donde poner el titular, y la única salida
sería un velo más opaco: tapar el shader con una cortina.

## Los tres archivos

```
HeroX.tsx          el componente. Una prop: `page`.
heroXContent.ts    la copy de las nueve, normalizada
heroXPresets.ts    los nueve presets del shader
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
