// forge/hand/soft3d/avatar-unicorn.mjs: hand-drawn soft 3D avatar-unicorn to the redesigned skeleton (role fill plus volume overlay, sibling painter recipe).
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
  const form = (d, role, cls = 'wm-k', g = 0) => { P(d, { fill: col(role) }, cls); P(d, { fill: `url(#${id(g)})` }, cls) }
  const fill = (d, role, op = 1, cls = 'wm-k') => P(d, op === 1 ? { fill: col(role) } : { fill: col(role), 'fill-opacity': op }, cls)
  const line = (d, role, w, op = 1, cls = 'wm-k') => P(d, { fill: 'none', stroke: col(role), 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', ...(op === 1 ? {} : { 'stroke-opacity': op }) }, cls)
  const shadow = (cx, w) => { fill(E(cx, 22.4, w, 0.9), 'shadow', 0.07, 'wm-shadow'); fill(E(cx, 22.4, w * 0.72, 0.65), 'shadow', 0.1, 'wm-shadow') }
  return { out, form, fill, line, shadow }
}

export default function render(icon) {
  const { out, form, fill, line, shadow } = painter(icon?.name || 'avatar-unicorn', { ink: '#262A33', c1: '#F4F4F6', c2: '#C7A8F2', c3: '#F27BA5', c4: '#F2C14E', accent: '#F36F7F', shadow: '#22202A', shine: '#FFFFFF' })
  shadow(13, 7)
  form('M15 5.75C18.25 5.5 20.25 7.75 19.75 10.75 19.5 12.75 21 14 21.25 16.25 21.5 18.5 20.25 20.25 19.25 21.5H16.2L16.4 9z', 'c2', 'wm-a')
  line('M18.2 8.3c.6 1.3.2 2.6.5 3.9M19.4 15c.4 1.5.1 3-.6 4.4', 'c3', 0.6, 0.7, 'wm-a')
  form('M10.5 21.5C10.5 19.25 9.75 17.75 8.5 16.75 7 17 5.25 16.75 4.25 16 3.25 15.25 3.25 13.75 4 12.75L7.75 8.25C9.25 6.75 11.25 6 13.25 6.25 15.75 6.75 17 8.75 17 11.5 17 15 16 18.5 16.5 21.5z', 'c1')
  form('M12.75 6.4L14.25 2.75L15.9 7.6z', 'c1', 'wm-k', 1)
  fill('M13.6 6.4L14.3 4.5L15.1 6.9z', 'c3', 0.6)
  form('M8.25 7.6L5 1.75L10.75 6.4z', 'c4', 'wm-a', 1)
  line('M6.4 4.4L8 3.9M7.4 5.9L9.4 5.1', 'accent', 0.45, 0.6, 'wm-a')
  form('M15 5.9c-1.6.2-2.4 1.4-2.2 2.9 1-.9 2.3-1.3 3.4-1z', 'c2', 'wm-a')
  fill(E(10.35, 10.9, 0.7, 0.85), 'ink')
  fill(E(10.15, 10.6, 0.24), 'shine', 0.95, 'wm-shine')
  line('M10.9 10.1L11.6 9.5M10.4 9.95L10.6 9.2', 'ink', 0.4)
  fill(E(5.4, 14.2, 0.35, 0.45), 'ink', 0.8)
  fill(E(7.8, 13.6, 0.9, 0.55), 'accent', 0.22)
  line('M5.3 16q1 .45 2 .2', 'ink', 0.4, 0.6)
  fill(E(9.6, 8.6, 1.4, 0.7), 'shine', 0.4, 'wm-shine')
  return out
}
