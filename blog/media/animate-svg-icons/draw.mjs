import { at, icon, rgba } from '../../tools/hero-kit.mjs'
import { BG, CSS, B } from './_kit.mjs'

// How the line-drawing effect works, on the navy blueprint sheet: the check-circle icon (line style) in three frames.
// Every path gets pathLength="1" and stroke-dasharray: 1, so one dash is exactly as long as the path; sliding
// stroke-dashoffset from 1 to 0 draws it. Frame 1: only a dotted ghost. Frame 2: half the circle, no tick yet, an
// arrow showing the drawing direction. Frame 3: the whole icon. Below: the dash and its equal gap, with a slider.
const S = 280
const svg = (cls, color) => icon('check-circle', 'line', S, color).replace(/<path /g, '<path pathLength="1" ').replace('<span class="hk-icon"', `<span class="hk-icon ${cls}"`)
const frame = (x, circle, tick, label, extra = '') => at(`<div class="dr-card${circle === 1 ? ' is-blank' : ''}">
  <div class="dr-stack">${svg('dr-ghost', B.c)}${svg('dr-live', '#fff')}${extra}</div>
  <span class="an-mono">${label}</span>
</div>`, { x, y: 110, w: 420, h: 520, style: `--c:${circle};--t:${tick}` })
const ARROW = `<svg class="dr-arrow" viewBox="0 0 40 40" fill="none"><path d="M8 26 L20 12 L32 26" stroke="${B.c}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></svg>`

export default {
  alt: 'Three frames of a check circle icon drawing itself on a navy blueprint grid: at dashoffset 1 only a dotted ghost shows, at 0.5 half the circle is drawn with an arrow showing its direction, at 0 the full icon; below, one bar split into an equal dash and gap with a slider',
  bg: BG,
  art: () => [
    frame(90, 1, 1, 'dashoffset: 1'),
    frame(590, 0.5, 1, 'dashoffset: 0.5', ARROW),
    frame(1090, 0, 0, 'dashoffset: 0'),
    at(`<div class="dr-bar"><span class="dr-dash">dash</span><span class="dr-gap">gap</span><i class="dr-knob"></i></div>`, { x: 190, y: 720, w: 1220, h: 76 }),
    at(`<span class="an-mono dr-cap">stroke-dasharray: 1 &nbsp;·&nbsp; pathLength="1"</span>`, { cx: 800, cy: 860 }),
  ].join(''),
  css: `${CSS}
.dr-card { box-sizing: border-box; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: space-between; padding: 44px 0 40px;
  border-radius: 36px; background: ${rgba('#ffffff', 0.06)}; border: 1.5px solid ${rgba(B.c, 0.35)}; box-shadow: 0 40px 80px -40px rgba(0,0,0,.7); }
.dr-stack { position: relative; width: ${S}px; height: ${S}px; }
.dr-stack .hk-icon { position: absolute; inset: 0; }
.dr-ghost svg path { stroke-dasharray: 0.004 0.03; opacity: .45; }
.dr-ghost svg path.wm-a { stroke-dasharray: 0.02 0.14; }
.dr-card.is-blank .dr-live { display: none; }
.dr-live svg path { stroke-dasharray: 1; stroke-dashoffset: var(--c); }
.dr-live svg path.wm-a { stroke-dashoffset: var(--t); }
.dr-arrow { position: absolute; left: -2px; top: 76px; width: 64px; height: 64px; }
.dr-bar { position: relative; display: flex; height: 100%; border-radius: 999px; overflow: visible; }
.dr-bar span { flex: 1; display: grid; place-items: center; font: 700 30px/1 var(--font-mono); }
.dr-dash { background: ${B.c}; color: #fff; border-radius: 999px 0 0 999px; }
.dr-gap { background: ${rgba('#ffffff', 0.12)}; color: #CFE4EC; border-radius: 0 999px 999px 0; border: 2px dashed ${rgba('#ffffff', 0.3)}; border-left: 0; }
.dr-knob { position: absolute; left: 50%; top: 50%; width: 64px; height: 64px; translate: -50% -50%; border-radius: 50%; background: #fff; box-shadow: 0 0 0 8px ${rgba(B.c, 0.35)}, 0 14px 26px -8px rgba(0,0,0,.6); }
.dr-cap { color: #CFE4EC; }
`,
}
