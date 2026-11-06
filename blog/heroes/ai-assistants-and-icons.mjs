import { at, card, chip, icon, glow, C, INK, rgba } from '../tools/hero-kit.mjs'

// A chat between a person and an assistant: the question, a made-up icon name struck out, then real with icons
// tiles with a check. Pink (ai) accent.
const P = C.gloss
const real = ['receipt', 'hand-coins', 'banknote'].map(n => `<span class="ch__tile">${icon(n, 'gloss', 92, P.c)}</span>`).join('')

export default {
  base: 'ai1',
  alt: 'A robot hand and a human hand reaching toward glowing AI letters, with a chat in front: a question about a refund icon, a made-up icon name crossed out, and three real pink gloss icons marked as real',
  photo: { filter: 'saturate(1) brightness(.72)', pos: '50% 50%' },
  overlay: `radial-gradient(60% 70% at 58% 45%, ${rgba('#0E0B2A', 0.55)} 0%, ${rgba('#0E0B2A', 0.2)} 100%)`,
  art: () => [
    glow({ cx: 940, cy: 470, r: 330, color: P.c, opacity: 0.35 }),
    at(`<div class="ch__me">an icon for refunds?</div>`, { x: 860, y: 140 }),
    card(`<div class="ch__bot">
      <div class="ch__who">${icon('sparkles', 'gloss', 44, P.c)}<i class="sk" style="width:180px"></i></div>
      <div class="ch__fake">${icon('x-circle', 'solid', 40, '#E5484D')}<code>refund-cash-back</code></div>
      <div class="ch__real">${real}</div>
    </div>`, { x: 710, y: 270, w: 600, tone: 'card', pad: 30, radius: 36 }),
    chip('real names', { x: 1120, y: 640, tone: 'color', style: 'gloss', icon: ['check-circle', 'solid'], size: 32, rot: -4 }),
  ].join(''),
  css: `
.ch__me { padding: 22px 30px; border-radius: 32px 32px 8px 32px; background: ${INK}; color: #fff; font: 700 38px/1 var(--font-display); letter-spacing: -.02em; white-space: nowrap; box-shadow: 0 30px 60px -28px rgba(0,0,0,.6); }
.hk-card { border-bottom-left-radius: 8px !important; }
.ch__bot { display: flex; flex-direction: column; gap: 20px; }
.ch__who { display: flex; align-items: center; gap: 16px; }
.ch__fake { display: flex; align-items: center; gap: 16px; padding: 16px 20px; border-radius: 18px; background: #FFF0F0; }
.ch__fake code { font: 600 30px/1 var(--font-mono); color: #B4232A; text-decoration: line-through; text-decoration-thickness: 3px; }
.ch__real { display: flex; gap: 18px; }
.ch__tile { width: 150px; height: 150px; border-radius: 40px; display: grid; place-items: center; background: ${P.soft}; }
.sk { display: block; height: 16px; border-radius: 9px; background: rgba(17,19,24,.12); }
`,
}
