// forge/hand/soft3d/cooking-pot.mjs: a round-bodied red pot with a silver domed lid, a round knob and two side ear handles,
// as in line (the generated drawing was a boxy toaster-like block).
const N = 'cooking-pot'
const v = (r, h) => `var(--with-soft3d-${r}, ${h})`
const C = { c1: v('c1', '#E5483F'), c2: v('c2', '#BFC7D2'), shine: v('shine', '#FFFFFF'), shadow: v('shadow', '#1D2130') }
const g = `url(#wg-soft3d-${N}-0)`
const gd = `url(#wg-soft3d-${N}-1)`
const stop = (o, c, a) => ['stop', { offset: o, 'stop-color': c, 'stop-opacity': a }]
const BODY = 'M4.2 10.6H19.8C20.8 13.8 20.4 17.4 17.2 19.9Q15.2 21.4 12 21.4Q8.8 21.4 6.8 19.9C3.6 17.4 3.2 13.8 4.2 10.6Z'
const LID = 'M4.6 10.8A7.4 4.8 0 0 1 19.4 10.8Z'
const RIM = 'M4.4 9.6H19.6A1 1 0 0 1 20.6 10.6V10.8A1 1 0 0 1 19.6 11.8H4.4A1 1 0 0 1 3.4 10.8V10.6A1 1 0 0 1 4.4 9.6Z'
const EAR_L = 'M4.6 12.6H2.7A1.1 1.1 0 0 0 1.6 13.7V13.9A1.1 1.1 0 0 0 2.7 15H4.6Z'
const EAR_R = 'M19.4 12.6H21.3A1.1 1.1 0 0 1 22.4 13.7V13.9A1.1 1.1 0 0 1 21.3 15H19.4Z'
export default function render() {
  return [
    ['defs', {}, [
      ['linearGradient', { id: `wg-soft3d-${N}-0`, x1: 0, y1: 0, x2: 1, y2: 0 }, [
        stop(0, C.shine, 0.2), stop(0.2, C.shine, 0.5), stop(0.44, C.shine, 0), stop(0.62, C.shadow, 0), stop(1, C.shadow, 0.32)]],
      ['radialGradient', { id: `wg-soft3d-${N}-1`, cx: 0.32, cy: 0.25, r: 0.95 }, [
        stop(0, C.shine, 0.6), stop(0.4, C.shine, 0.06), stop(0.75, C.shadow, 0), stop(1, C.shadow, 0.24)]],
    ]],
    ['ellipse', { cx: 12, cy: 21.8, rx: 9.2, ry: 1.3, fill: C.shadow, 'fill-opacity': 0.08, class: 'wm-shadow' }],
    ['ellipse', { cx: 12, cy: 21.8, rx: 6.4, ry: 0.9, fill: C.shadow, 'fill-opacity': 0.1, class: 'wm-shadow' }],
    ['path', { d: EAR_L, fill: C.c2, class: 'wm-a' }],
    ['path', { d: EAR_L, fill: C.shadow, 'fill-opacity': 0.25, class: 'wm-a' }],
    ['path', { d: EAR_R, fill: C.c2, class: 'wm-a' }],
    ['path', { d: EAR_R, fill: C.shadow, 'fill-opacity': 0.25, class: 'wm-a' }],
    ['path', { d: BODY, fill: C.c1, class: 'wm-k' }],
    ['path', { d: BODY, fill: gd, class: 'wm-k' }],
    ['path', { d: BODY, fill: g, class: 'wm-k' }],
    ['path', { d: 'M5.3 12.6C5 14.6 5.3 16.2 6.6 17.6', stroke: C.shine, 'stroke-width': 0.7, 'stroke-opacity': 0.6, 'stroke-linecap': 'round', fill: 'none', class: 'wm-shine' }],
    ['path', { d: 'M4.4 11.8H19.6V12.8H4.4Z', fill: C.shadow, 'fill-opacity': 0.22, class: 'wm-k' }],
    ['path', { d: 'M12 6.2V4.8', stroke: C.c2, 'stroke-width': 2.2, 'stroke-linecap': 'round', fill: 'none', class: 'wm-a' }],
    ['circle', { cx: 12, cy: 4.4, r: 1.5, fill: C.c2, class: 'wm-a' }],
    ['circle', { cx: 12, cy: 4.4, r: 1.5, fill: gd, class: 'wm-a' }],
    ['path', { d: LID, fill: C.c2, class: 'wm-k' }],
    ['path', { d: LID, fill: g, class: 'wm-k' }],
    ['path', { d: LID, fill: gd, class: 'wm-k' }],
    ['path', { d: 'M6.9 8.4C8 7.1 9.6 6.7 11 6.7', stroke: C.shine, 'stroke-width': 0.7, 'stroke-opacity': 0.85, 'stroke-linecap': 'round', fill: 'none', class: 'wm-shine' }],
    ['path', { d: RIM, fill: C.c2, class: 'wm-k' }],
    ['path', { d: RIM, fill: g, class: 'wm-k' }],
    ['path', { d: 'M4.8 10.1H12', stroke: C.shine, 'stroke-width': 0.6, 'stroke-opacity': 0.6, 'stroke-linecap': 'round', fill: 'none', class: 'wm-shine' }],
  ]
}
