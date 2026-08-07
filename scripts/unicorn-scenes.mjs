#!/usr/bin/env node
// Genera las variantes de color de la escena de Unicorn Studio.
//
// La escena exportada NO expone ninguna variable de color: sus únicos uniforms
// son la resolución del artboard y el aspect ratio. Todo el color sale del JPG
// de la capa `image`. Así que la única forma de tener tres covers con paletas
// distintas es tener una escena por imagen.
//
// Este script lee el export tal cual sale de Unicorn Studio y escribe una copia
// por variante, cambiando únicamente el `src` de esa capa. No toca ni un shader.
//
//   node scripts/unicorn-scenes.mjs
//
// Entrada:  public/unicorn-scene.json      (el export)
// Salida:   public/unicorn-scene-<x>.json
//
// Además reapunta ese `src` del CDN de Unicorn a public/unicorn/, donde las
// imágenes están self-hosteadas. En producción eso saca una dependencia de
// runtime contra un tercero del camino de render de la home: si su CDN está
// lento o caído, el cover se quedaba en el gradiente CSS.

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const SOURCE = join(ROOT, "public", "unicorn-scene.json");

// Las dos únicas imágenes que existen hoy en el CDN de Unicorn para este
// proyecto. gradient-3 en adelante devuelve 404.
const VARIANTS = {
  green: "gradient-1.jpg",
  blue: "gradient-2.jpg",
};

// Las imágenes viven en public/unicorn/ y no en el CDN de Unicorn. Son assets
// del proyecto —las subió quien diseñó la escena—, así que servirlas nosotros no
// es distinto de servir cualquier otra imagen del sitio, y quita un tercero del
// camino crítico.
const LOCAL_BASE = "/unicorn/";

if (!existsSync(SOURCE)) {
  console.error(
    `No existe ${SOURCE}.\n` +
      "Exportá la escena desde Unicorn Studio y dejala ahí — ver docs/unicorn.md."
  );
  process.exit(1);
}

const scene = JSON.parse(readFileSync(SOURCE, "utf8"));
const imageLayer = scene.history?.find((l) => l.layerType === "image");

if (!imageLayer?.src) {
  console.error("El export no tiene una capa `image` con `src`. ¿Cambió el formato?");
  process.exit(1);
}

for (const [name, file] of Object.entries(VARIANTS)) {
  // Copia profunda por serialización: el objeto es JSON puro, sin funciones ni
  // referencias cíclicas, y así cada variante sale independiente de las otras.
  const variant = JSON.parse(JSON.stringify(scene));
  const layer = variant.history.find((l) => l.layerType === "image");
  layer.src = LOCAL_BASE + file;

  const out = join(ROOT, "public", `unicorn-scene-${name}.json`);
  writeFileSync(out, JSON.stringify(variant));
  console.log(`✓ unicorn-scene-${name}.json  ← ${file}`);
}
