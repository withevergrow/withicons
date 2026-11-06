import { at, chip, icon, glow, C, rgba } from '../tools/hero-kit.mjs'

// A year of celebrations as tear-off calendar pages: each month card carries its holiday in its own holiday style.
const MONTHS = [
  ['Oct', 'jack-o-lantern', 'halloween', -5, 0],
  ['Nov', 'diya', 'utsav', 3, 34],
  ['Dec', 'christmas-tree', 'christmas', -2, 6],
  ['Jan', 'red-lantern', 'lunar', 4, 40],
  ['Feb', 'heart-balloon', 'valentine', -4, 10],
]
const page = ([m, name, style, rot, dy], i) => at(`<div class="cal" style="--c:${C[style].c}">
  <i class="cal__ring"></i><i class="cal__ring"></i>
  <div class="cal__head">${m}</div>
  <div class="cal__body">${icon(name, style, 160)}</div>
</div>`, { x: 196 + i * 246, y: 236 + dy, rot })

export default {
  base: 'xcolor2',
  alt: 'Open pots of bright paint under a dark wash, with five calendar pages from October to February, each holding a festive with icon in its own holiday style',
  photo: { filter: 'saturate(1.15) brightness(.72) blur(.5px)', pos: '50% 50%', scale: 1.04 },
  overlay: `linear-gradient(180deg, ${rgba('#111318', 0.35)} 0%, ${rgba('#111318', 0.15)} 50%, ${rgba('#111318', 0.55)} 100%)`,
  art: () => [
    glow({ cx: 800, cy: 420, r: 420, color: C.solid.c, opacity: 0.32, blur: 110 }),
    ...MONTHS.map(page),
    chip('6 holiday styles', { x: 990, y: 690, tone: 'color', style: 'solid', size: 34, icon: ['sparkles', 'solid'], rot: -3 }),
  ].join(''),
  css: `
.cal { position: relative; width: 220px; height: 296px; border-radius: 30px; background: #fff; display: flex; flex-direction: column; overflow: visible;
  box-shadow: 0 2px 0 rgba(17,19,24,.05), 0 44px 80px -36px rgba(0,0,0,.75); }
.cal__head { height: 78px; border-radius: 30px 30px 0 0; background: var(--c); color: #fff; display: grid; place-items: center;
  font: 800 40px/1 var(--font-display); letter-spacing: -.02em; text-transform: uppercase; }
.cal__body { flex: 1; display: grid; place-items: center; }
.cal__ring { position: absolute; top: -16px; width: 16px; height: 40px; border-radius: 10px; background: #2A2D35; box-shadow: inset 0 2px 0 rgba(255,255,255,.25); }
.cal__ring:first-child { left: 58px; } .cal__ring:nth-child(2) { right: 58px; }
`,
}
