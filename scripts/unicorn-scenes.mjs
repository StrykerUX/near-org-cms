#!/usr/bin/env node
// Prepara las escenas de Unicorn Studio que usan los covers de la home.
//
// Hay UN EXPORT POR COLOR, y son escenas distintas de verdad: además de la
// imagen, cada una trae sus propios shaders compilados (el spread del flow
// field, la mezcla final, y si la capa `blinds` aplica aberración cromática o
// no — ver docs/unicorn.md). Por eso este script NO deriva variantes de un
// export base: eso aplanaría los tres ajustes en el del export elegido.
//
// Lo único que hace es reapuntar el `src` de la capa `image`, que en el export
// sale contra el CDN de Unicorn, a public/unicorn/, donde las imágenes están
// self-hosteadas. En producción eso saca una dependencia de runtime contra un
// tercero del camino de render de la home: si su CDN está lento o caído, el
// cover se quedaba en el gradiente CSS. No toca ni un shader.
//
//   node scripts/unicorn-scenes.mjs
//
// Entrada:  assets/unicorn/<source>_scene.json   (el export tal cual)
// Salida:   public/unicorn-scene-<name>.json

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, basename } from "node:path";

const ROOT = process.cwd();
const SOURCE_DIR = join(ROOT, "assets", "unicorn");
const IMAGE_DIR = join(ROOT, "public", "unicorn");

// nombre de la escena publicada → export del que sale.
const SCENES = {
  green: "near-gradient-1",
  blue: "near-gradient-blue",
  red: "near-gradient-red-orange",
};

// Las imágenes viven en public/unicorn/ y no en el CDN de Unicorn. Son assets
// del proyecto —las subió quien diseñó la escena—, así que servirlas nosotros no
// es distinto de servir cualquier otra imagen del sitio, y quita un tercero del
// camino crítico.
const LOCAL_BASE = "/unicorn/";

let failed = false;

for (const [name, source] of Object.entries(SCENES)) {
  const from = join(SOURCE_DIR, `${source}_scene.json`);

  if (!existsSync(from)) {
    console.error(
      `✗ ${name}: falta ${from}.\n` +
        "  Exportá la escena desde Unicorn Studio y dejala ahí — ver docs/unicorn.md."
    );
    failed = true;
    continue;
  }

  const scene = JSON.parse(readFileSync(from, "utf8"));
  const layer = scene.history?.find((l) => l.layerType === "image");

  if (!layer?.src) {
    console.error(`✗ ${name}: el export no tiene una capa \`image\` con \`src\`. ¿Cambió el formato?`);
    failed = true;
    continue;
  }

  // El reapuntado es por basename y no por una tabla de traducción: la copia
  // local conserva el nombre que la imagen tiene en el CDN, así que agregar un
  // color es bajar su JPG y agregar una línea a SCENES.
  const file = basename(layer.src);

  if (!existsSync(join(IMAGE_DIR, file))) {
    console.error(
      `✗ ${name}: falta public/unicorn/${file}. Bajala del CDN:\n` +
        `  curl -o public/unicorn/${file} ${layer.src}`
    );
    failed = true;
    continue;
  }

  layer.src = LOCAL_BASE + file;

  const out = join(ROOT, "public", `unicorn-scene-${name}.json`);
  writeFileSync(out, JSON.stringify(scene));
  console.log(`✓ unicorn-scene-${name}.json  ← ${source} · ${file}`);
}

if (failed) process.exit(1);
