import { at, icon, C, INK, PAPER, rgba } from '../../tools/hero-kit.mjs'

// A generic phone showing the "Add to Home Screen" sheet (no real screenshot, no logos): a soft3d music-note tile, a
// name field reading "Music" and an Add button. Three numbered orange callouts outside the phone: 1 tap the icon,
// 2 the menu that opens (Take Photo, Choose Photo, Choose File), 3 tap Add.
const O = C.solid
const num = n => `<span class="st__num">${n}</span>`
const callout = (n, text) => `<span class="st__call">${num(n)}<b>${text}</b></span>`
const item = (ic, text, on) => `<li class="${on ? 'is-on' : ''}">${icon(ic, 'line', 34, on ? O.text : '#3A3F4B')}<span>${text}</span></li>`

export default {
  bg: `radial-gradient(70% 80% at 40% 50%, ${O.soft} 0%, ${PAPER} 70%)`,
  alt: 'A generic phone showing an Add to Home Screen sheet with a soft 3D music-note tile, a name field reading Music with the keyboard open and an Add button, annotated with three orange callouts: 1 tap the icon, 2 choose Photo or Choose File from a menu listing Take Photo, Choose Photo and Choose File, 3 tap Add',
  art: () => [
    // the phone and its sheet
    at(`<div class="st__phone"><i class="st__island"></i><div class="st__sheet">
      <div class="st__bar"><span class="st__cancel">Cancel</span><b>Add to Home Screen</b><span class="st__add">Add</span></div>
      <div class="st__row"><span class="st__tile">${icon('music-note', 'soft3d', 118)}</span><span class="st__field">Music<i></i></span></div>
      <div class="st__sk"><i style="width:92%"></i><i style="width:78%"></i><i style="width:60%"></i></div>
      <div class="st__kb">${[10, 9, 7].map(n => `<div>${'<i></i>'.repeat(n)}</div>`).join('')}<div><i class="w"></i></div></div>
    </div></div>`, { x: 430, y: 70, w: 560, h: 860 }),
    // rings on the two tap targets
    at('<span class="st__ring" style="width:188px;height:188px"></span>', { cx: 565, cy: 350 }),
    at('<span class="st__ring" style="width:100px;height:60px;border-radius:20px"></span>', { cx: 920, cy: 191 }),
    // leader lines
    at(`<svg width="1600" height="1000" viewBox="0 0 1600 1000" fill="none" stroke="${O.c}" stroke-width="5" stroke-linecap="round" stroke-dasharray="2 12">
      <path d="M370 350 H 462"/><path d="M974 191 C 1012 191, 1012 158, 1052 158"/><path d="M640 444 C 720 600, 900 580, 1052 572"/></svg>`, { x: 0, y: 0 }),
    at(callout(1, 'Tap the icon'), { x: 80, y: 320 }),
    at(callout(3, 'Tap Add'), { x: 1060, y: 128 }),
    at(callout(2, 'Choose Photo or<br>Choose File'), { x: 1060, y: 330 }),
    at(`<ul class="st__menu">${item('camera', 'Take Photo')}${item('image', 'Choose Photo', true)}${item('folder', 'Choose File', true)}</ul>`, { x: 1060, y: 470, w: 400 }),
  ].join(''),
  css: `
.st__phone { box-sizing: border-box; height: 100%; padding: 16px; border-radius: 70px; background: ${INK}; position: relative; box-shadow: 0 60px 100px -50px rgba(17,19,24,.6); }
.st__island { position: absolute; left: 50%; top: 30px; translate: -50% 0; width: 120px; height: 34px; border-radius: 999px; background: #000; z-index: 2; }
.st__sheet { box-sizing: border-box; height: 100%; border-radius: 56px; background: linear-gradient(180deg, #5A5E68 0 70px, #F2F1F6 70px); padding: 92px 26px 0; position: relative; overflow: hidden; }
.st__sheet::before { content: ''; position: absolute; left: 0; right: 0; top: 70px; height: 40px; border-radius: 28px 28px 0 0; background: #F2F1F6; }
.st__bar { position: relative; display: flex; align-items: center; justify-content: space-between; font: 600 28px/1 var(--font-display); color: ${INK}; margin-bottom: 52px; }
.st__bar b { font-weight: 800; letter-spacing: -.02em; }
.st__cancel { color: ${O.text}; } .st__add { color: ${O.text}; font-weight: 800; }
.st__row { display: flex; align-items: center; gap: 22px; padding: 18px; border-radius: 26px; background: #fff; }
.st__tile { flex: none; width: 150px; height: 150px; border-radius: 38px; display: grid; place-items: center; background: linear-gradient(160deg, #FFF8EC, #F6E7D2); box-shadow: inset 0 0 0 1.5px rgba(0,0,0,.05); }
.st__field { flex: 1; display: flex; align-items: center; gap: 4px; padding: 16px 18px; border-radius: 16px; background: #F2F1F6; font: 700 32px/1 var(--font-display); color: ${INK}; }
.st__field i { width: 3px; height: 34px; background: ${O.c}; border-radius: 2px; }
.st__sk { display: flex; flex-direction: column; gap: 16px; margin-top: 36px; padding: 0 8px; }
.st__sk i { display: block; height: 16px; border-radius: 8px; background: rgba(17,19,24,.1); }
.st__kb { position: absolute; left: 0; right: 0; bottom: 0; padding: 18px 10px 40px; background: #D9DBE1; display: flex; flex-direction: column; gap: 12px; }
.st__kb div { display: flex; justify-content: center; gap: 7px; }
.st__kb i { width: 40px; height: 52px; border-radius: 9px; background: #fff; box-shadow: 0 2px 0 rgba(17,19,24,.18); }
.st__kb i.w { width: 260px; }
.st__ring { display: block; box-sizing: border-box; border-radius: 48px; border: 6px solid ${O.c}; box-shadow: 0 0 0 8px ${rgba(O.c, 0.18)}; }
.st__call { display: inline-flex; align-items: center; gap: 16px; font: 800 34px/1.1 var(--font-display); letter-spacing: -.02em; color: ${INK}; }
.st__num { flex: none; width: 60px; height: 60px; border-radius: 50%; display: grid; place-items: center; background: ${O.c}; color: #fff; font: 800 34px/1 var(--font-display); box-shadow: 0 10px 20px -8px ${rgba(O.c, 0.7)}; }
.st__menu { list-style: none; margin: 0; padding: 10px; border-radius: 28px; background: #fff; box-shadow: 0 2px 0 rgba(17,19,24,.04), 0 40px 80px -36px rgba(17,19,24,.5); }
.st__menu li { display: flex; align-items: center; gap: 16px; padding: 18px 20px; border-radius: 18px; font: 700 32px/1 var(--font-display); color: ${INK}; }
.st__menu li + li { margin-top: 4px; }
.st__menu li.is-on { background: ${O.soft}; color: ${O.text}; }
`,
}
