import { at, icon, rgba } from '../../tools/hero-kit.mjs'
import { BG, CSS, B, WARN } from './_kit.mjs'

// SMIL's "deprecation" as a timeline on a navy blueprint sheet: April 2015, an orange warning (Chrome's intent to
// deprecate); August 2016, a pause (plan suspended); November 2026, a big cyan tick (works everywhere, ~97%). The
// line is dashed orange while SMIL was at risk and solid cyan after. Above the end, the line loader mid-spin.
const Y = 560
const STOPS = [
  [270, 'Apr 2015', 'alert-triangle', WARN, 'Chrome: intent to<br>deprecate SMIL', 92],
  [720, 'Aug 2016', 'pause', '#C9D3DC', 'Plan suspended', 92],
  [1250, 'Nov 2026', 'check', B.c, 'Works in Chrome, Edge,<br>Firefox and Safari:<br>about 97% of users', 132],
]
const stop = ([x, date, ic, col, text, size]) => [
  at(`<span class="tl-dot" style="width:${size}px;height:${size}px;background:${col}">${icon(ic, ic === 'check' ? 'line' : 'solid', Math.round(size * 0.52), ic === 'pause' ? '#0E1B29' : '#fff')}</span>`, { cx: x, cy: Y, z: 3 }),
  at(`<span class="an-mono tl-date" style="color:${col === '#C9D3DC' ? '#E6EDF2' : col}">${date}</span>`, { cx: x, cy: Y - size / 2 - 44 }),
  at(`<span class="an-text tl-text">${text}</span>`, { x: x - 190, y: Y + size / 2 + 34, w: 380 }),
].join('')

export default {
  alt: 'A timeline on a navy blueprint grid: an orange warning in April 2015 for Chrome’s intent to deprecate SMIL, a pause in August 2016 when the plan was suspended, and a big cyan tick in November 2026 for SMIL working in every major browser, with a spinning loader icon above',
  bg: BG,
  art: () => [
    at(`<svg width="1600" height="40" fill="none"><path d="M120 20 H720" stroke="${WARN}" stroke-width="8" stroke-linecap="round" stroke-dasharray="2 22"/><path d="M720 20 H1480" stroke="${B.c}" stroke-width="8" stroke-linecap="round"/><path d="M1462 6 L1482 20 L1462 34" stroke="${B.c}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/></svg>`, { x: 0, y: Y - 20 }),
    ...STOPS.map(stop),
    // the loader mid-spin: two ghost copies trail the live one
    at(icon('loader', 'line', 170, rgba(B.c, 0.18)), { cx: 1250, cy: 260, rot: -40 }),
    at(icon('loader', 'line', 170, rgba(B.c, 0.4)), { cx: 1250, cy: 260, rot: -20 }),
    at(icon('loader', 'line', 170, '#fff'), { cx: 1250, cy: 260 }),
    at(`<svg width="240" height="240" fill="none"><path d="M200 70 A 100 100 0 0 1 216 150" stroke="${B.c}" stroke-width="7" stroke-linecap="round"/><path d="M204 136 L216 156 L232 138" stroke="${B.c}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>`, { cx: 1250, cy: 260 }),
    at(`<span class="an-chip">&lt;animateTransform&gt;</span>`, { x: 700, y: 236 }),
  ].join(''),
  css: `${CSS}
.tl-dot { display: grid; place-items: center; border-radius: 50%; box-shadow: 0 0 0 10px rgba(14,27,41,1), 0 0 0 13px rgba(255,255,255,.18), 0 20px 40px -10px rgba(0,0,0,.7); }
.tl-date { font-size: 32px; }
.tl-text { display: block; text-align: center; }
`,
}
