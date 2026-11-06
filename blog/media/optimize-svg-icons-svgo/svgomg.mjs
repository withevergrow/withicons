import { at, win, icon, INK, rgba } from '../../tools/hero-kit.mjs'
import { BEFORE, AFTER, kb } from './_bell.mjs'
import { B, GREEN, GREEN_SOFT, BG, LOOK_CSS } from './_look.mjs'

// A generic browser-optimiser window (no product name or logo): a live preview of the bell on a checkerboard with a
// size readout, and a settings list. The three toggles to keep OFF are highlighted green and bracketed, number
// precision sits at 2 and multipass is on. Short handwritten notes say what to do. The readout uses the real sizes of
// the post's before / after bell files.
const sw = on => `<span class="sg-sw${on ? ' is-on' : ''}"><i></i></span>`
const row = (on, label, cls = '') => `<div class="sg-row ${cls}">${sw(on)}<span>${label}</span></div>`

export default {
  alt: 'A generic SVG optimiser window: a bell icon preview with a size readout of 1.09 KB to 0.27 KB, and settings where Remove viewBox, Remove title and Prefer viewBox to width/height are highlighted as kept off, precision is set to 2 and multipass is on',
  bg: BG,
  art: () => [
    win('Optimiser', `<div class="sg-body">
      <div class="sg-prev">
        <div class="sg-read"><b>${kb(BEFORE)}</b>${icon('arrow-right', 'line', 34, INK)}<b class="is-new">${kb(AFTER)}</b></div>
        <div class="sg-chk">${icon('bell', 'line', 240, INK)}</div>
      </div>
      <div class="sg-set">
        <div class="sg-keep">
          ${row(false, 'Remove viewBox', 'is-keep')}
          ${row(false, 'Remove &lt;title&gt;', 'is-keep')}
          ${row(false, 'Prefer viewBox to width/height', 'is-keep')}
        </div>
        <div class="sg-row sg-slide"><span>Number precision</span><div class="sg-track"><i style="width:40%"></i><b style="left:40%">2</b></div></div>
        ${row(true, 'Multipass')}
        ${row(true, 'Compare gzipped')}
      </div>
    </div>`, { x: 64, y: 64, w: 1472, h: 872, tone: 'card' }),
    at(`<div class="sg-note sg-note--keep"><svg width="40" height="295" viewBox="0 0 40 300" preserveAspectRatio="none" fill="none"><path d="M4 6 C 26 6, 22 40, 22 150 C 22 260, 26 294, 4 294 M22 150 H38" stroke="${GREEN}" stroke-width="5" stroke-linecap="round"/></svg><span>keep these<br>off</span></div>`, { x: 1272, y: 145 }),
    at(`<div class="sg-note"><span>&larr; 2 or 3<br>for icons</span></div>`, { x: 1265, y: 465 }),
    at(`<div class="sg-note"><span>on</span></div>`, { x: 920, y: 577 }),
  ].join(''),
  css: `${LOOK_CSS}
.sg-body { position: absolute; inset: 0; display: flex; }
.sg-prev { width: 520px; display: flex; flex-direction: column; border-right: 1.5px solid rgba(17,19,24,.08); }
.sg-read { display: flex; align-items: center; justify-content: center; gap: 14px; padding: 26px; font: 800 36px/1 var(--font-mono); letter-spacing: -.03em; border-bottom: 1.5px solid rgba(17,19,24,.08); }
.sg-read b { color: #8A8F9C; } .sg-read b.is-new { color: ${GREEN}; }
.sg-chk { flex: 1; display: grid; place-items: center; background: repeating-conic-gradient(#F1EEE8 0 25%, #fff 0 50%) 0 0 / 40px 40px; }
.sg-set { flex: 1; padding: 34px 40px; display: flex; flex-direction: column; gap: 16px; }
.sg-keep { display: flex; flex-direction: column; gap: 10px; padding: 12px; margin: -12px; border-radius: 26px; background: ${GREEN_SOFT}; width: 650px; }
.sg-row { display: flex; align-items: center; gap: 22px; height: 84px; padding: 0 18px; border-radius: 18px; font: 600 32px/1 var(--font-display); letter-spacing: -.015em; color: ${INK}; }
.sg-row.is-keep { background: #fff; box-shadow: 0 0 0 2px ${rgba(GREEN, 0.35)}; }
.sg-sw { flex: none; position: relative; width: 78px; height: 44px; border-radius: 999px; background: #D5D8DE; }
.sg-sw i { position: absolute; left: 5px; top: 5px; width: 34px; height: 34px; border-radius: 50%; background: #fff; box-shadow: 0 2px 4px rgba(0,0,0,.2); }
.sg-sw.is-on { background: ${B.c}; } .sg-sw.is-on i { left: 39px; }
.sg-slide { gap: 30px; margin-top: 18px; }
.sg-track { position: relative; width: 300px; height: 12px; border-radius: 6px; background: #E3E5EA; }
.sg-track i { position: absolute; left: 0; top: 0; bottom: 0; border-radius: 6px; background: ${B.c}; }
.sg-track b { position: absolute; top: 50%; translate: -50% -50%; width: 58px; height: 58px; border-radius: 50%; background: #fff; box-shadow: 0 0 0 4px ${B.c}, 0 6px 12px rgba(0,0,0,.2); display: grid; place-items: center; font: 800 30px/1 var(--font-mono); color: ${B.text}; }
.sg-note { display: flex; align-items: center; gap: 10px; font: 600 40px/1 var(--font-hand); color: ${GREEN}; }
.sg-note:not(.sg-note--keep) { color: ${B.text}; }
`,
}
