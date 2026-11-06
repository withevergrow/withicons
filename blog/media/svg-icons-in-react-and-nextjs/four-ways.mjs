import { at, icon, C, INK } from '../../tools/hero-kit.mjs'
import { B, BG, LOOK_CSS } from './_look.mjs'

// Decision map: one SVG icon, two questions, three answers, plus a side note for sprites.
const arrow = (d) => `<path d="${d}" stroke="${B.c}" stroke-width="5" stroke-linecap="round" fill="none" marker-end="url(#fw-ah)"/>`
const yn = (t, x, y) => at(`<span class="fc-yn">${t}</span>`, { x, y })

export default {
  alt: 'A flowchart on a pale blueprint grid: from I have an SVG icon, part of a full icon set leads to an icon component package, otherwise needing CSS colour leads to SVGR and not needing it leads to an img tag, with a side note on sprites',
  bg: BG,
  art: () => [
    at(`<svg width="1600" height="1000" viewBox="0 0 1600 1000" class="fc-edges">
      <defs><marker id="fw-ah" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 Z" fill="${B.c}"/></marker></defs>
      ${arrow('M800 168 V232')}
      ${arrow('M598 296 C 420 300, 340 330, 340 392')}
      ${arrow('M1002 296 C 1120 300, 1150 340, 1150 404')}
      ${arrow('M1010 512 C 920 540, 905 580, 905 628')}
      ${arrow('M1290 512 C 1370 540, 1375 580, 1375 628')}
    </svg>`, { x: 0, y: 0 }),
    at(`<span class="fc-pill is-ink">${icon('file-code', 'line', 40, '#fff')}I have an SVG icon</span>`, { cx: 800, cy: 128 }),
    at(`<span class="fc-pill">Part of a full icon set?</span>`, { cx: 800, cy: 296 }),
    yn('yes', 420, 236), yn('no', 1110, 236),
    at(`<div class="fc-card"><h4>Icon component package</h4><p>One import per icon, no set-up.</p><div class="fw-row">${['search', 'settings', 'bell'].map(n => `<span>${icon(n, 'line', 56, INK)}</span>`).join('')}</div></div>`, { x: 96, y: 400, w: 490, h: 300 }),
    at(`<span class="fc-pill">Must it change colour with CSS?</span>`, { cx: 1150, cy: 470 }),
    yn('yes', 806, 540), yn('no', 1390, 548),
    at(`<div class="fc-card"><h4>SVGR</h4><code>?react in Vite</code><code>turbopack.rules in Next 16</code></div>`, { x: 640, y: 636, w: 530, h: 240 }),
    at(`<div class="fc-card"><h4>&lt;img src&gt;</h4><p>or <code>next/image</code></p><p>Fixed colours.</p></div>`, { x: 1200, y: 636, w: 336, h: 240 }),
    at(`<div class="fw-note">${icon('layers', 'line', 44, B.text)}<div><b>Many icons, no JS?</b><code>Sprite + &lt;use&gt;</code></div></div>`, { x: 96, y: 752, w: 490 }),
  ].join(''),
  css: `${LOOK_CSS}
.fw-row { display: flex; gap: 18px; margin-top: auto; }
.fw-row span { display: grid; place-items: center; width: 92px; height: 92px; border-radius: 26px; background: ${B.soft}; }
.fw-note { box-sizing: border-box; display: flex; align-items: center; gap: 20px; padding: 22px 28px; border-radius: 26px; border: 3px dashed ${B.c}; background: rgba(255,255,255,.7); }
.fw-note b { display: block; font: 700 30px/1.15 var(--font-display); letter-spacing: -.02em; color: ${INK}; }
.fw-note code { font: 600 30px/1.3 var(--font-mono); color: ${B.text}; }
`,
}
