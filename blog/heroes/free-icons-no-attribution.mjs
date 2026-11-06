import { at, tile, icon, C, INK } from '../tools/hero-kit.mjs'

// Pure artwork: a paper receipt in front of a big orange arch. Its lines say the icons are free and fine for
// business; the "credit line" row is struck out in orange marker, with a handwritten note pointing at it.
const O = C.solid
const row = (ic, name, val, cls = '') => `<div class="rc__row ${cls}">${icon(ic, 'solid', 34, cls ? '#6B7080' : INK)}<span>${name}</span><em></em><b>${val}</b></div>`
const ZZ = (pos, from) => `conic-gradient(from ${from}deg at 50% ${pos === 'top' ? '0' : '100%'}, #000 90deg, transparent 0) 0 ${pos === 'top' ? '0' : '100%'} / 28px 14px repeat-x`
const MASK = `linear-gradient(#000 0 0) 0 14px / 100% calc(100% - 28px) no-repeat, ${ZZ('top', 135)}, ${ZZ('bottom', -45)}`

export default {
  alt: 'A paper receipt on a peach background with a big orange arch, listing free with icons for business use, with the credit line struck out in orange marker',
  bg: `radial-gradient(50% 60% at 70% 45%, #FFE2D6 0%, transparent 70%), linear-gradient(150deg, #FFF6EF 0%, #FFE9DE 100%)`,
  art: () => [
    at(`<div class="arch"></div>`, { x: 760, y: 90, w: 640, h: 820 }),
    tile('shapes', 'solid', { x: 300, y: 170, size: 130, tone: 'card', rot: -8 }),
    tile('rocket', 'solid', { x: 470, y: 300, size: 110, tone: 'soft', rot: 6 }),
    tile('heart', 'solid', { x: 290, y: 380, size: 96, tone: 'card', rot: 4 }),
    at(`<div class="rcbox"><div class="rc">
      <div class="rc__head">${icon('receipt-text', 'solid', 40, O.c)}<b>with icons</b></div>
      <hr>
      ${row('layout-grid', 'Icons', 'free')}
      ${row('briefcase', 'Business', 'yes')}
      ${row('quote', 'Credit line', 'due', 'is-cut')}
      <hr>
      <div class="rc__total"><span>You owe</span><b>nothing</b></div>
      <div class="rc__bars"></div>
    </div></div>`, { x: 840, y: 150, rot: 3 }),
    at(`<div class="note">not needed!</div>`, { x: 470, y: 400, rot: -6 }),
    at(`<svg width="1600" height="1000"><path d="M640 490 C 700 530, 790 520, 860 500" stroke="${O.c}" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M836 482 L 864 500 L 840 522" stroke="${O.c}" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`, { x: 0, y: 0, z: 4 }),
  ].join(''),
  css: `
.arch { width: 100%; height: 100%; border-radius: 320px 320px 40px 40px; background: linear-gradient(170deg, ${O.c} 0%, #FF8A5C 100%); box-shadow: inset 0 -30px 60px rgba(186,47,14,.25); }
.rcbox { filter: drop-shadow(0 40px 36px rgba(120,40,10,.35)); }
.rc { width: 480px; box-sizing: border-box; padding: 48px 40px 44px; background: #fff; font-family: var(--font-mono); color: ${INK}; -webkit-mask: ${MASK}; mask: ${MASK}; }
.rc__head { display: flex; align-items: center; justify-content: center; gap: 12px; font: 800 40px/1 var(--font-display); letter-spacing: -.03em; }
.rc hr { border: 0; border-top: 3px dashed rgba(17,19,24,.25); margin: 30px 0; }
.rc__row { position: relative; display: flex; align-items: center; gap: 16px; font-size: 32px; font-weight: 600; margin: 26px 0; }
.rc__row em { flex: 1; border-bottom: 3px dotted rgba(17,19,24,.3); translate: 0 8px; }
.rc__row.is-cut { color: #6B7080; margin-bottom: 34px; }
.rc__row.is-cut::after { content: ''; position: absolute; left: -12px; right: -12px; top: 50%; height: 10px; margin-top: -2px; border-radius: 10px; background: ${O.c}; opacity: .92; rotate: -2deg; }
.rc__total { display: flex; justify-content: space-between; align-items: baseline; font-size: 30px; font-weight: 600; }
.rc__total b { font: 800 50px/1 var(--font-display); color: ${O.text}; letter-spacing: -.03em; }
.rc__bars { height: 60px; margin-top: 34px; background: repeating-linear-gradient(90deg, ${INK} 0 4px, transparent 4px 9px, ${INK} 9px 11px, transparent 11px 18px, ${INK} 18px 24px, transparent 24px 28px); opacity: .85; }
.note { font: 700 58px/1 var(--font-hand); color: ${O.text}; }
`,
}
