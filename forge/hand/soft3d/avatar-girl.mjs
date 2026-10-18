// forge/hand/soft3d/avatar-girl.mjs: the redesigned girl (forge/icons/avatar-girl.json) as a soft 3D bust: a small
// round face framed by long auburn hair with a centre part and swept fringe, the ends flaring out over narrow
// shoulders, a pink bow clipped at the temple, big lashed eyes and an open smile, in a pink top. The skeleton's hair
// plate already hugs the face, so the face stays fully visible. Same painter recipe as the generated characters.
const BASE = { ink: '#2A2226', c1: '#F7D7BE', c2: '#C8632E', c3: '#904721', c4: '#F27BA5', accent: '#F06A6A', edge: '#FFF8EE', shadow: '#2A1E1C', shine: '#FFFFFF' }
const r2 = v => +(+v).toFixed(2)
const E = (cx, cy, rx, ry = rx) => `M${r2(cx - rx)} ${r2(cy)}a${r2(rx)} ${r2(ry)} 0 1 0 ${r2(2 * rx)} 0a${r2(rx)} ${r2(ry)} 0 1 0 ${r2(-2 * rx)} 0z`
const tf = (d, sx, sy, x0, y0, x1, y1) => {
  const t = d.match(/[A-Za-z]|-?\d*\.?\d+/g); let out = '', c = '', i = 0
  const X = v => r2(x1 + (v - x0) * sx), Y = v => r2(y1 + (v - y0) * sy)
  while (i < t.length) {
    if (/[A-Za-z]/.test(t[i])) { c = t[i++]; out += c; if (c === 'Z') continue }
    if (c === 'H') out += X(+t[i++]) + ' '
    else if (c === 'V') out += Y(+t[i++]) + ' '
    else if (c === 'A') { const [rx, ry, rot, la, sw, x, y] = t.slice(i, i + 7).map(Number); i += 7; out += `${r2(rx * sx)} ${r2(ry * sy)} ${rot} ${la} ${sw} ${X(x)} ${Y(y)} ` }
    else { out += `${X(+t[i])} ${Y(+t[i + 1])} `; i += 2 }
  }
  return out.trim()
}

export default function render(icon) {
  const name = icon?.name || 'avatar-girl'
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

  const cy = 11.7, S = 0.8, SY = 0.82
  const map = d => tf(d, S, SY, 12, 11, 12, cy)
  // contact shadow
  fill(E(12, 22.5, 6.6, 0.85), 'shadow', 0.07, 'wm-shadow')
  fill(E(12, 22.5, 4.7, 0.6), 'shadow', 0.1, 'wm-shadow')
  // narrow shoulders in a pink top
  form('M5.8 22.6c0-3.2 2-4.7 4.3-4.9l1.9.4 1.9-.4c2.3.2 4.3 1.7 4.3 4.9z', 'c4')
  line('M9.9 17.85c.6.75 1.3 1.1 2.1 1.1s1.5-.35 2.1-1.1', 'edge', 0.6, 0.7)
  // short neck
  form('M10.7 15.3h2.6v2.6c0 .65-.55 1.15-1.3 1.15s-1.3-.5-1.3-1.15z', 'c1', 'wm-k', null)
  fill('M10.7 15.8h2.6v1.4c-.85.45-1.75.45-2.6 0z', 'shadow', 0.22)
  // round face (the skeleton's 6.25 head circle, mapped)
  form(E(12, cy, 6.25 * S, 6.25 * SY), 'c1')
  fill(E(10.1, cy + 0.8, 1.5, 1.2), 'shine', 0.12, 'wm-shine')
  // blush
  fill(E(9.0, cy + 1.75, 0.95, 0.6), 'accent', 0.26)
  fill(E(15.0, cy + 1.75, 0.95, 0.6), 'accent', 0.26)
  // big eyes with an outer lash flick, soft brows
  for (const x of [10.05, 13.95]) {
    const o = x < 12 ? -1 : 1
    fill(E(x, cy + 0.35, 0.64, 0.84), 'ink')
    fill(E(x + 0.2, cy + 0.05, 0.23), 'shine', 0.95, 'wm-shine')
    line(`M${r2(x + o * 0.45)} ${r2(cy - 0.3)}l${r2(o * 0.42)} -.32`, 'ink', 0.32)
    line(`M${r2(x - 0.78)} ${r2(cy - 1.15)}q.78-.42 1.56 0`, 'c3', 0.42, 0.9)
  }
  // nose
  line(`M11.65 ${r2(cy + 1.85)}q.35.3.7 0`, 'shadow', 0.38, 0.28)
  // open smile with tongue
  fill(`M10.55 ${r2(cy + 2.75)}q1.45 1.55 2.9 0q-1.45.5-2.9 0z`, 'ink', 0.85)
  fill(`M11.3 ${r2(cy + 3.3)}q.7.42 1.4 0q-.7-.18-1.4 0z`, 'accent', 0.7)
  // long hair with centre part and fringe (skeleton A plate, notched around the face)
  const hair = map('M12 3.5 C8 3.5 4.75 5.75 4.5 8.25 C4.5 9 4.75 9.5 5.5 10 C4.25 11 3.75 12.5 3.5 14 C3.25 15.75 3.25 17.5 3.75 19 C5 18.25 6.5 16.75 7.5 15.25 A6.25 6.25 0 0 1 5.75 11 C6.5 9 8 7.75 9.75 7.5 C10.75 7.25 11.5 7 12 6.5 C12.5 7 13.25 7.25 14.25 7.5 C16 7.75 17.5 9 18.25 11 A6.25 6.25 0 0 1 16.5 15.25 C17.5 16.75 19 18.25 20.25 19 C20.75 17.5 20.75 15.75 20.5 14 C20.25 12.5 19.75 11 18.5 10 C19.25 9.5 19.5 9 19.5 8.25 C19.25 5.75 16 3.5 12 3.5 Z')
  form(hair, 'c2', 'wm-a')
  // strands: the centre part and a lock line down each side
  line(`M12 ${r2(cy - 5.3)}V${r2(cy - 3.75)}`, 'c3', 0.42, 0.7, 'wm-a')
  line('M6.1 13.6c-.35 1.3-.4 2.5-.15 3.6M17.9 13.6c.35 1.3.4 2.5.15 3.6', 'c3', 0.4, 0.6, 'wm-a')
  line('M8.3 6.85c1-.7 2.1-1 3.1-1', 'shine', 0.55, 0.34, 'wm-shine')
  // pink bow clipped at the right temple
  form('M16.2 6.95L14.75 5.55C14.3 6.25 14.35 7.5 14.95 8.15Z', 'c4', 'wm-s', 1)
  form('M16.2 6.95L17.75 5.65C18.25 6.35 18.2 7.6 17.55 8.2Z', 'c4', 'wm-s', 1)
  form(E(16.2, 6.95, 0.62, 0.66), 'c4', 'wm-s', 1)
  fill(E(16.05, 6.75, 0.22), 'shine', 0.6, 'wm-shine')
  return out
}
