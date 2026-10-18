// forge/hand/soft3d/avatar-boy.mjs: the redesigned boy (forge/icons/avatar-boy.json) as a soft 3D bust: a small
// round head sitting low on narrow shoulders, a tousled mop of hair with the skeleton's cowlick tuft flicking up at
// the crown, big glossy eyes and a wide open grin, in a yellow crew-neck tee. The smaller, rounder head, short neck
// and narrow shoulders keep him apart from avatar-man at 16px. Same painter recipe as the generated characters.
const BASE = { ink: '#2A2226', c1: '#A0673F', c2: '#2A2120', c3: '#4C2D18', c4: '#F4BE36', accent: '#F06A6A', edge: '#FFFFFF', shadow: '#2A1E1C', shine: '#FFFFFF' }
const r2 = v => +(+v).toFixed(2)
const E = (cx, cy, rx, ry = rx) => `M${r2(cx - rx)} ${r2(cy)}a${r2(rx)} ${r2(ry)} 0 1 0 ${r2(2 * rx)} 0a${r2(rx)} ${r2(ry)} 0 1 0 ${r2(-2 * rx)} 0z`
// map an absolute skeleton path into this drawing's frame
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
  const name = icon?.name || 'avatar-boy'
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

  const cy = 11.9
  // contact shadow
  fill(E(12, 22.5, 6.6, 0.85), 'shadow', 0.07, 'wm-shadow')
  fill(E(12, 22.5, 4.7, 0.6), 'shadow', 0.1, 'wm-shadow')
  // narrow shoulders in a crew-neck tee
  form('M5.7 22.6c0-3.3 2-4.8 4.4-5l1.9.4 1.9-.4c2.4.2 4.4 1.7 4.4 5z', 'c4')
  line('M7.9 20.2c.3.9.7 1.7 1.2 2.3M16.1 20.2c-.3.9-.7 1.7-1.2 2.3', 'shadow', 0.5, 0.16)
  // short neck and a collar band
  form('M10.6 15.4h2.8v2.7c0 .7-.6 1.2-1.4 1.2s-1.4-.5-1.4-1.2z', 'c1', 'wm-k', null)
  fill('M10.6 15.9h2.8v1.5c-.9.5-1.9.5-2.8 0z', 'shadow', 0.22)
  line('M9.9 17.8c.6.8 1.3 1.2 2.1 1.2s1.5-.4 2.1-1.2', 'shadow', 0.6, 0.22)
  // ears
  for (const x of [7.15, 16.85]) { form(E(x, cy + 0.4, 0.85, 1.15), 'c1', 'wm-k', 1); fill(E(x + (x < 12 ? 0.45 : -0.45), cy + 0.5, 0.36, 0.62), 'shadow', 0.16) }
  // a small round face
  form(E(12, cy, 4.85, 4.75), 'c1')
  fill(E(10.1, cy + 0.6, 1.5, 1.2), 'shine', 0.12, 'wm-shine')
  // blush
  fill(E(9.05, cy + 1.75, 0.95, 0.6), 'accent', 0.24)
  fill(E(14.95, cy + 1.75, 0.95, 0.6), 'accent', 0.24)
  // big eyes and light brows
  for (const x of [10.05, 13.95]) {
    fill(E(x, cy + 0.1, 0.66, 0.86), 'ink')
    fill(E(x + 0.2, cy - 0.2, 0.24), 'shine', 0.95, 'wm-shine')
    line(`M${r2(x - 0.8)} ${r2(cy - 1.45)}q.8-.45 1.6 0`, 'c2', 0.48, 0.95)
  }
  // button nose
  line(`M11.6 ${r2(cy + 1.75)}q.4.35.8 0`, 'shadow', 0.4, 0.28)
  // wide open grin with tongue
  fill(`M10.15 ${r2(cy + 2.6)}q1.85 2.1 3.7 0q-1.85.6-3.7 0z`, 'ink', 0.88)
  fill(`M11.1 ${r2(cy + 3.35)}q.9.5 1.8 0q-.9-.25-1.8 0z`, 'accent', 0.75)
  // tousled hair with the crown tuft (skeleton A plate, mapped onto the smaller head)
  const hair = tf('M5.75 11 C5 8.5 5.5 5.5 8.5 4.25 C8.75 3 9.75 2.25 11 2 C10.75 2.75 11 3.25 11.75 3.5 C12.75 2.5 14.5 2.25 16.5 2.25 C15.75 2.75 15.5 3.5 15.75 4.25 C17.75 5.25 19 8.25 18.25 11 C17.75 9.25 16.75 8 15.25 7.5 L13.75 8 C12.75 7 10.5 6.75 9 7.5 C7.5 8.25 6.25 9.25 5.75 11 Z', 0.8, 0.8, 12, 11, 12, cy + 0.15)
  form(hair, 'c2', 'wm-a')
  line('M9.2 6.1c.9-.6 2-.9 3.1-.8', 'shine', 0.55, 0.32, 'wm-shine')
  line('M12.9 8.15c.6-.5 1.3-.75 2-.75', 'shadow', 0.4, 0.3, 'wm-a')
  return out
}
