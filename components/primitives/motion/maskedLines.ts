/**
 * Gives SplitText's line masks room for descenders.
 *
 * `SplitText.create(el, { mask: "lines" })` wraps every line in a box with
 * `overflow: hidden`, and that box is exactly the line's height. At the tight
 * line-heights the display tokens use (`--text-h1` is 1.05) the tail of a g, y,
 * q or p falls outside it and is sheared off — permanently, not just during the
 * animation.
 *
 * The fix is to grow the mask downward and pull the same amount back as negative
 * margin, so the clip box is taller while the layout is untouched. Padding alone
 * would push the next line down; margin alone would not enlarge the clip.
 *
 * Call it inside `onSplit`, before returning the tween.
 */
export function allowDescenders(lines: Element[], depth = "0.2em") {
  for (const line of lines) {
    const mask = line.parentElement;
    // Only the generated mask wrapper should be touched. When `mask` is not set
    // the line's parent is the original element, and padding it would move the
    // real layout.
    if (!mask || mask.dataset.descenderSafe === "1") continue;
    mask.dataset.descenderSafe = "1";
    mask.style.paddingBottom = depth;
    mask.style.marginBottom = `-${depth}`;
  }
}
