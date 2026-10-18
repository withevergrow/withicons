// forge/hand/soft3d/avatar-owl.mjs: soft 3D owl head to the line design: a round, cat-eared head, two cream ring eyes with
// dark pupils and a small orange beak, plus a pale chest patch. Sibling painter recipe.
const BASE = { ink: '#2A2226', c1: '#8A5A3A', c2: '#F5A33A', c3: '#F7E7C8', c4: '#C99763', accent: '#F06A6A', shadow: '#2A1E1C', shine: '#FFFFFF' }
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
  const { out, form, fill, line } = painter(icon?.name || 'avatar-owl', BASE)
  fill(E(12, 22.3, 7.6, 0.9), 'shadow', 0.07, 'wm-shadow')
  fill(E(12, 22.3, 5.47, 0.65), 'shadow', 0.1, 'wm-shadow')
  // round head with two cat ears
  form('M4.9 8.4C4.5 6.3 4.3 4.6 4.5 3.7c.1-.5.6-.6 1-.4L8.6 5.2C9.6 4.9 10.8 4.8 12 4.8s2.4.1 3.4.4l3.1-1.9c.4-.2.9-.1 1 .4.2.9 0 2.6-.4 4.7 1 1.5 1.4 3.2 1.4 5 0 5-3.8 8.6-8.5 8.6S3.5 17.8 3.5 12.8c0-1.8.4-3.5 1.4-4.4z', 'c1')
  // inner ears
  fill('M5.5 6.6c-.1-.9-.1-1.6 0-2.1l2 1.2C6.7 6 6 6.2 5.5 6.6zM18.5 6.6c.1-.9.1-1.6 0-2.1l-2 1.2c.8.3 1.5.5 2 .9z', 'c4', 0.7)
  // pale chest patch with a few feather chevrons
  fill(E(12, 18.1, 4.3, 2.6), 'c4', 0.55)
  line('M9.6 17.6l1 .8 1-.8M12.4 17.6l1 .8 1-.8M11 19.4l1 .8 1-.8', 'c1', 0.5, 0.55)
  // ring eyes
  for (const x of [8.7, 15.3]) {
    form(E(x, 11.4, 3, 3), 'c3', 'wm-k', 1)
    line(`M${r2(x - 3)} 11.4a3 3 0 0 1 6 0`, 'shadow', 0.5, 0.18)
    fill(E(x, 11.5, 1.55, 1.7), 'ink')
    fill(E(x + 0.5, 10.8, 0.5), 'shine', 0.95, 'wm-shine')
  }
  // beak
  form('M10.9 14.7h2.2c.4 0 .6.4.4.7l-1.2 1.7c-.15.2-.45.2-.6 0l-1.2-1.7c-.2-.3 0-.7.4-.7z', 'c2', 'wm-a', 1)
  // soft head shine
  line('M6.2 8.2C7.3 6.8 8.8 6 10.5 5.8', 'shine', 0.65, 0.3, 'wm-shine')
  return out
}
