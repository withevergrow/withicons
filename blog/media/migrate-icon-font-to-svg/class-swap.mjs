import { at, icon, C, INK, rgba } from '../../tools/hero-kit.mjs'

// Before / after strip: the same <i> tag, only the class names change. Left: Font Awesome-style classes drawn by a
// font file. Right: with icons classes, a real SVG painted through a CSS mask. A curved arrow joins them.
const B = C.blueprint
const tagCode = (cls) => `<pre class="cs-code"><s>&lt;i class="</s>${cls}<s>"&gt;&lt;/i&gt;</s></pre>`

export default {
  alt: 'A before and after strip on warm paper: an i tag with fa-solid fa-house fa-fw classes drawn from a font file in one colour, and the same i tag with with with-home with-solid with-fw classes showing a real solid home SVG, joined by a curved arrow reading change the class names only',
  bg: `radial-gradient(${rgba(INK, 0.1)} 2px, transparent 2.5px) 0 0 / 36px 36px, linear-gradient(160deg, #FBF8F3 0%, #F2EADC 100%)`,
  art: () => [
    at(`<span class="cs-hand">change the class names only</span>`, { cx: 800, cy: 130 }),
    at(`<svg width="560" height="120" viewBox="0 0 560 120" fill="none"><defs><marker id="cs-ah" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="4" markerHeight="4" orient="auto"><path d="M0 0L10 5L0 10Z" fill="${B.c}"/></marker></defs><path d="M10 110 C 120 10, 440 10, 540 104" stroke="${B.c}" stroke-width="7" stroke-linecap="round" marker-end="url(#cs-ah)"/></svg>`, { x: 520, y: 168 }),
    at(`<div class="cs-card">
      <span class="cs-head">Before</span>
      ${tagCode('<b class="is-old">fa-solid<br>   fa-house fa-fw</b>')}
      <div class="cs-foot"><span class="cs-tile is-font">${icon('type', 'line', 64, '#5A606D')}</span><span class="cs-note">font file,<br>one colour</span></div>
    </div>`, { x: 96, y: 300, w: 660, h: 500 }),
    at(`<div class="cs-card is-new">
      <span class="cs-head">After</span>
      ${tagCode('<b class="is-new">with with-home<br>   with-solid with-fw</b>')}
      <div class="cs-foot"><span class="cs-tile">${icon('home', 'solid', 76, C.solid.c)}</span><span class="cs-note">real SVG via<br>CSS mask</span></div>
    </div>`, { x: 844, y: 300, w: 660, h: 500 }),
  ].join(''),
  css: `
.hk-at > svg { display: block; overflow: visible; }
.cs-hand { font: 700 58px/1 var(--font-hand); color: ${B.text}; white-space: nowrap; }
.cs-card { box-sizing: border-box; height: 100%; display: flex; flex-direction: column; gap: 26px; padding: 34px 36px; border-radius: 34px; background: #fff; border: 1.5px solid rgba(17,19,24,.07); box-shadow: 0 2px 0 rgba(17,19,24,.04), 0 40px 70px -36px rgba(60,40,20,.5); font-family: var(--font-display); color: ${INK}; }
.cs-card.is-new { box-shadow: 0 0 0 4px ${B.c}, 0 40px 70px -36px rgba(0,60,80,.5); }
.cs-head { font: 800 40px/1 var(--font-display); letter-spacing: -.03em; }
.cs-code { margin: 0; padding: 26px 28px; border-radius: 22px; background: #15171E; color: #E8ECF4; font: 500 30px/1.5 var(--font-mono); letter-spacing: -.03em; white-space: pre; }
.cs-code s { text-decoration: none; color: #8E96A8; }
.cs-code b { font-weight: 700; }
.cs-code b.is-old { color: #FF9A8A; }
.cs-code b.is-new { color: #5BE4FF; }
.cs-foot { display: flex; align-items: center; gap: 26px; margin-top: auto; }
.cs-tile { display: grid; place-items: center; width: 130px; height: 130px; border-radius: 36px; background: ${C.solid.soft}; }
.cs-tile.is-font { background: #F1EFEA; border: 3px dashed #C4C7CE; box-sizing: border-box; }
.cs-note { font: 600 32px/1.2 var(--font-display); color: #4A505C; letter-spacing: -.01em; }
`,
}
