import { at, icon, chip, glow, C, INK, rgba } from '../tools/hero-kit.mjs'

// A long-exposure night street, all light trails. Over it, a flip-book: five pages fanned from one bound corner, each
// page one frame of the bell's ring (0, 14, -10, 6, 0 degrees, the post's own keyframes), numbered like a film strip.
// A cyan chip names the keyframes; a white chip gives the duration. Code category accent: blueprint cyan.
const B = C.blueprint
const PX = 880, PY = 806 // the bound corner (bottom-left of every page)
const W = 540, H = 170
// [frame angle of the bell, page fan angle]
const PAGES = [[0, 0], [14, -17], [-10, -34], [6, -51], [0, -68]]

const page = ([bell, fan], i) => at(`<div class="fb${i === 0 ? ' is-top' : ''}">
  <span class="fb__n">${String(i + 1).padStart(2, '0')}</span>
  <span class="fb__bell" style="rotate:${bell}deg">${icon('bell', 'duo', 108, C.duo.text)}</span>
  ${i === 0 ? '<span class="fb__track"><i></i><i></i><i></i><i></i><i></i><b></b></span>' : ''}
  ${Math.abs(bell) > 3 ? `<svg class="fb__swish" viewBox="0 0 80 120" fill="none" style="${bell > 0 ? 'right:150px' : 'right:6px;scale:-1 1'}"><path d="M60 14 C 30 40, 30 80, 60 106" stroke="${B.c}" stroke-width="7" stroke-linecap="round"/><path d="M30 34 C 14 52, 14 70, 30 88" stroke="${B.c}" stroke-width="7" stroke-linecap="round" opacity=".55"/></svg>` : ''}
</div>`, { x: PX, y: PY - H, w: W, h: H, rot: fan, z: 8 - i, style: 'transform-origin: 0 100%;' })

export default {
  photoFile: 'animate-svg-icons-trails2.jpg',
  credit: { by: 'Egor Litvinov', profile: 'https://unsplash.com/@litvinov', source: 'https://unsplash.com/photos/nighttime-traffic-light-trails-captured-with-long-exposure-6-QINjM3DSM', license: 'Unsplash License' },
  alt: 'Red and gold light trails from a long-exposure night photo behind a flip-book of five white pages fanned out from one pinned corner, each page showing one frame of a violet bell icon swinging as it rings',
  photo: { filter: 'saturate(1.05) brightness(.62) blur(1.5px)', pos: '50% 40%', scale: 1.04 },
  overlay: `radial-gradient(ellipse at 62% 48%, ${rgba('#04121A', 0.1)} 0%, ${rgba('#04121A', 0.6)} 85%)`,
  art: () => [
    glow({ cx: 1000, cy: 520, r: 300, color: B.c, opacity: 0.32, blur: 90 }),
    ...PAGES.map(page),
    at(`<span class="fb__bind"></span>`, { cx: PX + 6, cy: PY - 14, w: 64, h: 64, z: 9 }),
    chip('@keyframes ring', { x: 1080, y: 150, tone: 'color', style: 'blueprint', size: 36, rot: 4, z: 10, icon: ['play', 'solid'] }),
    chip('0.8 s', { x: 640, y: 210, tone: 'card', size: 36, rot: -6, z: 10, icon: ['timer', 'line'] }),
  ].join(''),
  css: `
.fb { box-sizing: border-box; position: relative; width: 100%; height: 100%; border-radius: 26px 30px 30px 26px; background: linear-gradient(160deg, #FFFFFF, #F1EDF9);
  box-shadow: 0 2px 0 rgba(17,19,24,.05), 0 40px 70px -30px rgba(0,0,0,.8); border: 1.5px solid ${rgba(C.duo.c, 0.18)}; }
.fb:not(.is-top) { background: linear-gradient(160deg, #F6F3FF, #E6E0F6); }
.fb__n { position: absolute; right: 196px; top: 30px; font: 700 28px/1 var(--font-mono); color: ${rgba(INK, 0.45)}; }
.fb.is-top .fb__n { color: ${B.text}; }
.fb__bell { position: absolute; right: 40px; top: 12px; display: grid; place-items: center; transform-origin: 50% 12%; }
.fb__swish { position: absolute; top: 30px; width: 40px; height: 60px; }
.fb__track { position: absolute; left: 70px; bottom: 34px; width: 250px; height: 8px; border-radius: 6px; background: ${rgba(INK, 0.1)}; display: flex; justify-content: space-between; align-items: center; }
.fb__track i { width: 14px; height: 14px; border-radius: 50%; background: #fff; border: 3px solid ${rgba(INK, 0.25)}; box-sizing: border-box; }
.fb__track b { position: absolute; left: -9px; top: -9px; width: 26px; height: 26px; border-radius: 50%; background: ${B.c}; box-shadow: 0 0 0 5px ${rgba(B.c, 0.25)}; }
.fb__bind { display: block; width: 100%; height: 100%; border-radius: 50%; background: radial-gradient(circle at 40% 35%, #6A7080, #2B2F3A 70%); border: 5px solid #fff; box-shadow: 0 20px 40px -16px rgba(0,0,0,.8); }
`,
}
