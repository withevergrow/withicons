import { at, chip, icon, C, INK, PAPER, rgba } from '../../tools/hero-kit.mjs'

// Two generic phones. Left "Default": eight full-colour dock tiles. Right "Tinted": six of them turned into amber
// one-colour glass tiles on a dark wallpaper, while the two custom Shortcuts tiles (camera and music note, coquette
// style) stay exactly as made, each with a small "your picture" tag. A note chip says this is as reported.
const O = C.solid
const APPS = ['camera', 'mail', 'calendar', 'map-pin', 'music-note', 'clock', 'message-circle', 'settings']
const CUSTOM = new Set(['camera', 'music-note'])
const AMBER = '#FFC15E'
const phone = (inner, wall) => `<div class="tn__phone"><i class="tn__island"></i><div class="tn__screen" style="background:${wall}"><div class="tn__grid">${inner}</div></div></div>`
const deflt = APPS.map(n => `<span class="tn__cell">${icon(n, 'dock', 118)}</span>`).join('')
const tinted = APPS.map(n => CUSTOM.has(n)
  ? `<span class="tn__cell"><span class="tn__own">${icon(n, 'coquette', 92)}</span><em class="tn__tag">your picture</em></span>`
  : `<span class="tn__cell"><span class="tn__glass">${icon(n, 'line', 62, AMBER)}</span></span>`).join('')

export default {
  bg: PAPER,
  alt: 'Two phone home screens side by side: on the left, labelled default, eight full-colour tiles; on the right, labelled tinted, six of those tiles turned into amber one-colour glass on a dark wallpaper while a pink camera and a pink music-note tile stay in full colour, each tagged your picture, with a note reading as reported',
  art: () => [
    at('<span class="tn__label">Default</span>', { cx: 450, cy: 102 }),
    at('<span class="tn__label is-dark">Tinted</span>', { cx: 1150, cy: 102 }),
    at(phone(deflt, 'linear-gradient(170deg, #DDEBFA 0%, #F6E3EC 100%)'), { cx: 450, cy: 545 }),
    at(phone(tinted, 'linear-gradient(170deg, #2A2018 0%, #120E0B 100%)'), { cx: 1150, cy: 545 }),
    at(`<svg width="160" height="60" viewBox="0 0 160 60" fill="none"><path d="M8 30 H 140" stroke="${O.c}" stroke-width="10" stroke-linecap="round"/><path d="M118 8 L 146 30 L 118 52" stroke="${O.c}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/></svg>`, { cx: 800, cy: 500 }),
    chip('as reported', { cx: 800, cy: 580, tone: 'card', size: 28, icon: ['info-circle', 'line'] }),
  ].join(''),
  css: `
.tn__label { display: inline-block; padding: 12px 26px; border-radius: 999px; background: #E6EEF8; color: #2D4767; font: 800 34px/1 var(--font-display); letter-spacing: -.02em; white-space: nowrap; }
.tn__label.is-dark { background: #2A2018; color: ${AMBER}; }
.tn__phone { position: relative; width: 440px; height: 760px; box-sizing: border-box; padding: 16px; border-radius: 70px; background: ${INK}; box-shadow: 0 50px 90px -46px rgba(17,19,24,.6); }
.tn__island { position: absolute; left: 50%; top: 32px; translate: -50% 0; width: 110px; height: 32px; border-radius: 999px; background: #000; }
.tn__screen { height: 100%; box-sizing: border-box; border-radius: 56px; padding: 84px 20px 30px; }
.tn__grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 42px 0; justify-items: center; }
.tn__cell { position: relative; width: 132px; height: 120px; display: grid; place-items: center; }
.tn__glass { width: 110px; height: 110px; box-sizing: border-box; border-radius: 30px; display: grid; place-items: center;
  background: linear-gradient(160deg, ${rgba(AMBER, 0.34)}, ${rgba(AMBER, 0.1)}); border: 2px solid ${rgba(AMBER, 0.55)}; box-shadow: inset 0 1px 0 ${rgba('#FFFFFF', 0.25)}; }
.tn__own { width: 110px; height: 110px; border-radius: 30px; display: grid; place-items: center; background: #FFF1F4; box-shadow: 0 0 0 4px ${O.c}; }
.tn__tag { position: absolute; left: 50%; bottom: -30px; translate: -50% 0; white-space: nowrap; padding: 6px 12px; border-radius: 999px; background: ${O.c}; color: #fff; font: 700 28px/1 var(--font-display); font-style: normal; letter-spacing: -.02em; }
`,
}
