// skeuo / bat: one indigo-lacquer silhouette (pointed ears, a round body, wings with three scalloped points a side and
// debossed ribs), a dark graphite torso band down the middle and raised yellow eyes. The generated bat was two
// separate lumps round a grey blob. Same pipeline, materials and light as the generator
// (_skeuo-core / _skeuo-mat / _skeuo-render); only the geometry is drawn here.
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { build } from '../../styles/_skeuo-core.mjs'
import { materials } from '../../styles/_skeuo-mat.mjs'
import { paint } from '../../styles/_skeuo-render.mjs'

function skeleton(base, paths, fills, cuts) {
  const ps = paths.map((p, i) => ({ id: 'p' + i, d: p.d, plate: p.plate || 'K', subs: parsePath(p.d) }))
  return {
    ...base, paths: ps,
    fills: fills.map(d => { const subs = parsePath(d); return { d, subs, set: setOf(subs.map(s => s.pts)) } }),
    cutouts: cuts.map(d => ({ d, subs: parsePath(d) })),
    lines: ps.flatMap(p => p.subs.map(s => ({ pts: s.pts, closed: s.closed, plate: p.plate, pathId: p.id }))),
  }
}

const n = v => +v.toFixed(2)
// right half, top centre down to bottom centre: [end x, end y, control points...]
const HALF = [
  [12, 6.2],
  [13.2, 5.9],
  [13.7, 3.6],
  [14.8, 8.4],
  [22.2, 5.4, 17.2, 8.6, 20.2, 7.4],
  [20.6, 13.6, 21.8, 9.8],
  [16.9, 14.9, 18.5, 11.9],
  [14.3, 15.2, 15.7, 12.9],
  [12, 17.9, 14.3, 17.3, 13.3, 17.9],
]
const pairs = a => { const r = []; for (let k = 2; k < a.length; k += 2) r.push([a[k], a[k + 1]]); return r }
const cmd = (x, y, ctl) => ctl.length === 0 ? `L${n(x)} ${n(y)}` : `${ctl.length === 2 ? 'Q' : 'C'}${ctl.map(n).join(' ')} ${n(x)} ${n(y)}`
function silhouette() {
  const out = [`M${HALF[0][0]} ${HALF[0][1]}`]
  // the right side forward, then its mirror walked back up (curve controls reversed)
  for (let i = 1; i < HALF.length; i++) out.push(cmd(HALF[i][0], HALF[i][1], HALF[i].slice(2)))
  for (let i = HALF.length - 1; i >= 1; i--) {
    const [x, y] = HALF[i - 1]
    out.push(cmd(24 - x, y, pairs(HALF[i]).reverse().flatMap(([cx, cy]) => [24 - cx, cy])))
  }
  return out.join('') + 'Z'
}

const BAT = silhouette()
const eye = x => `M${x + 0.95} 9.3A0.95 0.95 0 1 1 ${x - 0.95} 9.3A0.95 0.95 0 1 1 ${x + 0.95} 9.3Z`
const RIB_R = 'M15.4 9.8L20.1 13M15.2 10.8L16.9 14.1'
const RIB_L = 'M8.6 9.8L3.9 13M8.8 10.8L7.1 14.1'

export default function render(icon) {
  const S = skeleton({ name: 'bat', category: 'halloween', ...(icon || {}) },
    [{ d: BAT }], [BAT], [eye(10.8), eye(13.2), RIB_R, RIB_L])
  const T = { body: 'indigo', decal: { 0: 'yellow', 1: 'yellow' }, groove: 0.8, zones: [{ x0: 10.1, x1: 13.9, mat: 'graphite', role: 'c2', opt: { noBrush: true } }] }
  return paint(build(S, T), materials(S, T), T)
}
