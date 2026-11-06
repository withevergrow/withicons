import { at, icon, C, rgba, INK } from '../tools/hero-kit.mjs'

// Pure artwork: a glowing light table on a dark desk with two film strips of the same five icons. The top strip mixes
// five styles, sizes and tilts and is crossed out in grease pencil; the bottom strip is one duo set, circled "yes!". A loupe on the desk magnifies one matched icon.
const NAMES = ['home', 'search', 'bell', 'heart', 'user']
const MIXED = [['sketch', 84, -9, 8], ['pixel', 60, 6, -8], ['soft3d', 104, 0, 2], ['gothic', 70, 10, -10], ['brutal', 90, -6, 2]]
const strip = frames => `<div class="fs"><div class="fs__holes"></div><div class="fs__row">${frames}</div><div class="fs__holes"></div></div>`

export default {
  alt: 'Artwork of a glowing light table on a dark desk with two film strips: a mismatched row of icons in five styles crossed out, and a matching violet row circled yes in grease pencil, beside a loupe magnifying a violet heart',
  bg: `radial-gradient(90% 80% at 62% 45%, #3A2F2A 0%, #1A1513 70%)`,
  art: () => [
    at('<div class="lt"></div>', { x: 560, y: 130, w: 860, h: 470 }),
    at(strip(NAMES.map((n, i) => { const [s, sz, r, dy] = MIXED[i]; return `<span><i style="rotate:${r}deg;translate:0 ${dy}px">${icon(n, s, sz)}</i></span>` }).join('')), { x: 600, y: 160, w: 780, rot: -2 }),
    at(strip(NAMES.map(n => `<span>${icon(n, 'duo', 84, C.duo.text)}</span>`).join('')), { x: 600, y: 385, w: 780, rot: 1 }),
    at(`<svg width="900" height="600" viewBox="0 0 900 600" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <path d="M50 70 L830 220 M70 225 L820 70" stroke="#E5484D" stroke-width="9" opacity=".75"/>
      <path d="M30 375 C 10 290, 300 262, 470 266 C 700 270, 880 290, 862 375 C 846 470, 520 486, 380 482 C 180 476, 20 440, 40 340" stroke="${C.duo.c}" stroke-width="10"/>
    </svg>`, { x: 560, y: 110, z: 3 }),
    at(`<div class="lp"><span class="lp__glass">${icon('heart', 'duo', 150, C.duo.text)}</span><i class="lp__handle"></i></div>`, { x: 210, y: 180 }),
    at('<span class="gp">nope</span>', { x: 1230, y: 96, rot: -8, z: 4 }),
    at(`<span class="gp is-yes">yes!</span>`, { x: 1250, y: 610, rot: -6, z: 4 }),
  ].join(''),
  css: `
.lt { width: 100%; height: 100%; border-radius: 36px; background: radial-gradient(80% 80% at 50% 50%, #FFFFFF 0%, #F3F6FF 60%, #DDE5FF 100%); box-shadow: 0 0 0 14px #2A2320, 0 0 120px 30px rgba(200,215,255,.25), 0 60px 120px -40px rgba(0,0,0,.9); }
.fs { background: #17181C; border-radius: 10px; padding: 0 18px; box-shadow: 0 24px 40px -22px rgba(0,0,0,.7); }
.fs__holes { height: 30px; background: radial-gradient(circle, transparent 0, transparent 0) ; background-image: linear-gradient(90deg, transparent 0 14px, rgba(255,255,255,.9) 14px 34px, transparent 34px 48px); background-size: 48px 14px; background-repeat: repeat-x; background-position: 0 50%; opacity: .85; }
.fs__row { display: flex; gap: 14px; }
.fs__row > span { flex: 1; height: 124px; border-radius: 8px; background: rgba(255,255,255,.94); display: grid; place-items: center; }
.fs__row i { display: grid; place-items: center; }
.lp { position: relative; width: 300px; height: 300px; }
.lp__glass { position: absolute; inset: 0; border-radius: 50%; display: grid; place-items: center; background: radial-gradient(circle at 35% 30%, #FFFFFF 0%, #EEF2FF 60%, #D6DEFF 100%); border: 22px solid #2B2E36; box-sizing: border-box; box-shadow: inset 0 0 0 4px rgba(255,255,255,.3), 0 40px 60px -20px rgba(0,0,0,.9); z-index: 1; }
.lp__handle { position: absolute; left: -40px; top: 250px; width: 150px; height: 46px; border-radius: 23px; background: linear-gradient(180deg, #4A4F5C, #23262E); rotate: -45deg; }
.gp { font: 700 84px/1 var(--font-hand); color: #E5484D; }
.gp.is-yes { color: ${C.duo.c}; }
`,
}
