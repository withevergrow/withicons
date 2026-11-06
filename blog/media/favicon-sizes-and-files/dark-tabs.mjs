import { at, icon, INK } from '../../tools/hero-kit.mjs'
import { BG, CSS, O, B, plate } from './_kit.mjs'

// A 2 x 2 comparison: a light and a dark browser tab bar (columns), each showing the same site twice (rows). Row one:
// a dark outline rocket favicon, clear on light, lost on dark. Row two: a white rocket on an orange plate, clear on
// both. Each row is named on the left with a warning or a check.
const DARK_MARK = icon('rocket', 'line', 60, '#1D2433')
const PLATE = plate(64, { round: 16 })
const bar = (mark, dark) => `<div class="dt-win${dark ? ' is-dark' : ''}">
  <div class="dt-bar">
    <span class="dt-tab is-on">${mark}<b>My site</b>${icon('close', 'line', 26, dark ? '#8A8F9C' : '#9A968E')}</span>
    <span class="dt-tab"><i class="dt-fav"></i><i class="dt-sk"></i></span>
  </div>
  <div class="dt-url"><i></i></div>
</div>`
const COLS = [[420, 'Light tab bar', false], [990, 'Dark tab bar', true]]
const ROWS = [[200, DARK_MARK, 'Dark mark only', 'alert-triangle', O.c], [570, PLATE, 'Mark on a plate', 'check-circle', B.c]]

export default {
  alt: 'Light and dark browser tab bars compared: a dark outline rocket favicon shows on the light tab but almost disappears on the dark one, while the same rocket in white on an orange plate stays clear on both',
  bg: BG,
  art: () => [
    ...COLS.map(([x, t]) => at(`<span class="dt-col">${t}</span>`, { x, y: 120, w: 520 })),
    ...ROWS.flatMap(([y, mark, label, ic, col]) => [
      at(`<div class="dt-row">${icon(ic, 'line', 56, col)}<b>${label}</b></div>`, { x: 64, y: y + 70, w: 320 }),
      ...COLS.map(([x, , dark]) => at(bar(mark, dark), { x, y, w: 540, h: 300 })),
      ...COLS.map(([x, , dark]) => { const ok = !(dark && mark === DARK_MARK); return at(`<span class="dt-badge${ok ? '' : ' is-bad'}">${icon(ok ? 'check' : 'close', 'line', 34, '#fff')}</span>`, { cx: x + 504, cy: y + 4, z: 3 }) }),
    ]),
  ].join(''),
  css: `${CSS}
.dt-badge { width: 60px; height: 60px; border-radius: 50%; display: grid; place-items: center; background: ${B.c}; border: 5px solid #fff; box-shadow: 0 12px 24px -10px rgba(17,19,24,.5); }
.dt-badge.is-bad { background: ${O.c}; }
.dt-col { display: block; text-align: center; font: 700 30px/1 var(--font-mono); color: ${B.text}; letter-spacing: -.02em; }
.dt-row { display: flex; flex-direction: column; gap: 16px; }
.dt-row b { font: 800 40px/1.05 var(--font-display); letter-spacing: -.03em; color: ${INK}; }
.dt-win { box-sizing: border-box; height: 100%; display: flex; flex-direction: column; border-radius: 30px; overflow: hidden; background: #E9E6E0;
  box-shadow: 0 2px 0 rgba(17,19,24,.04), 0 40px 80px -44px rgba(17,19,24,.55); border: 1.5px solid rgba(17,19,24,.07); }
.dt-win.is-dark { background: #17191F; border-color: rgba(255,255,255,.06); }
.dt-bar { display: flex; align-items: flex-end; gap: 6px; padding: 30px 24px 0; }
.dt-tab { display: flex; align-items: center; gap: 18px; height: 108px; padding: 0 26px; border-radius: 24px 24px 0 0; box-sizing: border-box; }
.dt-tab.is-on { background: #fff; flex: 1; }
.dt-tab.is-on b { flex: 1; font: 700 32px/1 var(--font-display); color: ${INK}; letter-spacing: -.02em; }
.dt-win.is-dark .dt-tab.is-on { background: #2B2E38; }
.dt-win.is-dark .dt-tab.is-on b { color: #F1F0EC; }
.dt-fav { width: 40px; height: 40px; border-radius: 12px; background: rgba(17,19,24,.16); }
.dt-sk { width: 80px; height: 14px; border-radius: 8px; background: rgba(17,19,24,.14); }
.dt-win.is-dark .dt-fav, .dt-win.is-dark .dt-sk { background: rgba(255,255,255,.14); }
.dt-url { flex: 1; display: flex; align-items: center; padding: 0 30px; background: #fff; }
.dt-url i { flex: 1; height: 46px; border-radius: 999px; background: #F1EEE8; }
.dt-win.is-dark .dt-url { background: #2B2E38; } .dt-win.is-dark .dt-url i { background: #1F2129; }
`,
}
