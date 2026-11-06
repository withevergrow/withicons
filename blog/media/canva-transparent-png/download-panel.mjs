import { at, icon, C, INK, PAPER, rgba } from '../../tools/hero-kit.mjs'

// A generic design-app download panel (no brand): File type PNG, a Size slider, and the Transparent background switch
// greyed out with a violet lock and a "Paid plans" pill. Beside it, a note card: on Free the background comes out white.
const O = C.solid, V = C.duo
const row = (label, ctrl, cls = '') => `<div class="dp__row ${cls}"><span class="dp__lbl">${label}</span>${ctrl}</div>`

export default {
  bg: `linear-gradient(135deg, ${O.soft} 0%, #FBF3EC 55%, ${V.soft} 100%)`,
  alt: 'A generic download panel set to PNG with a size slider and a greyed-out Transparent background switch locked with a violet lock and a Paid plans pill, beside a note card showing a star icon exported on a white box on the Free plan',
  art: () => [
    at(`<div class="dp">
      <div class="dp__head">${icon('download', 'line', 40, INK)}<b>Download</b></div>
      ${row('File type', `<span class="dp__sel">${icon('file-image', 'line', 34, O.c)}PNG<span class="dp__chev">${icon('chevron-down', 'line', 30, '#6A707C')}</span></span>`)}
      ${row('Size', `<span class="dp__slider"><i class="dp__track"></i><i class="dp__knob"></i><span class="dp__val">1x</span></span>`)}
      <div class="dp__lock">${row('Transparent background', '<span class="dp__switch"><i></i></span>', 'is-off')}<span class="dp__paid">${icon('lock', 'duo', 34, V.c)}Paid plans</span></div>
      <span class="dp__btn">Download</span>
    </div>`, { x: 64, y: 64, w: 860, h: 872 }),
    at(`<div class="dn"><span class="dn__eyebrow">Free plan</span><div class="dn__prev"><div class="dn__box">${icon('star', 'sticker', 170)}</div></div><b>Background comes out white</b></div>`, { x: 1000, y: 150, w: 536, h: 700 }),
  ].join(''),
  css: `
.dp { box-sizing: border-box; height: 100%; padding: 50px 54px; border-radius: 40px; background: #fff; font-family: var(--font-display); color: ${INK}; display: flex; flex-direction: column; gap: 34px; box-shadow: 0 2px 0 rgba(17,19,24,.04), 0 50px 100px -44px rgba(17,19,24,.5); }
.dp__head { display: flex; align-items: center; gap: 18px; font-size: 50px; letter-spacing: -.03em; }
.dp__head b { font-weight: 800; }
.dp__row { display: flex; flex-direction: column; gap: 14px; }
.dp__lbl { font: 600 30px/1 var(--font-display); color: #4A505C; }
.dp__sel { display: flex; align-items: center; gap: 16px; padding: 22px 26px; border-radius: 20px; border: 2.5px solid ${rgba(INK, 0.12)}; font: 700 34px/1 var(--font-display); }
.dp__chev { margin-left: auto; display: flex; }
.dp__slider { position: relative; display: flex; align-items: center; height: 54px; }
.dp__track { position: absolute; left: 0; right: 110px; height: 10px; border-radius: 5px; background: linear-gradient(90deg, ${O.c} 30%, ${rgba(INK, 0.12)} 30%); }
.dp__knob { position: absolute; left: calc((100% - 110px) * .3 - 20px); width: 40px; height: 40px; border-radius: 50%; background: #fff; box-shadow: 0 0 0 4px ${O.c}, 0 6px 14px rgba(17,19,24,.25); }
.dp__val { margin-left: auto; padding: 12px 18px; border-radius: 14px; border: 2.5px solid ${rgba(INK, 0.12)}; font: 600 30px/1 var(--font-mono); }
.dp__lock { position: relative; padding: 26px 26px 28px; border-radius: 24px; background: #F4F4F6; border: 2.5px dashed ${rgba(V.c, 0.45)}; }
.dp__lock .dp__row { flex-direction: row; align-items: center; justify-content: space-between; opacity: .45; }
.dp__lock .dp__lbl { color: ${INK}; font-size: 32px; }
.dp__switch { width: 92px; height: 52px; border-radius: 26px; background: #C9CBD1; position: relative; flex: none; }
.dp__switch i { position: absolute; left: 6px; top: 6px; width: 40px; height: 40px; border-radius: 50%; background: #fff; }
.dp__paid { display: inline-flex; align-items: center; gap: 10px; margin-top: 18px; padding: 10px 22px 10px 14px; border-radius: 999px; background: ${V.soft}; color: ${V.text}; font: 800 30px/1 var(--font-display); }
.dp__btn { margin-top: auto; display: grid; place-items: center; height: 92px; border-radius: 24px; background: ${INK}; color: #fff; font: 800 36px/1 var(--font-display); letter-spacing: -.02em; }
.dn { box-sizing: border-box; height: 100%; padding: 46px 44px; border-radius: 40px; background: #FFF8D6; font-family: var(--font-display); color: ${INK}; display: flex; flex-direction: column; gap: 30px; rotate: 2deg; box-shadow: 0 2px 0 rgba(17,19,24,.04), 0 50px 90px -44px rgba(17,19,24,.5); }
.dn__eyebrow { font: 700 28px/1 var(--font-display); text-transform: uppercase; letter-spacing: .1em; color: #8A6A00; }
.dn__prev { flex: 1; border-radius: 26px; background: #3B3F4C; display: grid; place-items: center; }
.dn__box { width: 250px; height: 250px; background: #fff; display: grid; place-items: center; }
.dn b { font: 800 44px/1.08 var(--font-display); letter-spacing: -.025em; }
`,
}
