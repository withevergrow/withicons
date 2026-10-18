// forge/hand/soft3d/candy-corn.mjs: soft 3D candy corn to the line design: an upright, symmetric, rounded cone in three
// clearly separate bands (cream tip, orange middle, yellow base) under one volume overlay.
const BASE = { ink: '#262A33', c1: '#F28A2E', c2: '#F7EEDF', c3: '#F7C531', accent: '#FF6A4D', shadow: '#2A1E1C', shine: '#FFFFFF' }
const r2 = v => +(+v).toFixed(2)
const E = (cx, cy, rx, ry = rx) => `M${r2(cx - rx)} ${r2(cy)}a${r2(rx)} ${r2(ry)} 0 1 0 ${r2(2 * rx)} 0a${r2(rx)} ${r2(ry)} 0 1 0 ${r2(-2 * rx)} 0z`
function painter(name, B) {
  const col = r => `var(--with-soft3d-${r}, ${B[r]})`
  const id = k => `wg-soft3d-${name}-${k}`
  const stop = (o, r, op) => ['stop', { offset: o, 'stop-color': col(r), 'stop-opacity': op }]
  const out = [['defs', {}, [
    ['radialGradient', { id: id(0), cx: 0.36, cy: 0.3, r: 0.8 }, [stop(0, 'shine', 0.5), stop(0.36, 'shine', 0.06), stop(0.66, 'shadow', 0), stop(1, 'shadow', 0.3)]],
    ['radialGradient', { id: id(1), cx: 0.38, cy: 0.28, r: 0.85 }, [stop(0, 'shine', 0.3), stop(0.45, 'shine', 0), stop(0.75, 'shadow', 0), stop(1, 'shadow', 0.2)]],
  ]]]
  const P = (d, a, cls = 'wm-k') => out.push(['path', { d, ...a, class: cls }])
  const form = (d, role, cls = 'wm-k', g = 0) => { P(d, { fill: col(role) }, cls); if (g !== null) P(d, { fill: `url(#${id(g)})` }, cls) }
  const fill = (d, role, op = 1, cls = 'wm-k') => P(d, op === 1 ? { fill: col(role) } : { fill: col(role), 'fill-opacity': op }, cls)
  const line = (d, role, w, op = 1, cls = 'wm-k') => P(d, { fill: 'none', stroke: col(role), 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', ...(op === 1 ? {} : { 'stroke-opacity': op }) }, cls)
  return { out, form, fill, line, id, col }
}

export default function render(icon) {
  const { out, fill, line, id } = painter(icon?.name || 'candy-corn', BASE)
  fill(E(12, 21.9, 8.2, 0.85), 'shadow', 0.07, 'wm-shadow')
  fill(E(12, 21.9, 5.9, 0.6), 'shadow', 0.1, 'wm-shadow')
  const whole = 'M12 2.8C13.6 2.8 14.6 4 15.3 5.8L19.3 16.2C20.2 19 17 21.4 12 21.4C7 21.4 3.8 19 4.7 16.2L8.7 5.8C9.4 4 10.4 2.8 12 2.8Z'
  // base (yellow), middle (orange), tip (cream)
  fill('M5.55 14Q12 15.7 18.45 14L19.3 16.2C20.2 19 17 21.4 12 21.4C7 21.4 3.8 19 4.7 16.2Z', 'c3')
  fill('M7.47 9Q12 10.7 16.53 9L18.45 14Q12 15.7 5.55 14Z', 'c1')
  fill('M12 2.8C13.6 2.8 14.6 4 15.3 5.8L16.53 9Q12 10.7 7.47 9L8.7 5.8C9.4 4 10.4 2.8 12 2.8Z', 'c2')
  // seams between the bands
  line('M7.47 9Q12 10.7 16.53 9', 'shadow', 0.45, 0.16)
  line('M5.55 14Q12 15.7 18.45 14', 'shadow', 0.45, 0.18)
  // one volume overlay over the whole piece
  out.push(['path', { d: whole, fill: `url(#${id(0)})`, class: 'wm-k' }])
  // glossy highlight down the left side
  line('M10.4 4.7C9.6 6.4 8.4 9.4 7 13.2', 'shine', 0.65, 0.4, 'wm-shine')
  line('M6.6 16.6C6.9 17.7 7.8 18.6 9 19.2', 'shine', 0.55, 0.3, 'wm-shine')
  return out
}
