import { at, win, chip, icon, C, INK, rgba } from '../tools/hero-kit.mjs'

// Treatment: over a soft-focus photo of sticker sheets, a with icons sticker sheet labelled sprite.svg: twelve die-cut
// stickers, each with its #id. One (the rocket) has been peeled off, leaving its dashed kiss-cut outline, and floats
// along a dotted path into the empty slot of a small web page. One sheet, pulled from by id. Blueprint cyan (code) accent.
const B = C.blueprint
const SHEET = ['home', 'search', 'bell', 'heart', 'star', 'camera', 'mail', 'gift', 'settings', 'calendar', 'user']
const cell = (n, i) => i === 0
  ? `<div class="sp-cell is-gone"><span class="sp-cut"></span><em>#rocket</em></div>`
  : `<div class="sp-cell"><span class="sp-st">${icon(n, 'sticker', 92)}</span><em>#${n}</em></div>`
const sk = w => `<i class="sk" style="width:${w}px"></i>`

export default {
  photoFile: 'svg-sprites-c4.jpg',
  credit: { by: 'Mohamed hamdi', profile: 'https://www.pexels.com/@mohamed-hamdi-510308652/', source: 'https://www.pexels.com/photo/close-up-of-a-sheet-of-stickers-16605272/', license: 'Pexels License' },
  alt: 'Soft-focus sticker sheets behind a white with icons sticker sheet labelled sprite.svg with eleven icon stickers and their ids; the rocket sticker has been peeled off and floats along a dotted path into the empty slot of a small web page',
  photo: { filter: 'saturate(.9) brightness(.97)', pos: '50% 12%' },
  overlay: `linear-gradient(90deg, ${rgba('#0B3A46', 0.28)} 0%, ${rgba('#0B3A46', 0.08)} 55%, ${rgba('#0B3A46', 0.22)} 100%)`,
  art: () => [
    at(`<div class="sp-sheet"><div class="sp-head"><span>sprite.svg</span><b>${icon('layers', 'blueprint', 34, B.c)}</b></div>
      <div class="sp-grid">${['rocket', ...SHEET].map(cell).join('')}</div></div>`, { x: 900, y: 120, w: 520, rot: 4 }),
    win(null, `<div class="sp-page">
        <div class="sp-nav"><span class="sp-logo"></span>${sk(70)}${sk(70)}<span class="sp-ic">${icon('search', 'line', 34, INK)}</span><span class="sp-ic">${icon('bell', 'line', 34, INK)}</span></div>
        <div class="sp-hero"><span class="sp-slot"></span><div>${sk(170)}${sk(120)}${sk(140)}</div></div>
      </div>`, { x: 180, y: 130, w: 520, tone: 'card', url: 'my-site.com' }),
    at(`<svg width="1600" height="1000" viewBox="0 0 1600 1000" fill="none"><path d="M1000 268 C 930 140, 560 90, 290 318" stroke="#fff" stroke-width="16" stroke-linecap="round" stroke-dasharray="1 26"/><path d="M1000 268 C 930 140, 560 90, 290 318" stroke="${B.c}" stroke-width="10" stroke-linecap="round" stroke-dasharray="1 26"/></svg>`, { x: 0, y: 0, z: 3 }),
    at(`<span class="sp-fly">${icon('rocket', 'sticker', 150)}</span>`, { cx: 720, cy: 172, rot: -14, z: 4 }),
    chip('use #rocket', { x: 520, y: 470, tone: 'color', style: 'blueprint', icon: ['link', 'line'], size: 34, rot: -3, z: 5, cls: 'sp-mono' }),
  ].join(''),
  css: `
.sp-sheet { border-radius: 30px; background: #fff; padding: 22px 26px 28px; box-shadow: 0 2px 0 rgba(17,19,24,.04), 0 60px 100px -40px rgba(10,40,50,.65); }
.sp-head { display: flex; align-items: center; justify-content: space-between; padding: 4px 6px 18px; border-bottom: 2.5px dashed ${rgba(B.c, 0.35)}; margin-bottom: 18px; }
.sp-head span { font: 800 34px/1 var(--font-mono); color: ${INK}; letter-spacing: -.02em; }
.sp-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px 10px; }
.sp-cell { display: flex; flex-direction: column; align-items: center; gap: 6px; }
.sp-cell em { font: 600 19px/1 var(--font-mono); font-style: normal; color: ${B.text}; }
.sp-st { line-height: 0; filter: drop-shadow(0 2px 0 #fff) drop-shadow(0 -2px 0 #fff) drop-shadow(2px 0 0 #fff) drop-shadow(-2px 0 0 #fff) drop-shadow(0 6px 8px rgba(17,19,24,.18)); }
.sp-cut { width: 100px; height: 100px; border-radius: 30px; border: 4px dashed ${rgba(B.c, 0.7)}; background: repeating-linear-gradient(135deg, #F2F7F8 0 10px, #E9F3F5 10px 20px); box-sizing: border-box; }
.sp-fly { display: block; line-height: 0; filter: drop-shadow(0 4px 0 #fff) drop-shadow(0 -4px 0 #fff) drop-shadow(4px 0 0 #fff) drop-shadow(-4px 0 0 #fff) drop-shadow(0 34px 30px rgba(17,19,24,.45)); }
.sp-page { display: flex; flex-direction: column; gap: 24px; margin: -6px -4px 0; }
.sp-nav { display: flex; align-items: center; gap: 18px; }
.sp-logo { width: 44px; height: 44px; border-radius: 14px; background: ${B.c}; margin-right: 6px; }
.sp-ic { margin-left: auto; line-height: 0; } .sp-ic + .sp-ic { margin-left: 0; }
.sp-hero { display: flex; align-items: center; gap: 26px; padding: 24px; border-radius: 22px; background: ${B.soft}; }
.sp-hero > div { display: flex; flex-direction: column; gap: 14px; }
.sp-slot { width: 112px; height: 112px; border-radius: 30px; border: 4px dashed ${B.c}; background: rgba(255,255,255,.6); box-sizing: border-box; flex: none; }
.sk { display: block; height: 14px; border-radius: 8px; background: rgba(17,19,24,.13); }
.sp-mono b { font-family: var(--font-mono); font-weight: 700; letter-spacing: -.02em; }
`,
}
