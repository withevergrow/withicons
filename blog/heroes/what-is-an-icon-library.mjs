import { at, icon, C, INK, rgba } from '../tools/hero-kit.mjs'

// A card-catalogue cabinet in front of a blurred, violet-dimmed library: every small drawer is labelled with one
// icon (one category each), and the weather drawer is pulled out, full of index cards of matching weather icons.
const D = C.duo
const LABELS = ['arrow-right', null, 'file-text', 'user', 'mail', 'heart', 'calendar', 'map-pin',
  'shopping-cart', 'music-note', 'lock', 'chart-bar', 'camera', 'home', 'settings', 'bell']
const CX = 760, CY = 140, COLS = 4, DW = 150, DH = 150, G = 12, PAD = 22
const drawer = (n, i) => {
  const x = CX + PAD + (i % COLS) * (DW + G), y = CY + PAD + Math.floor(i / COLS) * (DH + G)
  return at(n ? `<div class="dr"><span class="dr__lab">${icon(n, 'duo', 54, D.text)}</span><i class="dr__knob"></i></div>` : `<div class="dr is-open"></div>`, { x, y, w: DW, h: DH })
}
const CARDS = ['sun', 'cloud-rain', 'snowflake', 'wind', 'moon']

export default {
  base: 'xlib5',
  alt: 'A blurred violet library behind a wooden card-catalogue cabinet whose drawers are labelled with with icons, one drawer pulled out full of weather icon cards',
  photo: { filter: 'grayscale(1) blur(7px) brightness(.85)', pos: '50% 50%', scale: 1.06 },
  overlay: `linear-gradient(120deg, #7B5CFF 0%, #2A1E66 100%)`,
  art: () => [
    at(`<div class="cab"></div>`, { x: CX, y: CY, w: COLS * (DW + G) - G + PAD * 2, h: 4 * (DH + G) - G + PAD * 2 }),
    ...LABELS.map(drawer),
    // the pulled-out drawer: dark inside, index cards standing up, then the front
    at(`<div class="pull__in"></div>`, { x: 300, y: 300, w: 420, h: 230, z: 3 }),
    ...CARDS.map((n, i) => at(`<div class="card${i % 2 ? ' is-back' : ''}">${icon(n, 'duo', 66, D.text)}</div>`, { x: 318 + i * 80, y: [262, 240, 256, 236, 258][i], rot: [-6, 3, -2, 5, -3][i], z: 4 + i })),
    at(`<div class="dr is-front"><span class="dr__lab is-wide">${icon('cloud-sun', 'duo', 54, D.text)}<b>weather</b></span><i class="dr__knob"></i></div>`, { x: 290, y: 410, w: 440, h: 150, z: 10 }),
  ].join(''),
  css: `
.stage__overlay { mix-blend-mode: multiply; }
.cab { width: 100%; height: 100%; border-radius: 30px; background: linear-gradient(160deg, #8A5A34, #5E3A1E); box-shadow: inset 0 2px 0 rgba(255,255,255,.18), 0 60px 110px -40px rgba(0,0,0,.85); }
.dr { width: 100%; height: 100%; box-sizing: border-box; border-radius: 16px; background: linear-gradient(170deg, #D8A673, #B57E4C); box-shadow: inset 0 2px 0 rgba(255,255,255,.35), inset 0 -4px 0 rgba(0,0,0,.18), 0 3px 0 rgba(0,0,0,.25); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px; }
.dr.is-open { background: #1C1230; box-shadow: inset 0 18px 30px rgba(0,0,0,.8); }
.dr__lab { display: grid; place-items: center; width: 84px; height: 70px; border-radius: 12px; background: #fff; border: 4px solid #E8C26A; box-shadow: 0 2px 0 rgba(0,0,0,.2); }
.dr__lab.is-wide { width: auto; height: 76px; display: flex; gap: 14px; padding: 0 24px 0 16px; }
.dr__lab b { font: 700 50px/1 var(--font-hand); color: ${D.text}; }
.dr__knob { width: 26px; height: 26px; border-radius: 50%; background: radial-gradient(circle at 35% 35%, #FFF1C2, #C99A2E 70%); box-shadow: 0 3px 4px rgba(0,0,0,.35); }
.dr.is-front { border-radius: 20px; box-shadow: inset 0 2px 0 rgba(255,255,255,.35), inset 0 -5px 0 rgba(0,0,0,.18), 0 40px 70px -26px rgba(0,0,0,.85); }
.pull__in { width: 100%; height: 100%; border-radius: 20px 20px 0 0; background: linear-gradient(#3A2A1A, #24170C); clip-path: polygon(6% 0, 94% 0, 100% 100%, 0 100%); }
.card { width: 104px; height: 150px; box-sizing: border-box; padding-top: 16px; border-radius: 14px; background: #fff; display: flex; justify-content: center; box-shadow: 0 10px 18px -8px rgba(0,0,0,.6); border-top: 10px solid ${D.c}; }
.card.is-back { background: ${D.soft}; }
`,
}
