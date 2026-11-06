import { at, icon, C, INK, PAPER, rgba } from '../../tools/hero-kit.mjs'
import { pixIcon } from './_pix.mjs'

// Three rows, "input PNG -> traced SVG", run through the same tracer. The traced results are honest simulations:
// row 2 thresholds a blurry 12 px raster (the melted shapes a tracer finds), row 3 posterises a glossy rocket into the
// flat patches a tracer turns gradients into.
const O = C.solid, R = O.c, S = 190
const FILTERS = `<svg width="0" height="0" style="position:absolute"><defs>
<filter id="tr-melt" x="-10%" y="-10%" width="120%" height="120%"><feComponentTransfer><feFuncA type="discrete" tableValues="0 1 1"/></feComponentTransfer></filter>
<filter id="tr-poster" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves="2" seed="4" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="12" xChannelSelector="R" yChannelSelector="G" result="d"/><feComponentTransfer in="d" result="c"><feFuncR type="linear" slope="1.6" intercept="-0.3"/><feFuncG type="linear" slope="1.6" intercept="-0.3"/><feFuncB type="linear" slope="1.6" intercept="-0.3"/></feComponentTransfer><feComponentTransfer in="c"><feFuncR type="discrete" tableValues="0.25 0.7 0.97"/><feFuncG type="discrete" tableValues="0.2 0.55 0.93"/><feFuncB type="discrete" tableValues="0.25 0.55 0.93"/><feFuncA type="discrete" tableValues="0 1"/></feComponentTransfer></filter>
</defs></svg>`

const ROWS = [
  { file: '512 px, flat', inp: icon('rocket', 'solid', S, R), out: icon('rocket', 'solid', S, R), tag: 'Bold and flat: great', kind: 'ok' },
  { file: '32 px, blurry', inp: pixIcon('rocket', 'solid', { res: 14, size: S, color: R, smooth: true }), out: `<span style="display:block;filter:url(#tr-melt)">${pixIcon('rocket', 'solid', { res: 12, size: S, color: R, smooth: true })}</span>`, tag: 'Too small', kind: 'meh' },
  { file: '3D, glossy', inp: icon('rocket', 'soft3d', S), out: `<span style="display:block;line-height:0;filter:url(#tr-poster)">${icon('rocket', 'soft3d', S)}</span>`, tag: 'Gradients: poor', kind: 'bad' },
]
const MARK = { ok: ['check', '#13703A', '#E3F6EA'], meh: ['alert-triangle', '#9A5B00', '#FFF1D6'], bad: ['x-circle', '#B4232A', '#FDE7E7'] }
const row = r => {
  const [ic, fg, bg] = MARK[r.kind]
  return `<div class="lk-card tr"><div class="tr__box is-in">${r.inp}</div><div class="tr__file"><s>input.png</s>${r.file}</div>
  <div class="tr__arrow">${icon('arrow-right', 'line', 54, O.c)}<span>trace</span></div>
  <div class="tr__box is-out">${r.out}</div><span class="tr__tag" style="color:${fg};background:${bg}">${icon(ic, 'line', 34, fg)}${r.tag}</span></div>`
}

export default {
  bg: PAPER,
  alt: 'Three rows of input PNG to traced SVG with an orange rocket icon: a large flat rocket traces cleanly, a tiny blurry rocket traces into a lumpy shape with melted corners, and a glossy 3D rocket traces into blotchy flat patches',
  art: () => FILTERS + ROWS.map((r, i) => at(row(r), { x: 64, y: 64 + i * 300, w: 1472, h: 272, cls: 'lk' })).join(''),
  css: `
.lk { font-family: var(--font-display); color: ${INK}; }
.lk-card { box-sizing: border-box; width: 100%; height: 100%; background: #fff; border-radius: 34px; box-shadow: 0 2px 0 rgba(17,19,24,.04), 0 34px 70px -44px rgba(17,19,24,.45); border: 1.5px solid ${rgba(INK, 0.06)}; }
.tr { display: flex; align-items: center; gap: 34px; padding: 0 40px 0 36px; }
.tr__box { flex: none; width: 224px; height: 224px; border-radius: 24px; display: grid; place-items: center; line-height: 0; }
.tr__box.is-in { background: #fff conic-gradient(#ECEDF0 25%, #fff 0 50%, #ECEDF0 0 75%, #fff 0) 0 0 / 28px 28px; box-shadow: inset 0 0 0 2px ${rgba(INK, 0.06)}; }
.tr__box.is-out { background: #fff; box-shadow: inset 0 0 0 3px ${rgba(O.c, 0.35)}; }
.tr__file { width: 230px; font: 700 34px/1.15 var(--font-display); letter-spacing: -.02em; }
.tr__file s { display: block; text-decoration: none; font: 500 28px/1.4 var(--font-mono); color: #6A707C; letter-spacing: 0; }
.tr__arrow { display: flex; flex-direction: column; align-items: center; gap: 4px; font: 500 28px/1 var(--font-mono); color: ${O.text}; }
.tr__tag { margin-left: auto; display: inline-flex; align-items: center; gap: 12px; padding: 14px 26px 14px 18px; border-radius: 999px; font: 800 34px/1 var(--font-display); letter-spacing: -.02em; white-space: nowrap; }
`,
}
