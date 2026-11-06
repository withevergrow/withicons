import { at, win, icon, C, INK, rgba } from '../../tools/hero-kit.mjs'

// In-post: a generic "Account privacy" settings panel (no product branding) with three toggle rows. The middle row,
// online content, is off and ringed in orange; a callout shows what that does: a greyed-out Icons button.
const O = C.solid, D = C.duo
const ROWS = [
  ['Experiences that analyze your content', true, false],
  ['Experiences that download online content', false, true],
  ['All connected experiences', true, false],
]
const row = ([label, on, hi]) => `<div class="ps__row${hi ? ' is-hi' : ''}"><span>${label}</span><i class="ps__tg${on ? ' is-on' : ''}"><b></b></i></div>`

export default {
  alt: 'A generic Account privacy settings panel with three toggles; the switch for experiences that download online content is off and ringed in orange, with a callout showing a greyed-out Icons button',
  bg: `radial-gradient(${rgba(INK, 0.08)} 2px, transparent 2.5px) 0 0 / 34px 34px, linear-gradient(180deg, #FBF8F3, #F3EEE5)`,
  art: () => [
    win('Settings', `<div class="ps">
      <div class="ps__head"><span class="ps__shield">${icon('shield-check', 'duo', 64, D.text)}</span><div><b>Account privacy</b><span>Connected experiences</span></div></div>
      ${ROWS.map(row).join('')}
    </div>`, { x: 96, y: 150, w: 980, h: 680, tone: 'card' }),
    at(`<svg width="200" height="120" viewBox="0 0 200 120" fill="none"><path d="M190 30 C 120 20, 70 50, 22 86" stroke="${O.c}" stroke-width="7" stroke-linecap="round"/><path d="M14 92 L 48 86 M14 92 L 26 60" stroke="${O.c}" stroke-width="7" stroke-linecap="round"/></svg>`, { x: 1040, y: 500, z: 3 }),
    at(`<div class="ps__call">
      <span class="ps__btn">${icon('shapes', 'line', 64, '#A3A8B3')}<b>Icons</b></span>
      <p><b>Off</b> = Icons greyed out</p>
    </div>`, { x: 1180, y: 360, w: 330 }),
  ].join(''),
  css: `
.ps { display: flex; flex-direction: column; gap: 22px; padding: 8px 12px; }
.ps__head { display: flex; align-items: center; gap: 22px; margin-bottom: 14px; }
.ps__head b { display: block; font: 800 46px/1 var(--font-display); letter-spacing: -.03em; color: ${INK}; }
.ps__head span:not(.ps__shield) { display: block; margin-top: 8px; font: 500 28px/1 var(--font-display); color: #5A606D; }
.ps__shield { width: 104px; height: 104px; border-radius: 30px; display: grid; place-items: center; background: ${D.soft}; }
.ps__row { display: flex; align-items: center; justify-content: space-between; gap: 30px; padding: 30px 32px; border-radius: 24px; background: #F6F4F0; font: 600 31px/1.2 var(--font-display); color: ${INK}; }
.ps__row.is-hi { background: #fff; box-shadow: 0 0 0 5px ${O.c}, 0 0 0 16px ${rgba(O.c, 0.16)}; }
.ps__tg { flex: none; width: 104px; height: 58px; border-radius: 999px; background: #C9CCD3; position: relative; }
.ps__tg b { position: absolute; top: 6px; left: 6px; width: 46px; height: 46px; border-radius: 50%; background: #fff; box-shadow: 0 3px 8px rgba(17,19,24,.25); }
.ps__tg.is-on { background: ${D.c}; } .ps__tg.is-on b { left: 52px; }
.ps__call { box-sizing: border-box; display: flex; flex-direction: column; align-items: center; gap: 22px; padding: 34px 28px 30px; border-radius: 34px; background: #fff; box-shadow: 0 2px 0 rgba(17,19,24,.04), 0 40px 80px -40px rgba(17,19,24,.5); border: 3px solid ${rgba(O.c, 0.35)}; }
.ps__btn { display: flex; flex-direction: column; align-items: center; gap: 10px; padding: 22px 34px; border-radius: 26px; background: #F1F1F3; opacity: .85; }
.ps__btn b { font: 700 30px/1 var(--font-display); color: #A3A8B3; }
.ps__call p { margin: 0; text-align: center; font: 600 32px/1.2 var(--font-display); color: ${INK}; }
.ps__call p b { color: ${O.text}; font-weight: 800; }
.hk-win__bar { font-size: 26px; }
`,
}
