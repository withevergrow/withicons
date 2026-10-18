// forge/hand/soft3d/avatar-monster-fluffy.mjs: the redesigned fluffy monster (forge/icons/avatar-monster-fluffy.json)
// as a soft 3D furball: a dome with a ragged, shaggy hem and fur tufts at the crown and sides, two big white eyes,
// and a wide dark grin with two white fangs and a tongue. The open fanged mouth and white-eyed stare are what
// separate it from the sun and flower badges. Same painter recipe as the generated characters.
const BASE = { ink: '#262A33', c1: '#2FB3A3', c2: '#1E8C80', c3: '#F4F4F6', c4: '#F2C14E', accent: '#F36F7F', edge: '#FFFFFF', shadow: '#22202A', shine: '#FFFFFF' }
const r2 = v => +(+v).toFixed(2)
const E = (cx, cy, rx, ry = rx) => `M${r2(cx - rx)} ${r2(cy)}a${r2(rx)} ${r2(ry)} 0 1 0 ${r2(2 * rx)} 0a${r2(rx)} ${r2(ry)} 0 1 0 ${r2(-2 * rx)} 0z`

export default function render(icon) {
  const name = icon?.name || 'avatar-monster-fluffy'
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

  // contact shadow
  fill(E(12, 22.3, 7.6, 0.85), 'shadow', 0.07, 'wm-shadow')
  fill(E(12, 22.3, 5.4, 0.6), 'shadow', 0.1, 'wm-shadow')
  // shaggy body: the skeleton's dome with a crown tuft and a ragged fur hem, tips softened
  form('M4.5 11C4.5 7.5 7 5.3 10 4.8L10.6 3.05Q10.75 2.7 11 3L12 4.45L13 3Q13.25 2.7 13.4 3.05L14 4.8C17 5.3 19.5 7.5 19.5 11L21.25 12.5Q21.5 12.75 21.25 12.95L19.55 14.45L21.05 16.5Q21.2 16.8 20.95 16.95L19.6 17.75L20.6 19.95Q20.7 20.3 20.35 20.2L18.75 19.6L17.5 21.2Q17.25 21.5 17 21.25L15.5 19.6L14 21.05Q13.75 21.3 13.5 21.05L12 19.8L10.5 21.25Q10.25 21.5 10 21.2L8.5 19.6L7 21.05Q6.75 21.3 6.5 21.05L5.25 19.6L3.65 20.2Q3.3 20.3 3.4 19.95L4.4 17.75L3.05 16.85Q2.8 16.65 3 16.4L4.45 14.45L2.75 13.4Q2.5 13.2 2.75 13Z', 'c1')
  // fur flicks for texture
  line('M6.3 15.6l.7.9M17.7 15.6l-.7.9M7.1 18.3l.55.85M16.9 18.3l-.55.85M12 19.1v-.9', 'c2', 0.45, 0.7)
  line('M7.3 7.9c.7-1.05 1.75-1.8 3-2.1', 'shine', 0.6, 0.42, 'wm-shine')
  // two big white eyes with glossy pupils (wm-a: they blink)
  for (const x of [9.4, 14.6]) {
    form(E(x, 9.85, 1.65, 1.8), 'c3', 'wm-a', 1)
    fill(E(x + 0.3, 10.2, 0.92, 1.02), 'ink', 1, 'wm-a')
    fill(E(x + 0.05, 9.75, 0.34), 'shine', 0.95, 'wm-shine')
  }
  // wide grin, tongue and two big white fangs
  fill('M7.8 13.1C10.4 14.5 13.6 14.5 16.2 13.1C15.85 16.1 14.1 17.6 12 17.6S8.15 16.1 7.8 13.1Z', 'ink', 0.88)
  fill(E(12, 16.75, 1.5, 0.62), 'accent', 0.85)
  fill('M8.75 13.7L9.85 16.35L10.95 14.15ZM13.05 14.15L14.15 16.35L15.25 13.7Z', 'edge')
  // blush
  fill(E(6.6, 12.9, 0.95, 0.56), 'accent', 0.24)
  fill(E(17.4, 12.9, 0.95, 0.56), 'accent', 0.24)
  return out
}
