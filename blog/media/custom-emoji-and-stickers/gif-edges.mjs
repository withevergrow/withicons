import { at, icon, C, rgba } from '../../tools/hero-kit.mjs'

// A do / don't pair on a dark chat-like background. Left: the kawaii heart as a GIF blended for white, so a pale fringe
// rings it on dark. Right: blended for dark (or a PNG), clean. Round magnifier insets show the edge pixels.
const DARK = '#1F2127', PANEL = '#2A2D35'
const BAD = '#FF5A5F', GOOD = '#2BC48A'

// a zoomed patch of edge pixels: background, (fringe), outline, fill, along a diagonal edge
function pixels(fringe) {
  const N = 9, P = 26
  let r = ''
  for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
    const d = i - j + 1
    const fill = d < -2 ? DARK : d < -1 ? (fringe ? '#ECE6E8' : '#3B3036') : d < 1 ? '#2B1D24' : d < 2 ? '#C9536F' : '#FF9DB4'
    r += `<rect x="${i * P}" y="${j * P}" width="${P - 2}" height="${P - 2}" rx="3" fill="${fill}"/>`
  }
  return `<svg width="${N * P}" height="${N * P}" viewBox="0 0 ${N * P} ${N * P}">${r}</svg>`
}
function side(x, { title, tags, fringe, verdict, good }) {
  const halo = fringe ? ' is-halo' : ''
  return [
    at(`<div class="pn"></div>`, { x, y: 180, w: 680, h: 690 }),
    at(`<div class="tt">${title}${tags || ''}</div>`, { x, y: 92 }),
    at(`<div class="hrt${halo}">${icon('heart', 'kawaii', 300)}</div>`, { x: x + 70, y: 260 }),
    at(`<svg width="680" height="690" viewBox="0 0 680 690" fill="none"><circle cx="338" cy="200" r="34" stroke="#fff" stroke-width="4"/><path d="M362 226 L 430 312" stroke="#fff" stroke-width="4" stroke-dasharray="2 10" stroke-linecap="round"/></svg>`, { x, y: 180 }),
    at(`<div class="zoom">${pixels(fringe)}</div>`, { x: x + 400, y: 420 }),
    at(`<span class="vd" style="background:${good ? GOOD : BAD}">${icon(good ? 'check' : 'close', 'solid', 30, '#fff')}${verdict}</span>`, { x: x + 40, y: 780 }),
  ].join('')
}

export default {
  alt: 'Two dark panels with the same kawaii heart icon: a GIF blended for white shows a pale halo around its edge, while a GIF blended for dark or a PNG has clean edges, each with a zoomed circle of its edge pixels',
  bg: DARK,
  art: () => [
    side(96, { title: 'GIF blended for white', fringe: true, verdict: 'Pale halo on dark' }),
    side(824, { title: 'GIF blended for dark', tags: '<em>or PNG</em>', fringe: false, verdict: 'Clean edges', good: true }),
  ].join(''),
  css: `
.pn { width: 100%; height: 100%; border-radius: 36px; background: ${PANEL}; box-shadow: inset 0 0 0 1.5px rgba(255,255,255,.06); }
.tt { display: flex; align-items: center; gap: 14px; font: 800 38px/1 var(--font-display); color: #fff; letter-spacing: -.02em; white-space: nowrap; }
.tt em { font-style: normal; padding: 8px 14px; border-radius: 999px; background: ${rgba('#ffffff', 0.12)}; font: 700 28px/1 var(--font-display); }
.hrt { isolation: isolate; }
.hrt svg > path:first-child { fill-opacity: 1; fill: #FF8DB6; } /* the same opaque fill on both sides, so only the edges differ */
.hrt.is-halo .hk-icon { filter: drop-shadow(0 0 2.4px #F3EEF0) drop-shadow(0 0 2px #F3EEF0) drop-shadow(0 0 1.2px #fff); }
.zoom { width: 234px; height: 234px; border-radius: 50%; overflow: hidden; box-shadow: 0 0 0 6px #fff, 0 30px 50px -20px rgba(0,0,0,.7); }
.zoom svg { display: block; }
.vd { display: inline-flex; align-items: center; gap: 10px; padding: 10px 20px 10px 14px; border-radius: 999px; font: 800 30px/1 var(--font-display); color: #fff; letter-spacing: -.01em; }
`,
}
