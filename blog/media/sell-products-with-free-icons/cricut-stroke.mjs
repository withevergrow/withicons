import { at, icon, C, rgba, INK } from '../../tools/hero-kit.mjs'

// Three panels on a light green cutting mat: the line heart as it looks on screen, the same heart as the blade sees
// it (only a hairline dashed cut down the middle of the stroke, the stroke itself a faint ghost), and the solid
// heart with its dashed cut running round the outside. A small generic blade sits on each cut line.
const CUT = '#E0262B', MAT = '#CFE8D7', VINYL = '#2B2F3A'
const PW = 440, PH = 720, PY = 140, PX = [100, 580, 1060], S = 300

const blade = `<svg width="64" height="96" viewBox="0 0 64 96" fill="none"><rect x="14" y="0" width="36" height="58" rx="12" fill="#5A606D"/><rect x="14" y="44" width="36" height="14" fill="#3E424D"/><path d="M24 58 h16 L32 88 z" fill="#9AA0AC" stroke="#fff" stroke-width="2"/><circle cx="32" cy="22" r="7" fill="#fff" opacity=".35"/></svg>`
// tip of the blade (32, 88) lands on (x, y) inside a panel's icon box
const bladeAt = (x, y) => `<div class="bl" style="left:${x - 32}px;top:${y - 88}px">${blade}</div>`
const panel = (n, title, inner, tag, tone) => `<div class="pn"><div class="pn__t"><i>${n}</i><b>${title}</b></div><div class="pn__box">${inner}</div><span class="pn__tag" style="background:${tone[0]};color:${tone[1]}">${tag}</span></div>`

export default {
  alt: 'Three panels on a green cutting mat: a line-style heart as it looks on screen, the same heart as the blade sees it with only a thin red dashed hairline cut down the middle of its stroke, and a solid heart with a red dashed cut running cleanly round its outer edge',
  bg: `linear-gradient(${rgba('#2E7A4F', 0.16)} 2px, transparent 2px) 0 0 / 50px 50px, linear-gradient(90deg, ${rgba('#2E7A4F', 0.16)} 2px, transparent 2px) 0 0 / 50px 50px, linear-gradient(${rgba('#2E7A4F', 0.07)} 1px, transparent 1px) 0 0 / 10px 10px, ${MAT}`,
  art: () => [
    at(panel(1, 'Line icon (strokes)', icon('heart', 'line', S, VINYL), 'On screen', ['#EEF0F3', '#3E424D']), { x: PX[0], y: PY, w: PW, h: PH }),
    at(panel(2, 'What the blade sees', `<div class="ghost">${icon('heart', 'line', S, VINYL)}</div><div class="hair">${icon('heart', 'line', S, CUT)}</div>${bladeAt(150, 256)}`, 'Hairline cut', ['#FDE3E3', '#B4232A']), { x: PX[1], y: PY, w: PW, h: PH }),
    at(panel(3, 'Solid icon (fill)', `${icon('heart', 'solid', S, VINYL)}<div class="edge">${icon('heart', 'solid', S, CUT)}</div>${bladeAt(150, 268)}`, 'Clean shape', [C.sketch.soft, C.sketch.text]), { x: PX[2], y: PY, w: PW, h: PH }),
  ].join(''),
  css: `
.pn { box-sizing: border-box; height: 100%; padding: 40px 30px; border-radius: 38px; background: ${rgba('#FFFFFF', 0.88)}; box-shadow: 0 2px 0 rgba(17,19,24,.05), 0 50px 90px -48px rgba(20,60,35,.6); display: flex; flex-direction: column; align-items: center; }
.pn__t { display: flex; align-items: center; gap: 14px; }
.pn__t i { font-style: normal; width: 48px; height: 48px; border-radius: 50%; background: ${INK}; color: #fff; display: grid; place-items: center; font: 800 26px/1 var(--font-display); }
.pn__t b { font: 800 36px/1 var(--font-display); letter-spacing: -.025em; color: ${INK}; white-space: nowrap; }
.pn__box { position: relative; width: ${S}px; height: ${S}px; margin: auto 0; }
.pn__box > * { position: absolute; left: 0; top: 0; }
.ghost { opacity: .15; }
.hair svg { stroke-width: .24 !important; stroke-dasharray: .6 .42; }
.edge svg { fill: none !important; } .edge svg path { fill: none !important; stroke: currentColor; stroke-width: .24; stroke-dasharray: .6 .42; transform: scale(1.06); transform-origin: 12px 12.4px; }
.bl { position: absolute; rotate: 0deg; filter: drop-shadow(0 10px 10px rgba(0,0,0,.3)); }
.pn__tag { padding: 14px 26px; border-radius: 999px; font: 800 34px/1 var(--font-display); letter-spacing: -.02em; }
`,
}
