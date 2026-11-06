import { at, icon, chip, C, rgba, INK, PAPER } from '../../tools/hero-kit.mjs'

// Three made-up businesses side by side (a café front, a candle label, a podcast cover), all wearing the exact same
// with icons coffee icon. A dashed orange thread runs through the three icons: same icon, nobody owns it.
const O = C.solid.c
const W = 400, Y = 230, H = 540, XS = [128, 600, 1072], IY = Y + 250 // icon centre line
const awning = () => `<svg class="aw" viewBox="0 0 400 70" preserveAspectRatio="none">${Array.from({ length: 8 }, (_, i) => `<path d="M${i * 50} 0h50v44a25 25 0 0 1 -50 0z" fill="${i % 2 ? '#D7E8DC' : '#2F6B4A'}"/>`).join('')}</svg>`

export default {
  alt: 'Three made-up businesses side by side, a café called Morning Co., a candle shop called Wick and Wax and a podcast called Slow Sips, all using the exact same coffee icon, joined by a dashed orange line under the heading Same icon, three businesses and a chip saying Nobody owns it',
  bg: `radial-gradient(${rgba(INK, 0.08)} 2px, transparent 2.5px) 0 0 / 34px 34px, ${PAPER}`,
  art: () => [
    at(`<span class="ttl">Same icon, <em>three businesses</em></span>`, { cx: 800, cy: 132 }),
    at(`<div class="biz cafe">${awning()}<div class="biz__in">${icon('coffee', 'line', 170, '#2F6B4A')}<b>Morning Co.</b><small>café</small></div></div>`, { x: XS[0], y: Y, w: W, h: H }),
    at(`<div class="biz candle"><div class="biz__in">${icon('coffee', 'line', 170, '#7A4B2A')}<b>Wick &amp; Wax</b><small>candles</small></div></div>`, { x: XS[1], y: Y, w: W, h: H }),
    at(`<div class="biz pod"><div class="biz__in">${icon('coffee', 'line', 170, '#FFD9A8')}<b>Slow Sips</b><small>podcast</small></div></div>`, { x: XS[2], y: Y, w: W, h: H }),
    at(`<svg width="1600" height="1000" fill="none"><path d="M${XS[0] + W / 2 + 112} ${IY} H ${XS[1] + W / 2 - 112} M ${XS[1] + W / 2 + 112} ${IY} H ${XS[2] + W / 2 - 112}" stroke="${O}" stroke-width="6" stroke-dasharray="2 16" stroke-linecap="round"/>${XS.map(x => `<circle cx="${x + W / 2}" cy="${IY}" r="112" stroke="${O}" stroke-width="5" stroke-dasharray="2 13" stroke-linecap="round"/>`).join('')}</svg>`, { x: 0, y: 0, z: 3 }),
    chip('Nobody owns it', { cx: 800, cy: 872, tone: 'color', style: 'solid', size: 36, icon: ['help-circle', 'line'] }),
  ].join(''),
  css: `
.ttl { font: 800 58px/1 var(--font-display); letter-spacing: -.03em; color: ${INK}; white-space: nowrap; }
.ttl em { font: 400 66px/1 var(--font-serif); font-style: italic; letter-spacing: -.01em; color: ${C.solid.text}; }
.biz { position: relative; height: 100%; box-sizing: border-box; border-radius: 36px; overflow: hidden; box-shadow: 0 2px 0 rgba(17,19,24,.05), 0 50px 90px -44px rgba(17,19,24,.6); }
.biz__in { position: absolute; left: 0; right: 0; top: 165px; display: flex; flex-direction: column; align-items: center; }
.biz__in b { margin-top: 64px; font-size: 50px; line-height: 1; letter-spacing: -.02em; }
.biz__in small { margin-top: 14px; font: 600 28px/1 var(--font-display); text-transform: uppercase; letter-spacing: .14em; opacity: .7; }
.cafe { background: #fff; color: #2F6B4A; } .cafe .aw { position: absolute; left: 0; top: 0; width: 100%; height: 96px; }
.cafe b { font-weight: 800; }
.candle { background: #F3E6D3; color: #5E3A20; border: 10px solid #fff; }
.candle b { font: 400 60px/1 var(--font-serif); }
.pod { background: linear-gradient(160deg, #3A2350, #1C1426); color: #FFD9A8; }
.pod b { font-weight: 800; text-transform: uppercase; letter-spacing: .02em; }
`,
}
