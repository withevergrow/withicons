import { at, icon, INK, rgba } from '../../tools/hero-kit.mjs'
import { B, CY, RED, GREEN, LOOK_CSS, split, seam } from './_look.mjs'

// Two lanes across the server | client seam. Top: icon={Search} is a function, its arrow stops at the seam (red x).
// Bottom: icon={<Search />} is an element, its arrow crosses and arrives as a button with the search icon (green check).
const S = 900

export default {
  alt: 'Two lanes crossing a dashed server and client boundary: icon={Search} passes a function and its arrow is stopped at the line by a red x, while icon={<Search />} passes an element whose arrow crosses into a client button showing the search icon, marked with a green check',
  bg: split(S),
  art: () => [
    at(seam(S), { x: S - 20, y: 0 }),
    at(`<span class="rs-tab">server | client</span>`, { cx: S, cy: 110, z: 4 }),
    // lane 1: don't
    at(`<div class="rs-card"><span class="pi-code">icon={<em>Search</em>}</span><div class="pi-row"><span class="pi-tile is-ghost">${icon('search', 'line', 64, INK)}</span><span class="rs-label">a function, not data</span></div></div>`, { x: 110, y: 200, w: 520, h: 290, cls: 'pi-card' }),
    at(`<svg width="300" height="40" viewBox="0 0 300 40" fill="none"><path d="M6 20 H230" stroke="${RED}" stroke-width="6" stroke-linecap="round" stroke-dasharray="4 14"/></svg>`, { x: 640, y: 325 }),
    at(`<span class="pi-badge" style="background:${RED}">${icon('x-circle', 'line', 70, '#fff')}</span>`, { cx: S, cy: 345, z: 3 }),
    at(`<span class="pi-note" style="color:#FF8A8D">can't cross to the client</span>`, { x: S + 90, y: 320 }),
    // lane 2: do
    at(`<div class="rs-card"><span class="pi-code">icon={<em>&lt;Search /&gt;</em>}</span><div class="pi-row"><span class="pi-tile">${icon('search', 'line', 64, INK)}</span><span class="rs-label">an element: plain data</span></div></div>`, { x: 110, y: 590, w: 520, h: 290, cls: 'pi-card' }),
    at(`<svg width="560" height="40" viewBox="0 0 560 40" fill="none"><defs><marker id="pi-ah" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="4" markerHeight="4" orient="auto"><path d="M0 0L10 5L0 10Z" fill="${GREEN}"/></marker></defs><path d="M6 20 H520" stroke="${GREEN}" stroke-width="6" stroke-linecap="round" marker-end="url(#pi-ah)"/></svg>`, { x: 640, y: 715 }),
    at(`<span class="pi-badge" style="background:${GREEN}">${icon('check-circle', 'line', 70, '#fff')}</span>`, { cx: S, cy: 735, z: 3 }),
    at(`<div class="pi-btn">${icon('search', 'line', 48, '#fff')}<span>Search</span></div>`, { x: 1190, y: 690 }),
    at(`<span class="pi-note" style="color:#7FE0A8">crosses fine</span>`, { x: 1190, y: 600 }),
  ].join(''),
  css: `${LOOK_CSS}
.pi-row { display: flex; align-items: center; gap: 22px; margin-top: auto; }
.pi-tile { flex: none; display: grid; place-items: center; width: 110px; height: 110px; border-radius: 30px; background: ${B.soft}; }
.pi-tile.is-ghost { background: none; border: 4px dashed rgba(17,19,24,.25); box-sizing: border-box; } .pi-tile.is-ghost .hk-icon { opacity: .3; }
.pi-code { font: 700 44px/1.1 var(--font-mono); letter-spacing: -.04em; color: ${INK}; }
.pi-code em { font-style: normal; color: ${B.text}; }
.pi-badge { display: grid; place-items: center; width: 110px; height: 110px; border-radius: 50%; box-shadow: 0 0 0 8px #fff, 0 24px 40px -16px rgba(0,0,0,.6); }
.pi-note { font: 700 46px/1.1 var(--font-hand); white-space: nowrap; }
.pi-btn { display: inline-flex; align-items: center; gap: 16px; padding: 24px 36px 24px 30px; border-radius: 26px; background: ${B.c}; color: #fff; font: 700 38px/1 var(--font-display); box-shadow: 0 0 0 6px ${rgba(CY, 0.2)}, 0 0 50px ${rgba(CY, 0.45)}; }
`,
}
