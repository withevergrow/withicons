import { at, tile, chip, card, icon, glow, C, rgba } from '../tools/hero-kit.mjs'

// Light trails behind a frosted "player": icons mid-motion (ghost copies trail behind them), format chips around it.
const trail = (name, style, x, y, size, dx, dy, col) => [3, 2, 1].map(i => at(icon(name, style, size, col), { x: x - dx * i, y: y - dy * i, style: `opacity:${0.12 * (4 - i)};filter:blur(${i * 1.5}px)` })).join('') + at(icon(name, style, size, col), { x, y })

export default {
  base: 'xanim5',
  alt: 'Pink and orange light trails behind a frosted player card of with icons in motion, with Lottie, CSS and GIF format chips',
  photo: { filter: 'saturate(1.05) brightness(.8)', pos: '50% 50%' },
  overlay: `linear-gradient(100deg, ${rgba('#111318', 0.55)} 0%, ${rgba('#111318', 0.15)} 55%, ${rgba('#111318', 0.35)} 100%)`,
  art: () => [
    glow({ cx: 1010, cy: 470, r: 330, color: C.gloss.c, opacity: 0.35 }),
    card(`<div class="pl">
      ${trail('bell', 'gloss', 70, 70, 150, 26, 0, C.gloss.c)}
      ${trail('heart', 'kawaii', 330, 90, 130, 0, -22)}
      ${trail('rocket', 'soft3d', 560, 60, 160, 24, 18)}
      <div class="pl__bar"><span class="pl__play">${icon('play', 'solid', 34, '#fff')}</span><div class="pl__track"><i></i></div><span class="pl__time">0:01.2</span></div>
    </div>`, { x: 600, y: 170, w: 820, h: 440, tone: 'glass', pad: 0, radius: 44 }),
    chip('Lottie', { x: 500, y: 120, tone: 'card', style: 'gloss', icon: ['file-code', 'duo'], rot: -6 }),
    chip('CSS + SVG', { x: 1250, y: 120, tone: 'sun', icon: ['code', 'line'], rot: 5 }),
    chip('GIF', { x: 1310, y: 650, tone: 'card', icon: ['image', 'duo'], rot: -4 }),
    tile('loader', 'line', { x: 1180, y: 740, size: 120, tone: 'card' }),
    tile('sparkles', 'gloss', { x: 840, y: 730, size: 120, tone: 'soft', rot: 6 }),
  ].join(''),
  css: `
.pl { position: relative; width: 100%; height: 100%; }
.pl__bar { position: absolute; left: 34px; right: 34px; bottom: 30px; display: flex; align-items: center; gap: 22px; padding: 14px 22px 14px 14px; border-radius: 999px; background: rgba(17,19,24,.82); color: #fff; }
.pl__play { width: 64px; height: 64px; border-radius: 50%; display: grid; place-items: center; background: ${C.gloss.c}; }
.pl__track { flex: 1; height: 10px; border-radius: 10px; background: rgba(255,255,255,.2); overflow: hidden; }
.pl__track i { display: block; width: 46%; height: 100%; border-radius: 10px; background: linear-gradient(90deg, ${C.solid.c}, ${C.gloss.c}); }
.pl__time { font: 600 22px/1 var(--font-mono); opacity: .8; }
`,
}
