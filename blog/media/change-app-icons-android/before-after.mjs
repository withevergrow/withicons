import { at, chip, icon, C, INK, PAPER, rgba } from '../../tools/hero-kit.mjs'

// Two simple phone outlines side by side. Left, "Auto-themed": twelve one-colour line icons on tinted circles over a
// sage wallpaper (what a Pixel does by itself). Right, "Your own set": the same twelve ideas as clay tiles on one calm
// pastel wallpaper. An orange arrow with "512 px PNGs" joins them.
const O = C.solid
const APPS = ['camera', 'music-note', 'mail', 'calendar', 'map-pin', 'message-circle', 'clock', 'headphones', 'image', 'settings', 'phone', 'book-open']
const phone = (inner, wall) => `<div class="ba__phone"><div class="ba__screen" style="background:${wall}"><span class="ba__time">10:24</span><div class="ba__grid">${inner}</div></div></div>`
const themed = APPS.map(n => `<span class="ba__th">${icon(n, 'line', 50, '#2F4A3B')}</span>`).join('')
const clay = APPS.map(n => `<span class="ba__cl">${icon(n, 'clay', 78)}</span>`).join('')

export default {
  bg: PAPER,
  alt: 'Two phone outlines side by side: on the left, labelled auto-themed, twelve one-colour green line icons on pale circles over a sage wallpaper; on the right, labelled your own set, the same twelve apps as soft clay icons on cream tiles over a peach and lilac wallpaper, joined by an orange arrow reading 512 px PNGs',
  art: () => [
    at(`<span class="ba__label">Auto-themed</span>`, { cx: 450, cy: 102 }),
    at(`<span class="ba__label is-own">Your own set</span>`, { cx: 1150, cy: 102 }),
    at(phone(themed, 'linear-gradient(170deg, #B9CDBE 0%, #9DB7A6 100%)'), { cx: 450, cy: 545 }),
    at(phone(clay, 'linear-gradient(165deg, #FBE7D6 0%, #F4D3CF 50%, #DCD3F0 100%)'), { cx: 1150, cy: 545 }),
    at(`<svg width="160" height="60" viewBox="0 0 160 60" fill="none"><path d="M8 30 H 140" stroke="${O.c}" stroke-width="10" stroke-linecap="round"/><path d="M118 8 L 146 30 L 118 52" stroke="${O.c}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/></svg>`, { cx: 800, cy: 520 }),
    chip('512 px PNGs', { cx: 800, cy: 600, tone: 'card', size: 28, icon: ['image', 'line'] }),
  ].join(''),
  css: `
.ba__label { display: inline-block; padding: 12px 26px; border-radius: 999px; background: #E9ECE8; color: #3A4A40; font: 800 34px/1 var(--font-display); letter-spacing: -.02em; white-space: nowrap; }
.ba__label.is-own { background: ${O.c}; color: #fff; }
.ba__phone { width: 440px; height: 760px; box-sizing: border-box; padding: 16px; border-radius: 64px; background: ${INK}; box-shadow: 0 50px 90px -46px rgba(17,19,24,.6); }
.ba__screen { height: 100%; box-sizing: border-box; border-radius: 50px; padding: 30px 30px; display: flex; flex-direction: column; }
.ba__time { font: 700 56px/1 var(--font-display); letter-spacing: -.04em; color: ${rgba(INK, 0.72)}; margin: 14px 0 40px 10px; }
.ba__grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 34px 0; justify-items: center; }
.ba__th { width: 96px; height: 96px; border-radius: 50%; display: grid; place-items: center; background: #E3EEE6; }
.ba__cl { width: 100px; height: 100px; border-radius: 30px; display: grid; place-items: center; background: #FFF9F4; box-shadow: 0 14px 24px -14px rgba(90,50,80,.45); }
`,
}
