import { Resvg } from '@resvg/resvg-js'
import { at, icon, INK, rgba } from '../../tools/hero-kit.mjs'
import { icon as svgIcon } from '../../lib/blocks.mjs'
import { B, RED, GREEN, BG, LOOK_CSS } from './_look.mjs'

// Top: a zoomed pixel grid, twice. Left, a one-pixel wall sits exactly on a pixel column: one solid dark column.
// Right, the same wall shifted half a pixel: two half-grey columns. The true edge is outlined in cyan.
// Bottom: the real line home icon rasterised (resvg, deterministic) at 24 px and at 19.2 px, blown up 10x with
// nearest-neighbour pixels so the soft edges show, next to a real-size copy.
const CELL = 56, COLS = 7, ROWS = 5
function pixels(shift) {
  let cells = ''
  for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
    const a = shift ? (c === 3 || c === 4 ? 0.5 : 0) : (c === 3 ? 1 : 0)
    cells += `<i style="background:${a ? rgba(INK, a * 0.92) : '#fff'}"></i>`
  }
  const left = (3 + (shift ? 0.5 : 0)) * CELL
  return `<div class="bl-px">${cells}<span class="bl-edge" style="left:${left}px;width:${CELL}px"></span></div>`
}
const cov = shift => `<div class="bl-cov">${Array.from({ length: COLS }, (_, c) => `<span>${shift ? (c === 3 || c === 4 ? '50%' : '') : (c === 3 ? '100%' : '')}</span>`).join('')}</div>`

// real rasters of the line home icon
const paint = svg => svg.split('currentColor').join(INK)
const raw = paint(svgIcon('home', 'line', 24))
const png = svg => `data:image/png;base64,${Buffer.from(new Resvg(svg).render().asPng()).toString('base64')}`
const at24 = png(raw)
const at19 = png(raw.replace('width="24" height="24" viewBox="0 0 24 24"', 'width="20" height="20" viewBox="0 0 25 25"')) // 0.8 scale = 19.2 px
const real = (src, n, size, sub, col) => `<div class="bl-real">
  <img class="bl-zoom" src="${src}" style="width:${n * 10}px;height:${n * 10}px" alt="">
  <div class="bl-meta"><span class="bl-tiny"><img src="${src}" style="width:${n}px;height:${n}px" alt=""></span><b style="color:${col}">${size}</b><span class="lk-hand">${sub}</span></div>
</div>`

export default {
  alt: 'Zoomed pixel grids: a wall line on whole pixels makes one solid dark column (crisp), shifted half a pixel it becomes two grey columns (soft); below, the home icon rendered at 24 px and 19.2 px, blown up to show its pixels',
  bg: BG,
  art: () => [
    at(`<div class="lk-card lk-ok">${pixels(false)}${cov(false)}<div class="bl-t">on the pixel grid: <em style="color:${GREEN}">crisp</em></div></div>`, { x: 64, y: 64, w: 720, h: 532 }),
    at(`<div class="lk-card lk-bad">${pixels(true)}${cov(true)}<div class="bl-t">half a pixel off: <em style="color:${RED}">soft</em></div></div>`, { x: 816, y: 64, w: 720, h: 532 }),
    at(`<div class="lk-card bl-strip">${real(at24, 24, '24 px', '1 pixel per unit', GREEN)}${real(at19, 20, '19.2 px', '0.8 pixel per unit', RED)}</div>`, { x: 64, y: 628, w: 1472, h: 308 }),
  ].join(''),
  css: `${LOOK_CSS}
.bl-px { position: relative; display: grid; grid-template-columns: repeat(${COLS}, ${CELL}px); grid-auto-rows: ${CELL}px; gap: 0; border-top: 2px solid ${rgba(INK, 0.14)}; border-left: 2px solid ${rgba(INK, 0.14)}; margin-top: 6px; }
.bl-px i { box-sizing: border-box; border-right: 2px solid ${rgba(INK, 0.14)}; border-bottom: 2px solid ${rgba(INK, 0.14)}; }
.bl-edge { position: absolute; top: -18px; bottom: -18px; box-sizing: border-box; border: 4px dashed ${B.c}; border-radius: 4px; }
.bl-cov { display: grid; grid-template-columns: repeat(${COLS}, ${CELL}px); margin-top: 26px; }
.bl-cov span { display: flex; justify-content: center; font: 700 28px/1 var(--font-mono); color: ${B.text}; white-space: nowrap; }
.lk-ok, .lk-bad { justify-content: center; }
.bl-t { margin-top: 30px; font: 800 44px/1 var(--font-display); letter-spacing: -.03em; color: ${INK}; }
.bl-t em { font-style: normal; }
.bl-strip { flex-direction: row; justify-content: space-around; padding: 32px 40px; }
.bl-real { display: flex; align-items: center; gap: 36px; }
.bl-zoom { image-rendering: pixelated; display: block; background: #fff; box-shadow: 0 0 0 2px ${rgba(INK, 0.12)}; }
.bl-meta { display: flex; flex-direction: column; align-items: flex-start; gap: 12px; }
.bl-meta b { font: 800 48px/1 var(--font-mono); letter-spacing: -.03em; }
.bl-meta .lk-hand { margin: 0; text-align: left; }
.bl-tiny { display: inline-grid; place-items: center; width: 64px; height: 64px; border-radius: 16px; background: #F3EEE4; }
.bl-tiny img { display: block; }
`,
}
