// Drives a <video> from a scroll position: you feed it a 0..1 progress and it
// chases that point with a damped loop, asking the decoder for as few seeks as
// it can get away with.
//
// This is the loop that `components/sections/home-v2/HeroVideo.tsx` grew inline
// for the homepage rebuild, lifted out so a second scroll-scrubbed video does
// not become a second copy of it. HeroVideo still has its own inline version;
// migrating it here is a follow-up, deliberately not bundled with the page that
// prompted the extraction.
//
// Not a hook: the section that uses it creates and destroys it from its own
// `gsap.matchMedia()`, so there is one lifecycle to reason about instead of two
// that can fall out of sync on a live `prefers-reduced-motion` change.

export type VideoScrubOptions = {
  /**
   * Frame rate of the asset. There is NO way to read this from the browser —
   * no <video> API exposes it — so it has to be measured off the file and
   * updated by hand if the file is re-encoded.
   *
   * It is what keeps us from asking for a frame that is already on screen: at
   * 24 fps `currentTime = 1.0341` and `1.0352` decode to the same image, but
   * each assignment still kicks off a full seek + decode. Rounding to the
   * frame boundary takes seeks from ~60/s down to at most `fps`/s.
   */
  fps: number;
  /**
   * Chase factor. Higher = the video tracks scroll more closely but steps more
   * harshly between frames; lower = smoother and laggier. This damping is
   * exactly what hides the frame quantisation, so raising it brings it back.
   */
  chase?: number;
  /** Slower chase near the end, so the last stretch docks instead of stopping dead. */
  chaseDocking?: number;
};

export type VideoScrubHandle = {
  /** Feed a 0..1 scroll progress. Safe to call before metadata has loaded. */
  setProgress: (p: number) => void;
  destroy: () => void;
};

export function createVideoScrub(
  video: HTMLVideoElement,
  { fps, chase = 0.14, chaseDocking = 0.09 }: VideoScrubOptions
): VideoScrubHandle {
  const FRAME = 1 / fps;

  let duration = 0;
  let progress = 0;
  let target = 0;
  let current = 0;
  let raf = 0;
  // Last frame actually REQUESTED. Comparing against this — and not against
  // `video.currentTime` — is what stops us re-requesting the frame already on
  // screen: `currentTime` reports where the decoder landed, which is almost
  // never the time we asked for.
  let shownFrame = -1;

  /** How far the downloaded range containing `t` reaches. */
  const bufferedUntil = (t: number) => {
    for (let i = 0; i < video.buffered.length; i++) {
      if (t >= video.buffered.start(i) && t <= video.buffered.end(i)) {
        return video.buffered.end(i);
      }
    }
    return t; // outside every range: better not to run ahead
  };

  const tick = () => {
    raf = 0;
    if (!duration) return;

    const nearEnd = target > duration - 0.8 && target > current;
    current += (target - current) * (nearEnd ? chaseDocking : chase);

    // Never ask past what has downloaded. This is the difference between
    // holding on the last available frame and blocking the decoder waiting for
    // bytes that have not arrived — which is exactly what the stutter in the
    // first few seconds looks like.
    const reachable = Math.min(current, bufferedUntil(current));
    const frame = Math.round(reachable / FRAME);

    // Backpressure: while a seek is in flight we do not queue another. Without
    // this, a burst of scrolling piles up a queue the decoder serves late, and
    // late is indistinguishable from janky. `video.seeking` is standard and
    // needs no listeners.
    if (frame !== shownFrame && !video.seeking) {
      shownFrame = frame;
      video.currentTime = frame * FRAME;
    }

    // The loop stays alive while anything is outstanding, even if this tick
    // requested no new frame. The three cases:
    //   · there is still distance left to travel;
    //   · a frame was computed but an in-flight seek blocked the request;
    //   · the buffer clamped the target, and we should retry once more bytes
    //     land.
    const pending =
      Math.abs(target - current) > FRAME * 0.5 ||
      frame !== shownFrame ||
      reachable < current - FRAME;
    if (pending) raf = requestAnimationFrame(tick);
  };

  const onMeta = () => {
    duration = video.duration || 0;
    // Decode a first frame, otherwise the slot starts blank.
    shownFrame = 0;
    target = Math.min(duration - 0.05, Math.max(0.001, progress * duration));
    video.currentTime = target;
  };
  if (video.readyState >= 1) onMeta();
  else video.addEventListener("loadedmetadata", onMeta, { once: true });

  // Anything that starts it (an extension, the browser restoring state) gets
  // paused again: here the video is a scroll-driven texture, not a clip.
  const freeze = () => video.pause();
  video.addEventListener("play", freeze);

  return {
    setProgress: (p) => {
      progress = p;
      if (!duration) return; // remembered until metadata arrives
      target = Math.min(duration - 0.05, Math.max(0.001, p * duration));
      if (!raf) raf = requestAnimationFrame(tick);
    },
    destroy: () => {
      if (raf) cancelAnimationFrame(raf);
      video.removeEventListener("play", freeze);
      video.removeEventListener("loadedmetadata", onMeta);
    },
  };
}
