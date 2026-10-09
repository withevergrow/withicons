// Hand-drawn front-facing festive dragon head for the rich styles (clay bento suite dock liquid chrome soft3d brutal).
// One shared drawing (tall branching gold antlers, a red head narrowing into a long snout with a big nose and two
// nostrils, angry gold brows over bright eyes, cream mane tufts, an orange pearl on the forehead, a cream lip band over
// an open mouth with fangs, a cream beard fringe, long gold whiskers sweeping out and curling) and one material
// treatment per style. Roles: face c1, antlers/whiskers/brows c2, cream c4, pearl accent, ink, light shine/shadow.
// Motion: head wm-k, antlers/whiskers/brows/tufts wm-a, teeth/pearl wm-s. Deterministic, no randomness.
const N = 'dragon-head'
const f = n => +n.toFixed(2)
const circ = (x, y, r) => `M${f(x - r)} ${f(y)}a${f(r)} ${f(r)} 0 1 0 ${f(2 * r)} 0a${f(r)} ${f(r)} 0 1 0 ${f(-2 * r)} 0Z`
const ell = (x, y, rx, ry) => `M${f(x - rx)} ${f(y)}a${f(rx)} ${f(ry)} 0 1 0 ${f(2 * rx)} 0a${f(rx)} ${f(ry)} 0 1 0 ${f(-2 * rx)} 0Z`
// mirror an absolute path (pairs "x y" only) across x = 12, and shift one
const mir = d => d.replace(/(-?\d*\.?\d+) (-?\d*\.?\d+)/g, (_, x, y) => `${f(24 - x)} ${y}`)
const both = d => d + ' ' + mir(d)
const sh = (d, dx, dy) => d.replace(/(-?\d*\.?\d+) (-?\d*\.?\d+)/g, (_, x, y) => `${f(+x + dx)} ${f(+y + dy)}`)

// geometry (24 grid)
const ANTLER = both('M9.3 7.4 C8.9 5.5 7.9 3.7 6.5 2 M8.35 4.8 C8.95 4 9.55 3.2 10.1 2.3 M7.45 3.35 C6.45 3.45 5.4 3.25 4.4 2.65')
const TUFT = both('M7.4 8.3 C5.8 7.5 4.4 7.9 3.3 7.1 C3.4 8.3 4 8.9 3.1 9.6 C4.2 10.2 5 10 5.4 10.8 C4.7 11.5 3.9 11.6 3.3 12.3 C4.7 12.9 6.2 12.6 6.8 12.9 Z')
const BEARD = 'M7.7 18.4 L7.3 21.1 L8.8 20.4 L9.4 22.4 L10.6 21.2 L12 22.9 L13.4 21.2 L14.6 22.4 L15.2 20.4 L16.7 21.1 L16.3 18.4 Z'
const HEAD = 'M12 6.4 C15.9 6.4 18.3 8.7 18.1 11.6 C18 13.1 16.9 14 15.9 14.6 C16.9 15.3 17.2 16.5 16.8 17.5 C16.3 18.7 14.4 19.3 12 19.3 C9.6 19.3 7.7 18.7 7.2 17.5 C6.8 16.5 7.1 15.3 8.1 14.6 C7.1 14 6 13.1 5.9 11.6 C5.7 8.7 8.1 6.4 12 6.4 Z'
const NOSE = 'M8.4 15 C9.4 14.1 14.6 14.1 15.6 15 C16.4 15.7 16.3 16.8 15.4 17.2 C13.6 17.8 10.4 17.8 8.6 17.2 C7.7 16.8 7.6 15.7 8.4 15 Z'
const NOSTRIL = ell(10.55, 16.1, 0.62, 0.42) + ell(13.45, 16.1, 0.62, 0.42)
const LIP = 'M7.7 17.3 C10 18.2 14 18.2 16.3 17.3 C16.7 17.9 16.4 18.7 15.7 19 C13.8 19.6 10.2 19.6 8.3 19 C7.6 18.7 7.3 17.9 7.7 17.3 Z'
const MOUTH = 'M8.9 18.95 C10.6 19.4 13.4 19.4 15.1 18.95 C14.8 20.8 13.6 21.5 12 21.5 C10.4 21.5 9.2 20.8 8.9 18.95 Z'
const TEETH = 'M9.55 19.15 L10.15 20.35 L10.75 19.3 Z M13.25 19.3 L13.85 20.35 L14.45 19.15 Z M11.05 19.35 C11.3 19.9 11.75 19.9 12 19.4 C12.25 19.9 12.7 19.9 12.95 19.35 Z'
const EYE = both('M8.3 10.9 L11.1 11.7 C10.95 12.55 10.25 12.9 9.6 12.8 C8.85 12.7 8.3 12 8.3 10.9 Z')
const PUPIL = circ(9.95, 12.0, 0.5) + circ(14.05, 12.0, 0.5)
const GLINT = circ(9.8, 11.82, 0.17) + circ(13.9, 11.82, 0.17)
const BROW = both('M7.5 9.3 L10.9 10.6')
const WHISK = both('M8.1 15.7 C6.3 15.4 4.7 16.1 3.2 15.7 C2.1 15.4 1.9 14.2 2.8 14 C3.4 13.9 3.7 14.5 3.3 14.8')
const PEARL = [12, 8.55, 0.95]
const SIL = [HEAD, TUFT, BEARD] // filled silhouette parts (for shadows)

