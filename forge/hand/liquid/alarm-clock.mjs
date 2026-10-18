// forge/hand/liquid/alarm-clock.mjs — a round dial of clear liquid glass, two wide flat bell domes angled outward on top
// (half-ellipses with the flat side tucked behind the dial, so they read as alarm bells and not as mouse ears), two
// chunky violet feet splayed below, and thick hands in deep navy glass so the face still reads as a clock at 16px.
// Two passes of the style pipeline (_liquid-core build: dial + bells + feet, then the hands), gradient ids renumbered.
// Motion: dial wm-k; bells and feet wm-a (parts.A rings a beat behind the dial); the hands ride with the dial (wm-k).
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { build } from '../../styles/_liquid-core.mjs'

const NAME = 'alarm-clock'
const r2 = v => Math.round(v * 100) / 100
const DX = 12, DY = 13.2 // dial centre

// a skeleton in the shape the liquid model expects: parts [{ d, plate, fill, line }]
function sk(parts) {
  const paths = parts.filter(p => p.line !== false).map((p, i) => ({ id: 'p' + i, d: p.d, plate: p.plate, subs: parsePath(p.d) }))
  const fills = parts.filter(p => p.fill).map(p => { const subs = parsePath(p.d); return { d: p.d, subs, set: setOf(subs.map(s => s.pts)) } })
  return { name: NAME, paths, fills, cutouts: [], lines: paths.flatMap(p => p.subs.map(x => ({ pts: x.pts, closed: x.closed, plate: p.plate, pathId: p.id }))) }
}
const circle = (cx, cy, r) => `M${r2(cx - r)} ${r2(cy)}A${r} ${r} 0 1 0 ${r2(cx + r)} ${r2(cy)}A${r} ${r} 0 1 0 ${r2(cx - r)} ${r2(cy)}Z`
// a tiny closed triangle inside a shape: votes the shape's plate (fills join the plate whose line runs nearest)
const _tri = (x, y, plate) => ({ d: `M${r2(x)} ${r2(y)}l.3 0l-.15 .3Z`, plate })

// a flattened dome (a superellipse half): flat base centred on c, rx along the base, ry out along (ux, uy)
function dome(cx, cy, ux, uy, rx, ry, n = 2.8) {
  const tx = -uy, ty = ux // along the base
  const pts = []
  for (let i = 0; i <= 18; i++) {
    const t = Math.PI * i / 18, c = Math.cos(t), s = Math.sin(t)
    const a = Math.sign(c) * Math.abs(c) ** (2 / n), b = Math.abs(s) ** (2 / n)
    pts.push(`${r2(cx + tx * rx * a + ux * ry * b)} ${r2(cy + ty * rx * a + uy * ry * b)}`)
  }
  return `M${pts[0]}${pts.slice(1).map(p => 'L' + p).join('')}Z`
}
// a capsule (round-capped bar) from p to q, radius r
function capsule(x1, y1, x2, y2, r) {
  const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy), nx = -dy / L * r, ny = dx / L * r
  return `M${r2(x1 + nx)} ${r2(y1 + ny)}L${r2(x2 + nx)} ${r2(y2 + ny)}A${r} ${r} 0 0 0 ${r2(x2 - nx)} ${r2(y2 - ny)}L${r2(x1 - nx)} ${r2(y1 - ny)}A${r} ${r} 0 0 0 ${r2(x1 + nx)} ${r2(y1 + ny)}Z`
}

// bells: 52 degrees out from straight up, base tucked 0.5 inside the dial rim
const S = Math.sin(52 * Math.PI / 180), C = Math.cos(52 * Math.PI / 180)
const bellL = [DX - S * 6.5, DY - C * 6.5], bellR = [DX + S * 6.5, DY - C * 6.5]
const BELL_L = dome(bellL[0], bellL[1], -S, -C, 4.0, 3.0)
const BELL_R = dome(bellR[0], bellR[1], S, -C, 4.0, 3.0)

const DIAL = [
  { d: circle(DX, DY, 5.9), plate: 'K', fill: true },
]
const FEET = [
  { d: 'M7.9 18.6L5.7 21.7', plate: 'A' },
  { d: 'M16.1 18.6L18.3 21.7', plate: 'A' },
]
const FACE = sk(DIAL)
// bells and feet: a pass of their own (every fill votes the coloured glass), laid over the dial
const PARTS = sk([
  { d: BELL_L, plate: 'A', fill: true, line: false },
  { d: BELL_R, plate: 'A', fill: true, line: false },
  { d: circle(DX, 4.9, 1.15), plate: 'A', fill: true, line: false },
  ...FEET,
])
// hands: hour hand straight up, minute hand to the lower right, a hub at the centre
const HANDS = {
  name: NAME, paths: [], cutouts: [],
  lines: [{ pts: [[-8, -8], [-7, -8]], closed: false, plate: 'A' }],
  fills: [capsule(DX, DY, DX, DY - 4.2, 1.3), capsule(DX, DY, DX + 3.3, DY + 2.1, 1.3)].map(d => ({ subs: parsePath(d) })),
}

function pass(nodes, off, { deepRole, cls, keepShadow = true } = {}) {
  const re = new RegExp(`wg-liquid-${NAME}-([0-9]+)`, 'g')
  const ren = s => String(s).replace(re, (_, n) => `wg-liquid-${NAME}-${+n + off}`)
  const defs = [], body = []
  for (const n of nodes) {
    if (n[0] === 'defs') {
      for (const g of n[2]) {
        const k = +g[1].id.split('-').pop()
        let stops = g[2]
        if (k === 1 && deepRole) stops = stops.map(s => ['stop', { ...s[1], 'stop-color': `var(--with-liquid-${deepRole}, #1C3F9E)`, ...(s[1]['stop-opacity'] != null ? { 'stop-opacity': r2(0.8 + 0.2 * +s[1].offset) } : {}) }])
        // the coloured glass of the bells and feet: a step deeper than the generator's
        else if (k === 1) stops = stops.map((s, i) => ['stop', { ...s[1], 'stop-opacity': [0.5, 0.95][i] }])
        defs.push([g[0], { ...g[1], id: ren(g[1].id) }, stops])
      }
      continue
    }
    if (!keepShadow && n[1].class === 'wm-shadow') continue
    const a = { ...n[1] }
    if (a.fill) a.fill = ren(a.fill)
    if (a.stroke) a.stroke = ren(a.stroke)
    if (cls && a.class !== 'wm-shadow') a.class = cls
    body.push([n[0], a])
  }
  return { defs, body }
}
function compose(passes) {
  const sh = n => n[1].class === 'wm-shadow'
  const body = [...passes.flatMap(p => p.body.filter(sh)), ...passes.flatMap(p => p.body.filter(n => !sh(n)))]
  const used = new Set(body.flatMap(n => [n[1].fill, n[1].stroke]).map(v => (String(v).match(/#([^)]+)\)/) || [])[1]).filter(Boolean))
  return [['defs', {}, passes.flatMap(p => p.defs).filter(g => used.has(g[1].id))], ...body]
}

export default function render() {
  const face = pass(build(FACE), 0, { cls: 'wm-k' })
  const parts = pass(build(PARTS), 6, { cls: 'wm-a' })
  const hands = pass(build(HANDS), 12, { deepRole: 'c3', cls: 'wm-k', keepShadow: false })
  return compose([face, parts, hands])
}
