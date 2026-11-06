import { at, icon, C, INK, rgba } from '../tools/hero-kit.mjs'

// A black tally poster taped over the (greyed) wireframe sketches: a huge orange 30, and the 30 everyday icons a
// website needs printed small along its foot.
const CORE = ['home', 'search', 'menu', 'user', 'mail', 'phone', 'bell', 'heart', 'star', 'shopping-cart',
  'settings', 'close', 'check', 'arrow-right', 'chevron-down', 'plus', 'share', 'download', 'calendar', 'clock',
  'map-pin', 'lock', 'eye', 'trash', 'edit', 'image', 'play', 'info-circle', 'globe', 'log-in']
const O = C.solid

export default {
  base: 'xcount0',
  alt: 'Greyed watercolour website wireframes with a black poster taped over them, showing a huge orange 30 and the 30 everyday with icons a site needs',
  photo: { filter: 'grayscale(1) contrast(1.05) brightness(1.04)', pos: '50% 50%' },
  overlay: `linear-gradient(90deg, ${rgba('#FBF8F3', 0.15)} 0%, ${rgba('#FBF8F3', 0.35)} 100%)`,
  art: () => [
    at(`<div class="po">
      <div class="po__eye"><i></i>The core set<i></i></div>
      <div class="po__num">30</div>
      <div class="po__unit">icons</div>
      <div class="po__grid">${CORE.map((n, i) => icon(n, 'line', 46, i % 7 === 3 ? O.c : '#F4F0E8')).join('')}</div>
    </div>`, { x: 780, y: 120, rot: 2.5 }),
    at(`<div class="tape"></div>`, { x: 740, y: 120, rot: -32 }),
    at(`<div class="tape"></div>`, { x: 1270, y: 140, rot: 38 }),
    at(`<div class="tally">${[0, 1, 2, 3].map(() => '<i></i>').join('')}<b></b></div>`, { x: 500, y: 200, rot: -8 }),
  ].join(''),
  css: `
.po { width: 560px; height: 740px; box-sizing: border-box; padding: 44px 46px; border-radius: 28px; background: ${INK}; color: #F4F0E8; font-family: var(--font-display); box-shadow: 0 2px 0 rgba(17,19,24,.1), 0 60px 110px -40px rgba(17,19,24,.85); display: flex; flex-direction: column; align-items: center; }
.po__eye { display: flex; align-items: center; gap: 16px; align-self: stretch; font: 800 26px/1 var(--font-display); text-transform: uppercase; letter-spacing: .16em; color: ${O.c}; }
.po__eye i { flex: 1; height: 3px; background: ${rgba(O.c, 0.6)}; }
.po__num { margin-top: 14px; font-weight: 800; font-size: 330px; line-height: .86; letter-spacing: -.06em; color: ${O.c}; }
.po__unit { margin-top: -6px; font: italic 400 76px/1 var(--font-serif); color: #F4F0E8; }
.po__grid { margin-top: auto; display: grid; grid-template-columns: repeat(10, 46px); gap: 14px 1px; justify-content: space-between; align-self: stretch; padding-top: 28px; border-top: 2px dashed rgba(244,240,232,.25); }
.tape { width: 150px; height: 46px; background: ${rgba('#FFE7A8', 0.82)}; box-shadow: 0 6px 12px -6px rgba(0,0,0,.35); }
.tally { position: relative; display: flex; gap: 22px; padding: 10px 14px; }
.tally i { width: 12px; height: 150px; border-radius: 8px; background: ${O.c}; }
.tally i:nth-child(2) { rotate: 3deg; } .tally i:nth-child(3) { rotate: -2deg; } .tally i:nth-child(4) { rotate: 2deg; }
.tally b { position: absolute; left: -10px; right: -10px; top: 70px; height: 12px; border-radius: 8px; background: ${INK}; rotate: -24deg; }
`,
}
