import { at, icon, INK, rgba } from '../../tools/hero-kit.mjs'
import { BG, CSS } from './_kit.mjs'

// One clay heart, three times. Only --with-clay-c1 (the body colour) changes; shine, tint and shadow keep their
// defaults. Each card carries the one CSS line that made it. Gradient ids are made unique per copy, as inline
// outputs do, so each copy reads its own variables.
const CARDS = [
  ['default', null, 'no CSS needed'],
  ['lavender', '#A78BFA', '--with-clay-c1: #A78BFA'],
  ['mint', '#34D399', '--with-clay-c1: #34D399'],
]
const W = 400, H = 500, Y = 120
const X = [100, 600, 1100]
const heart = (k, c1) => `<div class="hv"${c1 ? ` style="--with-clay-c1:${c1}"` : ''}>${icon('heart', 'clay', 300).replace(/wg-clay-heart-/g, `wg-clay-heart-${k}-`)}</div>`

export default {
  alt: 'Three white cards with the same with icons clay heart: the default red one, a lavender one and a mint one, each labelled with the single CSS variable line that changed its body colour while the shine and shadow stay the same',
  bg: BG,
  art: () => CARDS.map(([name, c1, line], i) => [
    at(`<div class="k-card vc"><span class="vc__name">${name}</span>${heart(i, c1)}</div>`, { x: X[i], y: Y, w: W, h: H }),
    at(`<span class="k-lbl vl">${c1 ? `<em>--with-clay-c1:</em> ${c1}` : `<s>${line}</s>`}</span>`, { cx: X[i] + W / 2, cy: Y + H + 60 }),
    c1 ? at(`<i class="dot" style="background:${c1}"></i>`, { x: X[i] + W - 70, y: Y + 34 }) : '',
  ].join('')).join('') + at(`<span class="k-hand">same shine, same shadow</span>`, { cx: 800, cy: 820 }),
  css: `${CSS}
.vc { grid-template-rows: auto 1fr; padding: 36px 0 20px; }
.vc__name { font: 700 38px/1 var(--font-display); color: ${INK}; letter-spacing: -.02em; }
.hv { display: grid; place-items: center; }
.vl { font-size: 28px; }
.vl s { text-decoration: none; color: ${rgba(INK, 0.5)}; }
.dot { display: block; width: 36px; height: 36px; border-radius: 50%; border: 4px solid #fff; box-shadow: 0 0 0 2px ${rgba(INK, 0.12)}; }
`,
}
