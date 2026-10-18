// forge/hand/chrome/navigation.mjs — the location arrow folded down its axis into two facets: the upper-left wing in
// bright chrome catching the light, the lower-right wing in darker gunmetal in its shade, parted by a dark seam along
// the fold. The generated arrow was one pale chrome dart whose warm lower half and slim tip faded into a light
// background; the gunmetal facet gives the tip a strong dark mass and the fold says "pointer" at 16px.
// Same layer recipe as the generator (_chrome-core.mjs layers/emit); only the geometry is drawn here.
import { parsePath } from '../../kernel/geom.mjs'
import * as F from '../../styles/_chrome-field.mjs'
import { layers, emit, K } from '../../styles/_chrome-core.mjs'

// the style's placement: drawing scaled about the centre and lifted for the shadow
const tf = p => [(p[0] - 12) * K.SCALE + 12 + K.TX, (p[1] - 12) * K.SCALE + 12 + K.TY]
const lines = d => parsePath(d).map(s => ({ pts: s.pts.map(tf), closed: s.closed }))
const rings = d => parsePath(d).map(s => s.pts.map(tf))
const M0 = 0.7
// the half-plane side * (signed distance to the line a-b) > gap, as a clamped field (output units)
function half(a, b, side, gap) {
  const [ax, ay] = tf(a), [bx, by] = tf(b), L = Math.hypot(bx - ax, by - ay)
  const nx = (by - ay) / L, ny = -(bx - ax) / L, G = F.field(1)
  for (let j = 0; j < F.N; j++) for (let i = 0; i < F.N; i++) {
    const d = side * (nx * (i * F.H - ax) + ny * (j * F.H - ay))
    G[j * F.N + i] = Math.max(-2, Math.min(2, gap - d))
  }
  return G
}

// the skeleton's arrow: tip (20.5 3.5), left barb (3 10.5), notch (10.5 13.5), lower barb (13.5 21)
const ARROW = 'M20.5 3.5L3 10.5L10.5 13.5L13.5 21Z'
const TIP = [20.5, 3.5], NOTCH = [10.5, 13.5]
const SEAM = 0.2   // half the fold seam

export default function render(icon) {
  const name = (icon && icon.name) || 'navigation'
  // the whole dart inflated as the generator does, then split down the fold
  const U = F.strokes(lines(ARROW), K.WK, M0)
  F.region(rings(ARROW), M0, U)
  const sil = F.open(F.copy(U), K.ROUND)
  const side = (() => { const [ax, ay] = tf(TIP), [bx, by] = tf(NOTCH), [px, py] = tf([3, 10.5]); return Math.sign((by - ay) * (px - ax) - (bx - ax) * (py - ay)) })()
  const wing = F.intersect(F.copy(sil), half(TIP, NOTCH, side, SEAM))
  const shade = F.intersect(F.copy(sil), half(TIP, NOTCH, -side, SEAM))
  const seam = F.subtract(F.subtract(F.copy(sil), wing), shade)
  const round = Fd => F.open(Fd, 0.2)
  const Ls = layers({ T: {}, K: round(wing), Af: round(shade), Ab: null, S: null, sil, txt: null, seam })
  for (const L of Ls.list) L.cls = L.cls === 'wm-shine' || L.cls === 'wm-shadow' ? L.cls : 'wm-k'
  return emit(Ls, name, 0)
}
