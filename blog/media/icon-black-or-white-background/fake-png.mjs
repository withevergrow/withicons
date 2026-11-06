import { at, icon } from '../../tools/hero-kit.mjs'
import { CHECKER, CSS, INK, rgba } from './_look.mjs'

// Top: the two downloads on a white page look identical. Below, on a dark navy slide, the fake one drags its
// checkerboard along while the real one shows only the heart.
const NAVY = '#16213F', RED = '#FF4D6D'
const thumb = name => `<div class="fp__file"><div class="fp__th" style="background:${CHECKER(18, '#DADDE3')}">${icon('heart', 'solid', 74, RED)}</div><span>${name}</span></div>`

export default {
  bg: NAVY,
  alt: 'Two heart icon downloads that look identical on a white download page; on a dark navy slide the fake PNG shows a grey and white checkerboard square behind the heart while the real PNG shows only the heart',
  art: () => [
    at(`<div class="lk-card fp__strip"><span class="fp__lead">On the download page</span>${thumb('heart-a.png')}${thumb('heart-b.png')}<span class="fp__eq">look the same</span></div>`, { x: 64, y: 64, w: 1472, h: 200, cls: 'lk' }),
    at(`<div class="fp__on">On a dark slide</div>`, { x: 64, y: 312, cls: 'lk' }),
    at(`<div class="fp__panel"><div class="fp__sq" style="background:${CHECKER(44, '#CDD1D8')}">${icon('heart', 'solid', 250, RED)}</div><span class="lk-tag is-bad">Fake PNG: checkerboard is in the picture</span></div>`, { x: 64, y: 380, w: 716, h: 556, cls: 'lk' }),
    at(`<div class="fp__panel"><div class="fp__sq">${icon('heart', 'solid', 250, RED)}</div><span class="lk-tag is-ok">Real PNG: only the heart</span></div>`, { x: 820, y: 380, w: 716, h: 556, cls: 'lk' }),
  ].join(''),
  css: `${CSS}
.fp__strip { display: flex; align-items: center; justify-content: center; gap: 48px; padding: 0 48px; }
.fp__lead, .fp__eq { font: 700 32px/1.1 var(--font-display); color: #4A505C; }
.fp__eq { color: ${INK}; }
.fp__file { display: flex; align-items: center; gap: 18px; font: 500 26px/1 var(--font-mono); color: #4A505C; }
.fp__th { width: 120px; height: 120px; border-radius: 14px; display: grid; place-items: center; box-shadow: 0 0 0 2px rgba(17,19,24,.08); }
.fp__on { font: 700 32px/1 var(--font-display); color: rgba(255,255,255,.7); letter-spacing: .01em; }
.fp__panel { box-sizing: border-box; width: 100%; height: 100%; border-radius: 36px; border: 2px solid rgba(255,255,255,.12); background: rgba(255,255,255,.04); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 40px; }
.fp__sq { width: 330px; height: 330px; display: grid; place-items: center; }
`,
}
