import { at, icon, C, INK, PAPER, rgba } from '../../tools/hero-kit.mjs'

// Two cards with the same three-line list. Left: emoji bullets (plain placeholder circles, not vendor art) and the
// speech bubble a screen reader produces, emoji names included. Right: decorative line icons and a quiet reading.
const LINES = ['Faster setup.', 'Free forever.', 'New styles.']
const EMOJI_NAMES = ['rocket', 'check mark', 'sparkles']
const DOTS = ['#FF8A4C', '#3CC47C', '#FFC93C']
const ICONS = ['rocket', 'check-circle', 'sparkles']

function list(bullet) {
  return `<ul class="ls">${LINES.map((l, i) => `<li>${bullet(i)}<span>${l}</span></li>`).join('')}</ul>`
}
function side(x, title, bullet, said) {
  return [
    at(`<div class="tt">${title}</div>`, { x, y: 110 }),
    at(`<div class="cd">${list(bullet)}</div>`, { x, y: 186, w: 680, h: 310 }),
    at(`<div class="sp"><div class="sp__who">${icon('volume-1', 'line', 40, C.duo.text)}<span>Screen reader says</span></div><p>${said}</p></div>`, { x, y: 552, w: 680 }),
  ].join('')
}

export default {
  alt: 'Two cards with the same three-line list: with emoji bullets a screen reader says rocket, check mark and sparkles before each line, while with decorative line icon bullets it reads only Faster setup, Free forever, New styles',
  bg: `radial-gradient(120% 100% at 50% 0%, #FFFFFF 0%, ${PAPER} 75%)`,
  art: () => [
    side(96, 'Emoji bullets', i => `<i class="dot" style="background:${DOTS[i]}"></i>`,
      LINES.map((l, i) => `<mark>${EMOJI_NAMES[i]},</mark> ${l}`).join(' ')),
    side(824, 'Icon bullets <em>(decorative)</em>', i => icon(ICONS[i], 'line', 48, C.duo.text), LINES.join(' ')),
  ].join(''),
  css: `
.tt { font: 800 42px/1 var(--font-display); letter-spacing: -.02em; color: ${INK}; white-space: nowrap; }
.tt em { font-style: normal; font-weight: 600; color: ${C.duo.text}; }
.cd { box-sizing: border-box; height: 100%; padding: 44px 48px; border-radius: 36px; background: #fff; box-shadow: 0 2px 0 rgba(17,19,24,.04), 0 40px 80px -40px rgba(17,19,24,.45); }
.ls { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 34px; }
.ls li { display: flex; align-items: center; gap: 26px; font: 600 44px/1 var(--font-display); color: ${INK}; letter-spacing: -.02em; }
.dot { width: 48px; height: 48px; border-radius: 50%; flex: none; box-shadow: inset 0 -5px 0 rgba(0,0,0,.12); }
.sp { position: relative; box-sizing: border-box; padding: 30px 36px 34px; border-radius: 32px; background: ${C.duo.soft}; }
.sp::before { content: ''; position: absolute; left: 70px; top: -18px; width: 36px; height: 36px; background: ${C.duo.soft}; rotate: 45deg; border-radius: 6px; }
.sp__who { position: relative; display: flex; align-items: center; gap: 12px; font: 700 28px/1 var(--font-display); color: ${C.duo.text}; text-transform: uppercase; letter-spacing: .06em; }
.sp p { margin: 18px 0 0; font: 400 40px/1.3 var(--font-serif); font-style: italic; color: ${INK}; }
.sp mark { background: ${rgba('#FFC93C', 0.6)}; color: ${INK}; padding: 0 4px; border-radius: 6px; }
`,
}
