// forge/hand/soft3d/chef-hat.mjs — a crisp white chef's toque: three soft puffs (the top one behind) above a pleated
// crown, on a solid cool-grey band with a thin red piping, all with real depth to the lower right. The generated hat
// was a silver blob with a muddy grey band; here the crown is bright white shaped only by light and the puffs' creases,
// and the band is a distinct firm base, so the scalloped silhouette reads at 16px.
// Same studio recipe as the generated soft3d objects: contact shadow, walls in shade, face light, lit rim upper left.
// Roles (as the chef-hat palettes): crown c1, band c2, piping c3. Motion: crown wm-k (the toque rises), band wm-a.
const N = 'chef-hat'
const f = n => +(+n).toFixed(2)
const v = (r, h) => `var(--with-soft3d-${r}, ${h})`
const C = { c1: v('c1', '#F5F7FA'), c2: v('c2', '#B9C3D0'), c3: v('c3', '#E5483F'), shine: v('shine', '#FFFFFF'), shadow: v('shadow', '#1D2130') }
const id = n => `wg-soft3d-${N}-${n}`, url = n => `url(#${id(n)})`
const stop = (o, c, a) => ['stop', { offset: o, 'stop-color': c, 'stop-opacity': a }]
const P = (d, a, cls) => ['path', { d, ...a, class: cls }]
const ell = (x, y, rx, ry) => `M${f(x - rx)} ${f(y)}A${f(rx)} ${f(ry)} 0 1 0 ${f(x + rx)} ${f(y)}A${f(rx)} ${f(ry)} 0 1 0 ${f(x - rx)} ${f(y)}Z`
const mv = (d, dx, dy) => d.replace(/([MLCQA])([^MLCQAZ]*)/g, (m, c, s) => c + s.trim().split(/[\s,]+/).filter(Boolean).map(Number)
  .map((x, i) => c === 'A' ? (i % 7 === 5 ? x + dx : i % 7 === 6 ? x + dy : x) : x + (i % 2 ? dy : dx)).map(f).join(' '))
const wall = (d, dx, dy, n = 4) => Array.from({ length: n }, (_, i) => mv(d, dx * (i + 1) / n, dy * (i + 1) / n)).join('')

// crown: a pleated body under three puffs (all counter-clockwise so they union)
const NECK = 'M7 10.5L7 17L17 17L17 10.5Z'
const TOP = ell(12, 7.2, 4.3, 4.1)
const LEFT = ell(7.6, 10.6, 3.6, 3.5)
const RIGHT = ell(16.4, 10.6, 3.6, 3.5)
const CROWN = NECK + TOP + LEFT + RIGHT
const BAND = 'M6.4 17.7A1.4 1.4 0 0 1 7.8 16.3L16.2 16.3A1.4 1.4 0 0 1 17.6 17.7L17.6 19.2A1.4 1.4 0 0 1 16.2 20.6L7.8 20.6A1.4 1.4 0 0 1 6.4 19.2Z'

export default function render() {
  const n = [['defs', {}, [
    ['linearGradient', { id: id(0), x1: 0, y1: 0, x2: 1, y2: 1 }, [stop(0, C.shine, 0.34), stop(0.42, C.shine, 0), stop(0.62, C.shadow, 0), stop(1, C.shadow, 0.2)]],
    ['radialGradient', { id: id(1), cx: 0.36, cy: 0.3, r: 0.78 }, [stop(0, C.shine, 0.7), stop(0.5, C.shine, 0), stop(0.8, C.shadow, 0.05), stop(1, C.shadow, 0.22)]],
  ]]]
  // contact shadow
  n.push(P(ell(12.6, 21.2, 8.6, 1.4), { fill: C.shadow, 'fill-opacity': 0.06 }, 'wm-shadow'))
  n.push(P(ell(12.6, 21.2, 6.9, 1.1), { fill: C.shadow, 'fill-opacity': 0.08 }, 'wm-shadow'))
  n.push(P(ell(12.6, 21.2, 5, 0.8), { fill: C.shadow, 'fill-opacity': 0.11 }, 'wm-shadow'))
  // crown wall
  const W = wall(CROWN, 0.8, 0.65)
  n.push(P(W, { fill: C.c1 }, 'wm-k'), P(W, { fill: C.shadow, 'fill-opacity': 0.24 }, 'wm-k'))
  // pleated body, the back puff, then the two front puffs (each its own soft round light, so the creases show)
  n.push(P(NECK, { fill: C.c1 }, 'wm-k'), P(NECK, { fill: url(0) }, 'wm-k'))
  for (const d of [TOP, LEFT, RIGHT]) n.push(P(d, { fill: C.c1 }, 'wm-k'), P(d, { fill: url(1) }, 'wm-k'))
  // creases where the puffs meet, the pleats down the body
  n.push(P('M10 13.9C9.85 14.8 9.85 15.6 10 16.3M14 13.9C14.15 14.8 14.15 15.6 14 16.3', { fill: 'none', stroke: C.shadow, 'stroke-width': 0.9, 'stroke-opacity': 0.1, 'stroke-linecap': 'round' }, 'wm-k'))
  // speculars on the puffs
  n.push(P('M9.6 5.6C10.3 4.4 11.5 3.8 12.7 3.8M5 9.6C5.4 8.4 6.3 7.6 7.4 7.4', { fill: 'none', stroke: C.shine, 'stroke-width': 0.7, 'stroke-opacity': 0.9, 'stroke-linecap': 'round' }, 'wm-shine'))
  // the band: wall, face, piping, lit top edge
  const BW = wall(BAND, 0.8, 0.65)
  n.push(P(BW, { fill: C.c2 }, 'wm-a'), P(BW, { fill: C.shadow, 'fill-opacity': 0.32 }, 'wm-a'))
  n.push(P(BAND, { fill: C.c2 }, 'wm-a'), P(BAND, { fill: url(0) }, 'wm-a'))
  n.push(P('M6.4 18.45L17.6 18.45', { fill: 'none', stroke: C.c3, 'stroke-width': 0.85 }, 'wm-a'))
  n.push(P('M7.6 16.85L16.4 16.85', { fill: 'none', stroke: C.shine, 'stroke-width': 0.5, 'stroke-opacity': 0.6, 'stroke-linecap': 'round' }, 'wm-shine'))
  return n
}
