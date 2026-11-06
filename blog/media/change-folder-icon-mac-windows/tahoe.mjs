import { at, icon, C, INK, PAPER, rgba } from '../../tools/hero-kit.mjs'

// Left, a plain blue folder; middle, a generic "Customize Folder" popover with its three sections (Colour: seven
// circles, Symbol: six line symbols, Emoji: a button); right, the same folder after picking coral and the star, the
// symbol pressed into it. Two dotted arrows carry the chosen colour and symbol across.
const O = C.solid
const CORAL = '#F2715A', BLUE = '#4A9BEF'
const COLOURS = [BLUE, '#F5A524', '#F2CD3C', '#4CBF6B', '#A070E8', '#9AA0A8', CORAL]
const SYMBOLS = ['heart', 'book-open', 'briefcase', 'camera', 'music-note', 'star']
const folder = (col, mark) => `<div class="tf__folder">${icon('folder', 'solid', 330, col)}${mark ? `<span class="tf__mark">${icon(mark, 'solid', 110, '#C9482F')}</span>` : ''}</div>`

export default {
  bg: `radial-gradient(80% 80% at 50% 45%, #EEF1F6 0%, ${PAPER} 75%)`,
  alt: 'A plain blue folder beside a generic Customize Folder popover with three sections, Colour (seven circles, coral selected), Symbol (heart, book, briefcase, camera, music and star symbols, star selected) and an Emoji button, with dotted arrows leading to the same folder turned coral with a star pressed into it',
  art: () => [
    at(folder(BLUE), { cx: 245, cy: 470 }),
    at(`<div class="tf__pop">
      <b class="tf__title">Customize Folder</b>
      <span class="tf__h">Colour</span>
      <div class="tf__cols">${COLOURS.map(c => `<i class="${c === CORAL ? 'is-on' : ''}" style="background:${c}"></i>`).join('')}</div>
      <span class="tf__h">Symbol</span>
      <div class="tf__syms">${SYMBOLS.map(n => `<span class="${n === 'star' ? 'is-on' : ''}">${(n === 'star' ? icon(n, 'solid', 44, '#fff') : icon(n, 'line', 44, '#3A3F4B'))}</span>`).join('')}</div>
      <span class="tf__h">Emoji</span>
      <span class="tf__emoji">${icon('smile', 'line', 34, INK)}Emoji</span>
    </div>`, { x: 470, y: 200, w: 560 }),
    at(`<svg width="1600" height="1000" viewBox="0 0 1600 1000" fill="none" stroke-width="6" stroke-linecap="round">
      <path d="M984 378 C 1080 370, 1180 330, 1250 352" stroke="${CORAL}" stroke-dasharray="2 13"/>
      <path d="M1228 336 L 1252 352 L 1228 368" stroke="${CORAL}" stroke-dasharray="none" stroke-linejoin="round"/>
      <path d="M1002 512 C 1080 512, 1130 492, 1196 482" stroke="${O.c}" stroke-dasharray="2 13"/>
      <path d="M1174 466 L 1198 481 L 1176 498" stroke="${O.c}" stroke-dasharray="none" stroke-linejoin="round"/></svg>`, { x: 0, y: 0 }),
    at(folder(CORAL, 'star'), { cx: 1345, cy: 470 }),
    at('<span class="tf__tag">Before</span>', { cx: 245, cy: 700 }),
    at('<span class="tf__tag is-after">After</span>', { cx: 1345, cy: 700 }),
  ].join(''),
  css: `
.tf__folder { position: relative; width: 330px; height: 330px; filter: drop-shadow(0 30px 30px rgba(17,19,24,.22)); }
.tf__mark { position: absolute; left: 50%; top: 56%; translate: -50% -50%; opacity: .9; filter: drop-shadow(0 1.5px 0 rgba(255,255,255,.45)); }
.tf__pop { box-sizing: border-box; padding: 34px 36px 38px; border-radius: 34px; background: rgba(255,255,255,.96); display: flex; flex-direction: column; gap: 14px;
  box-shadow: 0 0 0 1.5px rgba(17,19,24,.06), 0 50px 100px -40px rgba(17,19,24,.5); font-family: var(--font-display); color: ${INK}; }
.tf__title { font: 800 38px/1 var(--font-display); letter-spacing: -.03em; margin-bottom: 10px; }
.tf__h { font: 700 30px/1 var(--font-display); color: #6B6F78; margin-top: 12px; }
.tf__cols { display: flex; gap: 14px; }
.tf__cols i { width: 54px; height: 54px; border-radius: 50%; box-sizing: border-box; }
.tf__cols i.is-on { box-shadow: 0 0 0 5px #fff, 0 0 0 10px ${CORAL}; }
.tf__syms { display: grid; grid-template-columns: repeat(6, 1fr); gap: 10px; }
.tf__syms > span { aspect-ratio: 1; border-radius: 20px; display: grid; place-items: center; background: #F1F2F5; }
.tf__syms > span.is-on { background: ${CORAL}; }
.tf__emoji { align-self: flex-start; display: inline-flex; align-items: center; gap: 12px; padding: 14px 26px 14px 20px; border-radius: 999px; background: #F1F2F5; font: 700 30px/1 var(--font-display); }
.tf__tag { display: inline-block; padding: 10px 22px; border-radius: 999px; background: #E3E6EC; color: #4A505C; font: 800 30px/1 var(--font-display); }
.tf__tag.is-after { background: ${CORAL}; color: #fff; }
`,
}
