import { at, icon, C, INK } from '../tools/hero-kit.mjs'

// Bauhaus poster: the hero IS the poster people make with free icons. Flat red disc, blue bar and yellow quarter as
// coded SVG on cream, the photo cropped into a circle, Bauhaus-style icons, a stacked headline, and the small-print
// credit line under it struck through in blue with a "No credit line" stamp.
const vsp = name => at(`<span class="vsp"><i>vs</i>${name}</span>`, { x: 170, y: 130 })
const VSP_CSS = `
.vsp { display: inline-flex; align-items: center; gap: 14px; padding: 10px 28px 10px 10px; border-radius: 999px; background: ${C.line.c}; color: #fff; font: 800 34px/1 var(--font-display); letter-spacing: -.02em; white-space: nowrap; box-shadow: 0 0 0 6px rgba(255,255,255,.85), 0 30px 60px -18px rgba(17,19,24,.55); }
.vsp i { font-style: normal; width: 58px; height: 58px; border-radius: 50%; background: #fff; color: ${C.line.c}; display: grid; place-items: center; font-size: 28px; letter-spacing: -.04em; }`

const RED = '#D62718', YEL = '#F2B705', BLU = '#1D3FA6', CREAM = '#F1E9D8'
const PX = 1110, PY = 440, PR = 270 // photo circle
const DX = 560 // slide the photo right so the hand and stylus land in the circle

export default {
  base: 'flat0',
  alt: 'A Bauhaus-style poster on cream: a designer drawing on a tablet cropped into a circle over a red disc and blue bar, Bauhaus cake, cookie and heart icons, a stacked Bake sale headline whose credit line is struck through in blue, a No credit line stamp and a blue vs Flaticon pill',
  photo: { filter: 'grayscale(1) contrast(1.15) brightness(1.05)', pos: '30% 50%' },
  overlay: 'none',
  art: () => [
    at(`<svg width="1600" height="1000" viewBox="0 0 1600 1000">
      <rect x="1392" y="120" width="48" height="640" fill="${BLU}"/>
      <path d="M${PX - PR - 40} ${PY - PR - 40} h190 a190 190 0 0 1 -190 190 z" fill="${YEL}"/>
      <rect x="200" y="586" width="440" height="10" fill="${INK}"/>
      <circle cx="${PX}" cy="${PY}" r="${PR + 8}" fill="none" stroke="${INK}" stroke-width="8"/>
    </svg>`, { x: 0, y: 0 }),
    at(`<div class="bh">Bake<br>sale</div>`, { x: 196, y: 228 }),
    at(`<div class="credit"><span>Icons by Flaticon.com</span></div>`, { x: 200, y: 520 }),
    at(icon('cake', 'bauhaus', 230), { cx: 1300, cy: 760 }),
    at(icon('cookie', 'bauhaus', 150), { cx: 790, cy: 250, rot: -10 }),
    at(icon('heart', 'bauhaus', 120), { cx: 760, cy: 470, rot: 8 }),
    at(`<div class="stamp">${icon('badge-check', 'line', 44, C.line.c)}<b>No credit line</b></div>`, { x: 760, y: 700, rot: -6 }),
    vsp('Flaticon'),
  ].join(''),
  css: `${VSP_CSS}
.stage { background: radial-gradient(circle ${PR + 10}px at ${PX + 130}px ${PY + 120}px, ${RED} 99.6%, transparent 100%), ${CREAM}; }
.stage__photo { transform: translateX(${DX}px); clip-path: circle(${PR}px at ${PX - DX}px ${PY}px); }
.bh { font: 800 150px/.86 var(--font-display); letter-spacing: -.055em; color: ${INK}; text-transform: uppercase; }
.credit { font: 500 28px/1 var(--font-display); color: #3E3A33; }
.credit span { position: relative; }
.credit span::after { content: ''; position: absolute; left: -10px; right: -10px; top: 50%; height: 6px; margin-top: -2px; border-radius: 6px; background: ${C.line.c}; transform: rotate(-1.5deg); }
.stamp { display: inline-flex; align-items: center; gap: 12px; padding: 18px 28px 18px 20px; border-radius: 22px; background: #fff; border: 4px solid ${C.line.c}; color: ${C.line.c}; font: 800 40px/1 var(--font-display); letter-spacing: -.02em; white-space: nowrap; box-shadow: 0 30px 60px -20px rgba(17,19,24,.45); }
`,
}
