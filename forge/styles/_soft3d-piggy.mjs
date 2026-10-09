// SOFT 3D piggy bank, hand-drawn: a chubby glossy studio-lit piggy bank in 3/4 view facing right. Two ears (the near one perky,
// the far one peeking behind), a separate deeper-pink oval snout with two dark nostrils, a glossy eye, a rosy cheek,
// a curly tail, four stubby legs, a coin slot on the back and a gold coin dropping in. Glossy studio light from the upper left (crisp speculars),
// a side wall and a soft ground shadow.
// Roles: body c1, snout + inner ears c2, coin c3 (gold) with an accent rim, eye/nostrils/slot ink, shine/shadow/tint.
// Default colours tuned for soft3d.
// Motion: body wm-k, snout/ears/eye wm-a, coin wm-s (dropped by the S part), ground wm-shadow.
const N = 'piggy-bank'
const v = (r, h) => `var(--with-soft3d-${r}, ${h})`
const C = {
  c1: v('c1', '#F7A8C0'), c2: v('c2', '#E8608A'), c3: v('c3', '#F5B82E'), accent: v('accent', '#E89A1C'),
  ink: v('ink', '#4A1A2A'), shine: v('shine', '#FFFFFF'), shadow: v('shadow', '#7F3550'), tint: v('tint', '#F2B6C8'),
}
const f = n => +n.toFixed(2)
const ell = (x, y, rx, ry) => `M${f(x - rx)} ${f(y)}a${f(rx)} ${f(ry)} 0 1 0 ${f(2 * rx)} 0a${f(rx)} ${f(ry)} 0 1 0 ${f(-2 * rx)} 0Z`
const circ = (x, y, r) => ell(x, y, r, r)
const id = n => `wg-soft3d-${N}-${n}`, url = n => `url(#${id(n)})`
const stop = (o, c, a = 1) => ['stop', { offset: o, 'stop-color': c, 'stop-opacity': a }]
const rad = (n, cx, cy, r, s) => ['radialGradient', { id: id(n), cx, cy, r, gradientUnits: 'userSpaceOnUse' }, s]
const P = (d, a, cls) => ['path', { d, ...a, class: cls }]
const gloss = (n, x, y, r) => rad(n, x - r * 0.45, y - r * 0.55, r * 1.9, [
  stop(0, C.shine, 0.95), stop(0.25, C.shine, 0.15), stop(0.6, C.tint, 0.08), stop(0.85, C.shadow, 0.25), stop(1, C.shadow, 0.45)])

// geometry (24 grid)
const BODY = 'M3.6 13.6C3.6 9.9 7 8 11.2 8C15.1 8 17.6 9.6 18.6 11.8C19.2 13.2 19.1 15.4 18.2 16.8C16.8 18.9 14.2 19.6 11 19.6C6.7 19.6 3.6 17.5 3.6 13.6Z'
const EAR_FAR = 'M12.6 9.2C12.4 7.6 12.9 6.3 13.6 5.9C14.5 6.4 15.2 7.7 15.1 9.1Z'
const EAR = 'M14.3 9.6C14.4 7.8 15.3 6.3 16.3 5.8C17.2 6.6 17.6 8.4 17.2 10.3Z'
const EAR_IN = 'M15.1 9.6C15.2 8.4 15.7 7.4 16.3 7C16.8 7.6 17 8.7 16.7 9.9Z'
const LEGS_FAR = 'M6 16.6h1.9v2.9a.95 .95 0 0 1-1.9 0Z M13.2 17h1.9v2.6a.95 .95 0 0 1-1.9 0Z'
const LEGS = 'M7.6 17.4h2.2v3a1.1 1.1 0 0 1-2.2 0Z M15 17.1h2.2v3a1.1 1.1 0 0 1-2.2 0Z'
const TAIL = 'M3.8 13.4C2.6 13.6 1.9 12.6 2.5 11.8C3.1 11.1 4 11.6 3.6 12.3C3.3 12.8 2.6 12.5 2.6 11.9C2.6 11.1 3.2 10.6 3.8 10.6'
const SNOUT = [19.1, 13.4, 1.55, 1.95]
const COIN = [9.6, 5.2, 1.75, 2.05]

