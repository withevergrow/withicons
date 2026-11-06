import { at, tile, icon, glow, C, rgba } from '../tools/hero-kit.mjs'

// Business icons on a shelf, a $0 price tag hanging off them, and a rubber stamp that says they are fine for
// business use.
const OK = C.sketch.text
const ROW = ['store', 'briefcase', 'shopping-bag', 'presentation']

export default {
  base: 'lic0',
  alt: 'A man signing papers, overlaid with a row of with icons business tiles, an orange $0 price tag hanging from them and a green OK for business stamp',
  photo: { filter: 'saturate(.85) brightness(.7)', pos: '40% 40%' },
  overlay: `linear-gradient(90deg, ${rgba('#111318', 0.1)} 0%, ${rgba('#111318', 0.5)} 60%, ${rgba('#111318', 0.45)} 100%)`,
  art: () => [
    glow({ cx: 1060, cy: 470, r: 360, color: C.solid.c, opacity: 0.38 }),
    ...ROW.map((n, i) => tile(n, 'solid', { x: 720 + i * 175, y: 150, size: 145, tone: i === 1 ? 'soft' : 'card' })),
    // string from the last tile to the tag's hole
    at(`<svg width="1600" height="1000"><path d="M1142 288 C 1150 340, 1120 390, 1131 441" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round"/></svg>`, { x: 0, y: 0, z: 2 }),
    at(`<div class="tagbox"><div class="tag"><i></i><b>$0</b><span>free</span></div></div>`, { x: 1060, y: 400, rot: 25, z: 3 }),
    at(`<div class="stamp"><div class="stamp__in">${icon('badge-check', 'solid', 86, OK)}<span>OK for<br>business</span></div></div>`, { x: 740, y: 560, rot: -8, z: 4 }),
  ].join(''),
  css: `
.tagbox { filter: drop-shadow(0 30px 26px rgba(0,0,0,.45)); }
.tag { position: relative; width: 330px; height: 170px; display: flex; align-items: center; gap: 14px; padding-left: 108px; box-sizing: border-box; background: ${C.solid.c}; color: #fff; clip-path: polygon(0 50%, 24% 0, 100% 0, 100% 100%, 24% 100%); font-family: var(--font-display); }
.tag i { position: absolute; left: 46px; top: 50%; width: 30px; height: 30px; margin-top: -15px; border-radius: 50%; background: #fff; box-shadow: inset 0 3px 6px rgba(0,0,0,.35); }
.tag b { font-weight: 800; font-size: 104px; line-height: 1; letter-spacing: -.04em; }
.tag span { font-weight: 800; font-size: 30px; text-transform: uppercase; letter-spacing: .08em; opacity: .9; align-self: flex-end; margin-bottom: 38px; }
.stamp { padding: 12px; border: 9px solid ${OK}; border-radius: 34px; background: rgba(255,255,255,.92); box-shadow: 0 40px 80px -36px rgba(0,0,0,.7); }
.stamp__in { display: flex; align-items: center; gap: 22px; padding: 22px 34px 22px 24px; border: 3px solid ${OK}; border-radius: 22px; color: ${OK}; }
.stamp__in span { font: 800 54px/0.98 var(--font-display); text-transform: uppercase; letter-spacing: -.01em; }
`,
}
