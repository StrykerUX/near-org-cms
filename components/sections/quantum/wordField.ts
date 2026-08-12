import { gsap, ScrollTrigger } from "@/components/primitives/motion/gsapClient";
import { NEAR_MARK_PATH } from "@/components/sections/quantum/NearMark";

// The word field that fills the foot of the "Mathematics" section: rows of
// crypto vocabulary in monospace, with the letters that land on the silhouette
// of the NEAR mark lit green. The mark is never drawn — it is IMPLIED by which
// letters are on.
//
// How the cut-out is resolved: the mark's path is rasterised into an offscreen
// canvas and the alpha channel is sampled at the centre of every character. A
// geometric test against the path would be slower and less accurate (the path
// has interior contours), and `background-clip: text` is no use because we need
// to light INDIVIDUAL letters, not clip a continuous fill.
//
// ── Why any of this survives a resize ──────────────────────────────────────
// Three things had to be true, and originally none of them were:
//
//  1. The weave is CENTRED, not left-anchored. It is built wider than the host
//     and centred on it, so widening the window keeps the lit pattern under the
//     middle of the section instead of leaving it stranded to the left. When the
//     rows were left-anchored, "centre" moved away from the pattern and the mark
//     visibly drifted.
//  2. The mark's geometry is entirely PROPORTIONAL to the host. It used to carry
//     an absolute `- 180px` in its vertical placement, so its position drifted
//     against its own size at every viewport but the one it was tuned at.
//  3. Metrics are MEASURED, not assumed. The host's type is sized in vw so the
//     weave scales with the window; a hard-coded character width and line height
//     would desynchronise from it immediately.
//
// It also rebuilds on a real size change. Overscan absorbs small ones so the
// rebuild is rare, but nothing here can survive an arbitrary resize by
// arithmetic alone — the lit letters are baked by a pixel test.
//
// Imperative factory, created and destroyed by the section's `gsap.matchMedia()`
// — same contract as `quantumLattice.ts` and `glyphShine`.

const WORDS = [
  "quantum-safe", "ML-DSA-65", "FIPS-204", "rotate the key", "alice.near", "same account",
  "one transaction", "post-quantum", "lattice", "access key", "no migration",
  "live on mainnet", "the key is an attachment", "the account stays", "NEAR",
  "signed, not seen", "Ed25519", "secp256k1", "add_key", "delete_key", "full access key",
  "function call key", "nonce", "signature", "public key", "private key", "key pair",
  "seed phrase", "account model", "named account", "implicit account", "sub-account",
  "key rotation", "cryptographic agility", "hybrid signatures", "Shor’s algorithm",
  "Grover", "qubit", "superposition", "entanglement", "decoherence",
  "quantum Fourier transform", "discrete log", "elliptic curve", "period finding",
  "harvest now, decrypt later", "module lattice", "short vector", "learning with errors",
  "Dilithium", "hash-based", "SPHINCS+", "NIST", "forward secrecy", "no new address",
  "Nightshade", "sharding", "chain abstraction", "intents", "chain signatures",
  "mainnet 2.13", "validator", "finality", "receipts", "storage staking",
  "cross-contract call", "access key list", "state", "gas", "RPC", "self-custody",
];

// How much wider and taller than the host the weave is built. The surplus hangs
// off both sides, so the field still covers the host after a moderate resize and
// no edge of the weave is ever exposed while the rebuild is debouncing.
const OVERSCAN_X = 1.55;
const OVERSCAN_Y = 1.3;

// Mark placement, both as fractions of the HOST's height. The mark is far taller
// than the field on purpose — only its upper portion is in frame.
const MARK_HEIGHT = 1.876;
const MARK_TOP = 0.043;
/** The path's own box: it is drawn at 351 units square with its origin at 108. */
const MARK_BOX = 351;
const MARK_ORIGIN = 108;

// Alpha threshold for counting a character as INSIDE the mark. Not 0: the
// antialiased edges of the rasterisation would leave a fringe of half-lit
// letters all around the silhouette.
const INSIDE_ALPHA = 90;

// ── Lit-letter colour ────────────────────────────────────────────────────────
// The letters sit on the CREAM page, so both the resting green and the sparkle
// have to be values that hold against a light ground. The page's `--sweep` and
// `--near-teal` are tuned for dark sections and wash out here; these are the
// same hues carried down in value until they read.
const LIT_HUE = 157;
const LIT_SAT = 66;
const LIT_LUM = 36;
/** How far each letter's own colour strays from that, as a fraction. */
const LIT_JITTER = 0.28;
// The two-stop twinkle: a vivid yellow-green flash falling through teal back to
// the letter's resting colour.
const SPARK_PEAK = "#cfe600";
const SPARK_MID = "#12b39c";

// A resize smaller than this is absorbed by the overscan and ignored. Rebuilding
// on every pixel of a window drag would re-run the pixel test dozens of times a
// second.
const REBUILD_THRESHOLD = 28;
const REBUILD_DEBOUNCE = 180;

export type WordFieldHandle = { destroy: () => void };

