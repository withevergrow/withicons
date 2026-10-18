// forge/hand/liquid/dumpling.mjs — a half-moon dumpling: scalloped crimped seam on a high arch, plump round belly,
// five bold coloured pleat ridges fanning down from the seam valleys, and a bright belly highlight.
// Glass recipe is the generator's (_liquid-core build); the body is K clear glass with a scalloped crescent edge, the
// pleats are A coloured glass (wm-a, they pulse) laid over it, plus one hand-placed belly glare (wm-shine).
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { build, L } from '../../styles/_liquid-core.mjs'

const f2 = v => Math.round(v * 100) / 100
// the seam: an arch from tip (2.2,12.4) to tip (21.8,12.4), peaking at y 7.4; five crimp scallops bulge outward along it
const X0 = 1.8, X1 = 22.2, N = 6
const arch = t => [X0 + (X1 - X0) * t, 13.2 - 4.0 * Math.sin(Math.PI * t)]
const seam = Array.from({ length: N + 1 }, (_, i) => arch(i / N))
let d = `M${f2(seam[0][0])} ${f2(seam[0][1])}`
for (let i = 0; i < N; i++) {
  const a = seam[i], b = seam[i + 1], mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2
  // outward normal of the arch (up and away from the centre)
  const nx = (mx - 12) * 0.05, ny = -1, nl = Math.hypot(nx, ny)
  d += `Q${f2(mx + nx / nl * 3.0)} ${f2(my + ny / nl * 3.0)} ${f2(b[0])} ${f2(b[1])}`
}
// plump belly back under to the first tip
const BODY = d + 'C21.8 17.9 17.2 20.8 12 20.8S2.2 17.9 1.8 13.2Z'
// pleats: from each interior valley a ridge falls down and in toward the belly's centre
const PLEATS = seam.slice(1, N).map(([x, y]) => {
  const k = (x - 12) * 0.12
  return `M${f2(x)} ${f2(y + 1.1)}C${f2(x + k * 0.3)} ${f2(y + 2.6)} ${f2(x + k * 0.8)} ${f2(y + 4.0)} ${f2(x + k)} ${f2(y + 5.4)}`
})
const GLARE = 'M4.1 15.4C4.5 16.7 5.4 17.8 6.7 18.5'

function shiftIds(nodes, name, by) {
  const re = new RegExp(`wg-liquid-${name}-([0-9]+)`, 'g')
  const sub = s => typeof s === 'string' ? s.replace(re, (_, n) => `wg-liquid-${name}-${+n + by}`) : s
  return nodes.map(n => {
    if (n[0] === 'defs') return ['defs', n[1], n[2].map(g => [g[0], { ...g[1], id: sub(g[1].id) }, g[2]])]
    const a = { ...n[1] }
    for (const k of ['fill', 'stroke']) a[k] = sub(a[k])
    return [n[0], a]
  })
}
function synth(name, paths, fills = []) {
  const ps = paths.map(([dd, plate], i) => ({ id: 'p' + i, d: dd, plate, subs: parsePath(dd) }))
  return {
    name, paths: ps, cutouts: [],
    lines: ps.flatMap(p => p.subs.map(s => ({ pts: s.pts, closed: s.closed, plate: p.plate, pathId: p.id }))),
    fills: fills.map(dd => { const subs = parsePath(dd); return { d: dd, subs, set: setOf(subs.map(s => s.pts)) } }),
  }
}

export default function render(icon) {
  const name = (icon && icon.name) || 'dumpling'
  const body = build(synth(name, [[BODY, 'K']], [BODY]))
  const wa = L.WA
  let pl
  try { L.WA = 1.5; pl = build(synth(name, PLEATS.map(p => [p, 'A']))) } finally { L.WA = wa }
  pl = shiftIds(pl, name, 6)
  const rest = pl.filter(n => n[0] !== 'defs' && n[1].class !== 'wm-shadow')
  // belly glare, same transform as the glass (scale .88 about 12, shift -.2/-.5)
  const t = ([x, y]) => [(x - 12) * L.SCALE + 12 + L.TX, (y - 12) * L.SCALE + 12 + L.TY]
  const gl = GLARE.replace(/(-?\d*\.?\d+) (-?\d*\.?\d+)/g, (m, x, y) => { const [a, b] = t([+x, +y]); return `${f2(a)} ${f2(b)}` })
  const glare = ['path', { d: gl, fill: 'none', stroke: `var(--with-liquid-shine, #FFFFFF)`, 'stroke-opacity': 0.75, 'stroke-width': 0.8, 'stroke-linecap': 'round', class: 'wm-shine' }]
  return [['defs', {}, [...body[0][2], ...pl[0][2]]],
    ...body.filter(n => n[0] !== 'defs').map(n => n[1].class ? n : [n[0], { ...n[1], class: 'wm-k' }]), ...rest, glare]
}
