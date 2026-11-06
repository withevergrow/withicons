import { at, icon, C, INK, rgba } from '../tools/hero-kit.mjs'

// Pure artwork: the whole stage is a generic spreadsheet (letters, row numbers, grid). In it, a small tracker: a
// status icon in each row's cell, and a pictograph bar of orange people icons, one per cell (1 icon = 1,000),
// the last one cut in half, all inside an orange selection with its fill handle. A floating formula bar explains.
const O = C.solid
const X0 = 72, CW = 160, Y0 = 52, RH = 92
const cx = i => X0 + i * CW, ry = j => Y0 + j * RH
const GREEN = '#1F9D55', AMBER = '#E89A00', RED = '#E5484D'
const ROWS = [
  ['Jan', 'check-circle', GREEN, 4.5],
  ['Feb', 'clock', AMBER, 3],
  ['Mar', 'check-circle', GREEN, 5],
  ['Apr', 'alert-triangle', RED, 2.5],
]
const cell = (html, i, j, cls = '') => at(`<div class="xs__cell ${cls}">${html}</div>`, { x: cx(i), y: ry(j), w: CW, h: RH })

function grid() {
  const out = []
  for (let i = 0; i < 10; i++) out.push(at(`<b class="xs__col">${'ABCDEFGHIJ'[i]}</b>`, { x: cx(i), y: 0, w: CW, h: Y0 }))
  for (let j = 0; j < 11; j++) out.push(at(`<b class="xs__row">${j + 1}</b>`, { x: 0, y: ry(j), w: X0, h: RH }))
  return out.join('')
}
function people(n, j) {
  const out = []
  for (let k = 0; k < Math.ceil(n); k++) {
    const half = n - k < 1
    out.push(cell(`<span class="xs__p${half ? ' is-half' : ''}">${icon('users', 'solid', 70, O.c)}</span>`, 3 + k, j))
  }
  return out.join('')
}

export default {
  alt: 'Artwork of a spreadsheet grid where each row has a status icon in a cell and a bar of orange people icons, one per cell with the last cut in half, inside an orange selection',
  bg: `linear-gradient(90deg, rgba(17,19,24,.09) 2px, transparent 2px) ${X0 - 1}px 0 / ${CW}px 100%, linear-gradient(rgba(17,19,24,.09) 2px, transparent 2px) 0 ${Y0 - 1}px / 100% ${RH}px, #FDFCF9`,
  art: () => [
    at('<div class="xs__hd"></div>', { x: 0, y: 0, w: 1600, h: Y0 }),
    at('<div class="xs__rn"></div>', { x: 0, y: 0, w: X0, h: 1000 }),
    grid(),
    cell('Month', 1, 1, 'is-th'), cell('Status', 2, 1, 'is-th'), cell('Visitors', 3, 1, 'is-th is-left'),
    ...ROWS.map(([m, ic, col, n], k) => cell(m, 1, k + 2, 'is-txt') + cell(icon(ic, 'solid', 58, col), 2, k + 2) + people(n, k + 2)),
    // the selection around the pictograph, with its fill handle
    at('<div class="xs__sel"><i></i></div>', { x: cx(3) - 2, y: ry(2) - 2, w: CW * 5 + 4, h: RH * 4 + 4 }),
    at(`<div class="xs__fx"><b>fx</b><span>1 icon = 1,000</span>${icon('users', 'solid', 50, O.c)}</div>`, { x: 860, y: 690, rot: -2 }),
  ].join(''),
  css: `
.xs__hd { height: 100%; background: #EFEBE4; border-bottom: 2px solid rgba(17,19,24,.12); }
.xs__rn { height: 100%; background: #EFEBE4; border-right: 2px solid rgba(17,19,24,.12); }
.xs__col, .xs__row { display: grid; place-items: center; height: 100%; font: 600 24px/1 var(--font-mono); color: #8A8F9A; }
.xs__cell { box-sizing: border-box; height: 100%; display: grid; place-items: center; font-family: var(--font-display); color: ${INK}; }
.xs__cell.is-th { font: 800 34px/1 var(--font-display); letter-spacing: -.02em; background: rgba(255,90,54,.06); }
.xs__cell.is-left { justify-items: start; padding-left: 28px; }
.xs__cell.is-txt { font: 600 34px/1 var(--font-display); }
.xs__p { display: block; line-height: 0; }
.xs__p.is-half { clip-path: inset(0 50% 0 0); }
.xs__sel { box-sizing: border-box; height: 100%; border: 5px solid ${O.c}; border-radius: 6px; background: ${rgba(O.c, 0.06)}; position: relative; }
.xs__sel i { position: absolute; right: -14px; bottom: -14px; width: 22px; height: 22px; border-radius: 5px; background: ${O.c}; border: 4px solid #fff; }
.xs__fx { display: flex; align-items: center; gap: 22px; padding: 22px 30px 22px 22px; border-radius: 28px; background: #fff; box-shadow: 0 2px 0 rgba(17,19,24,.04), 0 40px 80px -30px rgba(17,19,24,.5); border: 2px solid rgba(17,19,24,.06); }
.xs__fx b { width: 64px; height: 64px; border-radius: 18px; display: grid; place-items: center; background: ${INK}; color: #fff; font: italic 700 32px/1 var(--font-serif); }
.xs__fx span { font: 700 44px/1 var(--font-mono); letter-spacing: -.03em; color: ${INK}; }
`,
}