/** Real character advance and line height, including the host's letter-spacing. */
function measure(host: HTMLElement): { charW: number; lineH: number } {
  const probe = document.createElement("div");
  probe.style.cssText = "position:absolute;visibility:hidden;white-space:pre;top:0;left:0";
  probe.textContent = "M".repeat(100);
  host.appendChild(probe);
  const charW = probe.getBoundingClientRect().width / 100;
  const lineH = parseFloat(getComputedStyle(host).lineHeight) || probe.offsetHeight;
  probe.remove();
  return { charW: charW || 8.6, lineH: lineH || 20 };
}

export function createWordField(
  host: HTMLElement,
  section: Element,
  { motionOk }: { motionOk: boolean }
): WordFieldHandle {
  let cleanups: (() => void)[] = [];
  let lastW = 0;
  let lastH = 0;

  function teardown() {
    cleanups.forEach((fn) => fn());
    cleanups = [];
    // The weave was built by this module, so there is nothing of React's to
    // restore and the gsap context's revert would not see it.
    host.replaceChildren();
  }

  function build() {
    const box = host.getBoundingClientRect();
    if (!box.width || !box.height) return;
    lastW = box.width;
    lastH = box.height;

    const { charW, lineH } = measure(host);

    const blockW = box.width * OVERSCAN_X;
    const blockH = box.height * OVERSCAN_Y;
    const cols = Math.ceil(blockW / charW);
    const rows = Math.ceil(blockH / lineH);

    // ── 1. the weave ─────────────────────────────────────────────────────
    // Fixed seed: the field has to look the same on every load, and identical
    // before and after a rebuild. With Math.random() a resize would reshuffle
    // every word and the "drawing" they form would change under the reader.
    let seed = 4297;
    const rnd = () => {
      seed = (seed * 1103515245 + 12345) & 0x7fffffff;
      return seed / 0x7fffffff;
    };

    // One centred block, rather than rows laid straight into the host. This is
    // what keeps the pattern under the middle of the section at every width.
    const block = document.createElement("div");
    block.style.cssText =
      "position:absolute;top:0;left:50%;transform:translateX(-50%);width:max-content";

    for (let r = 0; r < rows; r++) {
      const row = document.createElement("div");
      let n = 0;
      while (n < cols) {
        const w = WORDS[Math.floor(rnd() * WORDS.length)];
        // The arrows point with the row: even rows read left to right, odd rows
        // back. That is what gives the field its back-and-forth texture instead
        // of reading as a list.
        const sep = rnd() < 0.34 ? (r % 2 === 0 ? "  →  " : "  ←  ") : "   ";
        const span = document.createElement("span");
        span.textContent = w + sep;
        if (rnd() > 0.805) span.style.color = "rgba(0,0,0,0.3)";
        row.appendChild(span);
        n += w.length + sep.length;
      }
      block.appendChild(row);
    }
    host.appendChild(block);

    // ── 2. which letters land inside the mark ────────────────────────────
    const litBase = new Map<HTMLElement, string>();
    const blockBox = block.getBoundingClientRect();

    if (blockBox.width && typeof window.Path2D !== "undefined") {
      const cw = Math.round(blockBox.width);
      const ch = Math.round(blockBox.height);
      const cv = document.createElement("canvas");
      cv.width = cw;
      cv.height = ch;
      const ctx = cv.getContext("2d");

      if (ctx) {
        // Sized and placed off the HOST, then drawn into the BLOCK's canvas.
        // Because the block is centred on the host, centring the mark on the
        // block centres it on the section — and it stays centred at any width.
        const size = box.height * MARK_HEIGHT;
        const sc = size / MARK_BOX;
        ctx.translate(
          (cw - size) / 2 - MARK_ORIGIN * sc,
          box.height * MARK_TOP - MARK_ORIGIN * sc
        );
        ctx.scale(sc, sc);
        ctx.fill(new Path2D(NEAR_MARK_PATH));

        const px = ctx.getImageData(0, 0, cw, ch).data;
        const inside = (x: number, y: number) => {
          const ix = Math.round(x);
          const iy = Math.round(y);
          if (ix < 0 || iy < 0 || ix >= cw || iy >= ch) return false;
          return px[(iy * cw + ix) * 4 + 3] > INSIDE_ALPHA;
        };

        const walker = document.createTreeWalker(block, NodeFilter.SHOW_TEXT);
        const nodes: Text[] = [];
        while (walker.nextNode()) nodes.push(walker.currentNode as Text);

        // Everything is MEASURED first and replaced afterwards. Interleaving the
        // two invalidates layout at every node, and the next Range's
        // `getBoundingClientRect()` forces it again: thousands of synchronous
        // reflows over ~10k characters.
        const rng = document.createRange();
        const plan: { node: Text; hits: number[] }[] = [];
        for (const node of nodes) {
          const t = node.nodeValue ?? "";
          const hits: number[] = [];
          for (let i = 0; i < t.length; i++) {
            if (t[i] === " ") continue;
            rng.setStart(node, i);
            rng.setEnd(node, i + 1);
            const r = rng.getBoundingClientRect();
            if (!r.width) continue;
            if (
              inside(
                r.left + r.width / 2 - blockBox.left,
                r.top + r.height / 2 - blockBox.top
              )
            ) {
              hits.push(i);
            }
          }
          if (hits.length) plan.push({ node, hits });
        }

        for (const { node, hits } of plan) {
          const t = node.nodeValue ?? "";
          const out = document.createDocumentFragment();
          let cur = 0;
          for (const i of hits) {
            if (i > cur) out.appendChild(document.createTextNode(t.slice(cur, i)));
            const sp = document.createElement("span");
            sp.textContent = t[i];
            // Every letter carries the base green with its own variation: a flat
            // green would read as a block of colour rather than as a weave.
            const sat = LIT_SAT + (rnd() - 0.5) * LIT_JITTER * LIT_SAT;
            const lum = LIT_LUM + (rnd() - 0.5) * LIT_JITTER * LIT_LUM;
            const color = `hsl(${LIT_HUE},${sat.toFixed(1)}%,${lum.toFixed(1)}%)`;
            sp.style.color = color;
            sp.dataset.lit = "1";
            litBase.set(sp, color);
            out.appendChild(sp);
            cur = i + 1;
          }
          if (cur < t.length) out.appendChild(document.createTextNode(t.slice(cur)));
          node.parentNode?.replaceChild(out, node);
        }
      }
    }

    // ── 3. motion ────────────────────────────────────────────────────────
    const rows_ = Array.from(block.children) as HTMLElement[];
    const words = Array.from(block.querySelectorAll<HTMLElement>("div > span"));
    if (!motionOk) return;

    gsap.set(rows_, { autoAlpha: 1 });
    gsap.set(words, { autoAlpha: 0 });

    // The field fills in word by word in random order. The whole set lands in
    // ~1.1s, so each word only needs a short fade.
    const fillIn = ScrollTrigger.create({
      trigger: host,
      start: "top 80%",
      once: true,
      onEnter: () => {
        gsap.to(words, {
          autoAlpha: 1,
          duration: 0.18,
          ease: "power1.out",
          stagger: { each: 0.94 / Math.max(1, words.length - 1), from: "random" },
        });
      },
    });
    cleanups.push(() => fillIn.kill());

    // Parallax between the field and the sentence over it. Raised 10% from ±90.
    const drift = gsap.fromTo(
      rows_,
      { y: -99 },
      {
        y: 99,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
          invalidateOnRefresh: true,
        },
      }
    );
    cleanups.push(() => {
      drift.scrollTrigger?.kill();
      drift.kill();
    });

    // Sparkle: the same lime → teal ramp the sentence wipes through, hopping
    // from letter to letter. Only while the section touches the viewport.
    const lit = Array.from(litBase.keys());
    if (!lit.length) return;

    let live = false;
    const gate = ScrollTrigger.create({
      trigger: section,
      start: "top bottom",
      end: "bottom top",
      onToggle: (st) => (live = st.isActive),
    });
    const sparks = new Map<HTMLElement, gsap.core.Timeline>();
    let timer: gsap.core.Tween | null = null;

    const tick = () => {
      if (live) {
        // More letters at once and a shorter flash than before: the effect reads
        // as twinkling rather than as a slow pulse.
        const n = 90 + Math.floor(Math.random() * 120);
        for (let i = 0; i < n; i++) {
          const el = lit[Math.floor(Math.random() * lit.length)];
          const running = sparks.get(el);
          if (running && running.isActive()) continue;
          sparks.set(
            el,
            gsap
              .timeline({ delay: Math.random() * 0.9 })
              .to(el, { color: SPARK_PEAK, duration: 0.07, ease: "none" })
              .to(el, { color: SPARK_MID, duration: 0.34, ease: "none" })
              .to(el, {
                color: litBase.get(el) ?? "#00b96f",
                duration: 0.22,
                ease: "power1.inOut",
              })
          );
        }
      }
      timer = gsap.delayedCall(0.5 + Math.random() * 0.7, tick);
    };
    timer = gsap.delayedCall(0.6, tick);

    cleanups.push(() => {
      gate.kill();
      timer?.kill();
      sparks.forEach((t) => t.kill());
      sparks.clear();
    });
  }

  build();

  // ── rebuild on a real size change ──────────────────────────────────────
  let pending: ReturnType<typeof setTimeout> | undefined;
  const ro = new ResizeObserver(() => {
    const r = host.getBoundingClientRect();
    if (
      Math.abs(r.width - lastW) < REBUILD_THRESHOLD &&
      Math.abs(r.height - lastH) < REBUILD_THRESHOLD
    ) {
      return;
    }
    clearTimeout(pending);
    pending = setTimeout(() => {
      teardown();
      build();
      // The rebuild changes nothing's height, but the ScrollTriggers created
      // inside it are new and have never been measured.
      ScrollTrigger.refresh();
    }, REBUILD_DEBOUNCE);
  });
  ro.observe(host);

  return {
    destroy: () => {
      ro.disconnect();
      clearTimeout(pending);
      teardown();
    },
  };
}
