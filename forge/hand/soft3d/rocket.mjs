// forge/hand/soft3d/rocket.mjs — a solid white rocket lifting off on the up-right diagonal: red nose cone and swept fins,
// a round glass porthole, a dark nozzle and a warm flame. Drawn upright and turned 45 degrees about the centre, replacing
// the generated pale ghost with a red hook.
const v = (r, h) => `var(--with-soft3d-${r}, ${h})`
const BODY = v('c1', '#EEF1F5'), RED = v('c2', '#E5483F'), DARK = v('c3', '#3A404C'), GLASS = v('tint', '#A9D8F2'), FIRE = v('accent', '#FFB02E')
const SH = v('shadow', '#1D2130'), SN = v('shine', '#FFFFFF')
const id = n => `wg-soft3d-rocket-${n}`
const stop = (o, c, op) => ['stop', op == null ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const n2 = x => { const r = Math.round(x * 100) / 100; return Object.is(r, -0) ? 0 : r }
const A = Math.PI / 4, CA = Math.cos(A), SA = Math.sin(A)
const rot = (x, y) => [12 + (x - 12) * CA - (y - 12) * SA, 12 + (x - 12) * SA + (y - 12) * CA]
// path in upright coordinates: [['M',x,y],['L',x,y],['C',x1,y1,x2,y2,x,y],['Z']] -> rotated path string
const T = cmds => cmds.map(c => {
  if (c[0] === 'Z') return 'Z'
  const out = []
  for (let i = 1; i < c.length; i += 2) out.push(...rot(c[i], c[i + 1]).map(n2))
  return c[0] + out.join(' ')
}).join(' ')
const P = (d, a, cls) => ['path', { d, ...a, class: cls }]
const S = (d, stroke, w, extra, cls) => P(d, { fill: 'none', stroke, 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', ...extra }, cls)
const circ = (cx, cy, r) => { const [x, y] = rot(cx, cy); return `M${n2(x + r)} ${n2(y)} A${r} ${r} 0 1 0 ${n2(x - r)} ${n2(y)} A${r} ${r} 0 1 0 ${n2(x + r)} ${n2(y)} Z` }

export default function render() {
  const defs = ['defs', {}, [
    ['linearGradient', { id: id(0), x1: 0, y1: 0, x2: 1, y2: 1 }, [stop(0, SN, 0.55), stop(0.35, SN, 0.08), stop(0.6, SH, 0), stop(1, SH, 0.3)]],
    ['linearGradient', { id: id(1), x1: 0, y1: 0, x2: 1, y2: 1 }, [stop(0, SN, 0.3), stop(0.5, SN, 0), stop(1, SH, 0.28)]],
    ['radialGradient', { id: id(2), cx: 0.35, cy: 0.3, r: 0.8 }, [stop(0, SN, 0.7), stop(0.5, SN, 0), stop(1, SH, 0.25)]],
  ]]
  const g0 = `url(#${id(0)})`, g1 = `url(#${id(1)})`, g2 = `url(#${id(2)})`
  const body = T([['M', 12, 0.8], ['C', 15.6, 3.2, 17.2, 7, 16.5, 11.6], ['L', 16.3, 16.4], ['C', 16.3, 17.3, 15.9, 17.7, 15, 17.7], ['L', 9, 17.7], ['C', 8.1, 17.7, 7.7, 17.3, 7.7, 16.4], ['L', 7.5, 11.6], ['C', 6.8, 7, 8.4, 3.2, 12, 0.8], ['Z']])
  const nose = T([['M', 12, 0.8], ['C', 14.2, 2.3, 15.5, 4.2, 16, 6.2], ['C', 14.5, 5.4, 9.5, 5.4, 8, 6.2], ['C', 8.5, 4.2, 9.8, 2.3, 12, 0.8], ['Z']])
  const finL = T([['M', 7.8, 11], ['C', 5, 12, 3.2, 14.6, 3, 19], ['L', 3.1, 19.4], ['L', 7.7, 17], ['Z']])
  const finR = T([['M', 16.2, 11], ['C', 19, 12, 20.8, 14.6, 21, 19], ['L', 20.9, 19.4], ['L', 16.3, 17], ['Z']])
  const noz = T([['M', 9.4, 17.5], ['L', 14.6, 17.5], ['L', 13.8, 19.6], ['L', 10.2, 19.6], ['Z']])
  const flame = T([['M', 10.2, 19.4], ['C', 9.6, 21.6, 11, 23, 12, 24.2], ['C', 13, 23, 14.4, 21.6, 13.8, 19.4], ['Z']])
  const flameIn = T([['M', 11, 19.4], ['C', 10.8, 20.8, 11.5, 21.7, 12, 22.4], ['C', 12.5, 21.7, 13.2, 20.8, 13, 19.4], ['Z']])
  return [
    defs,
    P('M5 21.6 A7.6 1.4 0 1 0 20.2 21.6 A7.6 1.4 0 1 0 5 21.6 Z', { fill: SH, 'fill-opacity': 0.05 }, 'wm-shadow'),
    P('M6.6 21.6 A6 1.1 0 1 0 18.6 21.6 A6 1.1 0 1 0 6.6 21.6 Z', { fill: SH, 'fill-opacity': 0.07 }, 'wm-shadow'),
    // flame behind the nozzle
    P(flame, { fill: FIRE }, 'wm-a'),
    P(flameIn, { fill: SN, 'fill-opacity': 0.85 }, 'wm-a'),
    // fins sit behind the body
    P(finL, { fill: RED, stroke: RED, 'stroke-width': 0.8, 'stroke-linejoin': 'round' }, 'wm-k'),
    P(finL, { fill: g1 }, 'wm-k'),
    P(finR, { fill: RED, stroke: RED, 'stroke-width': 0.8, 'stroke-linejoin': 'round' }, 'wm-k'),
    P(finR, { fill: SH, 'fill-opacity': 0.22 }, 'wm-k'),
    P(noz, { fill: DARK, stroke: DARK, 'stroke-width': 0.6, 'stroke-linejoin': 'round' }, 'wm-k'),
    // body, nose cone
    P(body, { fill: BODY }, 'wm-k'),
    P(body, { fill: g0 }, 'wm-k'),
    P(nose, { fill: RED, stroke: RED, 'stroke-width': 0.4, 'stroke-linejoin': 'round' }, 'wm-k'),
    P(nose, { fill: g1 }, 'wm-k'),
    // porthole: dark bezel, glass, glint
    P(circ(12, 9.6, 2.7), { fill: DARK }, 'wm-s'),
    P(circ(12, 9.6, 1.95), { fill: GLASS }, 'wm-s'),
    P(circ(12, 9.6, 1.95), { fill: g2 }, 'wm-s'),
    // a seam above the nozzle and a lit edge along the left of the body
    S(T([['M', 7.7, 15], ['C', 10, 15.7, 14, 15.7, 16.3, 15]]), SH, 0.5, { 'stroke-opacity': 0.22 }, 'wm-k'),
    S(T([['M', 8.7, 5.5], ['C', 7.6, 8, 7.8, 11, 8.1, 14]]), SN, 0.6, { 'stroke-opacity': 0.85 }, 'wm-shine'),
  ]
}
