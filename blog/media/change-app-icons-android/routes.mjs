import { at, icon, C, INK, PAPER, rgba } from '../../tools/hero-kit.mjs'

// A decision diagram: one phone asks "Which phone?", three curved branches lead to three route cards (Pixel, Samsung,
// any phone with a launcher). Each card ends in a row of three tiles showing what you get: Pixel's themed one-colour
// icons, and full dock-style pictures for the two routes that take your own image.
const O = C.solid
const ROWS = [
  { y: 92, who: 'Pixel', route: ['Wallpaper &amp; style', 'Icons'], note: 'Style + shape', verdict: ['no', 'No own pictures'], themed: true },
  { y: 384, who: 'Samsung', route: ['Themes', 'Icons'], route2: ['Good Lock', 'Theme Park'], verdict: ['yes', 'Your own picture'] },
  { y: 676, who: 'Any phone', route: ['Launcher app', 'Edit icon'], note: 'Pick any PNG', verdict: ['yes', 'Per-app PNG'] },
]
const H = 232
const path = r => r.map((s, i) => `${i ? '<i class="rt__sep">›</i>' : ''}<span>${s}</span>`).join('')
const trio = themed => ['camera', 'music-note', 'mail'].map(n => themed
  ? `<span class="rt__th">${icon(n, 'line', 50, '#3E5A4C')}</span>`
  : `<span class="rt__dk">${icon(n, 'dock', 78)}</span>`).join('')
const card = r => at(`<div class="rt__card">
  <span class="rt__who">${icon('smartphone', 'solid', 30, '#fff')}${r.who}</span>
  <div class="rt__mid">
    <div class="rt__path">${path(r.route)}</div>
    ${r.route2 ? `<div class="rt__path">${path(r.route2)}</div>` : `<div class="rt__note">${r.note}</div>`}
    <div class="rt__verdict is-${r.verdict[0]}">${icon(r.verdict[0] === 'yes' ? 'check' : 'ban', 'line', 30)}${r.verdict[1]}</div>
  </div>
  <div class="rt__trio">${trio(r.themed)}</div>
</div>`, { x: 560, y: r.y, w: 976, h: H })

// connectors from the start node (right edge ~ x 400, y 500) to the left edge of each card
const SX = 410, SY = 500
const wires = () => `<svg width="1600" height="1000" viewBox="0 0 1600 1000" fill="none">${ROWS.map(r => {
  const ey = r.y + H / 2
  return `<path d="M${SX} ${SY} C ${SX + 90} ${SY}, 460 ${ey}, 552 ${ey}" stroke="${O.c}" stroke-width="6" stroke-linecap="round" stroke-dasharray="2 14"/><circle cx="552" cy="${ey}" r="9" fill="${O.c}"/>`
}).join('')}</svg>`

export default {
  bg: `radial-gradient(90% 70% at 15% 50%, ${O.soft} 0%, ${PAPER} 60%)`,
  alt: 'A decision diagram: a phone asking which phone you have branches to three cards, Pixel (Wallpaper and style, Icons: style and shape, no own pictures), Samsung (Themes, Icons or Good Lock, Theme Park: your own picture) and any phone (launcher app, edit icon: per-app PNG), each ending in camera, music and mail tiles',
  art: () => [
    at(wires(), { x: 0, y: 0 }),
    at(`<div class="rt__start"><span class="rt__phone">${icon('smartphone', 'dock', 170)}</span><b>Which phone?</b></div>`, { cx: 250, cy: 500 }),
    ROWS.map(card).join(''),
  ].join(''),
  css: `
.rt__start { display: flex; flex-direction: column; align-items: center; gap: 18px; }
.rt__phone { width: 230px; height: 230px; border-radius: 64px; display: grid; place-items: center; background: #fff; box-shadow: 0 2px 0 rgba(17,19,24,.04), 0 40px 80px -36px rgba(17,19,24,.5); }
.rt__start b { font: 800 42px/1 var(--font-display); letter-spacing: -.03em; color: ${INK}; }
.rt__card { box-sizing: border-box; height: 100%; display: flex; align-items: center; gap: 26px; padding: 26px 30px; border-radius: 36px; background: #fff;
  box-shadow: 0 2px 0 rgba(17,19,24,.04), 0 40px 80px -40px rgba(17,19,24,.45); font-family: var(--font-display); color: ${INK}; }
.rt__who { flex: none; align-self: flex-start; display: inline-flex; align-items: center; gap: 10px; padding: 12px 20px 12px 16px; border-radius: 999px; background: ${O.c}; color: #fff; font: 800 28px/1 var(--font-display); letter-spacing: -.02em; width: 222px; box-sizing: border-box; white-space: nowrap; }
.rt__who .hk-icon { flex: none; }
.rt__mid { flex: 1; display: flex; flex-direction: column; gap: 12px; min-width: 0; }
.rt__path { display: flex; align-items: center; gap: 10px; font: 700 32px/1.1 var(--font-display); letter-spacing: -.02em; white-space: nowrap; }
.rt__sep { font-style: normal; color: ${O.c}; font-weight: 800; }
.rt__note { font: 600 30px/1.1 var(--font-display); color: #5B606B; }
.rt__verdict { display: inline-flex; align-self: flex-start; align-items: center; gap: 8px; padding: 8px 16px 8px 12px; border-radius: 999px; font: 700 28px/1 var(--font-display); }
.rt__verdict.is-yes { background: #DDF5E6; color: #146C3A; }
.rt__verdict.is-no { background: #F1EEEA; color: #6B6F78; }
.rt__trio { flex: none; display: flex; gap: 12px; }
.rt__dk { width: 82px; height: 82px; display: grid; place-items: center; }
.rt__th { width: 82px; height: 82px; border-radius: 50%; display: grid; place-items: center; background: #D6E6DA; }
`,
}
