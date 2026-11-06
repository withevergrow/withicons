import { at, chip, icon, C, INK } from '../tools/hero-kit.mjs'
import { N_STYLES } from '../lib/blocks.mjs'

// Duotone photo (deep blue to pale blue) with one giant retro star in front. A slim white "weight" rail on the
// right holds the same star from hairline to filled: six weights, one look, against one icon in a whole new style.
const vsp = name => at(`<span class="vsp"><i>vs</i>${name}</span>`, { x: 170, y: 130 })
const VSP_CSS = `
.vsp { display: inline-flex; align-items: center; gap: 14px; padding: 10px 28px 10px 10px; border-radius: 999px; background: ${C.line.c}; color: #fff; font: 800 34px/1 var(--font-display); letter-spacing: -.02em; white-space: nowrap; box-shadow: 0 0 0 6px rgba(255,255,255,.85), 0 30px 60px -18px rgba(0,0,0,.5); }
.vsp i { font-style: normal; width: 58px; height: 58px; border-radius: 50%; background: #fff; color: ${C.line.c}; display: grid; place-items: center; font-size: 28px; letter-spacing: -.04em; }`

const WEIGHTS = [0.6, 1.1, 1.75, 2.5, 3.3]

export default {
  base: 'phos1',
  alt: 'A blue duotone photo of a phone in a hand behind one giant retro-style star, a white rail of the same star from hairline to filled, a 34 styles chip and a blue vs Phosphor pill',
  photo: { filter: 'grayscale(1) contrast(1.25) brightness(1.05)', pos: '40% 50%' },
  overlay: 'linear-gradient(#2140C8, #2140C8)',
  art: () => [
    at(`<div class="halo"></div>`, { cx: 900, cy: 500 }),
    at(icon('star', 'retro', 560), { cx: 900, cy: 490, rot: -8 }),
    at(`<div class="rail"><b>weight</b>${WEIGHTS.map(w => `<span style="--w:${w}">${icon('star', 'line', 70, INK)}</span>`).join('')}<span>${icon('star', 'solid', 70, INK)}</span></div>`, { x: 1300, y: 130 }),
    chip(`${N_STYLES} styles`, { x: 820, y: 780, tone: 'sun', size: 38, icon: ['palette', 'line'], rot: -4 }),
    vsp('Phosphor'),
  ].join(''),
  css: `${VSP_CSS}
.stage__overlay { mix-blend-mode: multiply; }
.stage__overlay::after { content: ''; position: absolute; inset: 0; background: #A9C4FF; mix-blend-mode: lighten; opacity: .45; }
.halo { width: 640px; height: 640px; border-radius: 50%; background: radial-gradient(circle, rgba(255,255,255,.35) 0%, rgba(255,255,255,0) 68%); }
.rail { display: grid; justify-items: center; gap: 14px; padding: 22px 18px 26px; border-radius: 999px; background: #fff; box-shadow: 0 40px 80px -30px rgba(0,0,0,.6); }
.rail b { font: 700 20px/1 var(--font-mono); letter-spacing: .02em; color: #5A606D; margin-bottom: 6px; }
.rail span { display: grid; }
.rail span svg { stroke-width: var(--w); }
`,
}
