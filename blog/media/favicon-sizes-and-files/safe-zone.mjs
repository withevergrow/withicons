import { at, icon, INK, rgba } from '../../tools/hero-kit.mjs'
import { BG, CSS, O, B } from './_kit.mjs'

// A maskable icon, drawn big: a full-bleed orange square with a white solid heart in the middle. A dashed circle (80%
// across) marks the safe zone; the hatched outer 10% band may be cropped. On the right, the same tile as three
// Android launchers cut it: circle, squircle, rounded square.
const S = 640, X = 110, Y = 210 // the big tile
const mini = (r, label) => `<div class="sz-mini"><span class="sz-cut" style="border-radius:${r}">${icon('heart', 'solid', 104, '#fff')}</span><b>${label}</b></div>`

export default {
  alt: 'A maskable icon drawn large: an orange square with a white heart, a dashed circle marking the safe zone at 80 percent and a hatched outer edge that may be cropped, beside the same icon cut into a circle, a squircle and a rounded square',
  bg: BG,
  art: () => [
    at(`<div class="sz-tile">${icon('heart', 'solid', 300, '#fff')}<i class="sz-band"></i><i class="sz-safe"></i></div>`, { x: X, y: Y, w: S, h: S }),
    at(`<span class="sz-dim"><i></i>512 px<i></i></span>`, { x: X, y: Y - 66, w: S }),
    at(`<span class="fv-chip is-b">safe zone 80%</span>`, { cx: X + S / 2, cy: Y + S - 140 }),
    at(`<span class="fv-chip is-ink">may be cropped</span>`, { cx: X + S / 2, cy: Y + 32 }),
    at(`<span class="sz-h">Android cuts it to shape</span>`, { x: 880, y: 300 }),
    at(`<div class="sz-row">${mini('50%', 'circle')}${mini('38%', 'squircle')}${mini('20%', 'rounded')}</div>`, { x: 880, y: 380, w: 656 }),
    at(`<span class="sz-note">${icon('check-circle', 'line', 34, B.c)}the heart survives every shape</span>`, { x: 880, y: 720 }),
  ].join(''),
  css: `${CSS}
.sz-tile { position: relative; width: 100%; height: 100%; display: grid; place-items: center; background: ${O.c}; border-radius: 6px; box-shadow: 0 50px 90px -44px rgba(17,19,24,.6); overflow: hidden; }
.sz-band { position: absolute; inset: 0; border: 64px solid transparent; border-image: repeating-linear-gradient(45deg, ${rgba(INK, 0.32)} 0 10px, transparent 10px 22px) 64; }
.sz-safe { position: absolute; left: 10%; top: 10%; width: 80%; height: 80%; border-radius: 50%; border: 6px dashed #fff; box-sizing: border-box; }
.sz-dim { display: flex; align-items: center; gap: 16px; font: 700 30px/1 var(--font-mono); color: ${INK}; }
.sz-dim i { flex: 1; height: 3px; background: ${INK}; position: relative; }
.sz-h { font: 800 44px/1 var(--font-display); letter-spacing: -.03em; color: ${INK}; }
.sz-row { display: flex; justify-content: space-between; }
.sz-mini { display: flex; flex-direction: column; align-items: center; gap: 18px; }
.sz-mini b { font: 600 30px/1 var(--font-mono); color: ${B.text}; }
.sz-cut { width: 192px; height: 192px; display: grid; place-items: center; background: ${O.c}; box-shadow: 0 30px 50px -28px rgba(17,19,24,.6); }
.sz-note { display: inline-flex; align-items: center; gap: 12px; font: 600 32px/1 var(--font-display); color: #4B505C; letter-spacing: -.01em; }
`,
}
