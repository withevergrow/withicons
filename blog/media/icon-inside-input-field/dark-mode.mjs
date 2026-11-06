import { at, icon, INK, rgba } from '../../tools/hero-kit.mjs'
import { CYAN, BG, CSS, badge } from './_kit.mjs'

// A two-by-two grid. Columns: the icon as a background-image, and the icon as inline SVG with currentColor. Rows:
// light theme and dark theme. In the dark row the background-image icon keeps its fixed dark grey and nearly vanishes
// (red cross); the inline SVG follows the text colour and stays clear (green tick).
const COLS = [['background-image', 525], ['inline SVG + <em>currentColor</em>', 1180]] // label, cell centre x
const ROWS = [['light', 320], ['dark', 690]] // label, cell centre y
const CW = 620, CH = 320

const cell = (dark, inline) => {
  const iconColor = inline ? (dark ? '#E7EAF0' : '#4B5563') : '#363C48'
  return `<div class="cell${dark ? ' is-dark' : ''}"><div class="fld">${icon('search', 'line', 54, iconColor)}<span>Search icons</span></div></div>`
}

export default {
  alt: 'A two by two grid of the same search field with the with icons search icon: as a background-image and as inline SVG with currentColor, in a light and a dark theme. In dark mode the background-image icon is dark grey and barely visible, marked with a cross, while the inline SVG icon is light and clear, marked with a tick',
  bg: BG,
  art: () => [
    ...COLS.map(([t, x]) => at(`<span class="k-lbl">${t}</span>`, { cx: x, cy: 112 })),
    ...ROWS.map(([t, y]) => at(`<span class="k-lbl rl">${t}</span>`, { cx: 130, cy: y })),
    ...ROWS.flatMap(([, y], r) => COLS.map(([, x], c) => at(cell(r === 1, c === 1), { cx: x, cy: y, w: CW, h: CH }))),
    at(badge(false), { cx: COLS[0][1] + CW / 2 - 36, cy: ROWS[1][1] - CH / 2 + 36, z: 3 }),
    at(badge(true), { cx: COLS[1][1] + CW / 2 - 36, cy: ROWS[1][1] - CH / 2 + 36, z: 3 }),
  ].join(''),
  css: `${CSS}
.rl { font-size: 30px; color: ${CYAN}; }
.cell { box-sizing: border-box; width: 100%; height: 100%; display: grid; place-items: center; border-radius: 36px; background: #F4F6F9; border: 2px solid ${rgba('#ffffff', 0.5)}; box-shadow: 0 40px 80px -40px rgba(0,0,0,.7); }
.cell.is-dark { background: #0B0D12; border-color: ${rgba('#ffffff', 0.14)}; }
.fld { box-sizing: border-box; width: 500px; height: 100px; display: flex; align-items: center; gap: 18px; padding: 0 30px; border-radius: 999px; background: #fff; border: 3px solid #D5DAE2; }
.fld > span:last-child { font: 600 38px/1 var(--font-display); color: #8A909C; letter-spacing: -.01em; white-space: nowrap; }
.cell.is-dark .fld { background: #1A1D25; border-color: #2E333E; }
.cell.is-dark .fld > span:last-child { color: #8B93A3; }
`,
}
