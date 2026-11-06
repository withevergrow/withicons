import { at, chip, C, INK, rgba } from '../tools/hero-kit.mjs'
import { heart } from '../media/svg-in-google-slides/_jag.mjs'

// A real projector on a flight case throws its beam up to the right; where it lands, a projected slide shows the same
// with icons heart twice: on the left cut into straight segments (the WMF round trip), on the right smooth (a big PNG).
const O = C.solid
const LENS = [588, 730]
const SX = 800, SY = 150, SW = 640, SH = 380 // the projected slide

export default {
  photoFile: 'svg-in-google-slides-beam.jpg',
  credit: { by: 'Natasha Latinovska', profile: 'https://www.pexels.com/@natasha-latinovska-1052962659/', source: 'https://www.pexels.com/photo/light-of-projector-20728625/', license: 'Pexels License' },
  alt: 'A projector on a flight case in a dark blue room beams a slide onto the wall: the same heart icon twice, one with jagged straight-line curves and one smooth and crisp',
  photo: { filter: 'saturate(1.05) brightness(.78)', pos: '50% 64%' },
  overlay: `linear-gradient(180deg, ${rgba('#0B0E2A', 0.35)} 0%, ${rgba('#0B0E2A', 0.05)} 60%)`,
  art: () => [
    // the beam, from the lens to the slide's corners
    at(`<svg width="1600" height="1000" viewBox="0 0 1600 1000"><defs><linearGradient id="bm" x1="${LENS[0]}" y1="${LENS[1]}" x2="${SX + SW}" y2="${SY}" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#fff" stop-opacity=".5"/><stop offset="1" stop-color="#fff" stop-opacity=".12"/></linearGradient></defs>
      <path d="M${LENS[0] - 10} ${LENS[1] - 10} L${SX} ${SY} L${SX + SW} ${SY + SH} L${LENS[0] + 12} ${LENS[1] + 8} Z" fill="url(#bm)" style="mix-blend-mode:screen"/></svg>`, { x: 0, y: 0 }),
    at(`<div class="pj">
      <div class="pj__half">${heart(250, INK, { jagged: true, dots: true, width: 1.6 })}</div>
      <div class="pj__half">${heart(250, INK, { width: 1.6 })}</div>
    </div>`, { x: SX, y: SY, w: SW, h: SH }),
    chip('jagged', { cx: SX + SW * 0.27, cy: SY + SH + 40, tone: 'ink', size: 34 }),
    chip('crisp', { cx: SX + SW * 0.75, cy: SY + SH + 40, tone: 'color', style: 'solid', size: 34, icon: ['check-circle', 'solid'] }),
    chip('WMF', { x: SX - 40, y: SY - 34, tone: 'card', size: 28, rot: -5 }),
    chip('PNG 2x', { x: SX + SW - 120, y: SY - 34, tone: 'sun', size: 28, rot: 4 }),
  ].join(''),
  css: `
.pj { box-sizing: border-box; height: 100%; display: grid; grid-template-columns: 1fr 1fr; align-items: center; padding: 30px 26px; border-radius: 10px;
  background: radial-gradient(120% 120% at 30% 20%, #FFFFFF 0%, #EEF0FF 70%, #DCE0FF 100%);
  box-shadow: 0 0 0 2px rgba(255,255,255,.6), 0 0 90px 10px rgba(170,180,255,.45), 0 40px 80px -30px rgba(0,0,0,.7); }
.pj__half { display: grid; place-items: center; }
.pj__half + .pj__half { border-left: 3px dashed ${rgba(O.c, 0.45)}; }
`,
}
