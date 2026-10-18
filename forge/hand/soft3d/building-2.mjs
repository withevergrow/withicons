// forge/hand/soft3d/building-2.mjs: the line design's tall tower beside a lower, set-back wing, as soft clay volumes:
// each block has a rounded top corner, a clear grid of glassy windows and the tall one an arched door, on a thin plinth.
// It replaces the generated tilted dice-like block with brown dots.
const v = (r, h) => `var(--with-soft3d-${r}, ${h})`
const stop = (o, c, a) => ['stop', { offset: o, 'stop-color': c, 'stop-opacity': a }]
const SH = v('shadow', '#1D2130'), SN = v('shine', '#FFFFFF')
const N = 'building-2'

export default function render() {
  const g0 = `url(#wg-soft3d-${N}-0)`, g1 = `url(#wg-soft3d-${N}-1)`
  const TALL = v('c1', '#F1E4CC'), WING = v('c3', '#D7BF98'), WIN = v('c2', '#5BA7E6'), BASE = v('c4', '#B9C0CB'), INK = v('ink', '#2B2F3A')
  const rim = (d, o = 0.3, cls = 'wm-k') => ['path', { d, fill: 'none', stroke: SH, 'stroke-width': 0.5, 'stroke-opacity': o, 'stroke-linejoin': 'round', class: cls }]
  const part = (d, fill, g = g0, cls = 'wm-k') => [['path', { d, fill, class: cls }], ['path', { d, fill: g, class: cls }], rim(d, 0.3, cls)]
  const TOWER = 'M3.2 21.2V4.4A1.9 1.9 0 0 1 5.1 2.5h5.2a1.9 1.9 0 0 1 1.9 1.9v16.8z'
  const WINGD = 'M12.2 21.2V11.4A1.9 1.9 0 0 1 14.1 9.5h4.8a1.9 1.9 0 0 1 1.9 1.9v9.8z'
  const win = (x, y, w = 2.3, h = 2) => [
    ['rect', { x, y, width: w, height: h, rx: 0.6, fill: WIN, class: 'wm-a' }],
    ['rect', { x, y, width: w, height: h, rx: 0.6, fill: `url(#wg-soft3d-${N}-2)`, class: 'wm-a' }],
    ['rect', { x, y, width: w, height: h, rx: 0.6, fill: 'none', stroke: SH, 'stroke-width': 0.4, 'stroke-opacity': 0.45, class: 'wm-a' }],
  ]
  const wins = []
  for (const y of [4.3, 7.6, 10.9, 14.2]) for (const x of [4.6, 8.4]) wins.push(...win(x, y))
  for (const y of [11.8, 15.1]) for (const x of [14, 17.4]) wins.push(...win(x, y))
  const DOOR = 'M6.4 21.2v-1.8a1.3 1.3 0 0 1 2.6 0v1.8z'
  return [
    ['defs', {}, [
      ['radialGradient', { id: `wg-soft3d-${N}-0`, cx: 0.3, cy: 0.2, r: 1.0 }, [stop(0, SN, 0.5), stop(0.4, SN, 0.06), stop(0.7, SH, 0), stop(1, SH, 0.28)]],
      ['linearGradient', { id: `wg-soft3d-${N}-1`, x1: 0, y1: 0, x2: 0, y2: 1 }, [stop(0, SN, 0.4), stop(1, SH, 0.3)]],
      ['linearGradient', { id: `wg-soft3d-${N}-2`, x1: 0, y1: 0, x2: 1, y2: 1 }, [stop(0, SN, 0.55), stop(0.45, SN, 0.08), stop(1, SH, 0.3)]],
    ]],
    ['ellipse', { cx: 12, cy: 22.3, rx: 10, ry: 0.8, fill: SH, 'fill-opacity': 0.08, class: 'wm-shadow' }],
    ['ellipse', { cx: 12, cy: 22.3, rx: 7.2, ry: 0.55, fill: SH, 'fill-opacity': 0.1, class: 'wm-shadow' }],
    ...part(WINGD, WING),
    ['path', { d: 'M12.2 10.2V21.2', stroke: SH, 'stroke-width': 1.2, 'stroke-opacity': 0.1, fill: 'none', class: 'wm-k' }],
    ...part(TOWER, TALL),
    ['path', { d: 'M4.2 3.4h6.2', stroke: SN, 'stroke-width': 0.55, 'stroke-opacity': 0.55, 'stroke-linecap': 'round', fill: 'none', class: 'wm-shine' }],
    ['path', { d: 'M14.4 10.5h4.4', stroke: SN, 'stroke-width': 0.5, 'stroke-opacity': 0.45, 'stroke-linecap': 'round', fill: 'none', class: 'wm-shine' }],
    ...wins,
    ['path', { d: DOOR, fill: INK, class: 'wm-a' }],
    ['path', { d: DOOR, fill: g1, class: 'wm-a', 'fill-opacity': 0.5 }],
    ['rect', { x: 1.8, y: 21.2, width: 20.4, height: 1.3, rx: 0.65, fill: BASE, class: 'wm-k' }],
    ['rect', { x: 1.8, y: 21.2, width: 20.4, height: 1.3, rx: 0.65, fill: g1, class: 'wm-k' }],
    rim('M2.45 21.2h19.1a.65.65 0 0 1 .65.65v0a.65.65 0 0 1-.65.65H2.45a.65.65 0 0 1-.65-.65v0a.65.65 0 0 1 .65-.65z', 0.3),
  ]
}
