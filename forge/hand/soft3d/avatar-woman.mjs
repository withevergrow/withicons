// forge/hand/soft3d/avatar-woman.mjs: the line avatar's bob (rounded head, jaw-length hair framing the face) on soft 3D shoulders in a coral top, painter recipe of the sibling avatars.
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
  const { out, form, fill, line, shadow } = painter(icon?.name || 'avatar-woman', { ink: '#2A2226', c1: '#F3C7A6', c2: '#5B3526', c3: '#3E241A', c4: '#EE6A5E', accent: '#F06A6A', shadow: '#2A1E1C', shine: '#FFFFFF' })
  shadow(12, 7.4)
  // shoulders in a coral top
  form('M3.6 22.6c0-3.7 2.5-5.5 5.7-5.7l2.7.5 2.7-.5c3.2.2 5.7 2 5.7 5.7z', 'c4')
  line('M6.9 19.4c.4 1.2 1 2.2 1.7 3.1M17.1 19.4c-.4 1.2-1 2.2-1.7 3.1', 'shadow', 0.55, 0.16)
  // back of the bob, rounded and jaw length
  form('M4.4 15.4C4.1 8 7.3 3.2 12 3.2s7.9 4.8 7.6 12.2c-.1 1.3-1 2.2-2.3 2.2H6.7c-1.3 0-2.2-.9-2.3-2.2z', 'c2', 'wm-a')
  // neck
  form('M10.2 14.4h3.6v3.1c0 .9-.8 1.6-1.8 1.6s-1.8-.7-1.8-1.6z', 'c1', 'wm-k', null)
  fill('M10.2 15.2h3.6v1.6c-1.1.6-2.5.6-3.6 0z', 'shadow', 0.22)
  // face
  form('M7.3 11.2C7.3 8.2 9.3 6.2 12 6.2s4.7 2 4.7 5c0 3.6-1.9 6.1-4.7 6.1s-4.7-2.5-4.7-6.1z', 'c1')
  fill(E(10, 12.9, 1.5, 1.2), 'shine', 0.12, 'wm-shine')
  for (const x of [10.1, 13.9]) {
    fill(E(x, 11.6, 0.58, 0.76), 'ink')
    fill(E(x + 0.19, 11.3, 0.21), 'shine', 0.95, 'wm-shine')
    line(`M${x - 0.75} 10.1q.75-.4 1.5 0`, 'c3', 0.5, 0.7)
  }
  fill(E(8.8, 13.6, 0.95, 0.55) + E(15.2, 13.6, 0.95, 0.55), 'accent', 0.2)
  fill('M10.8 14.7q1.2 1.2 2.4 0q-1.2.4-2.4 0z', 'ink', 0.85)
  // bob fringe swept to one side, with the two side locks framing the face
  form('M6.8 12.2C6.2 7.2 8.5 4.3 12 4.3s5.8 2.9 5.2 7.9c-.4-1.6-1.2-2.7-2.6-3.3-1.7-.6-3-1.5-3.6-2.8-.6 1.8-2.3 3.1-4.4 3.3-.8.4-1.3 1.2-1.8 2.8z', 'c2', 'wm-a')
  form('M6.2 11.8c-.4 2.2-.4 4.2-.1 5.8h2c-.8-1.7-1.1-3.8-.9-6.2z', 'c2', 'wm-a', null)
  form('M17.8 11.8c.4 2.2.4 4.2.1 5.8h-2c.8-1.7 1.1-3.8.9-6.2z', 'c2', 'wm-a', null)
  line('M8.4 8.4c1.1-1 2.6-1.5 4.1-1.4', 'shine', 0.6, 0.3, 'wm-shine')
  return out
}
