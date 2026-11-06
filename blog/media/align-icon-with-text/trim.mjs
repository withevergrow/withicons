import { at, icon, INK, rgba } from '../../tools/hero-kit.mjs'
import { BLUE, BTEXT, RED, GREEN, BG, CSS } from './_kit.mjs'

// Before and after text-box, as two big Download buttons centred with flexbox. Before: the label's box (dashed) keeps
// the font's spare room above and below the letters, more of it below, so centring the box puts the letters a touch
// high and the icon looks low next to them. After: the box is trimmed to cap height and baseline, the dashed outline
// hugs the letters, and two equal measures show the same space above and below.
// (The spare room on the left is drawn as padding on a trimmed label, so the picture shows the effect plainly.)
const B = { x: 640, w: 860, h: 230 }
const ROWS = [
  { y: 170, after: false },
  { y: 570, after: true },
]

const button = after => `<div class="btn${after ? ' is-after' : ''}">${icon('download', 'line', 92, '#fff')}<span class="t">Download${after ? '<i class="ms ms-top"></i><i class="ms ms-bot"></i>' : ''}</span></div>`

export default {
  alt: 'Before and after: two large Download buttons with the with icons download icon. The first, centred with align-items: center, shows a dashed text box taller than the letters and the icon sitting slightly low; the second adds text-box: trim-both cap alphabetic, so the dashed box hugs the letters and equal measures show the icon visually centred',
  bg: BG,
  art: () => [
    at(`<span class="tagp">before</span>`, { x: 90, y: ROWS[0].y + 34 }),
    at(`<span class="k-lbl"><em>align-items:</em> center</span>`, { x: 90, y: ROWS[0].y + 100 }),
    at(`<span class="k-hand" style="color:${RED}">icon looks low</span>`, { x: 90, y: ROWS[0].y + 158 }),
    at(`<span class="tagp is-after">after</span>`, { x: 90, y: ROWS[1].y + 20 }),
    at(`<span class="k-lbl"><em>+ text-box:</em><br>trim-both cap<br>alphabetic</span>`, { x: 90, y: ROWS[1].y + 86 }),
    ...ROWS.map(r => at(button(r.after), { x: B.x, y: r.y, w: B.w, h: B.h })),
    at(`<span class="k-hand" style="color:${GREEN}">equal space</span>`, { x: 1300, y: ROWS[1].y + B.h + 22 }),
  ].join(''),
  css: `${CSS}
.tagp { display: inline-block; padding: 10px 20px; border-radius: 999px; background: ${rgba(INK, 0.08)}; font: 700 28px/1 var(--font-display); color: ${INK}; }
.tagp.is-after { background: ${BLUE}; color: #fff; }
.btn { box-sizing: border-box; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; gap: 34px; border-radius: 999px; background: #14171F; color: #fff; box-shadow: 0 2px 0 ${rgba(INK, 0.05)}, 0 40px 80px -36px ${rgba(INK, 0.6)}; }
.btn .t { position: relative; font: 700 108px/1 var(--font-display); letter-spacing: -.03em; text-box: trim-both cap alphabetic; padding: 30px 0 64px; outline: 3px dashed ${rgba('#ffffff', 0.55)}; outline-offset: 0; }
.btn.is-after .t { padding: 0; outline-color: #5ED3EA; }
.ms { position: absolute; right: -40px; width: 0; border-left: 4px solid #5ED3EA; height: ${(230 - 0.66 * 108) / 2}px; }
.ms::before, .ms::after { content: ''; position: absolute; left: -13px; width: 22px; height: 4px; background: #5ED3EA; }
.ms::before { top: 0; } .ms::after { bottom: 0; }
.ms-top { bottom: 100%; } .ms-bot { top: 100%; }
`,
}
