import { at, icon, INK, rgba } from '../../tools/hero-kit.mjs'
import { B, CY, NAVY, LOOK_CSS, split, seam } from './_look.mjs'

// Server zone (paper): layout, nav and page with their icons -> the browser gets HTML only. Client zone (dark): one
// search box under "use client" -> its search icon is shipped as JavaScript.
const S = 960
const mini = (n, label) => `<div class="bd-mini"><span>${icon(n, 'line', 64, INK)}</span><b>${label}</b></div>`

export default {
  alt: 'A two-zone diagram: on the paper Server Components side, layout, nav and page cards with home, search and bell icons send HTML only with 0 KB icon JS to the browser; on the dark use client side, a search box component ships its search icon as JavaScript',
  bg: split(S),
  art: () => [
    at(seam(S), { x: S - 20, y: 0 }),
    at(`<span class="bd-title">Server Components</span>`, { x: 110, y: 96 }),
    at(`<span class="bd-title is-dark">"use client"</span>`, { x: S + 70, y: 100 }),
    at(`<div class="bd-row">${mini('home', 'layout')}${mini('search', 'nav')}${mini('bell', 'page')}</div>`, { x: 110, y: 190 }),
    at(`<div class="rs-card is-dark"><span class="rs-mono" style="color:${CY}">&lt;SearchBox /&gt;</span><div class="bd-search">${icon('search', 'line', 48, B.c)}<span>Search</span></div></div>`, { x: S + 70, y: 190, w: 470, h: 230 }),
    // arrows down to the browser
    at(`<svg width="1600" height="1000" viewBox="0 0 1600 1000" fill="none">
      <defs><marker id="bd-ah" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10Z" fill="context-stroke"/></marker></defs>
      <path d="M480 450 V660" stroke="${INK}" stroke-width="5" stroke-linecap="round" marker-end="url(#bd-ah)"/>
      <path d="M1265 450 V660" stroke="${CY}" stroke-width="5" stroke-linecap="round" marker-end="url(#bd-ah)"/>
    </svg>`, { x: 0, y: 0 }),
    at(`<span class="rs-chip" style="background:${INK}">${icon('file-code', 'line', 36, '#fff')}HTML only, 0 KB icon JS</span>`, { cx: 480, cy: 540, z: 3 }),
    at(`<span class="rs-chip" style="background:${B.c}">${icon('braces', 'line', 36, '#fff')}shipped as JavaScript</span>`, { cx: 1265, cy: 540, z: 3 }),
    // the browser
    at(`<div class="bd-browser"><div class="bd-bar"><i></i><i></i><i></i><span>${icon('globe', 'line', 30, '#5A606D')}browser</span></div><div class="bd-body">
      <div class="bd-nav">${['home', 'search', 'bell'].map(n => icon(n, 'line', 44, INK)).join('')}</div>
      <div class="bd-js">${icon('search', 'line', 40, B.c)}<span>search.js</span></div>
    </div></div>`, { x: 200, y: 690, w: 1200 }),
  ].join(''),
  css: `${LOOK_CSS}
.bd-title { font: 800 46px/1 var(--font-display); letter-spacing: -.03em; color: ${INK}; }
.bd-title.is-dark { font: 700 44px/1 var(--font-mono); color: ${CY}; }
.bd-row { display: flex; gap: 26px; }
.bd-mini { display: flex; flex-direction: column; align-items: center; gap: 16px; width: 230px; padding: 28px 0 24px; border-radius: 28px; background: #fff; border: 1.5px solid rgba(17,19,24,.08); box-shadow: 0 34px 60px -34px rgba(17,19,24,.55); }
.bd-mini span { display: grid; place-items: center; width: 110px; height: 110px; border-radius: 30px; background: ${B.soft}; }
.bd-mini b { font: 600 30px/1 var(--font-mono); color: ${INK}; }
.bd-search { display: flex; align-items: center; gap: 16px; margin-top: auto; padding: 18px 22px; border-radius: 20px; background: #fff; border: 3px solid ${CY}; box-shadow: 0 0 0 6px ${rgba(CY, 0.18)}, 0 0 36px ${rgba(CY, 0.45)}; font: 600 32px/1 var(--font-display); color: #5A606D; }
.bd-browser { border-radius: 28px; overflow: hidden; background: #fff; box-shadow: 0 0 0 2px rgba(17,19,24,.08), 0 50px 90px -40px rgba(0,0,0,.7); }
.bd-bar { display: flex; align-items: center; gap: 10px; padding: 16px 22px; background: #F1EFEA; border-bottom: 1.5px solid rgba(17,19,24,.08); }
.bd-bar i { width: 14px; height: 14px; border-radius: 50%; background: #FF5F57; } .bd-bar i:nth-child(2) { background: #FEBC2E; } .bd-bar i:nth-child(3) { background: #28C840; }
.bd-bar span { display: flex; align-items: center; gap: 10px; margin-left: 16px; font: 600 28px/1 var(--font-display); color: #5A606D; }
.bd-body { display: flex; align-items: center; justify-content: space-between; padding: 26px 40px; }
.bd-nav { display: flex; gap: 34px; padding: 16px 28px; border-radius: 20px; background: ${B.soft}; }
.bd-js { display: flex; align-items: center; gap: 14px; padding: 16px 26px; border-radius: 20px; background: ${NAVY}; color: #fff; font: 600 30px/1 var(--font-mono); }
`,
}
