import { at, win, chip, icon, C, INK, rgba } from '../tools/hero-kit.mjs'

// Treatment: a light browser mockup of a real-looking page (a small bakery site). An icon picker panel sits to its left;
// one icon is mid-drag along a dotted arc into the empty slot of the page's feature row. Orange (guides) accent.
const O = C.solid
const pick = (n, empty) => empty ? '<span class="aw__pick is-empty"></span>' : `<span class="aw__pick">${icon(n, 'solid', 56, O.c)}</span>`
const feat = n => `<div class="aw__feat">${n ? `<span class="aw__ft">${icon(n, 'solid', 62, O.c)}</span>` : '<span class="aw__ft is-slot"></span>'}<i class="sk" style="width:120px"></i><i class="sk sk--thin" style="width:140px"></i><i class="sk sk--thin" style="width:100px"></i></div>`

export default {
  base: 'startup1',
  alt: 'A woman working on a laptop at a small desk, behind a bakery website in a browser window and an icon picker: an orange solid croissant icon is dragged along a dotted arc into the empty slot of the feature row',
  photo: { filter: 'saturate(.95) brightness(.88)', pos: '50% 40%' },
  overlay: `linear-gradient(100deg, ${rgba('#1E140E', 0.45)} 0%, ${rgba('#1E140E', 0.12)} 50%, ${rgba('#1E140E', 0.4)} 100%)`,
  art: () => [
    at(`<div class="aw__panel"><div class="aw__ph">${icon('search', 'line', 26, '#8A8F9C')}<i class="sk" style="width:110px"></i></div><div class="aw__grid">${pick('bread')}${pick('cake')}${pick('', true)}${pick('coffee')}${pick('wheat')}${pick('truck')}</div></div>`, { x: 180, y: 180, w: 330 }),
    win(null, `<div class="aw__site">
      <div class="aw__nav"><span class="aw__logo">${icon('wheat', 'solid', 30, '#fff')}</span><i class="sk" style="width:60px"></i><i class="sk" style="width:60px"></i><i class="sk" style="width:60px"></i><span class="aw__cta"></span></div>
      <div class="aw__hero"><b>Fresh bakes daily</b><i class="sk" style="width:260px"></i><span class="aw__btn"></span></div>
      <div class="aw__feats">${feat('bread')}${feat('cake')}${feat('')}</div>
    </div>`, { x: 680, y: 140, w: 760, tone: 'card', url: 'bakery.com' }),
    at(`<svg width="720" height="300" viewBox="0 0 720 300" fill="none"><path d="M6 140 C 200 -40, 560 -20, 715 240" stroke="#fff" stroke-width="15" stroke-linecap="round" stroke-dasharray="1 22"/><path d="M6 140 C 200 -40, 560 -20, 715 240" stroke="${O.c}" stroke-width="9" stroke-linecap="round" stroke-dasharray="1 22"/></svg>`, { x: 445, y: 160, z: 3 }),
    at(`<span class="aw__drag">${icon('croissant', 'solid', 78, '#fff')}</span>`, { x: 1150, y: 395, rot: -10, z: 4 }),
    at(icon('cursor', 'solid', 66, INK), { x: 1250, y: 490, z: 5, style: 'filter:drop-shadow(0 0 2px #fff) drop-shadow(0 8px 12px rgba(0,0,0,.3))' }),
    chip('No code', { x: 1240, y: 100, tone: 'sun', icon: ['mouse-pointer-click', 'line'], size: 30, rot: 4 }),
    chip('SVG', { x: 900, y: 760, tone: 'color', style: 'solid', size: 32, rot: -3 }),
    chip('PNG', { x: 1040, y: 780, tone: 'card', size: 32, rot: 4 }),
  ].join(''),
  css: `
.aw__panel { background: #fff; border-radius: 28px; padding: 20px; box-shadow: 0 2px 0 rgba(17,19,24,.04), 0 50px 100px -40px rgba(17,19,24,.55); }
.aw__ph { display: flex; align-items: center; gap: 12px; padding: 12px 16px; border-radius: 16px; background: #F3F1EC; margin-bottom: 14px; }
.aw__grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
.aw__pick { aspect-ratio: 1; border-radius: 22px; display: grid; place-items: center; background: ${O.soft}; }
.aw__pick.is-empty { background: none; border: 3px dashed ${rgba(O.c, 0.45)}; }
.aw__site { display: flex; flex-direction: column; gap: 22px; margin: -8px -4px -4px; }
.aw__nav { display: flex; align-items: center; gap: 20px; }
.aw__logo { width: 50px; height: 50px; border-radius: 15px; background: ${O.c}; display: grid; place-items: center; margin-right: 10px; }
.aw__cta { margin-left: auto; width: 110px; height: 40px; border-radius: 999px; border: 2.5px solid ${INK}; }
.aw__hero { display: flex; flex-direction: column; gap: 14px; padding: 28px 30px; border-radius: 22px; background: linear-gradient(120deg, #FFF1E6, #FFE1D2); }
.aw__hero b { font: 800 50px/1 var(--font-display); letter-spacing: -.035em; color: ${INK}; }
.aw__btn { width: 150px; height: 46px; border-radius: 999px; background: ${INK}; margin-top: 4px; }
.aw__feats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }
.aw__feat { display: flex; flex-direction: column; gap: 11px; padding: 4px; }
.aw__ft { width: 100px; height: 100px; border-radius: 28px; display: grid; place-items: center; background: ${O.soft}; margin-bottom: 6px; box-sizing: border-box; }
.aw__ft.is-slot { background: ${rgba(O.c, 0.06)}; border: 4px dashed ${O.c}; }
.aw__drag { width: 128px; height: 128px; border-radius: 36px; display: grid; place-items: center; background: ${O.c}; box-shadow: 0 40px 60px -24px rgba(17,19,24,.65); }
.sk { display: block; height: 13px; border-radius: 8px; background: rgba(17,19,24,.13); }
.sk--thin { height: 10px; background: rgba(17,19,24,.08); }
`,
}
