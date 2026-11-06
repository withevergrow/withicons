import { at, icon, C, INK, rgba } from '../../tools/hero-kit.mjs'

// In-post: five yes/no checks in a column, each with a line icon. Every "no" points right to a short fix; the last
// "yes" drops into a generic search result row that now shows its round favicon (a white leaf on deep green).
const O = C.solid
const GREEN = '#1E5B3A'
const CHECKS = [
  ['home', 'Is it on your home page?', 'Link it from the home page'],
  ['lock', 'Can Google fetch it?', 'Unblock it in robots.txt'],
  ['crop', 'Square and bigger than 48 px?', 'Use a square 192 px PNG'],
  ['file-image', 'PNG or ICO, not only SVG?', 'Add a PNG or ICO file'],
  ['clock', 'Waited for a recrawl?', 'Request indexing, then wait'],
]
const X = 150, W = 700, Y0 = 76, STEP = 136, H = 100, FX = 954

function wires() {
  let s = ''
  CHECKS.forEach((_, k) => {
    const y = Y0 + k * STEP
    s += `<path d="M${X + W} ${y + H / 2} H${FX - 14}" class="no" marker-end="url(#ahO)"/>`
    if (k < CHECKS.length - 1) s += `<path d="M${X + 70} ${y + H} V${y + STEP - 6}" marker-end="url(#ah)"/>`
  })
  const yl = Y0 + 4 * STEP + H
  s += `<path d="M${X + 70} ${yl} V${yl + 52}" marker-end="url(#ah)"/>`
  return `<svg width="1600" height="1000" viewBox="0 0 1600 1000" fill="none" class="ck__ln"><defs>
    <marker id="ah" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="4.5" markerHeight="4.5" orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill="${INK}"/></marker>
    <marker id="ahO" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="4.5" markerHeight="4.5" orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill="${O.c}"/></marker></defs>${s}</svg>`
}

export default {
  alt: 'A flowchart of five favicon checks with line icons (home page, fetchable, square, PNG or ICO, recrawl), each no leading to a fix, ending at a search result with a green leaf favicon',
  bg: `radial-gradient(${rgba(INK, 0.08)} 2px, transparent 2.5px) 0 0 / 34px 34px, linear-gradient(180deg, #FBF8F3, #F3EEE5)`,
  art: () => [
    at(wires(), { x: 0, y: 0 }),
    ...CHECKS.flatMap(([ic, q, fix], k) => {
      const y = Y0 + k * STEP
      return [
        at(`<div class="ck__q"><span class="ck__ic">${icon(ic, 'line', 46, INK)}</span><b>${q}</b></div>`, { x: X, y, w: W, h: H }),
        at('<span class="ck__no">no</span>', { cx: (X + W + FX) / 2, cy: y + H / 2 - 30 }),
        at(`<div class="ck__fix">${fix}</div>`, { x: FX, y: y + 14, h: H - 28 }),
        k < CHECKS.length - 1 ? at('<span class="ck__yes">yes</span>', { x: X + 92, y: y + H + 4 }) : '',
      ]
    }),
    at('<span class="ck__yes">yes</span>', { x: X + 92, y: Y0 + 4 * STEP + H + 10 }),
    at(`<div class="ck__res"><span class="ck__fav">${icon('leaf', 'solid', 36, '#fff')}</span><div><b>Fern and Pine Plants</b><i>fernandpine.example</i></div><span class="ck__ok">${icon('check-circle', 'solid', 44, O.c)}</span></div>`, { x: X, y: 796, w: 820 }),
  ].join(''),
  css: `
.ck__ln marker path { stroke: none; opacity: 1; }
.ck__ln { display: block; } .ck__ln path { stroke: ${INK}; stroke-width: 4; opacity: .6; } .ck__ln path.no { stroke: ${O.c}; opacity: 1; stroke-dasharray: 2 11; stroke-linecap: round; }
.ck__q { box-sizing: border-box; height: 100%; display: flex; align-items: center; gap: 22px; padding: 0 26px 0 18px; border-radius: 26px; background: #fff; box-shadow: 0 2px 0 rgba(17,19,24,.04), 0 24px 50px -30px rgba(17,19,24,.5); border: 2px solid rgba(17,19,24,.06); }
.ck__q b { font: 700 32px/1.1 var(--font-display); letter-spacing: -.02em; color: ${INK}; }
.ck__ic { flex: none; width: 68px; height: 68px; border-radius: 20px; display: grid; place-items: center; background: #F1EEE8; }
.ck__no { font: 700 30px/1 var(--font-display); color: ${O.text}; }
.ck__yes { font: 700 28px/1 var(--font-display); color: #5A606D; }
.ck__fix { box-sizing: border-box; height: 100%; display: flex; align-items: center; padding: 0 26px; border-radius: 999px; background: ${O.soft}; color: ${O.text}; font: 700 29px/1 var(--font-display); white-space: nowrap; border: 2px solid ${rgba(O.c, 0.25)}; }
.ck__res { box-sizing: border-box; display: flex; align-items: center; gap: 22px; padding: 22px 30px; border-radius: 28px; background: #fff; box-shadow: 0 0 0 4px ${rgba(GREEN, 0.25)}, 0 30px 60px -30px rgba(17,19,24,.5); }
.ck__fav { flex: none; width: 68px; height: 68px; border-radius: 50%; display: grid; place-items: center; background: ${GREEN}; }
.ck__res div { display: flex; flex-direction: column; gap: 8px; flex: 1; }
.ck__res b { font: 800 36px/1 var(--font-display); letter-spacing: -.02em; color: ${INK}; }
.ck__res i { font: 500 24px/1 var(--font-mono); font-style: normal; color: #4C7A5E; }
`,
}