const DEF = { c1: '#E23B3B', c2: '#F5B731', c4: '#FFF1D6', accent: '#FF8A1F', ink: '#2A1414', shine: '#FFFFFF', shadow: '#6A0F18', tint: '#FFE3B0' }
const DOCK_TILE = (dy = 0) => `M14.64 ${f(2 + dy)}c2.58 0 3.86 0 4.85.5a4.6 4.6 0 0 1 2.01 2.01c.5.98.5 2.27.5 4.85L22 ${f(14.64 + dy)}c0 2.58 0 3.86-.5 4.85a4.6 4.6 0 0 1 -2.01 2.01c-.98.5-2.27.5-4.85.5L9.36 ${f(22 + dy)}c-2.58 0-3.86 0-4.85-.5a4.6 4.6 0 0 1 -2.01-2.01c-.5-.98-.5-2.27-.5-4.85L2 ${f(9.36 + dy)}c0-2.58 0-3.86.5-4.85a4.6 4.6 0 0 1 2.01-2.01c.98-.5 2.27-.5 4.85-.5Z`
const BENTO_TILE = 'M9.4 2H14.6C20.08 2 22 3.92 22 9.4V14.6C22 20.08 20.08 22 14.6 22H9.4C3.92 22 2 20.08 2 14.6V9.4C2 3.92 3.92 2 9.4 2Z'

