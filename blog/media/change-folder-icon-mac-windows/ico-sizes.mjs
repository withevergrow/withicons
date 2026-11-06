import { at, icon, C, INK, PAPER, rgba } from '../../tools/hero-kit.mjs'

// An exploded .ico: a file card "projects.ico" with its size index (16 32 48 64 256), and below it five stacked
// cards, each holding the clay folder icon drawn at that real pixel size. Right: a PNG renamed to .ico, crossed out,
// with the note that it has no size index inside.
const O = C.solid
const SIZES = [16, 32, 48, 64, 256]
const W = { 16: 132, 32: 140, 48: 152, 64: 172, 256: 330 }
const cards = () => SIZES.map(s => `<div class="ic__card" style="width:${W[s]}px"><span class="ic__img">${icon('folder', 'clay', s)}</span><b>${s} px</b></div>`).join('')

export default {
  bg: `radial-gradient(70% 80% at 35% 40%, ${O.soft} 0%, ${PAPER} 70%)`,
  alt: 'An exploded diagram of a real .ico file: a projects.ico card listing a size index of 16, 32, 48, 64 and 256, joined by lines to five cards holding a clay folder icon at each of those sizes; beside it, a crossed-out card showing photo.png renamed to photo.ico, with the note no size index inside',
  art: () => [
    at(`<div class="ic__file">${icon('file', 'solid', 54, O.c)}<b>projects.ico</b><span class="ic__idx">${SIZES.map(s => `<i>${s}</i>`).join('')}</span></div>`, { x: 80, y: 84, w: 1010 }),
    at(`<svg width="1100" height="200" viewBox="0 0 1100 200" fill="none" stroke="${O.c}" stroke-width="5" stroke-linecap="round" stroke-dasharray="2 12">
      ${[146, 304, 472, 656, 929].map((x, i) => { const f = [706, 783, 859, 935, 1019][i]; return `<path d="M${f} 10 C ${f} 100, ${x} 80, ${x} 176"/>` }).join('')}</svg>`, { x: 0, y: 196 }),
    at(`<div class="ic__row">${cards()}</div>`, { x: 80, y: 384 }),
    at(`<div class="ic__bad">
      <div class="ic__doc">${icon('image', 'line', 64, '#6B6F78')}<s>photo.png</s></div>
      <div class="ic__ren">${icon('arrow-down', 'line', 40, '#9AA0A8')}<span>renamed to</span></div>
      <div class="ic__doc is-x">${icon('file', 'line', 64, '#6B6F78')}<s>photo.ico</s><i class="ic__cross"></i></div>
      <p>No size index inside</p>
    </div>`, { x: 1140, y: 120, w: 396 }),
  ].join(''),
  css: `
.ic__file { box-sizing: border-box; display: flex; align-items: center; gap: 18px; padding: 24px 30px; border-radius: 32px; background: #fff;
  box-shadow: 0 2px 0 rgba(17,19,24,.04), 0 40px 80px -40px rgba(17,19,24,.45); font-family: var(--font-display); color: ${INK}; }
.ic__file b { font: 800 40px/1 var(--font-mono); letter-spacing: -.02em; }
.ic__idx { margin-left: auto; display: flex; gap: 10px; }
.ic__idx i { font: 700 30px/1 var(--font-mono); font-style: normal; color: ${O.text}; background: ${O.soft}; padding: 12px 14px; border-radius: 14px; min-width: 66px; text-align: center; box-sizing: border-box; }
.ic__row { display: flex; align-items: flex-end; gap: 22px; }
.ic__card { box-sizing: border-box; height: 470px; padding: 20px 10px 24px; border-radius: 28px; background: #fff; display: flex; flex-direction: column; align-items: center; justify-content: flex-end; gap: 24px;
  box-shadow: 0 2px 0 rgba(17,19,24,.04), 0 30px 60px -34px rgba(17,19,24,.45); border: 1.5px solid ${rgba(O.c, 0.16)}; }
.ic__img { flex: 1; display: grid; place-items: center; width: 100%; border-radius: 18px;
  background: repeating-conic-gradient(#F3F1EC 0 25%, #FFFFFF 0 50%) 0 0 / 16px 16px; }
.ic__card b { font: 800 32px/1 var(--font-mono); color: ${INK}; letter-spacing: -.02em; }
.ic__bad { box-sizing: border-box; padding: 34px 30px; border-radius: 32px; background: #fff; display: flex; flex-direction: column; align-items: center; gap: 16px;
  box-shadow: 0 2px 0 rgba(17,19,24,.04), 0 40px 80px -40px rgba(17,19,24,.45); font-family: var(--font-display); }
.ic__doc { position: relative; width: 100%; box-sizing: border-box; display: flex; align-items: center; gap: 16px; padding: 22px 24px; border-radius: 22px; background: #F3F2EF; }
.ic__doc s { text-decoration: none; font: 700 34px/1 var(--font-mono); color: ${INK}; }
.ic__doc.is-x { background: #FDECEC; }
.ic__cross { position: absolute; inset: -10px; pointer-events: none;
  background: linear-gradient(to top right, transparent calc(50% - 4px), #D6312B calc(50% - 4px), #D6312B calc(50% + 4px), transparent calc(50% + 4px)),
              linear-gradient(to bottom right, transparent calc(50% - 4px), #D6312B calc(50% - 4px), #D6312B calc(50% + 4px), transparent calc(50% + 4px)); }
.ic__ren { display: flex; align-items: center; gap: 10px; font: 600 28px/1 var(--font-display); color: #6B6F78; }
.ic__bad p { margin: 10px 0 0; font: 800 34px/1.1 var(--font-display); color: #B3261E; text-align: center; letter-spacing: -.02em; }
`,
}
