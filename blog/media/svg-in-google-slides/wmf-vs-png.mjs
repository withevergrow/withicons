import { at, chip, icon, C, INK, rgba } from '../../tools/hero-kit.mjs'
import { heart } from './_jag.mjs'

// In-post: the with icons heart (line) at about 8x, twice. Left: after an SVG -> WMF -> Slides round trip, every curve
// is a chain of straight segments (dots on the corner points). Right: a 1024 px PNG, smooth with soft edges.
const O = C.solid
const panel = (label, sub, art, tone) => `<div class="wv__panel${tone ? ' is-' + tone : ''}">
  <div class="wv__head"><b>${label}</b><span>${sub}</span></div>
  <div class="wv__art">${art}</div>
</div>`

export default {
  alt: 'Two white panels compare one heart icon zoomed in: after the WMF round trip its curves are straight segments with dots at each corner, while the large PNG version is smooth',
  bg: `radial-gradient(${rgba(INK, 0.09)} 2px, transparent 2.5px) 0 0 / 34px 34px, linear-gradient(180deg, #FBF8F3, #F3EEE5)`,
  art: () => [
    at(panel('SVG → WMF → Slides', 'curves become straight lines', heart(470, INK, { jagged: true, dots: true, width: 1.5 }), 'bad'), { x: 96, y: 96, w: 680, h: 690 }),
    at(panel('PNG at 1024 px', 'curves stay curves', `<div class="wv__soft">${heart(470, INK, { width: 1.5 })}</div>`, 'good'), { x: 824, y: 96, w: 680, h: 690 }),
    chip('jagged curves', { cx: 436, cy: 860, tone: 'ink', size: 34, icon: ['x-circle', 'solid'] }),
    chip('smooth', { cx: 1164, cy: 860, tone: 'color', style: 'solid', size: 34, icon: ['check-circle', 'solid'] }),
    at(`<span class="wv__zoom">${icon('zoom-in', 'solid', 34, '#fff')}8x</span>`, { cx: 800, cy: 440, z: 3 }),
  ].join(''),
  css: `
.wv__panel { box-sizing: border-box; height: 100%; display: flex; flex-direction: column; border-radius: 36px; background: #fff; box-shadow: 0 2px 0 rgba(17,19,24,.04), 0 40px 80px -40px rgba(17,19,24,.45); overflow: hidden; border: 2px solid rgba(17,19,24,.06); }
.wv__head { display: flex; flex-direction: column; gap: 8px; padding: 30px 36px 22px; border-bottom: 2px solid rgba(17,19,24,.07); }
.wv__head b { font: 800 40px/1 var(--font-display); letter-spacing: -.03em; color: ${INK}; }
.wv__head span { font: 500 28px/1.1 var(--font-display); color: #5A606D; }
.wv__panel.is-good .wv__head b { color: ${O.text}; }
.wv__art { flex: 1; display: grid; place-items: center;
  background: linear-gradient(rgba(17,19,24,.045) 2px, transparent 2px) 0 0 / 40px 40px, linear-gradient(90deg, rgba(17,19,24,.045) 2px, transparent 2px) 0 0 / 40px 40px; }
.wv__soft { filter: blur(.9px); }
.wv__zoom { display: inline-flex; align-items: center; gap: 8px; padding: 14px 20px 14px 16px; border-radius: 999px; background: ${O.c}; color: #fff; font: 800 34px/1 var(--font-display); box-shadow: 0 0 0 8px #FBF8F3, 0 20px 40px -16px rgba(17,19,24,.5); }
`,
}
