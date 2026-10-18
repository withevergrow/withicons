// forge/hand/soft3d/witch-hat.mjs: soft 3D witch hat to the line design: a wide brim ring, a tall cone whose tip curls to
// the right, a violet band and a gold buckle. Sibling painter recipe (role fill plus volume overlay).
const BASE = { ink: '#262A33', c1: '#2A2E36', c2: '#8A66DE', c3: '#F7C531', accent: '#FF6A4D', shadow: '#1D2130', shine: '#FFFFFF' }
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
  return { out, form, fill, line }
}

export default function render(icon) {
  const { out, form, fill, line } = painter(icon?.name || 'witch-hat', BASE)
  // contact shadow
  fill(E(12, 21.9, 9, 0.8), 'shadow', 0.07, 'wm-shadow')
  fill(E(12, 21.9, 6.5, 0.55), 'shadow', 0.1, 'wm-shadow')
  // brim
  form(E(12, 18.7, 9.9, 2.75), 'c1')
  fill(E(12, 18.2, 7.2, 1.5), 'shadow', 0.3)
  line('M3.3 18.1C3.9 16.7 7.4 16 12 16s8.1.7 8.7 2.1', 'shine', 0.5, 0.28, 'wm-shine')
  // tall cone, tip curling right
  const cone = 'M6.6 17.2C7.9 13 9.4 9.2 10.3 6.7C11.2 4.2 14.7 2.9 19 5C16.3 5.3 14.6 6.6 14.6 8.9C14.6 11.6 16 14.6 17.4 17.2Q12 19.5 6.6 17.2Z'
  form(cone, 'c1', 'wm-k', 1)
  // a darker fold down the right side
  fill('M14.6 8.9C14.6 11.6 16 14.6 17.4 17.2Q15.6 18.1 13.4 18.2C14.5 14.6 14.6 11.4 14.3 9.2Z', 'shadow', 0.2)
  // violet band
  form('M7.7 13.4Q12 15.2 16.3 13.4L17.4 17.2Q12 19.5 6.6 17.2Z', 'c2', 'wm-a', 0)
  // gold buckle
  form('M10.3 14.7h3.4a.7.7 0 0 1 .7.7v2a.7.7 0 0 1-.7.7h-3.4a.7.7 0 0 1-.7-.7v-2a.7.7 0 0 1 .7-.7z', 'c3', 'wm-s', 0)
  fill('M11.2 15.55h1.6a.3.3 0 0 1 .3.3v.9a.3.3 0 0 1-.3.3h-1.6a.3.3 0 0 1-.3-.3v-.9a.3.3 0 0 1 .3-.3z', 'c1', 0.85, 'wm-s')
  // highlights
  line('M9.6 7.9C9 9.7 8.4 11.3 7.9 12.7', 'shine', 0.65, 0.42, 'wm-shine')
  line('M11.9 4.5C13.7 3.9 15.7 4.1 17.2 4.8', 'shine', 0.55, 0.32, 'wm-shine')
  return out
}
