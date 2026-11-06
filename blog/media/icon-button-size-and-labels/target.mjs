import { at, icon, INK, rgba } from '../../tools/hero-kit.mjs'
import { BG, CSS, B, BAD } from './_kit.mjs'

// Left: one icon button cut open, three nested layers: the button (cyan outline), the svg (grey dashed box) and the
// trash icon's shape, where a cursor clicks the lid (orange burst). Right: the same three as a little DOM stack, with
// an arrow bubbling up from <path> (event.target, orange) to <button> (event.currentTarget, cyan), and a green note
// with the CSS fix.
const GREEN = '#1E9E5A'
const row = (tag, col, label, y) => at(`<div class="tg-row"><span class="tg-tag" style="--c:${col}">${tag}</span>${label ? `<span class="tg-lab" style="color:${col}">${label}</span>` : ''}</div>`, { x: 860, y })

export default {
  alt: 'A diagram of an icon button cut open: a cursor clicks the lid of a trash icon inside an svg inside a button, and an arrow bubbles up from the path, labelled event.target, through the svg to the button, labelled event.currentTarget, beside a green note reading svg pointer-events none',
  bg: BG,
  art: () => [
    // the nested button
    at(`<div class="tg-btn"><span class="tg-cap" style="background:${B.c}">button</span>
      <div class="tg-svg"><span class="tg-cap" style="background:#7A808C">svg</span>${icon('trash', 'line', 300, INK)}</div></div>`, { x: 110, y: 180, w: 600, h: 600 }),
    at(`<span class="tg-burst"></span>`, { cx: 410, cy: 378, z: 3 }),
    at(icon('cursor', 'solid', 80, INK), { x: 414, y: 372, z: 4, style: 'filter: drop-shadow(0 0 3px #fff) drop-shadow(0 10px 14px rgba(0,0,0,.3))' }),
    // the DOM stack
    at(`<span class="ib-mono">bubbles up</span>`, { x: 860, y: 168 }),
    row('&lt;button&gt;', B.c, 'event.currentTarget', 240),
    row('&lt;svg&gt;', '#7A808C', '', 370),
    row('&lt;path&gt;', BAD, 'event.target', 500),
    at(`<svg width="60" height="330" fill="none"><path d="M30 320 V24" stroke="${INK}" stroke-width="5" stroke-linecap="round"/><path d="M12 42 L30 18 L48 42" stroke="${INK}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg>`, { x: 790, y: 236 }),
    at(`<div class="tg-note">${icon('check-circle', 'line', 40, GREEN)}<code>svg { pointer-events: none }</code></div>`, { x: 790, y: 676 }),
  ].join(''),
  css: `${CSS}
.tg-btn { position: relative; box-sizing: border-box; width: 100%; height: 100%; padding: 70px; border-radius: 80px; background: #fff; border: 7px solid ${B.c}; box-shadow: 0 50px 90px -50px rgba(0,60,80,.6); }
.tg-svg { position: relative; box-sizing: border-box; width: 100%; height: 100%; display: grid; place-items: center; border-radius: 20px; border: 4px dashed #9AA0AC; background: ${rgba('#F2FAFC', 0.7)}; }
.tg-cap { position: absolute; left: 30px; top: -22px; padding: 6px 14px; border-radius: 10px; color: #fff; font: 700 28px/1 var(--font-mono); }
.tg-btn > .tg-cap { left: 60px; top: -26px; }
.tg-burst { display: block; width: 110px; height: 110px; border-radius: 50%; border: 6px solid ${BAD}; box-shadow: 0 0 0 14px ${rgba(BAD, 0.16)}; }
.tg-row { display: flex; align-items: center; gap: 22px; }
.tg-tag { padding: 16px 22px; border-radius: 18px; background: #fff; border: 4px solid var(--c); color: ${INK}; font: 700 34px/1 var(--font-mono); box-shadow: 0 16px 30px -18px rgba(0,60,80,.5); }
.tg-lab { font: 700 32px/1 var(--font-mono); letter-spacing: -.02em; }
.tg-note { display: flex; align-items: center; gap: 16px; padding: 22px 28px; border-radius: 24px; background: #E4F6EC; border: 2px solid ${rgba(GREEN, 0.35)}; }
.tg-note code { font: 700 32px/1 var(--font-mono); color: #12663A; letter-spacing: -.02em; }
`,
}
