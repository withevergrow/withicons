import { at, icon, C, rgba } from '../tools/hero-kit.mjs'

// Treatment: a close photo of an old card-index drawer, its manila tabs rising in rows. The nearest tabs are dyed (a colour
// blend over the real paper, so its grain and handwriting show through) and printed with a with icon; tabs further back
// get small colour stickers. The front tab is orange (guides).
// tinted tab shapes traced on the stage (visible part of each tab): [colour, points]
const TABS = [
  ['#FF5A36', '460,632 466,530 480,505 508,492 935,464 952,470 1160,573 1100,578 700,600 462,618'],
  ['#7B5CFF', '365,528 368,440 380,415 405,404 838,390 858,396 945,446 935,464 508,492 480,505 466,530'],
  ['#14B8A6', '948,447 965,428 995,412 1440,384 1462,395 1470,412 1472,468 1000,482 955,466'],
  ['#2F7BEA', '862,372 880,352 905,343 1265,328 1285,338 1292,385 995,410 960,425 945,440 858,396'],
]
const tint = () => at(`<svg class="fd__tint" width="1600" height="1000" viewBox="0 0 1600 1000">${TABS.map(([c, pts]) => `<polygon points="${pts}" fill="${c}" stroke="${c}" stroke-width="3" stroke-linejoin="round"/>`).join('')}</svg>`, { x: 0, y: 0, style: 'mix-blend-mode:color;opacity:.9' })
// printed marks on the tabs: [icon, cx, cy, size, rot, text?]
const MARKS = [
  ['camera', 735, 556, 84, -4, 'Photos'],
  ['briefcase', 560, 438, 60, -2],
  ['music-note', 1215, 437, 58, -3, 'Music'],
  ['plane', 1080, 372, 44, -2],
]
const mark = ([n, cx, cy, s, rot, text]) => at(`<span class="fd__mark" style="--s:${s}px">${icon(n, 'solid', s, '#fff')}${text ? `<b>${text}</b>` : ''}</span>`, { cx, cy, rot, z: 3 })
// small colour stickers on the tabs further back: [icon, colour, cx, cy, size]
const STICKERS = [
  ['book-open', '#E0A800', 820, 300, 46],
  ['heart', '#E2456F', 470, 240, 40],
  ['leaf', '#22A35A', 1010, 315, 38],
]
const sticker = ([n, col, cx, cy, s]) => at(`<span class="fd__sticker" style="--c:${col};--s:${s}px">${icon(n, 'solid', Math.round(s * 0.62), '#fff')}</span>`, { cx, cy, rot: -2, z: 3 })

export default {
  photoFile: 'change-folder-icon-mac-windows-drawer.jpg',
  credit: { by: 'George Diamanto', profile: 'https://www.pexels.com/@george-diamanto-3416903/', source: 'https://www.pexels.com/photo/rows-of-folders-11176866/', license: 'Pexels License' },
  alt: 'A close photo of an old card-index drawer full of manila tabs, the nearest ones dyed bright colours and printed with white icons: an orange front tab with a camera and the word Photos, a violet briefcase tab, a teal Music tab and a blue plane tab, with small colour stickers on the tabs behind',
  photo: { filter: 'saturate(1.1) brightness(1.12) contrast(1.02)', pos: '50% 50%' },
  overlay: `radial-gradient(75% 80% at 58% 50%, ${rgba('#1A1006', 0)} 0%, ${rgba('#1A1006', 0.35)} 100%)`,
  art: () => [tint(), MARKS.map(mark).join(''), STICKERS.map(sticker).join('')].join(''),
  css: `
.fd__mark { display: inline-flex; align-items: center; gap: calc(var(--s) * .22); color: #fff; filter: drop-shadow(0 2px 3px rgba(40,10,0,.35)); opacity: .96; }
.fd__mark b { font: 800 calc(var(--s) * .72)/1 var(--font-display); letter-spacing: -.03em; }
.fd__sticker { display: grid; place-items: center; width: var(--s); height: var(--s); border-radius: calc(var(--s) * .3); background: var(--c);
  box-shadow: 0 1px 0 rgba(255,255,255,.35) inset, 0 6px 12px -4px rgba(30,14,2,.6); }
`,
}
