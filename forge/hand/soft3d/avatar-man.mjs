// forge/hand/soft3d/avatar-man.mjs: the redesigned man (forge/icons/avatar-man.json) as a soft 3D bust: a taller oval
// face on a neck and broad shoulders, the skeleton's side-swept hair (volume high on the right, swooping down to the
// left temple with a clear part), straight brows and a calm smile, in a blue shirt with a white collar. The tall
// head, neck and wide shoulders separate him from avatar-boy at 16px. Same painter recipe as the generated characters.
const BASE = { ink: '#2A2226', c1: '#F7D7BE', c2: '#43291D', c3: '#2A1A11', c4: '#3F7FE0', accent: '#F06A6A', edge: '#FFFFFF', shadow: '#2A1E1C', shine: '#FFFFFF' }
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
// a face with a gently tapered chin
const FACE = (cx, cy, rx, ryT, ryB) => {
  const k = 0.552
  return `M${r2(cx - rx)} ${r2(cy)}C${r2(cx - rx)} ${r2(cy - k * ryT)} ${r2(cx - k * rx)} ${r2(cy - ryT)} ${r2(cx)} ${r2(cy - ryT)}S${r2(cx + rx)} ${r2(cy - k * ryT)} ${r2(cx + rx)} ${r2(cy)}C${r2(cx + rx)} ${r2(cy + 0.6 * ryB)} ${r2(cx + 0.48 * rx)} ${r2(cy + ryB)} ${r2(cx)} ${r2(cy + ryB)}S${r2(cx - rx)} ${r2(cy + 0.6 * ryB)} ${r2(cx - rx)} ${r2(cy)}z`
}

export default function render(icon) {
  const name = icon?.name || 'avatar-man'
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

  const cy = 10.3
  // contact shadow
  fill(E(12.3, 22.5, 7.6, 0.9), 'shadow', 0.07, 'wm-shadow')
  fill(E(12.3, 22.5, 5.47, 0.65), 'shadow', 0.1, 'wm-shadow')
  // broad shoulders in a blue shirt
  form('M3.6 22.6c0-3.8 2.5-5.6 5.7-5.8l2.7.45 2.7-.45c3.2.2 5.7 2 5.7 5.8z', 'c4')
  line('M6.9 19.3c.4 1.2 1 2.3 1.7 3.2M17.1 19.3c-.4 1.2-1 2.3-1.7 3.2', 'shadow', 0.55, 0.16)
  // neck
  form('M10.15 13.6h3.7v3.6c0 .9-.8 1.6-1.85 1.6s-1.85-.7-1.85-1.6z', 'c1', 'wm-k', null)
  fill('M10.15 14.4h3.7v1.8c-1.15.65-2.55.65-3.7 0z', 'shadow', 0.22)
  // white shirt collar points either side of the neck
  form('M9.4 16.9L12 18.9L10.75 20.15C10.05 19.3 9.55 18.2 9.4 16.9Z', 'edge', 'wm-k', 1)
  form('M14.6 16.9L12 18.9L13.25 20.15C13.95 19.3 14.45 18.2 14.6 16.9Z', 'edge', 'wm-k', 1)
  // ears
  for (const x of [7.3, 16.7]) { form(E(x, cy + 0.8, 0.9, 1.3), 'c1', 'wm-k', 1); fill(E(x + (x < 12 ? 0.48 : -0.48), cy + 0.9, 0.4, 0.7), 'shadow', 0.16) }
  // a taller oval face
  form(FACE(12, cy, 4.75, 5.15, 5.25), 'c1')
  fill(E(10.1, cy + 1.2, 1.6, 1.3), 'shine', 0.12, 'wm-shine')
  // eyes and straight, slightly heavier brows
  for (const x of [10.05, 13.95]) {
    fill(E(x, cy + 0.65, 0.58, 0.74), 'ink')
    fill(E(x + 0.19, cy + 0.38, 0.21), 'shine', 0.95, 'wm-shine')
    line(`M${r2(x - 0.9)} ${r2(cy - 0.75)}q.9-.3 1.8 0`, 'c2', 0.62, 0.95)
  }
  // nose
  line(`M11.6 ${r2(cy + 2.3)}q.4.4.8 0`, 'shadow', 0.42, 0.3)
  fill(E(12, cy + 1.55, 0.3, 0.4), 'shine', 0.3, 'wm-shine')
  // calm open smile
  fill(`M10.75 ${r2(cy + 3.35)}q1.25 1.25 2.5 0q-1.25.42-2.5 0z`, 'ink', 0.85)
  // faint blush
  fill(E(8.6, cy + 2.2, 0.95, 0.55), 'accent', 0.16)
  fill(E(15.4, cy + 2.2, 0.95, 0.55), 'accent', 0.16)
  // side-swept hair (skeleton A plate mapped onto the head)
  const hair = tf('M6.5 10.5 C5.75 6.25 8 3.25 11.5 3 C13.5 2.25 16 2.25 17 3.75 C17.75 5.25 18 7.75 17.5 10.5 C17.25 9.5 16.75 8.5 16 8 C13.5 8 11 7.25 9.5 5.5 C8.5 7 7.25 8.5 6.5 10.5 Z', 0.86, 0.88, 12, 10.5, 12, cy + 0.35)
  form(hair, 'c2', 'wm-a')
  // the part and a combed strand, plus a soft shine
  line('M10.1 5.25c1.1 1.2 2.7 1.8 4.6 2', 'shadow', 0.38, 0.28, 'wm-a')
  line('M12.3 3.55c1.3-.4 2.6-.35 3.4.5', 'shine', 0.6, 0.34, 'wm-shine')
  return out
}
