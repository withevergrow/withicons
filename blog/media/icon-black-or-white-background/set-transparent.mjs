import { at, icon } from '../../tools/hero-kit.mjs'
import { O, BAD, CSS, INK, PAPER, rgba } from './_look.mjs'

// Three cards, each with the same peach slide. 1: a blue check-circle on a white square. 2: after Set Transparent
// Color the square is gone, but the white tick is a hole too (red arrow). 3: a see-through download keeps its tick.
const SLIDE = '#FFC9B5', BLUE = '#2448D8'
const panel = (step, title, inner, tag) => `<div class="lk-card st"><div class="st__head"><span class="st__step">${step}</span><span class="lk-t">${title}</span></div><div class="st__slide">${inner}</div>${tag}</div>`
const ico = (extra = '') => `<div class="st__ico">${extra}${icon('check-circle', 'solid', 230, BLUE)}</div>`

export default {
  bg: PAPER,
  alt: 'Three panels on a peach slide: a blue check-circle icon on a white square; after Set Transparent Color the square is gone but the white tick is now a hole, marked with a red arrow; and a see-through download with the white tick intact',
  art: () => [
    at(panel('Before', 'On a white square', `<div class="st__white">${ico()}</div>`, `<span class="lk-tag is-o">Picture with white box</span>`), { x: 64, y: 64, w: 450, h: 872, cls: 'lk' }),
    at(panel('After', 'Set Transparent Color', `${ico()}<svg class="st__arrow" width="370" height="370" viewBox="0 0 370 370" fill="none"><circle cx="185" cy="188" r="64" stroke="${BAD}" stroke-width="6" stroke-dasharray="14 10"/><path d="M352 352 C 330 300, 300 268, 250 245" stroke="${BAD}" stroke-width="8" stroke-linecap="round"/><path d="M262 228 L246 244 L268 256" stroke="${BAD}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/></svg>`, `<span class="lk-tag is-bad">The white tick went too</span>`), { x: 575, y: 64, w: 450, h: 872, cls: 'lk' }),
    at(panel('Instead', 'Download it <span style="white-space:nowrap">see-through</span>', ico('<i class="st__fill"></i>'), `<span class="lk-tag is-ok">${icon('check', 'line', 30)}Tick stays white</span>`), { x: 1086, y: 64, w: 450, h: 872, cls: 'lk' }),
  ].join(''),
  css: `${CSS}
.st { display: flex; flex-direction: column; align-items: center; justify-content: space-between; padding: 44px 30px 48px; }
.st__head { height: 150px; display: flex; flex-direction: column; align-items: center; gap: 12px; text-align: center; }
.st__head .lk-t { font-size: 38px; }
.st__step { font: 700 26px/1 var(--font-display); text-transform: uppercase; letter-spacing: .1em; color: ${O.text}; }
.st__slide { position: relative; width: 370px; height: 370px; border-radius: 26px; background: ${SLIDE}; display: grid; place-items: center; }
.st__white { width: 290px; height: 290px; background: #fff; display: grid; place-items: center; }
.st__ico { position: relative; width: 230px; height: 230px; display: grid; place-items: center; }
.st__ico .hk-icon { position: relative; }
.st__fill { position: absolute; left: 22%; top: 22%; width: 56%; height: 56%; border-radius: 50%; background: #fff; }
.st__arrow { position: absolute; left: 0; top: 0; }
`,
}
