import { at, icon, C, rgba, INK } from '../../tools/hero-kit.mjs'

// Two panels on warm yellow paper. Left, with a green tick: finished products (a sticker on a laptop lid, a mug with
// an icon pattern, a printed planner page). Right, with a red cross: the icon files themselves (a ZIP of 50 PNGs,
// fanned PNG files, a "clipart bundle" tag), plus the one-line licence note under it.
const OK = C.sketch.c, NO = '#E5484D'
const PW = 680, PH = 720, PY = 140, PX = [96, 824]

const laptop = `<div class="lap"><div class="lap__lid">${icon('cat', 'sticker', 120)}</div><div class="lap__base"></div></div>`
const mug = `<svg width="190" height="190" viewBox="0 0 190 190" fill="none">
  <path d="M138 70 h14 a26 26 0 0 1 0 52 h-14" stroke="#E6E1D6" stroke-width="16"/>
  <rect x="22" y="40" width="124" height="130" rx="18" fill="#fff" stroke="#E6E1D6" stroke-width="3"/>
  <ellipse cx="84" cy="42" rx="62" ry="10" fill="#F1ECE2"/>
</svg>`
const mugArt = `<div class="mug">${mug}<div class="mug__pat">${['heart', 'star', 'sun', 'star', 'sun', 'heart'].map(n => icon(n, 'retro', 40)).join('')}</div></div>`
const planner = `<div class="plan"><b>Today</b>${['sun', 'coffee', 'book-open', 'sprout'].map(n => `<span>${icon(n, 'duo', 30, C.duo.text)}<i></i></span>`).join('')}</div>`

const zip = `<div class="zip">${icon('file-archive', 'solid', 110, '#8A5A12')}<b>icons.zip</b></div>`
const pngs = `<div class="fan">${[['cat', -14], ['heart', 0], ['sun', 14]].map(([n, r], i) => `<div class="png" style="rotate:${r}deg;left:${i * 52}px;top:${i === 1 ? 0 : 16}px">${icon(n, 'sticker', 74)}<small>${n}.png</small></div>`).join('')}</div>`
const bundle = `<div class="bundle"><i></i><b>clipart<br>bundle</b></div>`

const item = (art, label) => `<div class="it"><div class="it__art">${art}</div><span>${label}</span></div>`
const panel = (ok, title, items, foot) => `<div class="pn"><div class="pn__h"><i style="background:${ok ? OK : NO}">${ok
  ? '<svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>'
  : '<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3.6" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>'}</i><b>${title}</b></div><div class="pn__row">${items}</div><p class="pn__f" style="color:${ok ? C.sketch.text : '#B4232A'}">${foot}</p></div>`

export default {
  alt: 'Two panels: on the left, under a green tick and Selling a product, a laptop with a cat sticker, a mug printed with small icons and a planner page; on the right, under a red cross and Selling the icons, a ZIP of 50 icon PNGs, fanned PNG files and a clipart bundle tag, noting that most licences forbid this',
  bg: `radial-gradient(${rgba('#8A5A12', 0.1)} 2px, transparent 2.5px) 0 0 / 34px 34px, linear-gradient(180deg, #FFF8E2, #FBEFCB)`,
  art: () => [
    at(panel(true, 'Selling a product', item(laptop, 'Sticker') + item(mugArt, 'Mug') + item(planner, 'Planner'), 'Your design, printed and sold: usually fine.'), { x: PX[0], y: PY, w: PW, h: PH }),
    at(panel(false, 'Selling the icons', item(zip, '50 icon PNGs') + item(pngs, 'Loose files') + item(bundle, 'Clipart pack'), 'Most licences forbid this (MIT allows it with the licence text).'), { x: PX[1], y: PY, w: PW, h: PH }),
  ].join(''),
  css: `
.pn { box-sizing: border-box; height: 100%; padding: 44px 40px; border-radius: 40px; background: #fff; box-shadow: 0 2px 0 rgba(17,19,24,.05), 0 50px 90px -46px rgba(90,60,0,.55); display: flex; flex-direction: column; }
.pn__h { display: flex; align-items: center; gap: 18px; }
.pn__h i { width: 64px; height: 64px; border-radius: 50%; display: grid; place-items: center; flex: none; }
.pn__h b { font: 800 50px/1 var(--font-display); letter-spacing: -.03em; color: ${INK}; }
.pn__row { flex: 1; display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; align-items: center; }
.pn__f { margin: 0; font: 600 30px/1.25 var(--font-display); letter-spacing: -.01em; text-wrap: balance; }
.it { display: flex; flex-direction: column; align-items: center; gap: 22px; }
.it__art { height: 250px; display: grid; place-items: center; }
.it > span { font: 700 30px/1 var(--font-display); color: #4A4F5C; white-space: nowrap; }
.lap { display: flex; flex-direction: column; align-items: center; }
.lap__lid { width: 186px; height: 130px; border-radius: 14px 14px 4px 4px; background: linear-gradient(160deg, #3A3F4C, #23262F); display: grid; place-items: center; }
.lap__lid .hk-icon { rotate: -8deg; }
.lap__base { width: 214px; height: 14px; border-radius: 0 0 10px 10px; background: #B9BCC4; }
.mug { position: relative; width: 190px; height: 190px; }
.mug__pat { position: absolute; left: 34px; top: 66px; width: 100px; display: grid; grid-template-columns: repeat(2, 1fr); gap: 4px 12px; justify-items: center; }
.plan { box-sizing: border-box; width: 170px; padding: 18px 16px; border-radius: 12px; background: #FFFDF6; border: 2px solid #EDE6D6; box-shadow: 0 16px 30px -18px rgba(0,0,0,.4); display: grid; gap: 12px; rotate: 3deg; }
.plan b { font: 800 24px/1 var(--font-display); color: ${INK}; }
.plan span { display: flex; align-items: center; gap: 8px; } .plan span i { flex: 1; height: 7px; border-radius: 7px; background: ${rgba(INK, 0.13)}; }
.zip { width: 170px; height: 200px; border-radius: 24px; background: #FFF1D2; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; border: 2px solid #F0DDB0; }
.zip b { font: 600 22px/1 var(--font-mono); color: #8A5A12; }
.fan { position: relative; width: 204px; height: 200px; }
.png { position: absolute; width: 100px; height: 150px; box-sizing: border-box; padding-top: 20px; border-radius: 14px; background: #fff; border: 2px solid #E7E3DA; box-shadow: 0 16px 30px -18px rgba(0,0,0,.45); display: flex; flex-direction: column; align-items: center; gap: 12px; }
.png small { font: 600 16px/1 var(--font-mono); color: #5A606D; }
.bundle { position: relative; box-sizing: border-box; width: 180px; height: 120px; padding-left: 52px; display: flex; align-items: center; background: ${NO}; clip-path: polygon(0 50%, 22% 0, 100% 0, 100% 100%, 22% 100%); rotate: -10deg; }
.bundle i { position: absolute; left: 26px; top: 50%; width: 20px; height: 20px; margin-top: -10px; border-radius: 50%; background: #fff; }
.bundle b { font: 800 27px/1 var(--font-display); color: #fff; letter-spacing: -.01em; }
`,
}