export function dragon(style) {
  const v = r => r === 'ink' && style === 'brutal' ? 'var(--with-brutal-ink, currentColor)' : `var(--with-${style}-${r}, ${DEF[r]})`
  const C = Object.fromEntries(Object.keys(DEF).map(k => [k, v(k)]))
  const id = n => `wg-${style}-${N}-${n}`, url = n => `url(#${id(n)})`
  const stop = (o, c, a = 1) => ['stop', { offset: o, 'stop-color': c, 'stop-opacity': a }]
  const lin = (n, x1, y1, x2, y2, s) => ['linearGradient', { id: id(n), x1, y1, x2, y2, gradientUnits: 'userSpaceOnUse' }, s]
  const rad = (n, cx, cy, r, s) => ['radialGradient', { id: id(n), cx, cy, r, gradientUnits: 'userSpaceOnUse' }, s]
  const P = (d, a, cls) => ['path', { d, ...a, class: cls }]

  // per-style material: light overlays (gradients 0 face, 1 gold, 2 cream), outline, backdrop
  const brutal = style === 'brutal', bento = style === 'bento', dock = style === 'dock'
  const glass = style === 'liquid'
  let defs = []
  const lightFace = {
    soft3d: rad(0, 9.2, 8.6, 11, [stop(0, C.shine, 0.55), stop(0.3, C.shine, 0.08), stop(0.75, C.shadow, 0.18), stop(1, C.shadow, 0.45)]),
    clay: rad(0, 9.5, 9, 12, [stop(0, C.shine, 0.32), stop(0.45, C.shine, 0), stop(1, C.shadow, 0.3)]),
    suite: lin(0, 6, 6, 18, 19, [stop(0, C.shine, 0.28), stop(0.5, C.shine, 0.05), stop(0.5, C.shadow, 0.08), stop(1, C.shadow, 0.3)]),
    chrome: lin(0, 0, 6.4, 0, 19.4, [stop(0, C.shine, 0.75), stop(0.38, C.shine, 0.1), stop(0.46, C.shadow, 0.55), stop(0.56, C.shine, 0.25), stop(1, C.shadow, 0.45)]),
    liquid: lin(0, 6, 6, 18, 20, [stop(0, C.shine, 0.45), stop(0.5, C.shine, 0), stop(1, C.shadow, 0.35)]),
    dock: lin(0, 0, 6.4, 0, 19.4, [stop(0, C.shine, 0.3), stop(0.5, C.shine, 0), stop(1, C.shadow, 0.3)]),
    bento: lin(0, 0, 6.4, 0, 19.4, [stop(0, C.shine, 0.18), stop(1, C.shadow, 0.12)]),
  }[style]
  if (lightFace) {
    defs.push(lightFace)
    defs.push(style === 'chrome'
      ? lin(1, 0, 2, 0, 16, [stop(0, C.shine, 0.85), stop(0.4, C.shine, 0.1), stop(0.5, C.shadow, 0.45), stop(1, C.shine, 0.3)])
      : lin(1, 4, 2, 20, 16, [stop(0, C.shine, 0.5), stop(0.5, C.shine, 0), stop(1, C.shadow, 0.3)]))
    defs.push(lin(2, 0, 7, 0, 23, [stop(0, C.shine, 0.4), stop(1, C.tint, 0.55)]))
  }
  if (dock) defs.push(lin(3, 12, 2, 12, 22, [stop(0, C.shadow), stop(1, C.ink)]))
  if (style === 'soft3d' || style === 'clay') defs.push(rad(4, 12, 22.3, 7, [stop(0, C.shadow, 0.32), stop(0.6, C.shadow, 0.12), stop(1, C.shadow, 0)]))

  const n = defs.length ? [['defs', {}, defs]] : []
  const lw = brutal ? 0.75 : bento ? 0.5 : 0
  const lc = brutal ? C.ink : C.shadow
  const op = glass ? { 'fill-opacity': 0.62 } : {}
  const fill = (d, col, ov, cls) => {
    n.push(P(d, { fill: col, ...op, ...(lw ? { stroke: lc, 'stroke-width': lw, 'stroke-linejoin': 'round', ...(bento ? { 'stroke-opacity': 0.55 } : {}) } : {}) }, cls))
    if (lightFace && ov != null) n.push(P(d, { fill: url(ov) }, cls))
  }
  const line = (d, col, w, ov, cls) => {
    const cap = { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', fill: 'none' }
    if (lw) n.push(P(d, { stroke: lc, 'stroke-width': w + 2 * lw, ...cap, ...(bento ? { 'stroke-opacity': 0.55 } : {}) }, cls))
    n.push(P(d, { stroke: col, 'stroke-width': w, ...cap }, cls))
    if (lightFace && ov != null) n.push(P(d, { stroke: url(ov), 'stroke-width': w, ...cap }, cls))
  }

  // backdrop
  if (bento) n.push(P(BENTO_TILE, { fill: C.tint, 'fill-opacity': 0.6 }, 'wm-deco'))
  if (dock) { n.push(P(DOCK_TILE(0.5), { fill: C.shadow, 'fill-opacity': 0.3 }, 'wm-shadow')); n.push(P(DOCK_TILE(), { fill: url(3) }, 'wm-deco')) }
  if (style === 'soft3d' || style === 'clay') n.push(P(ell(12, 22.4, 6.5, 1.1), { fill: url(4) }, 'wm-shadow'))
  // the hard ink shadow (brutal)
  const sw = brutal ? 0.9 : 0
  if (brutal) {
    n.push(P(sh(ANTLER + ' ' + WHISK, sw, sw), { stroke: C.ink, 'stroke-width': 1.2 + lw, 'stroke-linecap': 'round', fill: 'none' }, 'wm-shadow'))
    n.push(P(SIL.map(d => sh(d, sw, sw)).join(' '), { fill: C.ink }, 'wm-shadow'))
  }
  // behind the head: antlers, mane tufts, beard fringe
  line(ANTLER, C.c2, brutal ? 1.2 : 1.25, 1, 'wm-a')
  fill(TUFT, C.c4, 2, 'wm-a')
  fill(BEARD, C.c4, 2, 'wm-k')
  // head + snout
  fill(HEAD, C.c1, 0, 'wm-k')
  // nose bulb: a raised lighter form with two dark nostrils
  n.push(P(NOSE, { fill: C.shine, 'fill-opacity': brutal || bento ? 0 : 0.16 }, 'wm-k'))
  if (brutal || bento) n.push(P(NOSE, { fill: 'none', stroke: lc, 'stroke-width': lw * 0.8, ...(bento ? { 'stroke-opacity': 0.55 } : {}) }, 'wm-k'))
  else n.push(P('M9.2 15.9 C9.4 15.2 10.2 14.85 11 14.9', { stroke: C.shine, 'stroke-opacity': 0.55, 'stroke-width': 0.3, 'stroke-linecap': 'round', fill: 'none' }, 'wm-shine'))
  n.push(P(NOSTRIL, { fill: C.ink }, 'wm-k'))
  // open mouth with fangs, under a cream lip band
  n.push(P(MOUTH, { fill: C.ink }, 'wm-k'))
  n.push(P(TEETH, { fill: C.shine }, 'wm-s'))
  fill(LIP, C.c4, 2, 'wm-k')
  // eyes and angry gold brows
  n.push(P(EYE, { fill: C.shine, ...(lw ? { stroke: lc, 'stroke-width': lw * 0.7 } : {}) }, 'wm-k'))
  n.push(P(PUPIL, { fill: C.ink }, 'wm-k'))
  n.push(P(GLINT, { fill: C.shine }, 'wm-shine'))
  line(BROW, C.c2, 1.05, 1, 'wm-a')
  // pearl on the forehead
  fill(circ(...PEARL), C.accent, 1, 'wm-s')
  if (!brutal && !bento) n.push(P(circ(PEARL[0] - 0.3, PEARL[1] - 0.3, 0.26), { fill: C.shine, 'fill-opacity': 0.85 }, 'wm-shine'))
  // long gold whiskers
  line(WHISK, C.c2, brutal ? 0.85 : 0.75, 1, 'wm-a')
  // style finishing light
  if (glass) n.push(P(HEAD, { fill: 'none', stroke: C.shine, 'stroke-opacity': 0.75, 'stroke-width': 0.35 }, 'wm-shine'))
  if (['soft3d', 'chrome', 'liquid', 'suite', 'dock'].includes(style)) {
    n.push(P('M7.6 10.3 C7.7 8.6 9 7.3 10.8 7', { stroke: C.shine, 'stroke-opacity': style === 'suite' ? 0.35 : 0.7, 'stroke-width': 0.45, 'stroke-linecap': 'round', fill: 'none' }, 'wm-shine'))
  }
  if (style === 'clay') n.push(P(ell(8.6, 9.6, 1.1, 0.6), { fill: C.shine, 'fill-opacity': 0.3 }, 'wm-shine'))
  if (brutal) {
    // shift the whole front drawing so drawing + shadow stay centred
    for (const node of n) if (node[1].class !== 'wm-shadow' && node[1].d) node[1].d = node[1].d.includes('a') ? node[1].d.replace(/^M(-?[\d.]+) (-?[\d.]+)/, (_, x, y) => `M${f(x - 0.5)} ${f(y - 0.5)}`).replace(/Z\s*M(-?[\d.]+) (-?[\d.]+)/g, (_, x, y) => `ZM${f(x - 0.5)} ${f(y - 0.5)}`) : sh(node[1].d, -0.5, -0.5)
    for (const node of n) if (node[1].class === 'wm-shadow') node[1].d = sh(node[1].d, -0.5, -0.5)
  }
  return n
}
