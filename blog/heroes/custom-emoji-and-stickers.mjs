import { at, icon, chip, C, INK, rgba } from '../tools/hero-kit.mjs'

// Photo: a pink desk flat lay. On it lies a die-cut sticker sheet of with icons (kawaii, sticker, pastel and plush
// styles); two stickers have a corner peeled up, one has come off completely and floats above its empty slot.
const S = 136, G = 30, COLS = 4
const SHEET = [
  ['party-popper', 'sticker'], ['thumbs-up', 'kawaii'], ['rocket', 'pastel'], null,
  ['cat', 'plush'], ['heart', 'kawaii'], ['coffee', 'sticker'], ['sparkles', 'pastel'],
  ['laugh', 'kawaii'], ['cake', 'sticker'], ['sun', 'plush'], ['star', 'kawaii'],
]
const PEEL = new Set([6, 9]) // these get a lifted corner
const LIFTED = ['smile', 'kawaii'] // the one that came off (slot 3, top right)

const sticker = (n, s, peel) => `<div class="stk${peel ? ' is-peel' : ''}"><div class="stk__face">${icon(n, s, Math.round(S * 0.66))}</div>${peel ? '<i class="stk__flapw"><i class="stk__flap"></i></i>' : ''}</div>`
function sheet() {
  const cells = SHEET.map((it, i) => it ? sticker(it[0], it[1], PEEL.has(i)) : '<div class="stk is-gone"></div>').join('')
  return at(`<div class="sheet"><div class="sheet__grid">${cells}</div></div>`, { x: 700, y: 236, rot: -5 })
}

export default {
  photoFile: 'custom-emoji-and-stickers-desk.jpg',
  credit: { by: 'Jilly Noble', profile: 'https://www.pexels.com/@jillyjillystudio/', source: 'https://www.pexels.com/photo/pink-themed-office-desk-flat-lay-with-stationery-29765805/', license: 'Pexels License' },
  alt: 'A sticker sheet of cute with icons on a pink desk with pens and a coffee cup: two stickers have a corner peeled up, and a smiling face sticker floats above the empty slot it came from',
  photo: { filter: 'saturate(1.05) brightness(1.02)', pos: '50% 46%' },
  art: () => [
    sheet(),
    at(`<div class="stk is-lifted"><div class="stk__face">${icon(LIFTED[0], LIFTED[1], Math.round(S * 1.16 * 0.66))}</div></div>`, { cx: 1352, cy: 222, rot: 12 }),
    chip('Peel, paste, post', { x: 180, y: 196, tone: 'color', style: 'solid', size: 34, icon: ['sparkles', 'solid'], rot: -4 }),
  ].join(''),
  css: `
.sheet { padding: 34px; border-radius: 34px; background: linear-gradient(160deg, #FFFFFF, #F4F1F6); box-shadow: 0 2px 0 rgba(17,19,24,.05), 0 60px 90px -40px rgba(90,30,50,.55); }
.sheet__grid { display: grid; grid-template-columns: repeat(${COLS}, ${S}px); gap: ${G}px; }
.stk { position: relative; width: ${S}px; height: ${S}px; }
.stk__face { width: 100%; height: 100%; border-radius: 40px; background: #fff; display: grid; place-items: center; box-shadow: 0 0 0 1.5px rgba(17,19,24,.06), 0 6px 12px -6px rgba(17,19,24,.35); }
.stk.is-peel .stk__face { clip-path: polygon(0 0, 100% 0, 100% 52%, 52% 100%, 0 100%); }
.stk__flapw { position: absolute; inset: 0; filter: drop-shadow(-5px -5px 6px rgba(17,19,24,.28)); }
.stk__flap { position: absolute; inset: 0; clip-path: polygon(100% 52%, 52% 100%, 52% 52%); background: linear-gradient(135deg, #CFC9D6 0%, #FFFFFF 60%, #EEEAF2 100%); }
.stk.is-gone { border-radius: 40px; background: repeating-linear-gradient(45deg, #EEE9F2 0 10px, #F8F5FA 10px 20px); box-shadow: inset 0 0 0 3px #E0D9E6; }
.stk.is-lifted { width: ${Math.round(S * 1.16)}px; height: ${Math.round(S * 1.16)}px; }
.stk.is-lifted .stk__face { border-radius: 46px; box-shadow: 0 0 0 1.5px rgba(17,19,24,.06), 0 40px 50px -14px rgba(90,30,50,.42), 0 90px 80px -40px rgba(90,30,50,.45); }
`,
}
