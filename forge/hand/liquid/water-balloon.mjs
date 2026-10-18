// forge/hand/liquid/water-balloon.mjs: round clear-glass water balloon with a flared tie at the top and a wavy
// water line inside, the water a second, deeper pane of liquid glass (wm-a, it sways). Same subject and
// composition as the line version.
const NAME = 'water-balloon'
import { parsePath } from '../../kernel/geom.mjs'
import { build } from '../../styles/_liquid-core.mjs'

const fill = d => ({ subs: parsePath(d) })
const OFF = plate => ({ pts: [[-8, -8], [-7, -8]], closed: false, plate })
const glass = (fills, plate) => ({ name: NAME, paths: [], lines: plate ? [OFF(plate)] : [], fills: fills.map(fill), cutouts: [] })

function pass(nodes, off, cls, { deepRole, shadow = true, pool = 1 } = {}) {
  const re = new RegExp('wg-liquid-' + NAME + '-([0-9]+)', 'g')
  const ren = s => String(s).replace(re, (_, n) => `wg-liquid-${NAME}-${+n + off}`)
  const defs = [], body = []
  for (const n of nodes) {
    if (n[0] === 'defs') {
      for (const g of n[2]) {
        let stops = g[2]
        if (g[1].id.endsWith('-1') && deepRole) stops = stops.map(t => ['stop', { ...t[1], 'stop-color': `var(--with-liquid-${deepRole}, #FF7EC1)` }])
        defs.push([g[0], { ...g[1], id: ren(g[1].id) }, stops])
      }
      continue
    }
    const a = { ...n[1] }
    if (a.class === 'wm-shadow' && !shadow) continue
    if (a.fill) a.fill = ren(a.fill)
    if (a.stroke) a.stroke = ren(a.stroke)
    if (a.class !== 'wm-shadow' && a.class !== 'wm-shine') a.class = cls
    if (off && a.fill === `url(#wg-liquid-${NAME}-${4 + off})`) a['fill-opacity'] = pool
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

// round body with a short neck, and the flared tie above it
const BODY = 'M12 7.9C10.8 7.9 4.6 10.9 4.6 15.4C4.6 19 7.8 21.7 12 21.7C16.2 21.7 19.4 19 19.4 15.4C19.4 10.9 13.2 7.9 12 7.9Z'
const TIE = 'M11 9L8.3 3.6C10.2 2.9 13.8 2.9 15.7 3.6L13 9Z'
// the water: a wavy surface over the lower half, the bottom following the balloon
const WATER = 'M6.2 15.3C8 13.8 10 13.8 12 15.3C14 16.8 16 16.8 17.8 15.3C17.5 18.6 15.2 20.5 12 20.5C8.8 20.5 6.5 18.6 6.2 15.3Z'

export default function render() {
  const body = pass(build(glass([BODY])), 0, 'wm-k')
  const tie = pass(build(glass([TIE], 'A')), 12, 'wm-k', { deepRole: 'c4', shadow: false, pool: 0.4 })
  const water = pass(build(glass([WATER])), 6, 'wm-a', { shadow: false, pool: 0.5 })
  const glint = [['path', { d: 'M7.9 12.2C8.5 10.9 9.5 10.1 10.5 9.7C11 9.5 11.3 10 10.9 10.4C10.1 11 9.3 11.8 8.8 12.8C8.5 13.4 7.6 12.9 7.9 12.2Z', fill: 'var(--with-liquid-shine, #FFFFFF)', 'fill-opacity': 0.9, class: 'wm-shine' }]]
  return [...compose([body, tie, water]), ...glint]
}
