import { Resvg } from '@resvg/resvg-js'
import { at, chip, icon, C, INK, rgba } from '../tools/hero-kit.mjs'
import { icon as svgIcon } from '../lib/blocks.mjs'

// Treatment: split poster. The left half of the stage is the screen-pixel photo with a real 20 px PNG of the heart
// blown up (blocky, nearest-neighbour); the right half is flat violet with the same heart as SVG, still crisp.
// Violet (basics) accent.
const V = C.duo
const SPLIT = 820, BIG = 540, PX = 20
const paint = (svg, col) => svg.split('var(--with-duo, currentColor)').join(col).split('currentColor').join(col)
// rasterise the real icon at 20 px (deterministic), then show it scaled up with nearest-neighbour pixels
const png = new Resvg(paint(svgIcon('heart', 'duo', PX), '#FFFFFF'), { fitTo: { mode: 'width', value: PX } }).render().asPng()
const pngUrl = `data:image/png;base64,${Buffer.from(png).toString('base64')}`
const heart = { cx: SPLIT, cy: 440 }

export default {
  base: 'svg5',
  alt: 'A split poster: on the left, red, green and blue screen pixels behind a blocky pixelated white heart labelled PNG; on the right, flat violet behind the same heart as a crisp SVG',
  photo: { filter: 'saturate(1.2) brightness(.6)', pos: '50% 50%' },
  overlay: `linear-gradient(90deg, ${rgba('#140E2E', 0.45)}, ${rgba('#140E2E', 0.1)})`,
  art: () => [
    at('<div class="sp__right"></div>', { x: SPLIT, y: 0, w: 1600 - SPLIT, h: 1000 }),
    at(`<img class="sp__png" src="${pngUrl}" alt="">`, { ...heart, w: BIG, h: BIG, style: `clip-path: inset(0 50% 0 0)` }),
    at(icon('heart', 'duo', BIG, '#fff'), { ...heart, style: `clip-path: inset(0 0 0 50%)` }),
    at('<span class="sp__word">PNG</span>', { x: 190, y: 120 }),
    at('<span class="sp__word">SVG</span>', { x: 1170, y: 120 }),
    at(`<div class="sp__knob">${icon('arrow-left-right', 'solid', 40, INK)}</div>`, { cx: SPLIT, cy: 800 }),
    chip('sharp at any size', { x: 940, y: 700, tone: 'card', icon: ['zoom-in', 'line'], size: 30, rot: -3 }),
  ].join(''),
  css: `
.sp__right { width: 100%; height: 100%; background: radial-gradient(70% 60% at 30% 45%, #8C70FF 0%, ${V.c} 55%, #4B2BD6 100%); box-shadow: -4px 0 0 #fff; }
.sp__png { display: block; width: 100%; height: 100%; image-rendering: pixelated; filter: drop-shadow(0 0 30px rgba(0,0,0,.35)); }
.sp__word { display: block; font: 800 120px/1 var(--font-display); letter-spacing: -.04em; color: #fff; }
.sp__knob { width: 96px; height: 96px; border-radius: 50%; background: #fff; display: grid; place-items: center; box-shadow: 0 20px 40px -14px rgba(0,0,0,.6); }
`,
}
