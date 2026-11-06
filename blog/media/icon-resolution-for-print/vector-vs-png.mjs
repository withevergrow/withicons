import { at, icon, C, INK, PAPER, rgba } from '../../tools/hero-kit.mjs'
import { pixIcon } from '../png-to-svg/_pix.mjs'

// Split: the same line printer icon enlarged to fill a big circle. Left from the vector (crisp), right from a 64 px PNG
// (blocks and soft edges). A magnifier ring on each side shows the same rounded corner up close.
const O = C.solid, BIG = 420, LENS = 230
const WX = 17.6, WY = 6.1, WU = 5.6   // the lens window, in icon units (top-right corner of the printer body)
const RES = 64

const lensVector = () => {
  const k = LENS / WU
  return `<div class="vp__lens"><div style="position:absolute;left:${-Math.round(WX * k)}px;top:${-Math.round(WY * k)}px;line-height:0">${icon('printer', 'line', Math.round(24 * k), INK)}</div></div>`
}
const lensPixel = () => {
  const r = RES / 24
  return `<div class="vp__lens">${pixIcon('printer', 'line', { res: RES, size: LENS, color: INK, view: [WX * r, WY * r, WU * r] })}</div>`
}
// dashed ring on the big icon marking where the lens looks
const ring = () => { const k = BIG / 24; return `<svg class="vp__ring" width="${BIG}" height="${BIG}" viewBox="0 0 ${BIG} ${BIG}"><circle cx="${(WX + WU / 2) * k}" cy="${(WY + WU / 2) * k}" r="${(WU / 2) * k}" fill="none" stroke="${O.c}" stroke-width="5" stroke-dasharray="10 8"/></svg>` }
const side = (big, lens, tag, ok) => `<div class="vp"><div class="vp__disc"><div class="vp__big">${big}${ring()}</div>${lens}</div><span class="vp__tag ${ok ? 'is-ok' : 'is-bad'}">${tag}</span></div>`

export default {
  bg: PAPER,
  alt: 'The same line printer icon enlarged in two big circles: on the left from an SVG or PDF with perfectly crisp lines, on the right from a 64 px PNG with visible square pixels, each with a magnifier on one rounded corner',
  art: () => [
    at(side(icon('printer', 'line', BIG, INK), lensVector(), 'SVG / PDF: sharp at any size', true), { x: 64, y: 64, w: 716, h: 872 }),
    at(side(pixIcon('printer', 'line', { res: RES, size: BIG, color: INK }), lensPixel(), '64 px PNG, enlarged', false), { x: 820, y: 64, w: 716, h: 872 }),
  ].join(''),
  css: `
.vp { box-sizing: border-box; height: 100%; padding: 50px 40px; border-radius: 36px; background: #fff; display: flex; flex-direction: column; align-items: center; justify-content: space-between; font-family: var(--font-display); box-shadow: 0 2px 0 rgba(17,19,24,.04), 0 40px 80px -44px rgba(17,19,24,.45); border: 1.5px solid ${rgba(INK, 0.06)}; }
.vp__disc { position: relative; width: 600px; height: 600px; border-radius: 50%; background: ${O.soft}; display: grid; place-items: center; }
.vp__big { position: relative; width: ${BIG}px; height: ${BIG}px; line-height: 0; }
.vp__ring { position: absolute; left: 0; top: 0; overflow: visible; }
.vp__lens { position: absolute; right: -24px; top: -16px; width: ${LENS}px; height: ${LENS}px; border-radius: 50%; overflow: hidden; background: #fff; box-shadow: 0 0 0 10px ${O.c}, 0 30px 50px -16px rgba(17,19,24,.55); }
.vp__tag { display: inline-flex; padding: 16px 30px; border-radius: 999px; font: 800 34px/1 var(--font-display); letter-spacing: -.02em; white-space: nowrap; }
.vp__tag.is-ok { background: #E3F6EA; color: #13703A; } .vp__tag.is-bad { background: #FDE7E7; color: #B4232A; }
`,
}
