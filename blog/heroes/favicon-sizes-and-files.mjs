import { at, icon, chip, word, C, INK, rgba } from '../tools/hero-kit.mjs'

// A real picture ledge on a pale wall. Standing on it, like books or frames, is a row of oversized browser tabs, each
// wearing a different favicon and its file: .ico, .svg, the 180 px Apple icon and the 512 px app icon. The active tab
// is blueprint cyan (the code category). On the bare wall: "5 files" and a small "+ 4 tags" chip.
const B = C.blueprint
const LEDGE = 792 // the ledge top in the photo (stage px)
// [icon, style, plate colour, label, x, width, height, active]
const TABS = [
  ['rocket', 'solid', C.solid.c, '.ico', 792, 162, 372],
  ['leaf', 'duo', C.duo.c, '.svg', 953, 162, 416, true],
  ['heart', 'gloss', '#fff', '180', 1114, 162, 386],
  ['star', 'sticker', '#fff', '192', 1275, 162, 400],
  ['coffee', 'clay', '#fff', '512', 1436, 162, 380],
]
const tab = ([n, s, plate, label, x, w, h, active]) => at(`<div class="ft${active ? ' is-on' : ''}">
  <span class="ft__plate" style="background:${plate}">${icon(n, s, 92, plate === '#fff' ? (C[s] || C.line).c : '#fff')}</span>
  <span class="ft__dots"><i></i><i></i></span>
  <b class="ft__label">${label}</b>
</div>`, { x, y: LEDGE - h, w, h, z: active ? 3 : 2 })

export default {
  photoFile: 'favicon-sizes-and-files-shelf.jpg',
  credit: { by: 'Annie Spratt', profile: 'https://unsplash.com/@anniespratt', source: 'https://unsplash.com/photos/brown-wooden-floating-shelf-on-white-wall-ax-KPVfTYAs', license: 'Unsplash License' },
  alt: 'A wooden picture ledge on a pale grey wall holding five oversized browser tabs standing like books, each wearing a favicon and a file label: a rocket for .ico, a cyan leaf tab for .svg, then a heart, a star and a coffee cup for 180, 192 and 512, beside the words 5 files',
  photo: { filter: 'saturate(.85) brightness(1.02)', pos: '50% 50%' },
  overlay: `linear-gradient(90deg, ${rgba('#ffffff', 0.18)} 0%, ${rgba('#ffffff', 0)} 55%)`,
  art: () => [
    ...TABS.map(tab),
    word('5 files', { x: 196, y: 250, size: 168 }),
    at(`<span class="ft-serif">is all you need</span>`, { x: 206, y: 428 }),
    chip('+ 4 tags', { x: 560, y: 160, tone: 'color', style: 'blueprint', size: 34, rot: 5, icon: ['code', 'line'] }),
  ].join(''),
  css: `
.ft { position: relative; box-sizing: border-box; width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: space-between;
  padding: 46px 0 34px; background: #fff; border-radius: 36px 36px 0 0; color: ${INK};
  box-shadow: 0 -2px 0 rgba(17,19,24,.03), 18px 10px 40px -18px rgba(17,19,24,.45); }
.ft::before, .ft::after { content: ''; position: absolute; bottom: 0; width: 26px; height: 26px; }
.ft::before { left: -26px; background: radial-gradient(circle at 0 0, transparent 25.5px, #fff 26px); }
.ft::after { right: -26px; background: radial-gradient(circle at 100% 0, transparent 25.5px, #fff 26px); }
.ft.is-on { background: ${B.c}; color: #fff; }
.ft.is-on::before { background: radial-gradient(circle at 0 0, transparent 25.5px, ${B.c} 26px); }
.ft.is-on::after { background: radial-gradient(circle at 100% 0, transparent 25.5px, ${B.c} 26px); }
.ft__plate { width: 124px; height: 124px; border-radius: 36px; display: grid; place-items: center; box-shadow: inset 0 0 0 2px rgba(17,19,24,.06), 0 18px 30px -18px rgba(17,19,24,.5); }
.ft.is-on .ft__plate { box-shadow: 0 0 0 5px rgba(255,255,255,.9), 0 20px 34px -16px rgba(0,40,60,.6); }
.ft__dots { display: flex; flex-direction: column; gap: 10px; align-items: center; }
.ft__dots i { display: block; width: 84px; height: 11px; border-radius: 8px; background: currentColor; opacity: .14; }
.ft__dots i + i { width: 56px; }
.ft.is-on .ft__dots i { opacity: .35; }
.ft__label { font: 700 38px/1 var(--font-mono); letter-spacing: -.03em; }
.ft-serif { font: italic 400 58px/1.05 var(--font-serif); color: #2A2E37; }
`,
}
