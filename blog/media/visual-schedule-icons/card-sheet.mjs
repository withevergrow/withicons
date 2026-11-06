import { at, icon, C, rgba, INK } from '../../tools/hero-kit.mjs'

// A landscape US Letter sheet seen from above, laid out as twelve 2.5 inch schedule cards (4 x 3), one duo icon and
// one bold word each, with dashed cut lines round every card. A dimension bracket beside the first row reads
// "2.5 in / 6.4 cm", and orange scissors sit on the cut line.
const PPI = 100, CELL = 2.5 * PPI // 250 px per card
const SW = 11 * PPI, SH = 8.5 * PPI, SX = 100, SY = 75 // the sheet
const GX = SX + (SW - 4 * CELL) / 2, GY = SY + (SH - 3 * CELL) / 2 // the grid
const O = C.solid.c
const CARDS = [
  ['alarm-clock', 'Wake up'], ['tooth', 'Brush teeth'], ['shirt', 'Get dressed'], ['utensils', 'Breakfast'],
  ['bus', 'Bus'], ['users', 'Circle time'], ['book-open', 'Reading'], ['pencil', 'Writing'],
  ['person-running', 'PE'], ['sandwich', 'Lunch'], ['armchair', 'Calm corner'], ['home', 'Home'],
]

export default {
  alt: 'A printable landscape sheet of twelve square visual schedule cards in a four by three grid, each with a violet duo icon and a bold label from Wake up to Home, dashed cut lines round every card and a bracket showing each card is 2.5 in or 6.4 cm',
  bg: `radial-gradient(${rgba(C.duo.c, 0.12)} 2px, transparent 2.5px) 0 0 / 34px 34px, linear-gradient(160deg, #F4F1FF, #ECE6FF)`,
  art: () => [
    at(`<div class="sheet"></div>`, { x: SX, y: SY, w: SW, h: SH }),
    ...CARDS.map(([n, label], i) => at(`<div class="cell"><div class="sc">${icon(n, 'duo', 112, C.duo.text)}<b>${label}</b></div></div>`, { x: GX + (i % 4) * CELL, y: GY + Math.floor(i / 4) * CELL, w: CELL, h: CELL })),
    // scissors on the cut line between the first two columns, below the grid
    at(icon('scissors', 'solid', 56, O), { cx: GX + CELL, cy: GY + 3 * CELL + 24, rot: -90 }),
    // dimension bracket beside the first row
    at(`<svg width="60" height="${CELL}" viewBox="0 0 60 ${CELL}" fill="none"><path d="M10 2 H50 M30 2 V${CELL - 2} M10 ${CELL - 2} H50" stroke="${O}" stroke-width="4" stroke-linecap="round"/>${Array.from({ length: 11 }, (_, i) => `<path d="M30 ${2 + i * (CELL - 4) / 10} h${i % 5 === 0 ? 0 : 10}" stroke="${O}" stroke-width="3" stroke-linecap="round"/>`).join('')}</svg>`, { x: SX + SW + 28, y: GY }),
    at(`<div class="dim"><b>2.5 in</b><span>6.4 cm</span></div>`, { x: SX + SW + 96, y: GY + CELL / 2 - 46 }),
    at(`<div class="note">${icon('printer', 'line', 40, INK)}<span>Letter or A4</span></div>`, { x: SX + SW + 34, y: GY + 2 * CELL + 70 }),
  ].join(''),
  css: `
.sheet { height: 100%; border-radius: 6px; background: #fff; box-shadow: 0 2px 0 rgba(17,19,24,.05), 0 50px 90px -40px rgba(60,40,140,.5); }
.cell { box-sizing: border-box; height: 100%; padding: 10px; border: 2.5px dashed ${rgba(INK, 0.28)}; margin: -1.25px; }
.sc { box-sizing: border-box; height: 100%; border-radius: 26px; background: ${C.duo.soft}; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 16px; }
.sc b { font: 800 30px/1 var(--font-display); letter-spacing: -.02em; color: ${INK}; white-space: nowrap; }
.dim { display: flex; flex-direction: column; gap: 10px; }
.dim b { font: 800 44px/1 var(--font-display); color: ${C.solid.text}; letter-spacing: -.02em; white-space: nowrap; }
.dim span { font: 700 34px/1 var(--font-display); color: #5A606D; white-space: nowrap; }
.note { display: flex; flex-direction: column; gap: 10px; font: 700 30px/1.1 var(--font-display); color: #3E424D; width: 200px; }
`,
}
