import { at, icon, C, rgba, INK } from '../tools/hero-kit.mjs'

// A bright, empty classroom (softly blurred) with a laminated picture-schedule strip stuck to the wall: an orange
// "Today" tab, one empty slot showing its hook-and-loop dot, four sticker-style activity cards, and a "Done" pocket below
// holding the card that has already moved off the strip.
const O = C.solid.c
const SX = 392, SY = 214, CW = 180, CH = 226, GAP = 22, PAD = 28
const CARDS = [null, ['book-open', 'Reading'], ['apple', 'Snack'], ['playground', 'Play'], ['utensils', 'Lunch']]
const dot = '<i class="velcro"></i>'
const card = (n, label) => `<div class="sc">${icon(n, 'sticker', 118)}<b>${label}</b></div>`
const strip = () => `<div class="strip">${CARDS.map(c => `<div class="slot">${dot}${c ? card(...c) : ''}</div>`).join('')}</div>`

export default {
  photoFile: 'visual-schedule-icons-classroom.jpg',
  credit: { by: 'RDNE Stock project', profile: 'https://www.pexels.com/@rdne/', source: 'https://www.pexels.com/photo/wooden-tables-and-chairs-inside-a-classroom-8499580/', license: 'Pexels License' },
  alt: 'A bright empty classroom with a laminated picture schedule strip on the wall: an orange Today tab, an empty slot showing its hook-and-loop dot, colourful sticker-style cards for reading, snack, play and lunch, and a Done pocket below holding a circle time card',
  photo: { pos: '50% 40%', filter: 'blur(3px) saturate(1.05) brightness(1.03)', scale: 1.03 },
  overlay: `linear-gradient(180deg, ${rgba('#FFF4E6', 0.18)} 0%, ${rgba('#3A2A1A', 0.12)} 100%)`,
  art: () => [
    at(strip(), { x: SX, y: SY }),
    at(`<span class="tab">${icon('calendar', 'line', 40, '#fff')}Today</span>`, { x: SX + 20, y: SY - 66 }),
    // Done pocket under the strip, the first card tucked into it
    at(`<div class="pocket"><div class="pocket__card">${card('users', 'Circle')}</div><div class="pocket__front">${icon('check-circle', 'solid', 54, '#fff')}<b>Done</b></div></div>`, { x: 1196, y: 548 }),
  ].join(''),
  css: `
.strip { position: relative; display: flex; gap: ${GAP}px; padding: ${PAD}px; border-radius: 34px; background: linear-gradient(115deg, rgba(255,255,255,.98) 0%, rgba(255,255,255,.92) 38%, rgba(255,255,255,.99) 52%, rgba(250,248,243,.95) 100%);
  box-shadow: inset 0 0 0 2px rgba(255,255,255,.9), 0 2px 0 rgba(17,19,24,.05), 0 50px 90px -40px rgba(60,30,10,.7); }
.strip::after { content: ''; position: absolute; inset: 10px; border-radius: 26px; background: linear-gradient(115deg, transparent 30%, rgba(255,255,255,.25) 42%, transparent 54%); pointer-events: none; }
.slot { position: relative; width: ${CW}px; height: ${CH}px; border-radius: 22px; background: ${rgba(INK, 0.05)}; display: grid; place-items: center; }
.velcro { position: absolute; left: 50%; top: 50%; width: 54px; height: 54px; margin: -27px 0 0 -27px; border-radius: 50%;
  background: radial-gradient(circle, #2E3038 1.2px, transparent 1.8px) 0 0 / 6px 6px, radial-gradient(circle, #4A4D57 1px, transparent 1.6px) 3px 3px / 6px 6px, #3A3C45; box-shadow: inset 0 2px 4px rgba(0,0,0,.4); }
.sc { position: relative; box-sizing: border-box; width: ${CW}px; height: ${CH}px; border-radius: 22px; background: #fff; border: 3px solid #F2E9DC; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px;
  box-shadow: 0 14px 24px -14px rgba(60,30,10,.5); }
.sc b { font: 800 30px/1 var(--font-display); color: ${INK}; letter-spacing: -.02em; }
.tab { display: inline-flex; align-items: center; gap: 12px; padding: 14px 26px 30px 20px; border-radius: 22px 22px 0 0; background: ${O}; color: #fff; font: 800 38px/1 var(--font-display); letter-spacing: -.02em; }
.pocket { position: relative; width: 230px; height: 250px; filter: drop-shadow(0 24px 22px rgba(60,30,10,.45)); }
.pocket__card { position: absolute; left: 32px; top: 0; rotate: 7deg; }
.pocket__front { position: absolute; left: 0; bottom: 0; width: 230px; height: 150px; box-sizing: border-box; padding-top: 18px; border-radius: 10px 10px 28px 28px; background: ${O}; display: flex; flex-direction: column; align-items: center; gap: 8px;
  clip-path: polygon(0 0, 50% 22%, 100% 0, 100% 100%, 0 100%); padding-top: 38px; }
.pocket__front b { font: 800 34px/1 var(--font-display); color: #fff; letter-spacing: -.02em; }
`,
}
