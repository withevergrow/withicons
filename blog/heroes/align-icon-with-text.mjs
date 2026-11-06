import { at, icon, C, INK, rgba } from '../tools/hero-kit.mjs'

// A white desk with a ruler and pink paper. Across it runs one giant word, "Home", with the with icons home
// icon in front of it, and three cyan typographic guide lines run the full width of the picture: cap height, x-height
// and baseline. The word box is trimmed with CSS text-box (cap / alphabetic), so the lines sit exactly on this font's
// own metrics, and the icon is centred between cap height and baseline.
const BLUE = C.blueprint.c
const FS = 270 // the word's font size
const Y = 380 // top of the trimmed word box (= the cap-height line)
const X = 450 // left of the icon
const IC = Math.round(FS * 0.86), GAP = Math.round(FS * 0.16)
const LBL = 2400 - (X + IC + GAP - 168) // label x inside a guide line, so labels start at stage x 168

const line = (label, pos, below) => `<div class="gl${below ? ' is-below' : ''}" style="${pos}"><span>${label}</span></div>`

export default {
  photoFile: 'align-icon-with-text-desk.jpg',
  credit: { by: 'Jess Bailey Designs', profile: 'https://www.pexels.com/@jessbaileydesign/', source: 'https://www.pexels.com/photo/minimalist-workspace-with-pencils-and-ruler-34918669/', license: 'Pexels License' },
  alt: 'A white desk with a pink ruler and paper, with the giant word Home and the with icons home icon on it, and cyan cap height, x-height and baseline guide lines running across the whole picture',
  photo: { filter: 'saturate(.95) brightness(1.0)', pos: '50% 2%', scale: 1.02 },
  overlay: `linear-gradient(90deg, ${rgba('#FBF8F3', 0.55)} 0%, ${rgba('#FBF8F3', 0.15)} 70%, transparent 100%)`,
  art: () => [
    at(`<div class="row">
      <span class="ic">${icon('home', 'line', IC, INK)}</span>
      <span class="w">Home${line('cap height', 'top:0')}${line('x-height', 'bottom:1ex', true)}${line('baseline', 'bottom:0')}</span>
    </div>`, { x: X, y: Y }),
    at(`<span class="ok">${icon('check', 'line', 34, '#fff')}</span>`, { x: X + IC - 26, y: Y - 52, z: 3 }),
  ].join(''),
  css: `
.row { position: relative; z-index: 0; display: flex; align-items: center; gap: ${GAP}px; }
.ic { display: block; line-height: 0; }
.w { position: relative; display: block; font: 800 ${FS}px/1 var(--font-display); letter-spacing: -.045em; color: ${INK}; text-box: trim-both cap alphabetic; white-space: nowrap; }
.gl { position: absolute; left: -2400px; width: 5000px; height: 0; border-top: 4px solid ${BLUE}; font-size: ${FS}px; }
.gl span { position: absolute; left: ${LBL}px; top: -42px; padding: 0; font: 600 30px/1 var(--font-mono); color: ${C.blueprint.text}; letter-spacing: 0; }
.gl.is-below span { top: 12px; }
.w::before { content: ''; position: absolute; left: -2400px; width: 5000px; top: 0; bottom: 0; background: ${rgba(BLUE, 0.12)}; z-index: -1; }
.ok { display: grid; place-items: center; width: 64px; height: 64px; border-radius: 50%; background: #1FA463; box-shadow: 0 0 0 6px #fff, 0 16px 30px -10px rgba(0,0,0,.4); }
`,
}
