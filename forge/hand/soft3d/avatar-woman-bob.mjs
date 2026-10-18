// forge/hand/soft3d/avatar-woman-bob.mjs: soft 3D woman bust with a bob: a rounded cap of dark hair that falls to the jaw on
// both sides, a swept fringe, dot eyes and a smile, on curved shoulders in a coral top. Sibling painter recipe.
const BASE = { ink: '#2A2226', c1: '#B5764F', c2: '#2A2120', c4: '#F06B55', accent: '#F06A6A', edge: '#FFFFFF', shadow: '#2A1E1C', shine: '#FFFFFF' }
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
  const { out, form, fill, line } = painter(icon?.name || 'avatar-woman-bob', BASE)
  const cy = 10.8
  fill(E(12, 22.5, 7.6, 0.9), 'shadow', 0.07, 'wm-shadow')
  fill(E(12, 22.5, 5.47, 0.65), 'shadow', 0.1, 'wm-shadow')
  // back of the bob, behind the face and shoulders
  form('M6.1 15.4C4.7 11.6 4.8 7 7.7 4.6C10 2.7 14 2.7 16.3 4.6C19.2 7 19.3 11.6 17.9 15.4C17.6 16.4 16.2 16.6 15.5 15.7L8.5 15.7C7.8 16.6 6.4 16.4 6.1 15.4Z', 'c2', 'wm-a')
  // shoulders and neck
  form('M3.9 22.6c0-3.7 2.4-5.5 5.5-5.7l2.6.4 2.6-.4c3.1.2 5.5 2 5.5 5.7z', 'c4')
  line('M7 19.4c.4 1.1.9 2.2 1.6 3.1M17 19.4c-.4 1.1-.9 2.2-1.6 3.1', 'shadow', 0.55, 0.16)
  form('M10.2 14.5h3.6v2.8c0 .9-.8 1.6-1.8 1.6s-1.8-.7-1.8-1.6z', 'c1', 'wm-k', null)
  fill('M10.2 14.9h3.6v1.5c-1.1.6-2.5.6-3.6 0z', 'shadow', 0.24)
  // face
  form('M7.15 10.9C7.15 7.8 9.2 6.1 12 6.1s4.85 1.7 4.85 4.8c0 3.2-2.1 5-4.85 5s-4.85-1.8-4.85-5z', 'c1')
  fill(E(8.1, 13.6, 1, 0.58) + E(15.9, 13.6, 1, 0.58), 'accent', 0.22)
  for (const x of [9.9, 14.1]) {
    fill(E(x, 11.5, 0.62, 0.8), 'ink')
    fill(E(x + 0.2, 11.2, 0.23), 'shine', 0.95, 'wm-shine')
  }
  fill('M10.7 13.9q1.3 1.37 2.6 0q-1.3.49-2.6 0z', 'ink', 0.85)
  // cap of hair with a swept fringe
  form('M6.8 11.2C6.2 6.6 8.5 3.7 12 3.7s5.8 2.9 5.2 7.5C16.9 9.4 16.3 8.2 15.2 7.5C13.6 8.5 10.9 8.4 9.4 6.8C8.3 8.3 7.5 9.7 6.8 11.2Z', 'c2', 'wm-a')
  line('M8.6 6.1C9.7 4.9 11 4.5 12.6 4.6', 'shine', 0.65, 0.35, 'wm-shine')
  line('M5.9 9.2C5.8 11 6 12.6 6.5 14', 'shine', 0.5, 0.2, 'wm-shine')
  return out
}
