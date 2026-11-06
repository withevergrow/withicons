import { at, icon, C, rgba, INK, SUN } from '../tools/hero-kit.mjs'

// Pure artwork: a high-contrast black poster. A giant violet braille cell on the left; on the right a grid of big white
// icons where one has keyboard focus (yellow and violet rings) and a label, plus a contrast badge and a tap-target tag.
const GRID = ['home', 'search', 'bell', 'heart', 'user', 'settings']
const FOCUS = 2
const braille = () => [[0, 0, 1], [1, 0, 1], [0, 1, 0], [1, 1, 1], [0, 2, 1], [1, 2, 0]]
  .map(([c, r, on]) => `<i class="${on ? 'is-on' : ''}" style="left:${c * 150}px;top:${r * 150}px"></i>`).join('')

export default {
  alt: 'Artwork of a black high-contrast poster with a giant violet braille cell and a grid of big white icons, one bell icon wearing a yellow focus ring, a 7:1 badge and a 44 px tag',
  bg: `radial-gradient(70% 80% at 75% 40%, #1E2130 0%, ${INK} 70%)`,
  art: () => [
    at(`<div class="br">${braille()}</div>`, { x: 210, y: 170, w: 260, h: 410 }),
    at(`<div class="ax">${GRID.map((n, i) => `<span class="ax__t${i === FOCUS ? ' is-focus' : ''}">${icon(n, 'line', 120, '#fff')}</span>`).join('')}</div>`, { x: 700, y: 230, w: 720, h: 470 }),
    at(`<span class="ax__lbl">Alerts</span>`, { cx: 1312, cy: 150, z: 3 }),
    at(`<span class="ax__badge"><b>7:1</b><small>contrast</small></span>`, { x: 488, y: 330, rot: -8 }),
    at(`<span class="ax__tag">${icon('hand', 'line', 46, INK)}44 px</span>`, { x: 780, y: 740, rot: -3 }),
  ].join(''),
  css: `
.br { position: relative; width: 100%; height: 100%; }
.br i { position: absolute; width: 110px; height: 110px; border-radius: 50%; border: 5px solid rgba(255,255,255,.18); box-sizing: border-box; }
.br i.is-on { border: 0; background: radial-gradient(circle at 35% 30%, #A996FF 0%, ${C.duo.c} 55%, #3E22C9 100%); box-shadow: 0 18px 30px -10px rgba(0,0,0,.8); }
.ax { display: grid; grid-template-columns: repeat(3, 1fr); gap: 34px; }
.ax__t { display: grid; place-items: center; height: 218px; border-radius: 48px; border: 4px solid rgba(255,255,255,.22); }
.ax__t.is-focus { border-color: #fff; background: rgba(255,255,255,.06); box-shadow: 0 0 0 10px ${SUN}, 0 0 0 20px ${C.duo.c}; position: relative; z-index: 2; }
.ax__lbl::after { content: ''; position: absolute; left: 50%; bottom: -12px; translate: -50% 0; border: 12px solid transparent; border-bottom: 0; border-top-color: #fff; }
.ax__lbl { position: relative; display: inline-block; padding: 12px 24px; border-radius: 14px; background: #fff; color: ${INK}; font: 800 40px/1 var(--font-display); letter-spacing: -.02em; }
.ax__badge { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; width: 180px; height: 180px; border-radius: 50%; background: ${SUN}; color: ${INK}; text-align: center; box-shadow: 0 30px 50px -20px rgba(0,0,0,.8); }
.ax__badge b { font: 800 70px/1 var(--font-display); letter-spacing: -.04em; }
.ax__badge small { font: 600 24px/1 var(--font-mono); }
.ax__tag { display: inline-flex; align-items: center; gap: 14px; padding: 18px 30px 18px 22px; border-radius: 999px; background: #fff; color: ${INK}; font: 800 46px/1 var(--font-mono); letter-spacing: -.03em; box-shadow: 0 30px 50px -20px rgba(0,0,0,.8); }
`,
}
