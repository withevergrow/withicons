// forge/hand/soft3d/avatar-man-bald.mjs: soft 3D bald man bust: a round bald head with ears and a broad shine on the crown,
// two dot eyes and a smile, on a neck and shoulders in a red shirt. No beard, no realistic face. Sibling painter recipe.
const BASE = { ink: '#2A2226', c1: '#C3845A', c4: '#E0483F', accent: '#F06A6A', edge: '#FFFFFF', shadow: '#2A1E1C', shine: '#FFFFFF' }
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
  const { out, form, fill, line } = painter(icon?.name || 'avatar-man-bald', BASE)
  const cy = 10.2
  fill(E(12, 22.5, 7.6, 0.9), 'shadow', 0.07, 'wm-shadow')
  fill(E(12, 22.5, 5.47, 0.65), 'shadow', 0.1, 'wm-shadow')
  // shoulders
  form('M3.6 22.6c0-3.8 2.5-5.6 5.7-5.8l2.7.45 2.7-.45c3.2.2 5.7 2 5.7 5.8z', 'c4')
  line('M6.9 19.3c.4 1.2 1 2.3 1.7 3.2M17.1 19.3c-.4 1.2-1 2.3-1.7 3.2', 'shadow', 0.55, 0.16)
  // neck with a soft shadow under the chin
  form('M10.1 13.6h3.8v3.7c0 .9-.85 1.6-1.9 1.6s-1.9-.7-1.9-1.6z', 'c1', 'wm-k', null)
  fill('M10.1 14.3h3.8v1.8c-1.2.65-2.6.65-3.8 0z', 'shadow', 0.22)
  // ears
  for (const x of [6.55, 17.45]) {
    form(E(x, cy + 1, 1, 1.45), 'c1', 'wm-k', 1)
    fill(E(x + (x < 12 ? 0.5 : -0.5), cy + 1.05, 0.42, 0.8), 'shadow', 0.16)
  }
  // round bald head
  form(E(12, cy, 5.6, 6), 'c1')
  fill(E(10.2, 5.9, 2.7, 1.55), 'shine', 0.3, 'wm-shine')
  fill(E(9.3, 5.5, 1.15, 0.65), 'shine', 0.45, 'wm-shine')
  // dot eyes, smile and cheeks
  for (const x of [9.8, 14.2]) {
    fill(E(x, cy + 1.2, 0.62, 0.8), 'ink')
    fill(E(x + 0.2, cy + 0.9, 0.23), 'shine', 0.95, 'wm-shine')
  }
  fill(E(8.1, cy + 3.1, 1, 0.6) + E(15.9, cy + 3.1, 1, 0.6), 'accent', 0.2)
  fill(`M10.4 ${r2(cy + 3.6)}q1.6 1.7 3.2 0q-1.6.6-3.2 0z`, 'ink', 0.85)
  return out
}
