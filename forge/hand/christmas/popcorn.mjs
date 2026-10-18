// forge/hand/christmas/popcorn.mjs — a cranberry and cream striped bucket with a red rim, a heap of puffy cream
// kernels with butter-gold shading rising above it, snow on the highest puffs, one flying kernel and a gold sparkle.
const V = (r, h) => `var(--with-christmas-${r}, ${h})`
const INK = V('ink', '#3A0F17'), RED = V('c1', '#C8203A'), GOLD = V('c3', '#E2A93B'), CREAM = V('c4', '#FFF5E6'), ACC = V('accent', '#F4C24D')
const SHINE = V('shine', '#FFFFFF'), TINT = V('tint', '#C9DAEC'), SHADOW = V('shadow', '#4A0716')
const K = { stroke: INK, 'stroke-width': 0.6, 'stroke-linejoin': 'round' }
const n = v => Math.round(v * 100) / 100

export default function render(icon) {
  const id = k => `wg-christmas-${icon.name}-${k}`
  const cup = 'M5 11.6H19L17.4 19.6Q17.2 20.6 16.2 20.6H7.8Q6.8 20.6 6.6 19.6Z'
  const rim = 'M4.9 9.6H19.1Q20 9.6 20 10.5V10.9Q20 11.8 19.1 11.8H4.9Q4 11.8 4 10.9V10.5Q4 9.6 4.9 9.6Z'
  const stripe = i => {
    const t0 = 5 + 2.8 * i, t1 = t0 + 2.8, b0 = 6.8 + 2.08 * i, b1 = b0 + 2.08
    return `M${n(t0)} 11.6H${n(t1)}L${n(b1)} 20.6H${n(b0)}Z`
  }
  const reds = [0, 2, 4].map(stripe).join('')
  const puffs = [[12, 5, 3], [7.4, 7, 2.6], [16.6, 7, 2.6], [10.2, 8, 2.5], [14, 8, 2.5]]
  const body = cup + rim
  const cap = (cx, top, w) => `M${n(cx - w)} ${n(top + 1.2)}C${n(cx - w + 0.5)} ${n(top + 0.4)} ${n(cx - 0.8)} ${top} ${cx} ${top}C${n(cx + 0.8)} ${top} ${n(cx + w - 0.5)} ${n(top + 0.4)} ${n(cx + w)} ${n(top + 1.2)}Q${n(cx + w - 0.2)} ${n(top + 2.4)} ${n(cx + w - 1)} ${n(top + 2.2)}Q${n(cx + 0.5)} ${n(top + 2.9)} ${cx} ${n(top + 2.3)}Q${n(cx - 0.5)} ${n(top + 2.9)} ${n(cx - w + 1)} ${n(top + 2.2)}Q${n(cx - w + 0.2)} ${n(top + 2.4)} ${n(cx - w)} ${n(top + 1.2)}Z`
  const snow = { fill: `url(#${id(1)})`, stroke: INK, 'stroke-width': 0.4, 'stroke-linejoin': 'round', class: 'wm-deco' }
  return [
    ['defs', {}, [
      ['linearGradient', { id: id(0), x1: 2, y1: 2, x2: 14, y2: 22, gradientUnits: 'userSpaceOnUse' }, [
        ['stop', { offset: 0, 'stop-color': SHINE, 'stop-opacity': 0.34 }],
        ['stop', { offset: 0.42, 'stop-color': SHINE, 'stop-opacity': 0 }],
        ['stop', { offset: 0.58, 'stop-color': SHADOW, 'stop-opacity': 0 }],
        ['stop', { offset: 1, 'stop-color': SHADOW, 'stop-opacity': 0.42 }],
      ]],
      ['linearGradient', { id: id(1), x1: 0, y1: 1.7, x2: 0, y2: 6.2, gradientUnits: 'userSpaceOnUse' }, [
        ['stop', { offset: 0.25, 'stop-color': SHINE }],
        ['stop', { offset: 1, 'stop-color': TINT }],
      ]],
    ]],
    ...puffs.flatMap(([x, y, r]) => [
      ['circle', { cx: x, cy: y, r, fill: CREAM, ...K, class: 'wm-k' }],
      ['circle', { cx: n(x + r * 0.36), cy: n(y + r * 0.3), r: n(r * 0.3), fill: GOLD, 'fill-opacity': 0.9, class: 'wm-deco' }],
    ]),
    ['circle', { cx: 4.2, cy: 4.8, r: 1.3, fill: CREAM, ...K, class: 'wm-a' }],
    ['path', { d: cup, fill: CREAM, ...K, class: 'wm-k' }],
    ['path', { d: reds, fill: RED, stroke: RED, 'stroke-width': 0.1, class: 'wm-k' }],
    ['path', { d: cup, fill: 'none', ...K, class: 'wm-k' }],
    ['path', { d: rim, fill: RED, ...K, class: 'wm-k' }],
    ['path', { d: body, fill: `url(#${id(0)})`, class: 'wm-shine' }],
    ['path', { d: 'M5.4 10.4H18.6', stroke: SHINE, 'stroke-width': 0.4, 'stroke-opacity': 0.6, 'stroke-linecap': 'round', class: 'wm-shine' }],
    ['path', { d: cap(12, 1.7, 2.1), ...snow }],
    ['path', { d: cap(7.4, 4.1, 1.8), ...snow }],
    ['path', { d: cap(16.6, 4.1, 1.8), ...snow }],
    ['path', { d: 'M20.4 2Q20.7 3.4 22.2 3.7Q20.7 4 20.4 5.4Q20.1 4 18.6 3.7Q20.1 3.4 20.4 2Z', fill: ACC, stroke: INK, 'stroke-width': 0.28, 'stroke-linejoin': 'round', class: 'wm-deco' }],
  ]
}
