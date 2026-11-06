import { at, icon, C, INK, PAPER, rgba } from '../tools/hero-kit.mjs'

// Treatment: a type-specimen poster pinned over a printer's type case. Its glyph grid has serif letters, but several
// cells are "tofu" (empty boxes with a hex code), and one cell is fixed: a crisp with icons home SVG in a cyan ring,
// with a hand-written note. A giant tofu box with its code floats on the left. Blueprint cyan (code) accent.
const B = C.blueprint
const tofu = (hex, big) => `<span class="tf${big ? ' is-big' : ''}"><i>${hex.slice(0, 2)}</i><i>${hex.slice(2)}</i></span>`
const CELLS = [['A'], ['g'], ['&amp;'], ['R'], ['tofu', 'F015'], ['k'], ['tofu', 'F0E0'], ['Q'], ['?'], ['tofu', 'F002'], ['fix'], ['tofu', 'F007']]
const cell = ([g, hex]) => g === 'tofu' ? `<span class="sp__cell">${tofu(hex)}</span>`
  : g === 'fix' ? `<span class="sp__cell is-fix">${icon('home', 'line', 92, B.text)}</span>`
  : `<span class="sp__cell"><b>${g}</b></span>`

export default {
  photoFile: 'icons-showing-as-squares-typecase.jpg',
  credit: { by: 'Erik Mclean', profile: 'https://www.pexels.com/@introspectivedsgn/', source: 'https://www.pexels.com/photo/cabinet-drawers-with-various-vintage-letterpress-4140925/', license: 'Pexels License' },
  alt: 'A cream type-specimen poster over dark drawers of vintage letterpress type: its grid of serif letters has four empty tofu boxes with hex codes, and one cell fixed with a crisp cyan home icon, beside a giant tofu box',
  photo: { filter: 'saturate(.7) brightness(.5) contrast(1.1)', pos: '50% 50%' },
  overlay: `linear-gradient(110deg, ${rgba('#120C08', 0.35)} 0%, ${rgba('#120C08', 0.1)} 60%, ${rgba('#120C08', 0.35)} 100%)`,
  art: () => [
    at(`<div class="sp">
      <div class="sp__head"><span class="sp__title">Specimen</span><span class="sp__meta">Regular 400<br>Icon font</span></div>
      <div class="sp__grid">${CELLS.map(cell).join('')}</div>
    </div>`, { x: 760, y: 108, w: 640, rot: 2, z: 2 }),
    at('<span class="sp__pin"></span>', { cx: 1080, cy: 126, z: 3 }),
    at(`<span class="sp__note">fixed!</span>`, { x: 930, y: 800, rot: -5, z: 4 }),
    at(`<svg width="120" height="90" viewBox="0 0 120 90" fill="none"><path d="M8 70 C 40 76, 84 60, 100 14 M78 26 L101 10 L112 38" stroke="#fff" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>`, { x: 1100, y: 770, z: 4 }),
    at(tofu('F015', true), { x: 260, y: 170, rot: -5, z: 2 }),
    at(`<span class="sp__tag">tofu</span>`, { x: 470, y: 420, rot: 6, z: 3 }),
  ].join(''),
  css: `
.sp { box-sizing: border-box; padding: 40px 44px 46px; border-radius: 22px; background: ${PAPER}; color: ${INK}; box-shadow: 0 2px 0 rgba(0,0,0,.08), 0 60px 110px -40px rgba(0,0,0,.9); }
.sp__head { display: flex; align-items: flex-end; justify-content: space-between; padding-bottom: 20px; margin-bottom: 26px; border-bottom: 3px solid ${INK}; }
.sp__title { font: 400 92px/.9 var(--font-serif); letter-spacing: -.02em; }
.sp__meta { font: 500 20px/1.35 var(--font-mono); text-align: right; color: #5A606D; }
.sp__grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
.sp__cell { display: grid; place-items: center; height: 140px; border-radius: 18px; background: #fff; border: 1.5px solid rgba(17,19,24,.08); }
.sp__cell b { font: 400 112px/1 var(--font-serif); }
.sp__cell.is-fix { background: ${B.soft}; border: 4px solid ${B.c}; box-shadow: 0 0 0 8px ${rgba(B.c, 0.18)}, 0 24px 40px -18px ${rgba(B.text, 0.6)}; }
.tf { box-sizing: border-box; display: grid; grid-template-columns: 1fr; align-content: center; justify-items: center; gap: 2px; width: 62px; height: 92px; border: 4px solid ${INK}; border-radius: 4px; font: 700 20px/1 var(--font-mono); color: ${INK}; }
.tf.is-big { width: 250px; height: 360px; border: 14px solid #fff; border-radius: 12px; gap: 16px; font-size: 84px; color: #fff; box-shadow: 0 40px 80px -30px rgba(0,0,0,.8); }
.tf i { font-style: normal; letter-spacing: .02em; }
.sp__pin { display: block; width: 30px; height: 30px; border-radius: 50%; background: ${C.solid.c}; box-shadow: 0 6px 10px rgba(0,0,0,.45), inset -4px -4px 0 rgba(0,0,0,.18); }
.sp__note { font: 700 64px/1 var(--font-hand); color: #fff; text-shadow: 0 4px 16px rgba(0,0,0,.6); }
.sp__tag { display: inline-block; padding: 12px 26px; border-radius: 999px; background: ${B.c}; color: #fff; font: 700 46px/1 var(--font-hand); box-shadow: 0 24px 40px -18px rgba(0,0,0,.7); }
`,
}
