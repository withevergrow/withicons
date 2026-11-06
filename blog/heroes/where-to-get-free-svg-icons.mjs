import { at, chip, icon, C, INK, rgba } from '../tools/hero-kit.mjs'

// Treatment: a bookshelf drawn in SVG/CSS over the library photo (pushed back and blurred). The "books" are icon files
// standing on two shelves; one, rocket.svg, is pulled out with an MIT licence tag hanging from it, and a download
// button waits below. Orange (guides) accent.
const O = C.solid
const SPINES = ['#FF5A36', '#FFD23F', '#2F5BFF', '#22A861', '#B57CFF', '#FF4FA3', '#0E9F9A', '#F57C12']
const book = (i, h, w = 34) => `<span class="bs__spine" style="height:${h}px;width:${w}px;background:${SPINES[i % SPINES.length]}"></span>`
const file = (name, style, col) => `<span class="bs__file">${icon(name, style, 92, col)}</span>`
const row1 = [book(0, 150), book(2, 170), file('camera', 'sticker'), book(5, 140, 28), file('heart', 'gloss', C.gloss.c), '<span class="bs__gap"></span>', book(3, 160), file('leaf', 'sketch'), book(1, 130, 40)].join('')
const row2 = [file('music-note', 'duo', C.duo.c), book(6, 155), book(4, 175, 30), file('cloud', 'clay'), book(7, 145), file('star', 'pixel'), book(2, 165, 28), book(0, 140)].join('')

export default {
  base: 'xlib2',
  alt: 'A long library, blurred far behind a drawn bookshelf whose books are SVG icon files in several styles; one file, rocket.svg, is pulled out with an MIT licence tag hanging from it, above an orange Download SVG button',
  photo: { filter: 'blur(4px) saturate(.85) brightness(.5)', pos: '50% 50%', scale: 1.06 },
  overlay: `linear-gradient(180deg, ${rgba('#1C120B', 0.2)}, ${rgba('#1C120B', 0.55)})`,
  art: () => [
    at(`<div class="bs">
      <div class="bs__row">${row1}</div><div class="bs__plank"></div>
      <div class="bs__row">${row2}</div><div class="bs__plank"></div>
    </div>`, { x: 690, y: 150, w: 750 }),
    at(`<div class="bs__out"><div class="bs__doc">${icon('rocket', 'solid', 150, O.c)}<span>rocket.svg</span></div></div>`, { x: 300, y: 150, rot: -9 }),
    at(`<svg width="120" height="120" viewBox="0 0 120 120" fill="none"><path d="M18 8 C 30 50, 60 70, 96 96" stroke="#F4E9DA" stroke-width="5" stroke-linecap="round"/></svg>`, { x: 470, y: 400 }),
    at(`<div class="bs__tag"><i></i><b>MIT</b><span>${icon('badge-check', 'solid', 30, '#22A861')}free to use</span></div>`, { x: 530, y: 460, rot: 10 }),
    at(`<span class="bs__dl">${icon('download', 'solid', 44, '#fff')}Download SVG</span>`, { x: 860, y: 700 }),
  ].join(''),
  css: `
.bs { padding: 26px 26px 0; border-radius: 30px 30px 18px 18px; background: linear-gradient(180deg, #6B4428, #55341D); box-shadow: inset 0 0 0 10px #7A4E2F, 0 60px 100px -40px #000; }
.bs__row { display: flex; align-items: flex-end; gap: 8px; height: 200px; padding: 0 14px; }
.bs__plank { height: 26px; margin: 0 -26px 26px; background: linear-gradient(180deg, #9A6A43, #7A4E2F); box-shadow: 0 10px 18px -6px rgba(0,0,0,.6); }
.bs__row + .bs__plank:last-child { margin-bottom: 0; border-radius: 0 0 18px 18px; }
.bs__spine { display: block; border-radius: 7px 7px 3px 3px; box-shadow: inset -6px 0 0 rgba(0,0,0,.15), inset 0 18px 0 -12px rgba(255,255,255,.35); }
.bs__file { width: 128px; height: 178px; border-radius: 16px; background: #fff; display: grid; place-items: center; box-shadow: inset 0 -10px 0 rgba(17,19,24,.06); }
.bs__gap { width: 128px; height: 178px; border-radius: 16px; border: 3px dashed rgba(255,255,255,.35); box-sizing: border-box; }
.bs__doc { width: 250px; height: 320px; box-sizing: border-box; padding: 56px 0 30px; border-radius: 24px; background: #fff; display: flex; flex-direction: column; align-items: center; justify-content: space-between; box-shadow: 0 0 0 5px ${O.c}, 0 50px 90px -30px #000; }
.bs__doc span { font: 700 26px/1 var(--font-mono); color: ${O.text}; }
.bs__tag { position: relative; display: flex; flex-direction: column; gap: 8px; padding: 22px 26px 22px 58px; border-radius: 18px 26px 26px 18px; background: #FFF6E5; box-shadow: 0 30px 60px -24px #000; }
.bs__tag i { position: absolute; left: 20px; top: 50%; translate: 0 -50%; width: 20px; height: 20px; border-radius: 50%; border: 5px solid ${O.c}; }
.bs__tag b { font: 800 72px/.9 var(--font-display); letter-spacing: -.04em; color: ${INK}; }
.bs__tag span { display: flex; align-items: center; gap: 8px; font: 700 24px/1 var(--font-display); color: #157A43; }
.bs__dl { display: inline-flex; align-items: center; gap: 18px; padding: 26px 40px 26px 32px; border-radius: 999px; background: ${O.c}; color: #fff; font: 800 44px/1 var(--font-display); letter-spacing: -.02em; white-space: nowrap; box-shadow: 0 30px 60px -24px rgba(0,0,0,.8); }
`,
}
