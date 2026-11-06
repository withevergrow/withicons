import { at, icon, C, rgba, INK } from '../../tools/hero-kit.mjs'

// Three steps on cream: the free leaf icon as it ships, a new mark drawn from it (two leaves meeting as the letter M,
// with round stems either side), and that mark locked up with the made-up name Meadow Studio. Thin arrows between.
const G = '#2F6B4A', O = C.solid.c
const W = 420, H = 570, Y = 160, XS = [96, 590, 1084]

// a lens-shaped leaf between two points, bulging by k of its length, with a vein in the card colour
function leaf(x1, y1, x2, y2, k, vein) {
  const mx = (x1 + x2) / 2, my = (y1 + y2) / 2, dx = x2 - x1, dy = y2 - y1
  const nx = -dy * k, ny = dx * k
  return `<path d="M${x1} ${y1} Q ${mx + nx} ${my + ny} ${x2} ${y2} Q ${mx - nx} ${my - ny} ${x1} ${y1} Z" fill="${G}" stroke="${vein}" stroke-width="6" paint-order="stroke"/>` +
    `<path d="M${x1 + dx * 0.16} ${y1 + dy * 0.16} L ${x2 - dx * 0.12} ${y2 - dy * 0.12}" stroke="${vein}" stroke-width="7" stroke-linecap="round"/>`
}
const mark = (size, bg) => `<svg width="${size}" height="${size}" viewBox="0 0 200 200" fill="none">
  <rect x="14" y="36" width="34" height="140" rx="17" fill="${G}"/><rect x="152" y="36" width="34" height="140" rx="17" fill="${G}"/>
  ${leaf(46, 40, 100, 150, 0.3, bg)}${leaf(154, 40, 100, 150, -0.3, bg)}
</svg>`
const arrow = x => at(`<svg width="74" height="40" viewBox="0 0 74 40" fill="none"><path d="M4 20 H62 M48 6 L66 20 L48 34" stroke="${INK}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" opacity=".55"/></svg>`, { cx: x, cy: Y + H / 2 })
const step = (n, label, note, inner, x, tone = '#fff') => at(`<div class="st" style="background:${tone}"><div class="st__art">${inner}</div><div class="st__lab"><i>${n}</i><b>${label}</b></div><span class="st__note">${note}</span></div>`, { x, y: Y, w: W, h: H })

export default {
  alt: 'Three steps on cream: a plain leaf icon labelled Free icon, a new green mark where two leaves form the letter M labelled Redrawn, and that mark beside the made-up name Meadow Studio labelled Your logo, joined by thin arrows',
  bg: `radial-gradient(120% 100% at 50% 0%, #FFFDF8 0%, #F4EDE0 100%)`,
  art: () => [
    step(1, 'Free icon', 'anyone can use it', icon('leaf', 'line', 210, '#5A606D'), XS[0], '#FBF8F3'),
    arrow(XS[0] + W + 37),
    step(2, 'Redrawn', 'a new shape', mark(230, '#fff'), XS[1]),
    arrow(XS[1] + W + 37),
    step(3, 'Your logo', 'mark + name', `<div class="lock">${mark(150, '#fff')}<span>Meadow<br><em>Studio</em></span></div>`, XS[2]),
    at(`<span class="hint">combine · redraw · add your name</span>`, { cx: 800, cy: 828 }),
  ].join(''),
  css: `
.st { position: relative; height: 100%; box-sizing: border-box; border-radius: 40px; box-shadow: 0 2px 0 rgba(17,19,24,.05), 0 50px 90px -46px rgba(17,19,24,.55); border: 1.5px solid ${rgba(INK, 0.06)}; }
.st__art { position: absolute; left: 0; right: 0; top: 60px; height: 300px; display: grid; place-items: center; }
.st__lab { position: absolute; left: 0; right: 0; top: 408px; display: flex; justify-content: center; align-items: center; gap: 14px; }
.st__lab i { font-style: normal; width: 50px; height: 50px; border-radius: 50%; background: ${O}; color: #fff; display: grid; place-items: center; font: 800 28px/1 var(--font-display); }
.st__lab b { font: 800 46px/1 var(--font-display); letter-spacing: -.025em; color: ${INK}; }
.st__note { position: absolute; left: 0; right: 0; top: 482px; text-align: center; font: 700 38px/1 var(--font-hand); color: #5A606D; }
.lock { display: flex; align-items: center; gap: 12px; }
.lock span { font: 400 64px/.9 var(--font-serif); color: ${G}; letter-spacing: -.01em; }
.lock em { font-style: italic; }
.hint { font: 600 30px/1 var(--font-display); color: ${C.solid.text}; letter-spacing: .02em; white-space: nowrap; }
`,
}
