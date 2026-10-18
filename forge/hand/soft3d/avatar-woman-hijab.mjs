// forge/hand/soft3d/avatar-woman-hijab.mjs: the common round hood with a centred smiling face (as the line avatar): a rounded teal
// hijab that drapes a little wider at the bottom, an oval face in its opening with the inner rim in shade, and the scarf's
// diagonal fold as a darker band across the lower right. Same painter recipe as the sibling soft3d avatars.
const r2 = s => s.replace(/(\d+\.\d{2})\d+/g, '$1')
const E = (cx, cy, rx, ry = rx) => r2(`M${cx - rx} ${cy}a${rx} ${ry} 0 1 0 ${2 * rx} 0a${rx} ${ry} 0 1 0 ${-2 * rx} 0z`)
const BASE = { ink: '#2A2226', c1: '#D9A07A', c2: '#22A495', c3: '#16786D', accent: '#F06A6A', shadow: '#2A1E1C', shine: '#FFFFFF' }
const N = 'avatar-woman-hijab'
const col = r => `var(--with-soft3d-${r}, ${BASE[r]})`
const id = k => `wg-soft3d-${N}-${k}`
const stop = (o, r, op) => ['stop', { offset: o, 'stop-color': col(r), 'stop-opacity': op }]
// the hood: a round head that drapes a little wider toward the shoulders and ends in a soft, slightly rounded hem
const HOOD = 'M4.6 20.6C4.7 18.6 5.4 17.2 6.5 16.1C4.9 14.5 4 12.6 4 10.3C4 5.8 7.4 2.6 12 2.6S20 5.8 20 10.3C20 12.6 19.1 14.5 17.5 16.1C18.6 17.2 19.3 18.6 19.4 20.6C19.4 21.4 18.7 21.7 18 21.7H6C5.3 21.7 4.6 21.4 4.6 20.6Z'
// the face opening (an oval) and the scarf's diagonal fold across the lower right
const FACE = 'M7.2 10.6C7.2 7.7 9.2 6 12 6S16.8 7.7 16.8 10.6C16.8 13.9 14.7 16.5 12 16.5S7.2 13.9 7.2 10.6Z'
const FOLD = 'M17.6 16C17.9 17.6 17.4 19.3 15.4 20.3C13.2 21.4 10.6 21.7 8.6 21.7H6C5.9 21.1 6.1 20.6 6.5 20.2C9.6 20.2 12.6 19.6 14.6 17.9C15.6 17.1 16.4 16.6 17.6 16Z'

export default function render() {
  const out = []
  const P = (d, a, cls = 'wm-k') => out.push(['path', { d, ...a, class: cls }])
  const form = (d, role, cls = 'wm-k', g = 0) => { P(d, { fill: col(role) }, cls); P(d, { fill: `url(#${id(g)})` }, cls) }
  const fill = (d, role, op = 1, cls = 'wm-k') => P(d, op === 1 ? { fill: col(role) } : { fill: col(role), 'fill-opacity': op }, cls)
  const line = (d, role, w, op = 1, cls = 'wm-k') => P(d, { fill: 'none', stroke: col(role), 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', ...(op === 1 ? {} : { 'stroke-opacity': op }) }, cls)

  fill(E(12, 22.4, 6.4, 0.9), 'shadow', 0.07, 'wm-shadow'); fill(E(12, 22.4, 4.6, 0.65), 'shadow', 0.1, 'wm-shadow')
  const defs = ['defs', {}, [
    ['radialGradient', { id: id(0), cx: 0.36, cy: 0.3, r: 0.8 }, [stop(0, 'shine', 0.5), stop(0.36, 'shine', 0.06), stop(0.66, 'shadow', 0), stop(1, 'shadow', 0.3)]],
    ['radialGradient', { id: id(1), cx: 0.38, cy: 0.28, r: 0.85 }, [stop(0, 'shine', 0.3), stop(0.45, 'shine', 0), stop(0.75, 'shadow', 0), stop(1, 'shadow', 0.2)]],
  ]]
  form(HOOD, 'c2', 'wm-a')
  // the inner rim: the face sits a little below the hood's edge, in shade at the top
  fill(FACE.replace(/(\d+\.?\d*) (\d+\.?\d*)/g, (m, x, y) => `${x} ${+y - 0.35}`).replace(/\.\d{3,}/g, ''), 'shadow', 0.38, 'wm-a')
  form(FACE, 'c1', 'wm-k', 1)
  // blush, eyes with a catch light, a little smile
  fill(E(9.1, 13.1, 1.1, 0.7) + E(14.9, 13.1, 1.1, 0.7), 'accent', 0.22)
  for (const x of [9.9, 14.1]) {
    fill(E(x, 10.9, 0.62, 0.82), 'ink')
    fill(E(x - 0.2, 10.6, 0.22), 'shine', 0.95, 'wm-shine')
  }
  line('M10.5 13.9C11.3 14.7 12.7 14.7 13.5 13.9', 'ink', 0.7, 0.9)
  // the diagonal fold, darker, over the hood
  form(FOLD, 'c3', 'wm-a', 1)
  line('M17.3 16.6C16.6 17.6 15.5 18.5 13.9 19.3', 'shine', 0.55, 0.3, 'wm-shine')
  // hood highlight
  line('M5.7 9.2C6.1 6.9 8 4.8 10.6 4.2', 'shine', 0.7, 0.42, 'wm-shine')
  return [defs, ...out]
}
