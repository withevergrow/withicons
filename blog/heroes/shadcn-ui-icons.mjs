import { at, chip, icon, C, INK, PAPER, rgba } from '../tools/hero-kit.mjs'

// Treatment: isometric 3D stack of layers. components.json at the bottom, the copied UI components in the middle and
// the icon layer on top, now drawn in with icons solid; the desk photo is cropped into an arch behind it on the right.
// Orange (guides) accent.
const O = C.solid
const ui = `<div class="iso__ui"><span class="iso__btn"></span><i style="width:70%"></i><i style="width:85%"></i><i style="width:55%"></i></div>`
const icons = ['settings', 'bell', 'search', 'user', 'credit-card', 'log-out'].map(n => `<span class="iso__ic">${icon(n, 'solid', 62, O.c)}</span>`).join('')

export default {
  base: 'landing1',
  alt: 'A laptop on a wooden desk, cropped into a tall arch, behind an isometric stack of three layers: components.json at the bottom, UI components in the middle and a top layer of orange solid icons from with icons',
  photo: { filter: 'saturate(.9) brightness(.95)', pos: '50% 50%' },
  overlay: 'none',
  bg: '#F7EEE6',
  art: () => [
    at('<div class="iso__dots"></div>', { x: 0, y: 0, w: 1600, h: 1000 }),
    at(`<div class="iso">
      <div class="iso__l iso__l--json"><code>"iconLibrary": <b>"withicons"</b></code></div>
      <div class="iso__l iso__l--ui">${ui}${ui}</div>
      <div class="iso__l iso__l--icons">${icons}</div>
    </div>`, { cx: 760, cy: 450 }),
    chip('with icons', { x: 1090, y: 215, tone: 'color', style: 'solid', icon: ['sparkles', 'solid'], size: 34, rot: -3 }),
    chip('components', { x: 1110, y: 420, tone: 'card', icon: ['component', 'line'], size: 30, rot: 2 }),
    chip('components.json', { x: 1060, y: 600, tone: 'ink', icon: ['file-json', 'line'], size: 30, rot: -2 }),
  ].join(''),
  css: `
.stage__photo { clip-path: inset(70px 150px 0 930px round 260px 260px 0 0); }
.iso__dots { background-image: radial-gradient(${rgba(O.c, 0.22)} 2.4px, transparent 3px); background-size: 34px 34px; -webkit-mask-image: linear-gradient(90deg, #000 0%, #000 50%, transparent 62%); mask-image: linear-gradient(90deg, #000 0%, #000 50%, transparent 62%); }
.iso { width: 520px; height: 340px; transform-style: preserve-3d; transform: rotateX(56deg) rotateZ(-38deg); }
.iso__l { position: absolute; inset: 0; border-radius: 34px; box-sizing: border-box; padding: 30px; transform-style: preserve-3d; box-shadow: 0 0 0 2px rgba(17,19,24,.06), -26px 30px 50px -10px rgba(17,19,24,.35); }
.iso__l--json { transform: translateZ(0); background: ${INK}; display: flex; align-items: flex-end; }
.iso__l--json code { font: 600 30px/1.2 var(--font-mono); color: #F4F0E8; } .iso__l--json b { color: #FF8A6B; font-weight: 600; }
.iso__l--ui { transform: translateZ(105px); background: #fff; display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
.iso__ui { display: flex; flex-direction: column; gap: 16px; padding: 22px; border-radius: 20px; background: #F4F1EC; }
.iso__ui i { display: block; height: 16px; border-radius: 9px; background: rgba(17,19,24,.14); }
.iso__btn { width: 60%; height: 50px; border-radius: 14px; background: ${INK}; margin-bottom: 6px; }
.iso__l--icons { transform: translateZ(210px); background: ${O.soft}; border: 3px solid ${O.c}; display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; place-items: center; }
.iso__ic { width: 118px; height: 118px; border-radius: 30px; background: #fff; display: grid; place-items: center; box-shadow: 0 8px 0 ${rgba(O.c, 0.25)}; }
`,
}
