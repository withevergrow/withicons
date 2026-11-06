import { at, icon, INK, rgba } from '../../tools/hero-kit.mjs'
import { BLUE, BG, CSS } from './_kit.mjs'

// The mask method as a sum: a colour swatch (background-color) + the home SVG as a black stencil on a transparent
// checkerboard (mask) = the home icon in the swatch colour. Under the result, the same icon in slate, rose and white on
// dark, with a handwritten note: colour changes, shape stays.
const S = 340, Y = 150
const X = [150, 630, 1110]
const cx = i => X[i] + S / 2

export default {
  alt: 'Diagram: a cyan swatch labelled background-color: currentColor, plus the with icons home icon as a black stencil labelled mask: url(home.svg), equals the home icon in cyan, with the same icon below in slate, rose and white on dark',
  bg: BG,
  art: () => [
    at(`<div class="k-card"><div class="sw"></div></div>`, { x: X[0], y: Y, w: S, h: S }),
    at(`<div class="k-card is-check">${icon('home', 'line', 230, INK)}</div>`, { x: X[1], y: Y, w: S, h: S }),
    at(`<div class="k-card is-res">${icon('home', 'line', 230, BLUE)}</div>`, { x: X[2], y: Y, w: S, h: S }),
    at(`<span class="k-op">+</span>`, { cx: (X[0] + S + X[1]) / 2, cy: Y + S / 2 }),
    at(`<span class="k-op">=</span>`, { cx: (X[1] + S + X[2]) / 2, cy: Y + S / 2 }),
    at(`<span class="k-lbl"><em>background-color:</em><br>currentColor</span>`, { cx: cx(0), cy: Y + S + 74 }),
    at(`<span class="k-lbl"><em>mask:</em> url(home.svg)</span>`, { cx: cx(1), cy: Y + S + 56 }),
    at(`<span class="k-lbl">the icon</span>`, { cx: cx(2), cy: Y + S + 56 }),
    // the same shape, three colours
    ...[['#475569', '#fff'], ['#E11D48', '#fff'], ['#fff', '#1B1E27']].map(([c, bg], i) =>
      at(`<div class="mini" style="background:${bg}">${icon('home', 'line', 96, c)}</div>`, { x: 1050 + i * 162, y: 706, w: 142, h: 142 })),
    at(`<span class="k-hand">color changes,<br>shape stays</span>`, { x: 690, y: 728 }),
    at(`<svg width="140" height="80" viewBox="0 0 140 80" fill="none"><path d="M6 50 C 40 70, 90 66, 128 34" stroke="${BLUE}" stroke-width="5" stroke-linecap="round"/><path d="M106 30 L130 32 L124 56" stroke="${BLUE}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg>`, { x: 890, y: 776 }),
  ].join(''),
  css: `${CSS}
.sw { width: 76%; height: 76%; border-radius: 30px; background: ${BLUE}; }
.k-card.is-check { background: repeating-conic-gradient(${rgba(INK, 0.07)} 0 25%, #fff 0 50%) 0 0 / 40px 40px; }
.k-card.is-res { box-shadow: 0 0 0 6px ${rgba(BLUE, 0.25)}, 0 40px 80px -40px ${rgba(INK, 0.45)}; }
.mini { box-sizing: border-box; width: 100%; height: 100%; display: grid; place-items: center; border-radius: 34px; border: 2px solid ${rgba(INK, 0.08)}; box-shadow: 0 30px 50px -30px ${rgba(INK, 0.5)}; }
`,
}
