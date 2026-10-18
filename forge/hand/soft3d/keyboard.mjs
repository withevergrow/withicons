// forge/hand/soft3d/keyboard.mjs: a front-facing soft3d keyboard: a rounded dark slab with a visible lower lip, a row of four
// silver keys, a row of three, and one long blue space bar (the same layout as the line icon).
const N = 'keyboard'
const v = (r, h) => `var(--with-soft3d-${r}, ${h})`
const C = { c1: v('c1', '#3A404C'), c2: v('c2', '#BFC7D2'), c3: v('c3', '#3D7EE0'), shine: v('shine', '#FFFFFF'), shadow: v('shadow', '#1D2130') }
const g = `url(#wg-soft3d-${N}-0)`
const stop = (o, c, a) => ['stop', { offset: o, 'stop-color': c, 'stop-opacity': a }]
const f = n => (Math.round(n * 100) / 100).toString()
const slab = y => `M4.5 ${f(y)}H19.5A2.5 2.5 0 0 1 22 ${f(y + 2.5)}V${f(y + 11)}A2.5 2.5 0 0 1 19.5 ${f(y + 13.5)}H4.5A2.5 2.5 0 0 1 2 ${f(y + 11)}V${f(y + 2.5)}A2.5 2.5 0 0 1 4.5 ${f(y)}Z`
const rr = (x, y, w, h) => `M${f(x + 0.8)} ${f(y)}H${f(x + w - 0.8)}A0.8 0.8 0 0 1 ${f(x + w)} ${f(y + 0.8)}V${f(y + h - 0.8)}A0.8 0.8 0 0 1 ${f(x + w - 0.8)} ${f(y + h)}H${f(x + 0.8)}A0.8 0.8 0 0 1 ${f(x)} ${f(y + h - 0.8)}V${f(y + 0.8)}A0.8 0.8 0 0 1 ${f(x + 0.8)} ${f(y)}Z`
const key = (x, y, w, h, fill, cls) => {
  const d = rr(x, y, w, h)
  const low = rr(x, y + 0.7, w, h)
  return [
    ['path', { d: low, fill, class: cls }],
    ['path', { d: low, fill: C.shadow, 'fill-opacity': 0.4, class: cls }],
    ['path', { d, fill, class: cls }],
    ['path', { d, fill: g, class: cls }],
    ['path', { d: `M${f(x + 0.9)} ${f(y + 0.5)}H${f(x + w - 0.9)}`, stroke: C.shine, 'stroke-width': 0.45, 'stroke-opacity': 0.6, 'stroke-linecap': 'round', fill: 'none', class: 'wm-shine' }],
  ]
}
export default function render() {
  const out = [
    ['defs', {}, [['linearGradient', { id: `wg-soft3d-${N}-0`, x1: 0, y1: 0, x2: 1, y2: 1 }, [
      stop(0, C.shine, 0.34), stop(0.42, C.shine, 0), stop(0.62, C.shadow, 0), stop(1, C.shadow, 0.22)]]]],
    ['ellipse', { cx: 12, cy: 21.4, rx: 10.2, ry: 1.5, fill: C.shadow, 'fill-opacity': 0.08, class: 'wm-shadow' }],
    ['ellipse', { cx: 12, cy: 21.4, rx: 7.6, ry: 1, fill: C.shadow, 'fill-opacity': 0.1, class: 'wm-shadow' }],
    ['path', { d: slab(5.5), fill: C.c1, class: 'wm-k' }],
    ['path', { d: slab(5.5), fill: C.shadow, 'fill-opacity': 0.4, class: 'wm-k' }],
    ['path', { d: slab(4), fill: C.c1, class: 'wm-k' }],
    ['path', { d: slab(4), fill: g, class: 'wm-k' }],
    ['path', { d: 'M4.6 5.1H19.4', stroke: C.shine, 'stroke-width': 0.7, 'stroke-opacity': 0.5, 'stroke-linecap': 'round', fill: 'none', class: 'wm-shine' }],
  ]
  for (const x of [4.4, 8.4, 12.4, 16.4]) out.push(...key(x, 6.9, 3.2, 2.5, C.c2, 'wm-a'))
  for (const x of [6.4, 10.4, 14.4]) out.push(...key(x, 10.7, 3.2, 2.5, C.c2, 'wm-a'))
  out.push(...key(6.4, 14.5, 11.2, 2.5, C.c3, 'wm-a'))
  return out
}
