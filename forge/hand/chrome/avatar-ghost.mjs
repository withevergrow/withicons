// forge/hand/chrome/avatar-ghost.mjs: a chrome ghost, a round-topped body with three deep scallops along the hem. The
// face is two tall ink eyes and an open "o" mouth, each on a pale halo so the chrome horizon and the dark ground can
// never swallow them; the hem carries a strong dark rim line. The generated drawing washed its face and scalloped hem
// out into the pale bounce light at the bottom of the chrome.
import { parsePath } from '../../kernel/geom.mjs'
import * as F from '../../styles/_chrome-field.mjs'
import { layers, emit, col } from '../../styles/_chrome-core.mjs'

// the style's placement: drawing scaled about the centre and lifted for the shadow
const S = 0.88, OX = -0.2, OY = -0.55
const tf = p => [(p[0] - 12) * S + 12 + OX, (p[1] - 12) * S + 12 + OY]
const M0 = 0.7, f = v => Math.round(v * 100) / 100
const P = (x, y) => tf([x, y]).map(f).join(' ')

// body, in output units: arch (r 7.4 about x 12), straight sides, three scallops
const X0 = 4.6, X1 = 19.4, YS = 11.4, YH = 20.2, R = 7.4, SW = (X1 - X0) / 3, SY = 1.9
const arc = (rx, ry, x, y) => `A${f(rx * S)} ${f(ry * S)} 0 0 1 ${P(x, y)}`
const HEM = [X1, X1 - SW, X1 - 2 * SW, X0].map((x, i, a) => i ? arc(SW / 2, SY, x, YH) : '').join('')
const BODY = `M${P(X0, YH)}L${P(X0, YS)}A${f(R * S)} ${f(R * S)} 0 0 1 ${P(X1, YS)}L${P(X1, YH)}` + HEM + 'Z'
const HEMLINE = `M${P(X1, YH - 0.3)}L${P(X1, YH)}` + HEM + `L${P(X0, YH - 0.3)}`
const EYES = [[9.2, 10.9], [14.8, 10.9]]

export default function render(icon) {
  const name = (icon && icon.name) || 'avatar-ghost'
  const subs = parsePath(BODY)
  const K = F.open(F.region(subs.map(s => s.pts), M0), 0.32)
  const Ls = layers({ T: {}, K, Af: null, Ab: null, S: null, sil: F.copy(K), txt: null, seam: null })
  for (const l of Ls.list) if (!l.cls) l.cls = 'wm-k'
  const glint = Ls.glint
  Ls.glint = null
  const out = emit(Ls, name, 0)
  const defs = out[0] && out[0][0] === 'defs' ? out.shift()[2] : []

  const nodes = []
  // the hem rim: a dark steel line right along the scalloped edge, so the bottom never fades into the page
  nodes.push(['path', { d: HEMLINE, fill: 'none', stroke: col('shadow'), 'stroke-width': 0.7, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'wm-k' }])
  // face: pale halo, ink, white catch-light
  for (const [x, y] of EYES) {
    const [ex, ey] = tf([x, y])
    nodes.push(['ellipse', { cx: f(ex), cy: f(ey), rx: 1.55, ry: 2.05, fill: col('edge'), class: 'wm-a' }])
    nodes.push(['ellipse', { cx: f(ex), cy: f(ey), rx: 1.0, ry: 1.5, fill: col('ink'), class: 'wm-a' }])
    nodes.push(['circle', { cx: f(ex - 0.28), cy: f(ey - 0.55), r: 0.32, fill: col('shine'), class: 'wm-shine' }])
  }
  const [mx, my] = tf([12, 15.4])
  nodes.push(['ellipse', { cx: f(mx), cy: f(my), rx: 1.75, ry: 2.1, fill: col('edge'), class: 'wm-k' }])
  nodes.push(['ellipse', { cx: f(mx), cy: f(my), rx: 1.2, ry: 1.55, fill: col('ink'), class: 'wm-k' }])
  nodes.push(['ellipse', { cx: f(mx - 0.3), cy: f(my + 0.55), rx: 0.55, ry: 0.3, fill: col('c1'), 'fill-opacity': 0.8, class: 'wm-k' }])
  return [...(defs.length ? [['defs', {}, defs]] : []), ...out, ...nodes, ...(glint ? [glint] : [])]
}
