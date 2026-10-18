// forge/hand/soft3d/avatar-dino.mjs: the redesigned dino (forge/icons/avatar-dino.json) as a soft 3D rex in profile:
// a long green neck rising to a big round head facing right, jaws open on a dark mouth with a tongue and little white
// teeth, orange plates down the back, a pale belly strip and a glossy eye. The profile snout and back spikes give the
// unmistakable dinosaur silhouette the old front-facing blob lacked. Same painter recipe as the generated characters.
const BASE = { ink: '#262A33', c1: '#6CC26A', c2: '#F08A35', c3: '#9BD45B', c4: '#F28CA0', accent: '#F36F7F', edge: '#FFFFFF', shadow: '#22202A', shine: '#FFFFFF' }
const r2 = v => +(+v).toFixed(2)
const E = (cx, cy, rx, ry = rx) => `M${r2(cx - rx)} ${r2(cy)}a${r2(rx)} ${r2(ry)} 0 1 0 ${r2(2 * rx)} 0a${r2(rx)} ${r2(ry)} 0 1 0 ${r2(-2 * rx)} 0z`

export default function render(icon) {
  const name = icon?.name || 'avatar-dino'
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

  // contact shadow under the neck base
  fill(E(9.2, 22.3, 5.6, 0.85), 'shadow', 0.07, 'wm-shadow')
  fill(E(9.2, 22.3, 3.9, 0.6), 'shadow', 0.1, 'wm-shadow')
  // back plates (behind the body), rounded orange spikes
  form('M7.05 19.2L3.1 17.35Q2.85 17.1 3.15 16.95L6.75 15.4Z', 'c2', 'wm-a', 1)
  form('M7.75 13.75L4.1 12.15Q3.85 11.9 4.15 11.8L8.05 10.6Z', 'c2', 'wm-a', 1)
  form('M8.5 8.8L5.45 7.6Q5.2 7.35 5.5 7.25L9.1 6.35Z', 'c2', 'wm-a', 1)
  form('M10.6 4.1L9.85 1.65Q9.85 1.35 10.15 1.45L12.35 3Z', 'c2', 'wm-a', 1)
  // body: neck and head in one soft form, jaws open
  form('M5.75 21.6C6.2 18.2 6.95 14.6 7.55 11.2C7.95 8.6 8.3 6.8 8.7 5.7C9.45 3.75 11.15 2.75 13.1 2.75C14.35 2.75 15.3 3.05 16.05 3.8C16.5 4.25 17 4.3 17.7 4.3H19.75C20.75 4.3 21.5 5.05 21.5 6.05V6.3C21.5 6.95 21.05 7.4 20.4 7.5C20.4 10.3 18.9 12.5 16.9 13.5C16.1 13.9 15.6 15.75 14.55 15.75C12.55 15.75 11.05 16.55 11.05 18.3V21.6Z', 'c1')
  // pale belly strip down the front of the neck
  form('M11.05 21.6V18.3C11.05 16.55 12.55 15.75 14.55 15.75C15.3 15.75 16 15.7 16.65 15.55L16.4 14.85C14.6 15 12.85 14.9 11.4 15.75C10.2 16.5 9.6 17.6 9.6 19.1V21.6Z', 'c3', 'wm-k', 1)
  line('M9.75 18.4h1.45M9.85 20.2h1.3', 'shadow', 0.38, 0.14)
  // a friendly closed smile with an upturned corner, nostril and cheek blush
  line('M14.2 9.55C16.2 10.85 18.6 10.5 20.2 8.45M14.2 9.55l-.35-.55', 'ink', 0.7, 0.85)
  fill(E(20.15, 5.3, 0.3, 0.22), 'shadow', 0.5)
  fill(E(13.1, 8.2, 0.95, 0.55), 'accent', 0.24)
  // glossy eye and a soft brow ridge
  fill(E(14.9, 5.9, 0.8, 0.95), 'ink')
  fill(E(15.15, 5.55, 0.3), 'shine', 0.95, 'wm-shine')
  line('M13.9 4.45c.6-.35 1.3-.4 1.95-.1', 'shadow', 0.4, 0.3)
  // highlight along the crown
  line('M10 4.6c.7-.95 1.7-1.4 2.8-1.35', 'shine', 0.6, 0.42, 'wm-shine')
  return out
}
