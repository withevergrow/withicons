import { at, icon, C, INK, rgba } from '../tools/hero-kit.mjs'
import { round, flat, gloss } from '../media/emoji-vs-icons/_faces.mjs'

// Pure artwork, a face-off on a split pastel background. Left (butter yellow): one smiley character drawn three ways,
// as three devices would. Right (lavender): the with icons smile in duo, one steady drawing, repeated identically.
const SPLIT = 900

export default {
  alt: 'A split pastel face-off: on the yellow side one smiley drawn three different ways, round, flat outlined and glossy; on the violet side one duo smile icon on a white tile with three identical small copies below, and a vs badge between them',
  bg: `linear-gradient(90deg, #FFF0B3 0 ${SPLIT}px, #E6DEFF ${SPLIT}px 100%)`,
  art: () => [
    at(`<div class="dots"></div>`, { x: SPLIT, y: 0, w: 700, h: 1000 }),
    // left: three drawings of one character
    at(`<div class="face">${round(250, 'evi-r')}</div>`, { cx: 300, cy: 380, rot: -8 }),
    at(`<div class="face">${flat(250)}</div>`, { cx: 540, cy: 300, rot: 4 }),
    at(`<div class="face">${gloss(250, 'evi-g')}</div>`, { cx: 715, cy: 440, rot: -3 }),
    at(`<span class="lbl is-emoji">Emoji</span>`, { x: 190, y: 140, rot: -3 }),
    at(`<span class="hand">3 devices, 3 faces</span>`, { x: 215, y: 530, rot: -4 }),
    // right: one icon, the same every time
    at(`<div class="ic">${icon('smile', 'duo', 230, C.duo.text)}</div>`, { cx: 1200, cy: 390 }),
    at(`<div class="row">${[0, 1, 2].map(() => `<i>${icon('smile', 'duo', 64, C.duo.text)}</i>`).join('')}</div>`, { cx: 1200, cy: 690 }),
    at(`<span class="lbl is-icon">Icon</span>`, { x: 1250, y: 150, rot: 3 }),
    at(`<span class="hand is-icon">always the same</span>`, { cx: 1200, cy: 800, rot: -2 }),
    // vs
    at(`<span class="vs">vs</span>`, { cx: SPLIT, cy: 420 }),
  ].join(''),
  css: `
.dots { width: 100%; height: 100%; background: radial-gradient(${rgba(C.duo.c, 0.16)} 2px, transparent 2.5px) 0 0 / 34px 34px; }
.face { filter: drop-shadow(0 30px 30px rgba(120, 80, 0, .28)); line-height: 0; }
.ic { width: 360px; height: 360px; border-radius: 96px; background: #fff; display: grid; place-items: center; box-shadow: 0 2px 0 rgba(17,19,24,.04), 0 50px 90px -40px ${rgba(C.duo.c, 0.75)}; border: 1.5px solid ${rgba(C.duo.c, 0.16)}; }
.row { display: flex; gap: 26px; }
.row i { width: 104px; height: 104px; border-radius: 30px; background: #fff; display: grid; place-items: center; box-shadow: 0 20px 40px -24px ${rgba(C.duo.c, 0.8)}; }
.lbl { display: inline-block; padding: 14px 28px; border-radius: 999px; font: 800 52px/1 var(--font-display); letter-spacing: -.03em; }
.lbl.is-emoji { background: ${INK}; color: #FFE36E; }
.lbl.is-icon { background: ${C.duo.c}; color: #fff; }
.hand { font: 700 46px/1 var(--font-hand); color: #8A5A00; white-space: nowrap; }
.hand.is-icon { color: ${C.duo.text}; }
.vs { width: 120px; height: 120px; border-radius: 50%; display: grid; place-items: center; background: #fff; color: ${INK}; font: 800 46px/1 var(--font-display); letter-spacing: -.04em; box-shadow: 0 0 0 10px ${rgba('#ffffff', 0.5)}, 0 30px 50px -20px rgba(17,19,24,.45); }
`,
}
