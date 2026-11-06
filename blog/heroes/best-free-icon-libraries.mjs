import { at, chip, icon, glow, C, INK, rgba } from '../tools/hero-kit.mjs'

// The ten libraries of the guide as ten book spines on one shelf, in the order of the guide, each with a small icon for
// what it is best for. The first spine (with icons) leans out and wears a star; one orange "10 free sets" chip on top.
const BOOKS = [
  ['with icons', 'sparkles', C.solid.c, 420],
  ['Font Awesome', 'flag', C.line.c, 380],
  ['Material', 'smartphone', C.duo.c, 350],
  ['Lucide', 'command', C.gloss.c, 400],
  ['Heroicons', 'wind', C.kawaii?.c || '#FF7AA8', 360],
  ['Phosphor', 'sliders', C.retro?.c || '#E4572E', 390],
  ['Tabler', 'layout-grid', C.blueprint?.c || '#1F6FEB', 340],
  ['Bootstrap', 'boxes', C.luxe?.c || '#2B3A8C', 370],
  ['Hugeicons', 'package', C.sticker?.c || '#7A3CFF', 400],
  ['Flaticon', 'image', C.clay?.c || '#F28C38', 355],
]
const W = 64, GAP = 8, X0 = 724, FLOOR = 640

export default {
  base: 'best4',
  alt: 'A sweep of coloured pencils behind a shelf of ten colourful book spines named after free icon libraries, the first one, with icons, leaning out with a star, under an orange 10 free sets chip',
  photo: { filter: 'saturate(.9) brightness(.72)', pos: '50% 50%' },
  overlay: `linear-gradient(90deg, ${rgba('#111318', 0.15)} 0%, ${rgba('#111318', 0.45)} 50%, ${rgba('#111318', 0.55)} 100%)`,
  art: () => [
    glow({ cx: 1070, cy: 460, r: 330, color: C.solid.c, opacity: 0.35 }),
    BOOKS.map(([name, ic, col, h], i) => at(`<div class="bk" style="background:${col};height:${h}px">
      <span class="bk__ic">${icon(ic, 'solid', 34, '#fff')}</span><b>${name}</b></div>`,
      { x: X0 + i * (W + GAP) + (i === 0 ? -14 : 0), y: FLOOR - h, w: W, rot: i === 0 ? -9 : 0, style: i === 0 ? 'transform-origin:100% 100%;z-index:2' : '' })).join(''),
    at('<div class="shelf"></div>', { x: 700, y: FLOOR, w: 740 }),
    at(`<span class="star">${icon('star', 'solid', 50, '#fff')}</span>`, { x: 650, y: 170, z: 3 }),
    chip('10 free sets', { x: 1050, y: 140, tone: 'color', style: 'solid', size: 38, icon: ['library', 'line'], rot: 3 }),
    chip('Compared', { x: 1180, y: 700, tone: 'card', size: 30, icon: ['list-checks', 'line'], rot: -3 }),
  ].join(''),
  css: `
.bk { box-sizing: border-box; border-radius: 12px 12px 4px 4px; display: flex; flex-direction: column; align-items: center; padding-top: 16px; gap: 16px; box-shadow: inset -8px 0 0 rgba(0,0,0,.12), inset 0 -26px 0 rgba(255,255,255,.14), 0 30px 40px -24px rgba(0,0,0,.7); color: #fff; }
.bk b { writing-mode: vertical-rl; transform: rotate(180deg); font: 800 30px/1 var(--font-display); letter-spacing: -.01em; white-space: nowrap; }
.shelf { height: 30px; border-radius: 10px; background: linear-gradient(#FBF8F3, #DCD5C8); box-shadow: 0 30px 50px -20px rgba(0,0,0,.7); }
.star { width: 84px; height: 84px; border-radius: 50%; display: grid; place-items: center; background: ${C.solid.c}; box-shadow: 0 0 0 6px #fff, 0 20px 40px -14px rgba(0,0,0,.6); }
`,
}
