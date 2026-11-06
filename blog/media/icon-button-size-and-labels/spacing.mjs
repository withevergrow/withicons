import { at, icon, INK, rgba } from '../../tools/hero-kit.mjs'
import { BG, CSS, B, BAD, verdict } from './_kit.mjs'

// WCAG 2.5.8's spacing exception, drawn at 6x: two toolbars of four 20 px icon buttons (bold, italic, link, trash).
// Left: buttons 2 px apart, so the dashed 24 px circles around them overlap: fails. Right: 8 px apart, the circles
// touch nothing: passes. A dimension line marks one circle as 24 px.
const K = 6, CY = 470, NAMES = ['bold', 'italic', 'link', 'trash']
function bar(x0, step, ok) {
  const col = ok ? B.c : BAD
  const cxs = NAMES.map((_, i) => x0 + 12 * K + i * step * K)
  const circles = cxs.map(cx => `<circle cx="${cx - x0 + 30}" cy="${12 * K + 30}" r="${12 * K}" stroke="${col}" stroke-width="5" stroke-dasharray="12 9"/>`).join('')
  // where two 24 px circles overlap (left toolbar only): a filled lens between the buttons
  const d = step * K, r = 12 * K, half = Math.sqrt(r * r - (d / 2) ** 2)
  const lenses = ok ? '' : cxs.slice(1).map(cx => `<ellipse cx="${cx - d / 2 - x0 + 30}" cy="${12 * K + 30}" rx="${r - d / 2 + 3}" ry="${half}" fill="${BAD}"/>`).join('')
  const w = cxs[3] - x0 + 12 * K + 60
  return at(`<div class="ib-panel"></div>`, { x: x0 - 40, y: CY - 12 * K - 70, w: w + 20, h: 24 * K + 140 })
    + at(`<svg width="${w}" height="${24 * K + 60}" fill="none">${circles}${lenses}</svg>`, { x: x0 - 30, y: CY - 12 * K - 30, z: 4 })
    + cxs.map((cx, i) => at(`<span class="sp-btn">${icon(NAMES[i], 'line', 16 * K, INK)}</span>`, { cx, cy: CY, w: 20 * K, h: 20 * K, z: 3 })).join('')
}
const L0 = 150, R0 = 820

export default {
  alt: 'Two toolbars of four 20 pixel icon buttons, bold, italic, link and trash, drawn large on blueprint paper: packed 2 pixels apart their dashed 24 pixel circles overlap and fail WCAG 2.5.8, spaced 8 pixels apart the circles touch nothing and pass',
  bg: BG,
  art: () => [
    bar(L0, 22, false),
    bar(R0, 28, true),
    at(`<span class="ib-mono">2 px gaps</span>`, { x: L0 - 10, y: 220 }),
    at(`<span class="ib-mono">8 px gaps</span>`, { x: R0 - 10, y: 220 }),
    at(`<div class="sp-dim"><i></i><span class="ib-mono">24 px</span><i></i></div>`, { x: R0 + 3 * 28 * K, y: CY + 12 * K + 62, w: 24 * K }),
    at(`<span class="sp-call">${icon('arrow-up', 'line', 30, BAD)}circles overlap</span>`, { cx: L0 + 12 * K + 1.5 * 22 * K, cy: CY + 12 * K + 90 }),
    at(verdict('fails 2.5.8', false), { cx: L0 + 12 * K + 1.5 * 22 * K, cy: 790 }),
    at(verdict('passes: spacing', true), { cx: R0 + 12 * K + 1.5 * 28 * K, cy: 790 }),
  ].join(''),
  css: `${CSS}
.sp-btn { box-sizing: border-box; width: 100%; height: 100%; display: grid; place-items: center; border-radius: 26px; background: #fff; border: 3px solid ${rgba(INK, 0.16)}; }
.sp-call { display: inline-flex; align-items: center; gap: 10px; font: 700 30px/1 var(--font-mono); color: ${BAD}; letter-spacing: -.02em; white-space: nowrap; }
.sp-dim { display: flex; align-items: center; gap: 0; position: relative; flex-direction: column; }
.sp-dim i { display: none; }
.sp-dim::before { content: ''; display: block; width: 100%; height: 22px; box-sizing: border-box; border: 3px solid ${B.text}; border-top: 0; margin-bottom: 12px; }
`,
}
