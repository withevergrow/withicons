import { at, icon, glow, C, INK, rgba } from '../tools/hero-kit.mjs'

// Treatment: a glowing React component tree drawn over a dark circuit board. A logo.svg file card on the left is
// imported (dashed line) into a <Logo /> node; <App /> branches to <Logo />, <Nav /> and <Page />, whose leaves are
// real with icons on white tiles. Blueprint cyan (code) accent.
const B = C.blueprint
const CY = '#5BE4FF'
const N = { app: [1000, 200], logo: [560, 420], nav: [900, 420], page: [1260, 420] }
const LEAVES = [['home', 'line', 800, 'nav'], ['search', 'glass', 990, 'nav'], ['bell', 'gloss', 1170, 'page'], ['settings', 'sticker', 1350, 'page']]
const LY = 690
const FILE = [300, 232]

const curve = ([x1, y1], [x2, y2]) => `M${x1} ${y1} C ${x1} ${(y1 + y2) / 2}, ${x2} ${(y1 + y2) / 2}, ${x2} ${y2}`
function edges() {
  const lines = [curve(N.app, N.logo), curve(N.app, N.nav), curve(N.app, N.page), ...LEAVES.map(([, , x, p]) => curve(N[p], [x, LY]))]
  const dots = [N.logo, N.nav, N.page, ...LEAVES.map(([, , x]) => [x, LY - 70])]
  return `<svg width="1600" height="1000" viewBox="0 0 1600 1000" fill="none" class="ct__edges">
    ${lines.map(d => `<path d="${d}" stroke="${CY}" stroke-width="5" stroke-linecap="round"/>`).join('')}
    <path d="M${FILE[0] + 120} ${FILE[1] + 10} C 470 240, 560 300, ${N.logo[0]} ${N.logo[1] - 40}" stroke="#fff" stroke-width="5" stroke-linecap="round" stroke-dasharray="2 16"/>
    ${dots.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="7" fill="${CY}"/>`).join('')}
  </svg>`
}
const node = (label, [cx, cy], ic) => at(`<span class="ct__node">${ic ? icon(ic[0], ic[1], 40, ic[2]) : ''}${label}</span>`, { cx, cy, z: 3 })

export default {
  photoFile: 'svg-icons-in-react-and-nextjs-circuit.jpg',
  credit: { by: 'ClickerHappy', profile: 'https://www.pexels.com/@clickerhappy/', source: 'https://www.pexels.com/photo/shallow-focus-photography-of-black-circuit-board-1448561/', license: 'Pexels License' },
  alt: 'A dark circuit board under a glowing cyan React component tree: a logo.svg file card is imported into a Logo node, and App branches to Logo, Nav and Page, whose leaves are home, search, bell and settings icons on white tiles',
  photo: { filter: 'grayscale(.6) brightness(.42) contrast(1.15)', pos: '50% 50%' },
  overlay: `radial-gradient(ellipse at 65% 45%, ${rgba('#00A3C4', 0.28)} 0%, ${rgba('#06121A', 0.55)} 70%), linear-gradient(${rgba('#06121A', 0.25)}, ${rgba('#06121A', 0.25)})`,
  art: () => [
    glow({ cx: 1000, cy: 430, r: 360, color: B.c, opacity: 0.32, blur: 110 }),
    at(edges(), { x: 0, y: 0, z: 1 }),
    at(`<div class="ct__file"><span class="ct__fi">${icon('file-code', 'line', 54, B.text)}</span><b>logo.svg</b></div>`, { cx: FILE[0], cy: FILE[1], z: 3, rot: -4 }),
    node('&lt;App /&gt;', N.app, ['component', 'line', CY]),
    node('&lt;Logo /&gt;', N.logo, ['sparkles', 'line', CY]),
    node('&lt;Nav /&gt;', N.nav),
    node('&lt;Page /&gt;', N.page),
    ...LEAVES.map(([n, s, x]) => at(`<span class="ct__leaf">${icon(n, s, 84, s === 'line' ? C.line.c : s === 'gloss' ? C.gloss.c : undefined)}</span>`, { cx: x, cy: LY, z: 3 })),
  ].join(''),
  css: `
.ct__edges { display: block; overflow: visible; filter: drop-shadow(0 0 10px ${rgba(CY, 0.9)}) drop-shadow(0 0 26px ${rgba(B.c, 0.7)}); }
.ct__node { display: inline-flex; align-items: center; gap: 14px; padding: 16px 30px; border-radius: 999px; background: ${rgba('#06121A', 0.82)}; border: 2.5px solid ${CY}; color: #E8FCFF; font: 600 38px/1 var(--font-mono); letter-spacing: -.02em; white-space: nowrap; box-shadow: 0 0 0 8px ${rgba(CY, 0.12)}, 0 0 50px ${rgba(CY, 0.55)}, 0 30px 60px -20px rgba(0,0,0,.8); }
.ct__leaf { display: grid; place-items: center; width: 140px; height: 140px; border-radius: 38px; background: #fff; box-shadow: 0 0 0 6px ${rgba(CY, 0.22)}, 0 0 46px ${rgba(CY, 0.5)}, 0 30px 50px -20px rgba(0,0,0,.8); }
.ct__file { display: flex; align-items: center; gap: 18px; padding: 18px 28px 18px 18px; border-radius: 28px; background: #fff; color: ${INK}; box-shadow: 0 40px 70px -24px rgba(0,0,0,.85); }
.ct__fi { display: grid; place-items: center; width: 84px; height: 84px; border-radius: 22px; background: ${B.soft}; }
.ct__file b { font: 700 36px/1 var(--font-mono); letter-spacing: -.03em; }
`,
}
