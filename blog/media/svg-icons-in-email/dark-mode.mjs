import { at, icon, INK, rgba } from '../../tools/hero-kit.mjs'
import { BG, CSS, BLUE, ICONS, verdict } from './_kit.mjs'

// One email footer, split down the middle: the left half is a light inbox, the right half a dark inbox. Row one: black
// line icons on transparency, clear on light, nearly gone on dark. Row two: the same icons in solid white on mid-blue
// circles, clear on both. A verdict chip names each row.
const X = 80, Y = 150, W = 1440, H = 720, HALF = W / 2
const bare = () => ICONS.map(n => `<span class="dm-ic">${icon(n, 'line', 64, '#111318')}</span>`).join('')
const plated = () => ICONS.map(n => `<span class="dm-ic is-plate">${icon(n, 'solid', 50, '#fff')}</span>`).join('')
const ROWS = [[Y + 150, bare, 'Black on transparent', false], [Y + 450, plated, 'Icon on a plate', true]]

export default {
  alt: 'An email footer split into a light half and a dark half: black outline phone, mail, globe and calendar icons are clear on light but almost vanish on dark, while the same icons in white on blue circles stay clear on both halves',
  bg: BG,
  art: () => [
    at(`<div class="dm-split"><div class="dm-l"></div><div class="dm-r"></div></div>`, { x: X, y: Y, w: W, h: H }),
    at(`<span class="dm-h">Light inbox</span>`, { x: X + 50, y: Y + 44 }),
    at(`<span class="dm-h is-dark">Dark inbox</span>`, { x: X + HALF + 50, y: Y + 44 }),
    ...ROWS.flatMap(([y, row, label, ok]) => [
      at(`<div class="dm-row">${row()}</div>`, { cx: X + HALF / 2, cy: y + 60, w: 520 }),
      at(`<div class="dm-row">${row()}</div>`, { cx: X + HALF + HALF / 2, cy: y + 60, w: 520 }),
      at(verdict(label, ok), { cx: X + HALF, cy: y + 176, z: 3 }),
    ]),
  ].join(''),
  css: `${CSS}
.dm-split { display: flex; height: 100%; border-radius: 34px; overflow: hidden; box-shadow: 0 2px 0 rgba(17,19,24,.04), 0 50px 90px -46px rgba(17,19,24,.6); }
.dm-l { flex: 1; background: #fff; } .dm-r { flex: 1; background: #17191F; }
.dm-h { font: 700 30px/1 var(--font-mono); color: ${INK}; letter-spacing: -.02em; }
.dm-h.is-dark { color: #E8E6E1; }
.dm-row { display: flex; justify-content: space-between; }
.dm-ic { width: 104px; height: 104px; display: grid; place-items: center; }
.dm-ic.is-plate { border-radius: 50%; background: ${BLUE}; box-shadow: 0 14px 26px -14px ${rgba(BLUE, 0.9)}; }
`,
}