export function piggy() {
  const defs = ['defs', {}, [
    gloss(0, 11.2, 13.4, 7.6), gloss(1, 19.1, 13.4, 2.1), gloss(2, 16, 8, 2.4), gloss(3, 9.6, 5.2, 2.2),
    rad(4, 11.4, 20.9, 8.4, [stop(0, C.shadow, 0.3), stop(0.7, C.shadow, 0.08), stop(1, C.shadow, 0)]),
  ]]
  const n = [defs]
  n.push(P(ell(11.4, 20.9, 8.3, 1.25), { fill: url(4) }, 'wm-shadow'))
  // far ear and far legs (behind, in shade)
  n.push(P(EAR_FAR, { fill: C.c1 }, 'wm-a'), P(EAR_FAR, { fill: C.shadow, 'fill-opacity': 0.28 }, 'wm-a'))
  n.push(P(LEGS_FAR, { fill: C.c1 }, 'wm-k'), P(LEGS_FAR, { fill: C.shadow, 'fill-opacity': 0.3 }, 'wm-k'))
  // curly tail
  n.push(P(TAIL, { stroke: C.c2, 'stroke-width': 0.95, 'stroke-linecap': 'round', fill: 'none' }, 'wm-k'))
  // near legs
  n.push(P(LEGS, { fill: C.c1 }, 'wm-k'), P(LEGS, { fill: url(0) }, 'wm-k'))
  n.push(P('M7.6 20.1h2.2M15 19.8h2.2', { stroke: C.shadow, 'stroke-opacity': 0.25, 'stroke-width': 0.5, fill: 'none' }, 'wm-k'))
  // body: side wall then the lit face
    n.push(P(BODY, { fill: C.c1 }, 'wm-k'), P(BODY, { fill: url(0) }, 'wm-k'))
  // coin slot on the back
  n.push(P('M8.1 9.3Q9.6 8.6 11.2 8.7', { stroke: C.ink, 'stroke-width': 0.75, 'stroke-linecap': 'round', fill: 'none' }, 'wm-k'))
  // near ear
  n.push(P(EAR, { fill: C.c1 }, 'wm-a'), P(EAR, { fill: url(2) }, 'wm-a'), P(EAR_IN, { fill: C.c2 }, 'wm-a'))
  // rosy cheek
  n.push(P(ell(15.6, 14.6, 1.05, 0.65), { fill: C.c2, 'fill-opacity': 0.45 }, 'wm-k'))
  // snout: deeper pink oval with a wall, two dark nostrils
  const [sx, sy, rx, ry] = SNOUT
  n.push(P(ell(sx - 0.35, sy + 0.15, rx, ry), { fill: C.c2 }, 'wm-a'))
  n.push(P(ell(sx - 0.35, sy + 0.15, rx, ry), { fill: C.shadow, 'fill-opacity': 0.3 }, 'wm-a'))
  n.push(P(ell(sx, sy, rx, ry), { fill: C.c2 }, 'wm-a'), P(ell(sx, sy, rx, ry), { fill: url(1) }, 'wm-a'))
  n.push(P(ell(18.55, 13.5, 0.36, 0.62) + ell(19.65, 13.5, 0.36, 0.62), { fill: C.ink }, 'wm-a'))
  // eye
  n.push(P(ell(15.5, 11.6, 0.68, 0.82), { fill: C.ink }, 'wm-a'))
  n.push(P(circ(15.3, 11.3, 0.25), { fill: C.shine }, 'wm-shine'))
  // crisp studio speculars + a rim light on the shaded belly
  n.push(P(ell(7.4, 10.5, 1.7, 0.6), { fill: C.shine, 'fill-opacity': 0.85, transform: 'rotate(-20 7.4 10.5)' }, 'wm-shine'))
  n.push(P(circ(9.6, 9.95, 0.3), { fill: C.shine, 'fill-opacity': 0.9 }, 'wm-shine'))
  n.push(P(ell(18.5, 12.2, 0.45, 0.3), { fill: C.shine, 'fill-opacity': 0.7 }, 'wm-shine'))
  n.push(P('M5.2 16.6C6.6 18.3 9.4 19 12 18.9', { stroke: C.shine, 'stroke-opacity': 0.45, 'stroke-width': 0.4, 'stroke-linecap': 'round', fill: 'none' }, 'wm-shine'))
  // gold coin dropping in
  const [cx, cy, crx, cry] = COIN
  n.push(P(ell(cx + 0.3, cy, crx, cry), { fill: C.accent }, 'wm-s'))
  n.push(P(ell(cx, cy, crx, cry), { fill: C.c3 }, 'wm-s'), P(ell(cx, cy, crx, cry), { fill: url(3) }, 'wm-s'))
  n.push(P(ell(cx, cy, crx * 0.6, cry * 0.62), { fill: 'none', stroke: C.accent, 'stroke-width': 0.4 }, 'wm-s'))
  n.push(P(ell(cx - 0.6, cy - 0.8, 0.35, 0.55), { fill: C.shine, 'fill-opacity': 0.6 }, 'wm-s'))
  return n
}
