import { at, icon, C, INK, rgba } from '../../tools/hero-kit.mjs'

// A generic design-tool mockup (no real app chrome): left, a selected button component with an arrow-right icon slot;
// right, its properties panel: an instance swap property with a short preferred list, a boolean, and icon variables.
const V = C.duo.c, VT = C.duo.text
const PREF = [['arrow-right', true], ['check'], ['plus'], ['download']]

function canvas() {
  return at(`<div class="cv">
    <span class="cv__tag">${icon('component', 'line', 28, V)}Button</span>
    <div class="sel"><button class="btn">Continue<span class="btn__ic">${icon('arrow-right', 'line', 40, '#fff')}</span></button>
      <i class="h is-tl"></i><i class="h is-tr"></i><i class="h is-bl"></i><i class="h is-br"></i></div>
    <span class="cv__note">icon slot</span>
    <svg class="cv__arr" width="720" height="872" viewBox="0 0 720 872" fill="none"><path d="M470 610 C 500 590, 520 570, 524 540" stroke="${VT}" stroke-width="4" stroke-linecap="round"/><path d="M510 552 L524 536 L536 556" stroke="${VT}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>
  </div>`, { x: 64, y: 64, w: 720, h: 872 })
}
function panel() {
  const list = PREF.map(([n, on]) => `<li class="${on ? 'is-on' : ''}">${icon(n, 'line', 32, on ? VT : INK)}<em>${n}</em>${on ? icon('check', 'line', 28, VT) : ''}</li>`).join('')
  return at(`<div class="pp">
    <h4>Properties</h4>
    <div class="pr"><span class="pr__k">${icon('component', 'line', 28, V)}Icon</span><span class="pr__t">instance swap</span></div>
    <div class="fld">${icon('arrow-right', 'line', 30, INK)}<em>arrow-right</em>${icon('chevron-down', 'line', 28, '#7A7F8C')}</div>
    <ul class="dd"><li class="dd__h">Preferred</li>${list}</ul>
    <div class="pr"><span class="pr__k">${icon('toggle', 'line', 28, V)}Show icon</span><i class="tg"></i></div>
    <h4 class="is-sub">Variables</h4>
    <div class="vr"><code>icon/size</code><b>20</b></div>
    <div class="vr"><code>icon/stroke</code><b>1.75</b></div>
    <div class="vr"><code>icon/color</code><i class="sw"></i></div>
  </div>`, { x: 816, y: 64, w: 720, h: 872 })
}

export default {
  alt: 'A generic design tool mockup: a selected Continue button with an arrow-right icon, and a properties panel with an instance swap icon property, a preferred list of arrow-right, check, plus and download, a show icon toggle, and icon size, stroke and color variables',
  bg: '#E9E7F2',
  art: () => [canvas(), panel()].join(''),
  css: `
.cv { position: relative; height: 100%; box-sizing: border-box; border-radius: 32px; background: radial-gradient(${rgba(INK, 0.12)} 1.6px, transparent 2px) 0 0 / 28px 28px, #F7F6FB; box-shadow: inset 0 0 0 1.5px ${rgba(INK, 0.06)}; }
.cv__tag { position: absolute; left: 150px; top: 316px; display: inline-flex; align-items: center; gap: 8px; font: 700 28px/1 var(--font-display); color: ${VT}; }
.sel { position: absolute; left: 150px; top: 380px; padding: 0; scale: 1.4; transform-origin: 0 0; outline: 3px solid ${V}; outline-offset: 10px; }
.btn { display: inline-flex; align-items: center; gap: 18px; padding: 26px 34px 26px 40px; border: 0; border-radius: 22px; background: ${INK}; color: #fff; font: 700 40px/1 var(--font-display); letter-spacing: -.01em; box-shadow: 0 30px 50px -26px rgba(17,19,24,.6); }
.btn__ic { display: inline-grid; place-items: center; outline: 2px dashed ${rgba('#C9BCFF', 0.95)}; outline-offset: 6px; border-radius: 6px; }
.h { position: absolute; width: 16px; height: 16px; background: #fff; border: 3px solid ${V}; box-sizing: border-box; }
.h.is-tl { left: -19px; top: -19px; } .h.is-tr { right: -19px; top: -19px; } .h.is-bl { left: -19px; bottom: -19px; } .h.is-br { right: -19px; bottom: -19px; }
.cv__arr { position: absolute; inset: 0; }
.cv__note { position: absolute; left: 300px; top: 610px; font: 700 40px/1 var(--font-hand); color: ${VT}; rotate: -4deg; }
.pp { height: 100%; box-sizing: border-box; padding: 34px 40px; border-radius: 32px; background: #fff; box-shadow: 0 2px 0 rgba(17,19,24,.04), 0 40px 80px -40px rgba(17,19,24,.45); font-family: var(--font-display); color: ${INK}; display: flex; flex-direction: column; gap: 16px; }
.pp h4 { margin: 0 0 4px; font: 800 34px/1 var(--font-display); letter-spacing: -.02em; }
.pp h4.is-sub { margin-top: 14px; padding-top: 22px; border-top: 1.5px solid ${rgba(INK, 0.08)}; }
.pr { display: flex; align-items: center; justify-content: space-between; }
.pr__k { display: inline-flex; align-items: center; gap: 12px; font: 700 30px/1 var(--font-display); }
.pr__t { padding: 7px 14px; border-radius: 999px; background: ${C.duo.soft}; color: ${VT}; font: 600 26px/1 var(--font-mono); }
.fld { display: flex; align-items: center; gap: 14px; padding: 14px 18px; border-radius: 14px; box-shadow: inset 0 0 0 2px ${V}; font: 500 28px/1 var(--font-mono); }
.fld em { flex: 1; font-style: normal; }
.dd { list-style: none; margin: -6px 0 6px; padding: 10px; border-radius: 16px; background: #fff; box-shadow: 0 0 0 1.5px ${rgba(INK, 0.08)}, 0 24px 40px -24px rgba(17,19,24,.4); }
.dd li { display: flex; align-items: center; gap: 14px; padding: 9px 12px; border-radius: 10px; font: 500 28px/1 var(--font-mono); }
.dd li em { flex: 1; font-style: normal; }
.dd li.is-on { background: ${C.duo.soft}; color: ${VT}; }
.dd li.dd__h { font: 700 22px/1 var(--font-display); text-transform: uppercase; letter-spacing: .08em; color: #7A7F8C; padding: 6px 12px 8px; }
.tg { width: 66px; height: 38px; border-radius: 999px; background: ${V}; position: relative; }
.tg::after { content: ''; position: absolute; right: 4px; top: 4px; width: 30px; height: 30px; border-radius: 50%; background: #fff; }
.vr { display: flex; align-items: center; justify-content: space-between; padding: 10px 16px; border-radius: 12px; background: #F5F4FA; }
.vr code { font: 500 28px/1 var(--font-mono); color: ${VT}; }
.vr b { font: 700 28px/1 var(--font-mono); }
.sw { width: 36px; height: 36px; border-radius: 10px; background: ${INK}; box-shadow: 0 0 0 3px #fff, 0 0 0 4.5px ${rgba(INK, 0.15)}; }
`,
}
