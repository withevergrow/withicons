import { at, icon, C, INK, PAPER, rgba } from '../../tools/hero-kit.mjs'

// One icon, annotated: the with icons calendar-clock line icon (it has the rule-made corner badge and the trimmed body
// the post describes) at 28x on a faint 24 px grid, with callouts to its padding, keyline, stroke, radius, badge and gap.
// Every callout point is in icon units (0..24) taken from forge/icons/calendar-clock.json.
const U = 28, GX = 464, GY = 164, S = 24 * U
const RED = '#EE4B57', V = C.duo.c
const P = (x, y) => [GX + x * U, GY + y * U]

const LEFT = [ // label, sub, icon-unit point, label y
  ['One stroke', 'round caps', [8, 3], 150],
  ['Radius 2', 'on the frame', [3.59, 5.59], 330],
  ['2 px padding', 'empty on every side', [1, 14.5], 510],
  ['Keyline', 'square 18', [3, 21], 690],
]
const RIGHT = [
  ['Trimmed back', '≥ 1.5 px from the badge', [21, 12.6], 250],
  ['Badge', 'r 4 at 17.5, 17.5', [20.3, 20.3], 560],
]
function lines() {
  let s = ''
  for (const [, , [x, y], ly] of LEFT) { const [px, py] = P(x, y); s += `<path d="M418 ${ly + 26} L${px} ${py}" stroke="${INK}" stroke-width="2.5"/><circle cx="${px}" cy="${py}" r="8" fill="${V}" stroke="#fff" stroke-width="3.5"/>` }
  for (const [, , [x, y], ly] of RIGHT) { const [px, py] = P(x, y); s += `<path d="M1182 ${ly + 26} L${px} ${py}" stroke="${INK}" stroke-width="2.5"/><circle cx="${px}" cy="${py}" r="8" fill="${V}" stroke="#fff" stroke-width="3.5"/>` }
  return s
}
function grid() {
  let g = `<rect x="${GX}" y="${GY}" width="${S}" height="${S}" fill="#fff"/>`
  g += `<path d="M${GX} ${GY}h${S}v${S}h${-S}Z M${GX + 2 * U} ${GY + 2 * U}v${20 * U}h${20 * U}v${-20 * U}Z" fill="${rgba(V, 0.12)}" fill-rule="evenodd"/>`
  for (let i = 0; i <= 24; i++) g += `<path d="M${GX + i * U} ${GY}V${GY + S}M${GX} ${GY + i * U}H${GX + S}" stroke="${rgba(INK, i % 12 === 0 ? 0.2 : 0.08)}"/>`
  g += `<rect x="${GX + 3 * U}" y="${GY + 3 * U}" width="${18 * U}" height="${18 * U}" fill="none" stroke="${RED}" stroke-width="3" stroke-dasharray="10 7"/>`
  // badge centre and radius
  const [bx, by] = P(17.5, 17.5)
  g += `<path d="M${bx - 14} ${by}h28M${bx} ${by - 14}v28" stroke="${V}" stroke-width="3"/><path d="M${bx} ${by} L${bx + 4 * U} ${by}" stroke="${V}" stroke-width="3" stroke-dasharray="6 6"/>`
  return g
}
const label = ([t, sub, , ly], side) => at(`<div class="cl is-${side}"><b>${t}</b><span>${sub}</span></div>`, side === 'l' ? { x: 70, y: ly, w: 340 } : { x: 1190, y: ly, w: 346 })

export default {
  alt: 'The calendar-clock line icon drawn large on a faint 24 pixel grid, with callouts for one stroke with round caps, radius 2 corners, the 2 pixel padding, the square 18 keyline, the radius 4 badge centred at 17.5, 17.5, and the body trimmed back from the badge',
  bg: `radial-gradient(120% 100% at 50% 0%, #FFFFFF 0%, ${PAPER} 75%)`,
  art: () => [
    at(`<svg width="1600" height="1000" viewBox="0 0 1600 1000" fill="none">${grid()}</svg>`, { x: 0, y: 0 }),
    at(icon('calendar-clock', 'line', S, rgba(INK, 0.9)), { x: GX, y: GY }),
    at(`<svg width="1600" height="1000" viewBox="0 0 1600 1000" fill="none">${lines()}</svg>`, { x: 0, y: 0 }),
    ...LEFT.map(l => label(l, 'l')), ...RIGHT.map(r => label(r, 'r')),
  ].join(''),
  css: `
.cl { display: flex; flex-direction: column; gap: 8px; font-family: var(--font-display); color: ${INK}; }
.cl.is-l { align-items: flex-end; text-align: right; }
.cl b { font-size: 36px; font-weight: 800; letter-spacing: -.02em; line-height: 1; }
.cl span { font: 500 28px/1.1 var(--font-mono); color: ${C.duo.text}; }
`,
}
