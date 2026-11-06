import { at, icon, C, INK, PAPER, rgba } from '../../tools/hero-kit.mjs'
import { pixIcon } from './_pix.mjs'

// Two cards. Each: the same small orange heart with a dashed ring on its upper-left edge, and a big magnifier on that
// edge. Traced SVG: a smooth curve with pen anchors. Fake SVG (a PNG inside): a staircase of pixels.
const O = C.solid, HEART = O.c
const U = 62                      // zoom: stage px per icon unit (24-unit grid)
const VX = -0.2, VY = 2.6, VW = 7.4 // the zoomed window, in icon units
const D = Math.round(VW * U)      // magnifier diameter
const ANCH = [[3.76, 4.65], [2.07, 8], [5.84, 3.34]]
const pt = ([x, y]) => [Math.round((x - VX) * U), Math.round((y - VY) * U)]

function vectorZoom() {
  const big = icon('heart', 'solid', 24 * U, HEART)
  const a = ANCH.map(pt).filter(([x, y]) => x > 0 && y > 0 && x < D && y < D)
  const [hx, hy] = pt([2.07, 8])
  const marks = `<svg width="${D}" height="${D}" viewBox="0 0 ${D} ${D}" style="position:absolute;left:0;top:0"><line x1="${hx}" y1="${hy - 70}" x2="${hx}" y2="${hy + 70}" stroke="${INK}" stroke-width="3"/><circle cx="${hx}" cy="${hy - 70}" r="9" fill="${INK}"/><circle cx="${hx}" cy="${hy + 70}" r="9" fill="${INK}"/>${a.map(([x, y]) => `<rect x="${x - 11}" y="${y - 11}" width="22" height="22" rx="3" fill="#fff" stroke="${INK}" stroke-width="4"/>`).join('')}</svg>`
  return `<div class="rv__lens"><div style="position:absolute;left:${-Math.round(VX * U)}px;top:${-Math.round(VY * U)}px;line-height:0">${big}</div>${marks}</div>`
}
const pixZoom = () => `<div class="rv__lens">${pixIcon('heart', 'solid', { res: 24, size: D, color: HEART, view: [VX, VY, VW] })}</div>`
// the small heart, with a dashed ring where the lens looks
const small = () => {
  const s = 130, k = s / 24, cx = (VX + VW / 2) * k, cy = (VY + VW / 2) * k, r = (VW / 2) * k
  return `<div class="rv__small">${icon('heart', 'solid', s, HEART)}<svg width="${s}" height="${s}" viewBox="0 0 ${s} ${s}" style="position:absolute;left:0;top:0;overflow:visible"><circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${INK}" stroke-width="3" stroke-dasharray="6 5"/></svg></div>`
}
const card = (title, lens, tag, ok) => `<div class="lk-card rv"><div class="rv__head">${small()}<span class="rv__t">${title}</span></div>${lens}<span class="rv__tag ${ok ? 'is-ok' : 'is-bad'}">${tag}</span></div>`

export default {
  bg: PAPER,
  alt: 'Two cards with the same small orange heart icon and a big magnifier on its edge: the traced SVG shows a smooth curve with pen anchor points, the fake SVG with a PNG inside shows a jagged staircase of pixels',
  art: () => [
    at(card('Traced SVG', vectorZoom(), 'Shapes', true), { x: 64, y: 64, w: 716, h: 872, cls: 'lk' }),
    at(card('Fake SVG <s>(PNG inside)</s>', pixZoom(), 'Still pixels', false), { x: 820, y: 64, w: 716, h: 872, cls: 'lk' }),
  ].join(''),
  css: `
.lk { font-family: var(--font-display); color: ${INK}; }
.lk-card { box-sizing: border-box; width: 100%; height: 100%; background: #fff; border-radius: 36px; box-shadow: 0 2px 0 rgba(17,19,24,.04), 0 40px 80px -44px rgba(17,19,24,.45); border: 1.5px solid ${rgba(INK, 0.06)}; }
.rv { display: flex; flex-direction: column; align-items: center; justify-content: space-between; padding: 40px 40px 48px; }
.rv__head { display: flex; align-items: center; gap: 28px; align-self: stretch; }
.rv__small { position: relative; width: 130px; height: 130px; flex: none; line-height: 0; }
.rv__t { font: 800 46px/1.05 var(--font-display); letter-spacing: -.025em; }
.rv__t s { text-decoration: none; display: block; font: 600 32px/1.2 var(--font-display); color: #5A606D; letter-spacing: -.01em; }
.rv__lens { position: relative; width: ${D}px; height: ${D}px; border-radius: 50%; overflow: hidden; background: #fff; box-shadow: 0 0 0 14px ${INK}, 0 0 0 22px ${O.soft}, 0 40px 60px -20px rgba(17,19,24,.5); }
.rv__tag { display: inline-flex; padding: 14px 30px; border-radius: 999px; font: 800 36px/1 var(--font-display); letter-spacing: -.02em; }
.rv__tag.is-ok { background: #E3F6EA; color: #13703A; } .rv__tag.is-bad { background: #FDE7E7; color: #B4232A; }
`,
}
