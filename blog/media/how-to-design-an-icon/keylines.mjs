import { at, icon, C, INK, PAPER, rgba } from '../../tools/hero-kit.mjs'

// Left: the 24 x 24 grid with the 2 px padding shaded and all four keylines in red. Right: one panel per keyline, the
// same grid smaller, that keyline alone, and a real line icon drawn over it at exactly the same scale.
const RED = '#EE4B57'
const KEY = {
  circle: u => `<circle cx="${12 * u}" cy="${12 * u}" r="${10 * u}"/>`,
  square: u => `<rect x="${3 * u}" y="${3 * u}" width="${18 * u}" height="${18 * u}"/>`,
  portrait: u => `<rect x="${4 * u}" y="${2 * u}" width="${16 * u}" height="${20 * u}"/>`,
  landscape: u => `<rect x="${2 * u}" y="${4 * u}" width="${20 * u}" height="${16 * u}"/>`,
}
function grid(u, keys, sw) {
  const S = 24 * u
  let g = `<path d="M0 0h${S}v${S}H0Z M${2 * u} ${2 * u}v${20 * u}h${20 * u}v${-20 * u}Z" fill="${rgba(C.duo.c, 0.12)}" fill-rule="evenodd"/>`
  for (let i = 0; i <= 24; i++) g += `<path d="M${i * u} 0V${S}M0 ${i * u}H${S}" stroke="${rgba(INK, i % 12 === 0 ? 0.22 : 0.09)}" stroke-width="1"/>`
  g += `<g stroke="${RED}" stroke-width="${sw}" fill="none">${keys.map(k => KEY[k](u)).join('')}</g>`
  return `<svg width="${S}" height="${S}" viewBox="0 0 ${S} ${S}" style="display:block;overflow:visible">${g}</svg>`
}
const keyOnly = (u, k) => `<svg width="${24 * u}" height="${24 * u}" viewBox="0 0 ${24 * u} ${24 * u}" style="display:block;overflow:visible"><g stroke="${RED}" stroke-width="3" fill="none">${KEY[k](u)}</g></svg>`
const PANELS = [
  ['circle', 'check-circle', 'Circle 20'], ['square', 'calendar', 'Square 18'],
  ['portrait', 'file', 'Portrait 16 x 20'], ['landscape', 'monitor', 'Landscape 20 x 16'],
]
const U2 = 11, PW = 348, PH = 386
function panel([k, name, label], i) {
  const x = 812 + (i % 2) * (PW + 24), y = 92 + Math.floor(i / 2) * (PH + 24)
  return at(`<div class="pn"><div class="pn__g">${grid(U2, [], 2.5)}<span class="pn__i">${icon(name, 'line', 24 * U2, rgba(INK, 0.82))}</span><span class="pn__i">${keyOnly(U2, k)}</span></div><b>${label}</b></div>`, { x, y, w: PW, h: PH })
}

export default {
  alt: 'A 24 by 24 pixel grid with the 2 pixel padding shaded and four red keylines, a circle, a square, a portrait and a landscape rectangle, beside four panels where check-circle, calendar, file and monitor line icons sit on each keyline',
  bg: `radial-gradient(120% 100% at 30% 0%, #FFFFFF 0%, ${PAPER} 75%)`,
  art: () => [
    at(`<div class="big">${grid(26, ['circle', 'square', 'portrait', 'landscape'], 3)}</div>`, { x: 96, y: 210 }),
    at(`<div class="hd"><b>24 x 24</b><span><i></i>2 px padding</span><span><i class="is-red"></i>keylines</span></div>`, { x: 96, y: 112 }),
    ...PANELS.map(panel),
  ].join(''),
  css: `
.big { padding: 0; background: #fff; box-shadow: 0 0 0 1.5px ${rgba(INK, 0.12)}, 0 40px 80px -40px rgba(17,19,24,.45); }
.hd { display: flex; align-items: center; gap: 26px; font: 600 30px/1 var(--font-display); color: ${INK}; white-space: nowrap; }
.hd b { font: 800 42px/1 var(--font-display); letter-spacing: -.02em; }
.hd span { display: inline-flex; align-items: center; gap: 10px; color: #4A4F5C; }
.hd i { width: 26px; height: 26px; border-radius: 6px; background: ${rgba(C.duo.c, 0.22)}; }
.hd i.is-red { background: none; border: 3px solid ${RED}; border-radius: 50%; box-sizing: border-box; }
.pn { box-sizing: border-box; height: 100%; padding: 26px; border-radius: 30px; background: #fff; display: flex; flex-direction: column; align-items: center; gap: 22px; box-shadow: 0 2px 0 rgba(17,19,24,.04), 0 30px 60px -36px rgba(17,19,24,.45); }
.pn__g { position: relative; width: ${24 * U2}px; height: ${24 * U2}px; }
.pn__i { position: absolute; inset: 0; }
.pn b { font: 800 30px/1 var(--font-display); letter-spacing: -.02em; color: ${INK}; white-space: nowrap; }
`,
}
