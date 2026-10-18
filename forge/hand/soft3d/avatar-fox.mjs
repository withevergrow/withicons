// forge/hand/soft3d/avatar-fox.mjs: angular fox head (pointed ears, wide cheek points, slot eyes, small triangular nose) in soft 3D, painter recipe of the sibling avatars.
const r2 = s => s.replace(/(\d+\.\d{2})\d+/g, '$1')
const E = (cx, cy, rx, ry = rx) => r2(`M${cx - rx} ${cy}a${rx} ${ry} 0 1 0 ${2 * rx} 0a${rx} ${ry} 0 1 0 ${-2 * rx} 0z`)
function painter(name, BASE) {
  const col = r => `var(--with-soft3d-${r}, ${BASE[r]})`
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
  const shadow = (cx, w) => { fill(E(cx, 22.4, w, 0.9), 'shadow', 0.07, 'wm-shadow'); fill(E(cx, 22.4, w * 0.72, 0.65), 'shadow', 0.1, 'wm-shadow') }
  return { out, form, fill, line, shadow }
}

export default function render(icon) {
  const { out, form, fill, line, shadow } = painter(icon?.name || 'avatar-fox', { ink: '#2A2226', c1: '#F28A38', c2: '#FFF2E2', c3: '#4A2C26', accent: '#F06A6A', shadow: '#2A1E1C', shine: '#FFFFFF' })
  shadow(12, 6.8)
  // angular fox head: pointed ears, wide cheek points, chin point
  const head = 'M12 21C10.8 19.8 9.4 18.8 7.8 18L3.3 15.5C4.4 14 5 12.5 5 10.9V4.9C5 3.8 5.9 3.5 6.7 4.1L10.2 6.9H13.8L17.3 4.1C18.1 3.5 19 3.8 19 4.9V10.9C19 12.5 19.6 14 20.7 15.5L16.2 18C14.6 18.8 13.2 19.8 12 21z'
  form(head, 'c1')
  form('M6.4 5.9V10.2L9.1 8z', 'c3', 'wm-a', null)
  form('M17.6 5.9V10.2L14.9 8z', 'c3', 'wm-a', null)
  // cream cheeks and chin
  form('M3.5 15.4C6.4 14 9.7 14.6 12 16.9C14.3 14.6 17.6 14 20.5 15.4L16.2 18C14.6 18.8 13.2 19.8 12 21C10.8 19.8 9.4 18.8 7.8 18z', 'c2', 'wm-k', 1)
  fill(E(7.2, 14.1, 1.1, 0.65) + E(16.8, 14.1, 1.1, 0.65), 'accent', 0.22)
  // slot eyes
  for (const x of [9.4, 14.6]) {
    fill(E(x, 12.3, 0.75, 1.1), 'ink', 1, 'wm-a')
    fill(E(x - 0.2, 11.8, 0.26), 'shine', 0.95, 'wm-shine')
  }
  // small triangular nose
  fill('M10.7 17.1Q12 16.8 13.3 17.1Q13.2 18 12 18.9Q10.8 18 10.7 17.1z', 'ink', 0.95, 'wm-a')
  fill(E(11.5, 17.3, 0.35, 0.22), 'shine', 0.5, 'wm-shine')
  // forehead shine
  fill(E(9.4, 8.4, 1.5, 0.7), 'shine', 0.32, 'wm-shine')
  return out
}
