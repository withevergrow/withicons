import { at, icon, INK, rgba } from '../../tools/hero-kit.mjs'
import { BLUE, BTEXT, BG, CSS } from './_kit.mjs'

// Top: the HTML tag in a dark code card. Its two class names point down to the two rules they pull in: the shared
// .with base rule (1em box, -0.125em nudge, ::after = currentColor + mask) and the per-icon .with-home rule (one
// variable holding a data URI). Bottom: the result, the home icon next to "Home" in three text colours.
const TAG = { x: 380, y: 74, w: 840, h: 112 }
const R1 = { x: 70, y: 268, w: 700, h: 420 }
const R2 = { x: 830, y: 268, w: 700, h: 420 }
const RES = [['#475569', '#fff'], ['#0F766E', '#fff'], ['#fff', '#14213D']]

export default {
  alt: 'Code diagram: the tag i class with with-home points to two rule cards, the shared .with rule with a 1em box, vertical-align -0.125em and an ::after painted with currentColor through a mask, and the .with-home rule holding one data URI variable, above the home icon beside the word Home in slate, teal and white on navy',
  bg: BG,
  art: () => [
    at(`<div class="tag"><pre class="k-code"><s>&lt;i class="</s><em class="c1">with</em> <em class="c2">with-home</em><s>"&gt;&lt;/i&gt;</s></pre></div>`, { x: TAG.x, y: TAG.y, w: TAG.w, h: TAG.h }),
    // arrows from the two class names to their rules
    at(`<svg width="1600" height="1000" viewBox="0 0 1600 1000" fill="none" stroke="${BLUE}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
      <path d="M652 190 C 640 225, 520 220, 440 258"/><path d="M450 238 L438 259 L462 263"/>
      <path d="M840 190 C 860 225, 1060 220, 1150 258"/><path d="M1128 240 L1152 259 L1130 266"/>
    </svg>`, { x: 0, y: 0, z: 3 }),
    at(`<div class="k-card rule"><span class="rule__tag">shared by every icon</span><pre class="k-code"><em>.with</em> {
  width: 1em; height: 1em;
  vertical-align: <b>-0.125em</b>;
}
<em>.with::after</em> {
  background: <b>currentColor</b>;
  mask: var(--with-i);
}</pre></div>`, { ...R1 }),
    at(`<div class="k-card rule"><span class="rule__tag">one per icon</span><pre class="k-code"><em>.with-home</em> {
  --with-i: url("data:image/
    svg+xml,%3Csvg <s>…</s>%3E");
}</pre><span class="k-hand rule__note">the shape: about 292 B gzipped</span></div>`, { ...R2 }),
    // the result row
    at(`<span class="k-lbl"><em>result</em></span>`, { x: 250, y: 790 }),
    ...RES.map(([c, bg], i) => at(`<span class="hm" style="color:${c};background:${bg}">${icon('home', 'line', 50, c)}Home</span>`, { x: 440 + i * 330, y: 756, h: 100 })),
  ].join(''),
  css: `${CSS}
.tag { box-sizing: border-box; height: 100%; display: grid; place-items: center; border-radius: 30px; background: #14171F; box-shadow: 0 40px 80px -40px ${rgba(INK, 0.6)}; }
.tag .k-code { font-size: 36px; color: #F4F0E8; }
.tag .k-code s { color: ${rgba('#F4F0E8', 0.55)}; }
.tag .k-code em { color: #5ED3EA; border-bottom: 4px solid ${BLUE}; }
.rule { position: relative; padding: 62px 40px 30px; }
.rule__tag { position: absolute; left: 40px; top: -22px; padding: 10px 18px; border-radius: 999px; background: ${BLUE}; color: #fff; font: 700 24px/1 var(--font-display); letter-spacing: .01em; }
.rule__note { position: absolute; left: 40px; bottom: 34px; font-size: 38px; }
.hm { box-sizing: border-box; height: 100%; display: inline-flex; align-items: center; gap: 16px; padding: 0 34px 0 28px; border-radius: 26px; font: 700 46px/1 var(--font-display); letter-spacing: -.02em; border: 2px solid ${rgba(INK, 0.08)}; box-shadow: 0 30px 50px -30px ${rgba(INK, 0.5)}; }
`,
}
