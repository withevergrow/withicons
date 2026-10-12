// A tiny stroke font for the labels on preview_icons sheets (icon names, style names, a few symbols).
// Why not <text>: the sheet is rendered to PNG by resvg, which has no fonts here (and system fonts would make the picture depend
// on the machine), and the hosted SVG must look the same everywhere. The labels are plain paths: deterministic, no font files,
// no external references. Lowercase a-z, digits and - . , : # / ( ) + _ are drawn; any other character is skipped.
//
// Glyph space (y down): ascender top 0, x-height top 2, baseline 7, descender bottom ~9.8; x from 0 to the glyph's width w.
// Paths use only absolute M L Q Z, so one pass can scale and move them.
const G = {
  a: [4, 'M2 2 Q0 2 0 4.5 Q0 7 2 7 Q4 7 4 4.5 Q4 2 2 2 Z M4 2 L4 7'],
  b: [4, 'M2 2 Q0 2 0 4.5 Q0 7 2 7 Q4 7 4 4.5 Q4 2 2 2 Z M0 0 L0 7'],
  c: [4, 'M4 3.2 Q3.2 2 2 2 Q0 2 0 4.5 Q0 7 2 7 Q3.2 7 4 5.8'],
  d: [4, 'M2 2 Q0 2 0 4.5 Q0 7 2 7 Q4 7 4 4.5 Q4 2 2 2 Z M4 0 L4 7'],
  e: [4, 'M0 4.6 L4 4.6 Q4 2 2 2 Q0 2 0 4.5 Q0 7 2 7 Q3.2 7 4 5.8'],
  f: [3.2, 'M3.2 0.5 Q2.8 0 2.2 0 Q1.2 0 1.2 1.3 L1.2 7 M0 2.3 L3.2 2.3'],
  g: [4, 'M2 2 Q0 2 0 4.5 Q0 7 2 7 Q4 7 4 4.5 Q4 2 2 2 Z M4 2 L4 8.2 Q4 9.8 2 9.8 Q1 9.8 0.3 9.2'],
  h: [4, 'M0 0 L0 7 M0 4.2 Q0 2 2 2 Q4 2 4 4.2 L4 7'],
  i: [0, 'M0 2 L0 7 M0 0 L0 0.1'],
  j: [1.2, 'M1.2 2 L1.2 8.6 Q1.2 9.8 0 9.8 M1.2 0 L1.2 0.1'],
  k: [4, 'M0 0 L0 7 M3.6 2 L0 5 M1.3 4 L4 7'],
  l: [0, 'M0 0 L0 7'],
  m: [7, 'M0 2 L0 7 M0 4.2 Q0 2 1.8 2 Q3.5 2 3.5 4.2 L3.5 7 M3.5 4.2 Q3.5 2 5.3 2 Q7 2 7 4.2 L7 7'],
  n: [4, 'M0 2 L0 7 M0 4.2 Q0 2 2 2 Q4 2 4 4.2 L4 7'],
  o: [4, 'M2 2 Q0 2 0 4.5 Q0 7 2 7 Q4 7 4 4.5 Q4 2 2 2 Z'],
  p: [4, 'M2 2 Q0 2 0 4.5 Q0 7 2 7 Q4 7 4 4.5 Q4 2 2 2 Z M0 2 L0 9.8'],
  q: [4, 'M2 2 Q0 2 0 4.5 Q0 7 2 7 Q4 7 4 4.5 Q4 2 2 2 Z M4 2 L4 9.8'],
  r: [3.3, 'M0 2 L0 7 M0 4.2 Q0 2 2 2 Q2.8 2 3.3 2.4'],
  s: [3.9, 'M3.7 3 Q3.2 2 2 2 Q0.4 2 0.4 3.4 Q0.4 4.5 2 4.7 Q3.7 5 3.7 5.9 Q3.7 7 2 7 Q0.7 7 0.2 6'],
  t: [3.4, 'M1.3 0.5 L1.3 5.8 Q1.3 7 2.4 7 Q3 7 3.4 6.8 M0 2.3 L3.2 2.3'],
  u: [4, 'M0 2 L0 5 Q0 7 2 7 Q4 7 4 5 M4 2 L4 7'],
  v: [4, 'M0 2 L2 7 L4 2'],
  w: [7, 'M0 2 L1.7 7 L3.5 2.8 L5.3 7 L7 2'],
  x: [4, 'M0.2 2 L3.8 7 M3.8 2 L0.2 7'],
  y: [4, 'M0 2 L2 6.8 M4 2 L1.7 9 Q1.3 9.9 0.2 9.8'],
  z: [4, 'M0.3 2 L3.7 2 L0.3 7 L3.7 7'],
  0: [4, 'M2 0 Q0 0 0 3.5 Q0 7 2 7 Q4 7 4 3.5 Q4 0 2 0 Z'],
  1: [1.8, 'M0.4 1.8 L1.8 0 L1.8 7'],
  2: [4, 'M0.3 1.7 Q0.6 0 2 0 Q3.8 0 3.8 1.9 Q3.8 3.1 2.2 4.5 L0 7 L4 7'],
  3: [4, 'M0.3 0.9 Q0.8 0 2 0 Q3.7 0 3.7 1.7 Q3.7 3.3 1.8 3.4 Q4 3.5 4 5.2 Q4 7 2 7 Q0.7 7 0.1 6.1'],
  4: [4.2, 'M3 7 L3 0 L0 5 L4.2 5'],
  5: [4, 'M3.6 0 L0.7 0 L0.4 3.2 Q1 2.7 2.1 2.7 Q4 2.7 4 4.9 Q4 7 2 7 Q0.7 7 0.2 6.1'],
  6: [4, 'M3.5 0.7 Q3 0 2.2 0 Q0 0 0 4.2 Q0 7 2 7 Q4 7 4 4.9 Q4 2.8 2.1 2.8 Q0.6 2.8 0.1 4'],
  7: [4, 'M0 0 L4 0 L1.6 7'],
  8: [4, 'M2 3.4 Q0.3 3.4 0.3 1.7 Q0.3 0 2 0 Q3.7 0 3.7 1.7 Q3.7 3.4 2 3.4 Q0 3.4 0 5.2 Q0 7 2 7 Q4 7 4 5.2 Q4 3.4 2 3.4'],
  9: [4, 'M0.5 6.3 Q1 7 1.9 7 Q4 7 4 2.8 Q4 0 2 0 Q0 0 0 2.1 Q0 4.2 1.9 4.2 Q3.4 4.2 3.9 3'],
  '-': [3.4, 'M0.2 4.8 L3.2 4.8'],
  '.': [0, 'M0 6.9 L0 7'],
  ',': [0.5, 'M0.5 6.6 L0.5 7 L0.1 8.4'],
  ':': [0, 'M0 3.9 L0 4 M0 6.9 L0 7'],
  '#': [4.4, 'M1.4 0.3 L0.8 6.7 M3.6 0.3 L3 6.7 M0 2.5 L4.4 2.5 M0 4.5 L4.2 4.5'],
  '/': [3, 'M3 0 L0 7'],
  '(': [2, 'M2 0 Q0.2 3.5 2 7'],
  ')': [2, 'M0 0 Q1.8 3.5 0 7'],
  '+': [4, 'M2 2.5 L2 6.5 M0 4.5 L4 4.5'],
  _: [4, 'M0 8.6 L4 8.6'],
}
const GAP = 2.2      // between letters, in glyph units
const SPACE = 2.6    // a space (plus the gap)
const BASELINE = 7
/** Ascender height in glyph units: a font size `px` means the ascender is px tall, so k = px / ASC. */
export const ASC = 7
/** Ascender-to-descender height in units. */
export const FULL = 9.8
const fmt = n => String(+n.toFixed(2))

const glyphs = s => [...String(s).toLowerCase()].map(ch => (ch === ' ' ? [SPACE, ''] : G[ch] || null)).filter(Boolean)

/** Width in px of `s` drawn with k px per glyph unit. */
export function textWidth(s, k) {
  const gs = glyphs(s)
  if (!gs.length) return 0
  return (gs.reduce((n, [w]) => n + w + GAP, 0) - GAP) * k
}

/** SVG path data for `s`, its left edge at x and its baseline at y, k px per glyph unit. Stroke it (round caps). */
export function textPath(s, x, y, k) {
  let out = '', ox = x
  for (const [w, d] of glyphs(s)) {
    if (d) {
      let isX = true
      for (const tok of d.match(/[MLQZ]|-?\d*\.?\d+/g)) {
        if (/[A-Z]/.test(tok)) { out += (out ? ' ' : '') + tok; isX = true; continue }
        const v = +tok
        out += ' ' + fmt(isX ? ox + v * k : y + (v - BASELINE) * k)
        isX = !isX
      }
    }
    ox += (w + GAP) * k
  }
  return out
}
