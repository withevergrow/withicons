import { at, chip, icon, C, INK, rgba } from '../tools/hero-kit.mjs'

// Treatment: an overhead photo of a phone on a round wooden table under palm leaves. Its blank screen becomes a home
// screen with a few empty slots, and dock-style icon tiles lie scattered on the table like puzzle pieces; one is
// mid-flight along a dotted arc into its slot. Orange (guides) accent on the empty slots and the arc.
const O = C.solid
// the phone's screen on the stage (photo scaled 1.2 about the centre, object-position y 80%)
const SX = 976, SY = 331, SW = 282, SH = 494

const GRID = [
  'target', 'clock', 'map-pin',
  'mail', 'calendar', 'headphones',
  'message-circle', 'image', null,
  'book-open', 'settings', 'phone',
]
const DOCKROW = ['phone', 'message-circle', 'music-note']
const slot = n => n === 'target' ? '<span class="aa__app is-empty is-target"></span>' : n ? `<span class="aa__app">${icon(n, 'dock', 66)}</span>` : '<span class="aa__app is-empty"></span>'

// loose tiles on the table: [name, cx, cy, rot]
const LOOSE = [
  ['gamepad', 300, 250, -12],
  ['palette', 570, 185, 9],
  ['leaf', 290, 500, 7],
  ['sun', 540, 440, -6],
  ['heart', 1370, 300, 12],
]
const piece = ([n, cx, cy, r], size = 165) => at(`<span class="aa__piece" style="width:${size}px;height:${size}px">${icon(n, 'dock', Math.round(size * 0.78))}</span>`, { cx, cy, rot: r, z: 3 })

export default {
  photoFile: 'change-app-icons-android-desk.jpg',
  credit: { by: 'Katrin Bolovtsova', profile: 'https://www.pexels.com/@ekaterina-bolovtsova/', source: 'https://www.pexels.com/photo/a-smartphone-with-a-blank-screen-on-a-round-wooden-table-6373209/', license: 'Pexels License' },
  alt: 'Overhead photo of a phone on a round wooden table under palm leaves, its screen a home screen with empty slots, while glossy dock-style icon tiles lie around it like puzzle pieces and a camera tile flies along an orange dotted arc into a glowing empty slot',
  photo: { filter: 'saturate(1.05) brightness(.92)', pos: '50% 80%', scale: 1.2 },
  overlay: `linear-gradient(90deg, ${rgba('#120C06', 0.18)} 0%, ${rgba('#120C06', 0)} 55%, ${rgba('#120C06', 0.12)} 100%)`,
  art: () => [
    // the home screen on the phone
    at(`<div class="aa__screen"><span class="aa__time">10:24</span><div class="aa__grid">${GRID.map(slot).join('')}</div><div class="aa__dock">${DOCKROW.map(slot).join('')}</div></div>`, { x: SX, y: SY, w: SW, h: SH, z: 2 }),
    // scattered pieces
    LOOSE.map(l => piece(l)).join(''),
    // flight path from the table into the empty slot
    at(`<svg width="460" height="300" viewBox="0 0 460 300" fill="none"><path d="M20 250 C 60 80, 180 20, 250 60" stroke="#fff" stroke-width="15" stroke-linecap="round" stroke-dasharray="1 24"/><path d="M20 250 C 60 80, 180 20, 250 60" stroke="${O.c}" stroke-width="9" stroke-linecap="round" stroke-dasharray="1 24"/></svg>`, { x: 640, y: 330, z: 3 }),
    piece(['camera', 960, 410, -10], 150),
    chip('Your own PNG', { x: 1010, y: 150, tone: 'color', style: 'solid', size: 30, icon: ['image', 'line'], rot: -3, z: 5 }),
    chip('512 px', { x: 1290, y: 690, tone: 'card', size: 30, rot: 4, z: 5 }),
  ].join(''),
  css: `
.aa__screen { box-sizing: border-box; height: 100%; border-radius: 14px; padding: 22px 18px 12px; display: flex; flex-direction: column;
  background: linear-gradient(170deg, #FBE9D7 0%, #F3D9C4 45%, #DCC9E6 100%); }
.aa__time { font: 700 40px/1 var(--font-display); color: ${rgba(INK, 0.78)}; letter-spacing: -.03em; margin: 0 8px 18px auto; }
.aa__grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px 14px; justify-items: center; }
.aa__dock { margin-top: auto; display: grid; grid-template-columns: repeat(3, 1fr); justify-items: center; padding: 6px 0; border-radius: 24px; background: rgba(255,255,255,.45); }
.aa__app { width: 70px; height: 70px; display: grid; place-items: center; }
.aa__app.is-empty { box-sizing: border-box; width: 64px; height: 64px; border-radius: 18px; border: 3.5px dashed ${O.c}; background: ${rgba(O.c, 0.1)}; }
.aa__app.is-target { border-style: solid; background: ${rgba(O.c, 0.22)}; box-shadow: 0 0 0 6px ${rgba(O.c, 0.25)}, 0 0 30px 6px ${rgba(O.c, 0.45)}; }
.aa__piece { display: grid; place-items: center; filter: drop-shadow(0 26px 22px rgba(20,12,4,.5)); }
`,
}
