import { at, icon, chip, C, rgba, INK } from '../tools/hero-kit.mjs'

// A maker's table against a yellow wall (photo flipped so the products sit clear of the reserved corner): a retro cat
// printed on the canvas tote, small prints on the two mugs, a printed planner page poking out of the tote, a sheet
// of kiss-cut stickers taped to the wall, a kraft price tag on the handle and an orange "OK to sell" chip.
const O = C.solid.c, KRAFT = '#D8B486'
const print = (name, style, size, o) => at(`<div class="prn">${icon(name, style, size)}</div>`, o)
const STICKERS = [['cat', 'sticker'], ['heart', 'sticker'], ['sun', 'sticker'], ['star', 'sticker'], ['sprout', 'sticker'], ['coffee', 'sticker']]

export default {
  photoFile: 'sell-products-with-free-icons-table.jpg',
  credit: { by: 'Bach Hanzo', profile: 'https://www.pexels.com/@bach-hanzo-1922634/', source: 'https://www.pexels.com/photo/two-white-ceramic-mugs-and-a-white-bag-on-wooden-table-3551355/', license: 'Pexels License' },
  alt: 'A canvas tote bag and two white mugs on a table against a yellow wall, with icons printed on them: a retro cat on the tote, a sun and a heart on the mugs, a planner page in the bag, a sheet of icon stickers taped to the wall, a kraft price tag and an orange OK to sell chip',
  photo: { pos: '50% 74%', filter: 'saturate(.95)' },
  overlay: `radial-gradient(70% 80% at 55% 40%, transparent 50%, ${rgba('#5A3A00', 0.22)} 100%)`,
  art: () => [
    // planner page in the tote (covers the paper already in the bag)
    at(`<div class="page"><b>Week</b>${['sun', 'book-open', 'sprout'].map(n => `<span>${icon(n, 'duo', 34, C.duo.text)}<i></i></span>`).join('')}</div>`, { x: 470, y: 196, rot: -9 }),
    // prints: tote and mugs
    print('cat', 'retro', 230, { cx: 520, cy: 498 }),
    print('sun', 'retro', 76, { cx: 990, cy: 760 }),
    print('heart', 'bauhaus', 58, { cx: 1113, cy: 810 }),
    // sticker sheet taped to the wall
    at(`<div class="sheet"><i class="tape"></i>${STICKERS.map(([n, s]) => `<span>${icon(n, s, 78)}</span>`).join('')}</div>`, { x: 968, y: 66, rot: 4 }),
    // kraft swing tag on the handle
    at(`<svg width="1600" height="1000" fill="none"><path d="M592 70 C 660 96, 730 120, 768 168" stroke="#F4EAD8" stroke-width="4" stroke-linecap="round"/></svg>`, { x: 0, y: 0 }),
    at(`<div class="swing"><i></i><b>$18</b></div>`, { x: 712, y: 150, rot: 14 }),
    chip('OK to sell', { x: 1130, y: 480, tone: 'color', style: 'solid', size: 40, icon: ['badge-check', 'line'], rot: -4 }),
  ].join(''),
  css: `
.stage__photo { transform: scaleX(-1); }
.prn { mix-blend-mode: multiply; opacity: .94; line-height: 0; }
.page { box-sizing: border-box; width: 210px; padding: 18px 20px; border-radius: 14px; background: #FFFDF8; box-shadow: 0 20px 40px -20px rgba(0,0,0,.5); display: grid; gap: 10px; }
.page b { font: 800 26px/1 var(--font-display); color: ${INK}; letter-spacing: -.02em; }
.page span { display: flex; align-items: center; gap: 10px; } .page span i { flex: 1; height: 8px; border-radius: 8px; background: ${rgba(INK, 0.14)}; }
.sheet { position: relative; box-sizing: border-box; width: 300px; padding: 26px 22px 22px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; justify-items: center; border-radius: 22px; background: #FBF8F3; box-shadow: 0 2px 0 rgba(17,19,24,.05), 0 40px 60px -30px rgba(70,40,0,.65); }
.sheet span { display: grid; place-items: center; width: 80px; height: 80px; border-radius: 22px; outline: 2px dashed ${rgba(INK, 0.14)}; outline-offset: 3px; }
.tape { position: absolute; left: 50%; top: -22px; width: 130px; height: 40px; margin-left: -65px; rotate: -3deg; background: ${rgba('#FFFFFF', 0.62)}; box-shadow: 0 2px 6px rgba(0,0,0,.12); }
.swing { position: relative; box-sizing: border-box; width: 132px; height: 176px; padding-top: 58px; text-align: center; background: ${KRAFT}; clip-path: polygon(22% 0, 78% 0, 100% 16%, 100% 100%, 0 100%, 0 16%); filter: drop-shadow(0 20px 18px rgba(80,40,0,.45)); }
.swing i { position: absolute; left: 50%; top: 22px; width: 20px; height: 20px; margin-left: -10px; border-radius: 50%; background: #F0C23A; box-shadow: inset 0 2px 4px rgba(0,0,0,.35); }
.swing b { font: 800 50px/1 var(--font-display); color: #4A2E12; letter-spacing: -.03em; }
`,
}
