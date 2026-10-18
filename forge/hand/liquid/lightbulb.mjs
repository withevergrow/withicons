// forge/hand/liquid/lightbulb.mjs: a full-size clear-glass bulb, a stout coloured-glass screw base with two thread stripes,
// and a fine filament inside. The generated filament was a blunt 2.3u coloured block that read as a white lump in the glass,
// and the base was a plain stub. Here the bulb is exact clear glass (K), the base is a violet-glass cap (A, wm-a) with thread
// grooves, and the filament is drawn as hairline strokes (two posts and a zig-zag, wm-deco) over a faint warm glow (wm-shine
// glass keeps the specular rim). Same glass recipe as the generator (_liquid-core.mjs build).
import { parsePath } from '../../kernel/geom.mjs'
import { build, L } from '../../styles/_liquid-core.mjs'

const r2 = n => Math.round(n * 100) / 100
const tf = ([x, y]) => [r2((x - 12) * L.SCALE + 12 + L.TX), r2((y - 12) * L.SCALE + 12 + L.TY)]
// transform every coordinate pair of an absolute path (M/L/C/V/H only, as drawn here)
const tfd = d => { let cx = 0, cy = 0; return d.replace(/([MLCVHZ])([^MLCVHZ]*)/g, (_, c, a) => {
  const n = a.trim() ? a.trim().split(/[\s,]+/).map(Number) : []
  if (c === 'V') { cy = n[0]; return `L${tf([cx, cy]).join(' ')}` }
  if (c === 'H') { cx = n[0]; return `L${tf([cx, cy]).join(' ')}` }
  if (c === 'Z') return 'Z'
  let o = c
  for (let i = 0; i < n.length; i += 2) { o += (i ? ' ' : '') + tf([n[i], n[i + 1]]).join(' '); cx = n[i]; cy = n[i + 1] }
  return o
}) }
const pd = pts => pts.map((p, i) => `${i ? 'L' : 'M'}${tf(p).join(' ')}`).join('')

function skeleton(name, parts) {
  const lines = [], fills = []
  for (const p of parts) {
    const subs = parsePath(p.d)
    if (p.line) for (const s of subs) lines.push({ pts: s.pts, closed: s.closed, plate: p.plate })
    if (p.fill) fills.push({ subs })
  }
  return { name, paths: [], lines, fills, cutouts: [] }
}

const BULB = 'M12 2 C16.4 2 19.5 5.2 19.5 9.25 C19.5 12 18 13.6 16.75 15 C16 15.8 15.75 16.5 15.75 17 L8.25 17 C8.25 16.5 8 15.8 7.25 15 C6 13.6 4.5 12 4.5 9.25 C4.5 5.2 7.6 2 12 2 Z'
const BASE = 'M8.6 17.7 H15.4 V19.8 C15.4 20.8 14.6 21.5 13.6 21.5 H10.4 C9.4 21.5 8.6 20.8 8.6 19.8 Z'
const BASE_LINE = 'M10 19.7 H14'

export default function render(icon) {
  const name = (icon && icon.name) || 'lightbulb'
  const nodes = build(skeleton(name, [
    { d: BULB, plate: 'K', fill: true },
    { d: BASE, plate: 'A', fill: true },
    { d: BASE_LINE, plate: 'A', line: true },
  ])) || []
  const C3 = 'var(--with-liquid-c3, #1C3F9E)', ACC = 'var(--with-liquid-accent, #FF5F8F)', C4 = 'var(--with-liquid-c4, #FF7EC1)'
  const gid = `wg-liquid-${name}-9`
  const [gx, gy] = tf([12, 10.4])
  const glow = ['radialGradient', { id: gid, cx: gx, cy: gy, r: 5.2, gradientUnits: 'userSpaceOnUse' }, [
    ['stop', { offset: 0, 'stop-color': C4, 'stop-opacity': 0.28 }], ['stop', { offset: 1, 'stop-color': C4, 'stop-opacity': 0 }]]]
  const out = nodes.map(n => n[0] === 'defs' ? ['defs', {}, [...n[2], glow]] : n)
  out.push(['circle', { cx: gx, cy: gy, r: 5.2, fill: `url(#${gid})`, class: 'wm-a' }])
  // filament: two posts and a fine looped coil
  const FIL = 'M10.5 16.6 V12.9 C10.5 11.8 9.8 11.4 9.8 10.4 C9.8 8.9 11.2 8.6 12 10 C12.8 8.6 14.2 8.9 14.2 10.4 C14.2 11.4 13.5 11.8 13.5 12.9 V16.6'
  out.push(['path', { d: tfd(FIL), stroke: ACC, 'stroke-width': 0.6, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'wm-a' }])
  // screw threads on the cap
  out.push(['path', { d: pd([[9, 18.9], [15, 18.9]]) + pd([[9.3, 20.2], [14.7, 20.2]]), stroke: C3, 'stroke-opacity': 0.65, 'stroke-width': 0.45, 'stroke-linecap': 'round', class: 'wm-deco' }])
  return out
}
