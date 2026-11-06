import { at, chip, icon, glow, C, rgba } from '../tools/hero-kit.mjs'

// A Christmas greeting card standing open on a blurred, pine-green cosy scene, with a kraft gift tag hanging on a red string.
// Snow falls as a coded dot pattern. The card front is framed in a candy-cane border.
const snow = `radial-gradient(circle, rgba(255,255,255,.95) 0 5px, transparent 6px) 20px 40px / 223px 191px,
  radial-gradient(circle, rgba(255,255,255,.8) 0 3.5px, transparent 4.5px) 90px 10px / 137px 157px,
  radial-gradient(circle, rgba(255,255,255,.55) 0 2.5px, transparent 3.5px) 50px 80px / 97px 83px`

export default {
  base: 'student0',
  alt: 'A cosy knit sweater and laptop blurred deep into pine green behind falling snow, with an open Christmas greeting card showing a snowy wreath and a kraft gift tag on a red string holding a gingerbread man, all with icons in the Christmas style',
  photo: { filter: 'blur(10px) brightness(.55) saturate(.8)', pos: '50% 50%', scale: 1.08 },
  overlay: `linear-gradient(160deg, ${rgba('#1F7A4D', 0.75)} 0%, ${rgba('#0B3B25', 0.85)} 100%)`,
  art: () => [
    at('<div class="snow"></div>', { x: 0, y: 0, w: 1600, h: 1000 }),
    glow({ cx: 1010, cy: 470, r: 360, color: '#FFE7A8', opacity: 0.28, blur: 110 }),
    // the card: back panel + front panel, slightly open
    at('<div class="card-back"></div>', { x: 760, y: 170, rot: -8 }),
    at(`<div class="card-front">
      <div class="card-front__in">
        ${icon('wreath', 'christmas', 250)}
        <span class="card-front__msg">Merry &amp; bright</span>
        <div class="card-front__row">${icon('candy-cane', 'christmas', 64)}${icon('bauble', 'christmas', 64)}${icon('holly', 'christmas', 64)}</div>
      </div></div>`, { x: 900, y: 160, rot: 4 }),
    // gift tag hanging on a string from the top edge
    at(`<svg width="260" height="300" viewBox="0 0 260 300"><path d="M130 0 C 120 70, 170 110, 150 190" fill="none" stroke="${C.lunar.c}" stroke-width="6" stroke-linecap="round"/></svg>`, { x: 470, y: 0 }),
    at(`<div class="tag"><i class="tag__hole"></i>${icon('gingerbread-man', 'christmas', 150)}<span>for you</span></div>`, { x: 500, y: 170, rot: -10 }),
    chip('Christmas style', { x: 1120, y: 790, tone: 'color', style: 'solid', size: 30, icon: ['christmas-tree', 'christmas'], rot: -3 }),
    at(icon('north-star', 'christmas', 110), { x: 1300, y: 140, rot: 10 }),
  ].join(''),
  css: `
.snow { width: 100%; height: 100%; background: ${snow}; opacity: .7; }
.card-back { width: 400px; height: 560px; border-radius: 26px; background: #E9E1D2; box-shadow: 0 50px 90px -40px rgba(0,0,0,.8); }
.card-front { width: 420px; height: 580px; box-sizing: border-box; padding: 16px; border-radius: 26px;
  background: repeating-linear-gradient(45deg, ${C.lunar.c} 0 16px, #fff 16px 32px); box-shadow: 0 2px 0 rgba(0,0,0,.05), 0 60px 100px -40px rgba(0,0,0,.85); }
.card-front__in { height: 100%; border-radius: 16px; background: #FBF8F3; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; }
.card-front__msg { font: italic 400 50px/1 var(--font-serif); color: ${C.christmas.text}; letter-spacing: -.01em; }
.card-front__row { display: flex; gap: 18px; margin-top: 18px; }
.tag { position: relative; width: 230px; height: 300px; box-sizing: border-box; padding-top: 60px; display: flex; flex-direction: column; align-items: center; gap: 8px;
  background: linear-gradient(170deg, #D9AE7E, #C08A55); clip-path: polygon(22% 0, 78% 0, 100% 16%, 100% 100%, 0 100%, 0 16%); border-radius: 0 0 22px 22px;
  filter: drop-shadow(0 30px 30px rgba(0,0,0,.5)); }
.tag__hole { position: absolute; left: 50%; top: 20px; translate: -50% 0; width: 26px; height: 26px; border-radius: 50%; background: #0E3A24; box-shadow: inset 0 0 0 5px #E9D2B0; }
.tag span { font: 700 40px/1 var(--font-hand); color: #5A341C; }
`,
}
