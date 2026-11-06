import { at, icon, C, rgba, INK, SUN } from '../tools/hero-kit.mjs'

// Pure artwork: a yellow tape measure drawn in SVG runs across dotted paper into a violet case, and the same duo bell
// stands on it at 16, 24, 32, 48 and 64 px (drawn 4.5x), each size printed on the tape below it.
const K = 4.5
const STEPS = [[16, 240], [24, 390], [32, 570], [48, 800], [64, 1060]] // size, centre x
const TOP = 500, BAND = 100, X0 = 170, X1 = 1250
function tape() {
  let t = ''
  for (let x = X0 + 20, i = 0; x < X1; x += 20, i++) t += `<path d="M${x} ${TOP}v${i % 5 === 4 ? 34 : 18}" stroke="${INK}" stroke-width="${i % 5 === 4 ? 4 : 3}"/>`
  const nums = STEPS.map(([s, cx]) => `<path d="M${cx} ${TOP}v48" stroke="${C.duo.c}" stroke-width="6"/><text x="${cx}" y="${TOP + 84}" text-anchor="middle">${s}</text>`).join('')
  return `<svg width="1600" height="1000" viewBox="0 0 1600 1000" fill="none">
    <rect x="${X0}" y="${TOP + 14}" width="${X1 - X0}" height="${BAND}" rx="6" fill="${rgba(INK, 0.18)}" style="filter:blur(10px)"/>
    <rect x="${X0}" y="${TOP}" width="${X1 - X0}" height="${BAND}" rx="6" fill="${SUN}"/>
    <rect x="${X0 - 26}" y="${TOP - 8}" width="30" height="${BAND + 16}" rx="5" fill="#9AA0AC"/>
    ${t}${nums}
    <rect x="${X1 - 30}" y="${TOP - 100}" width="200" height="220" rx="60" fill="${C.duo.c}"/>
    <rect x="${X1 - 30}" y="${TOP - 100}" width="200" height="220" rx="60" fill="none" stroke="rgba(255,255,255,.25)" stroke-width="4"/>
    <circle cx="${X1 + 70}" cy="${TOP + 10}" r="58" fill="${rgba('#ffffff', 0.18)}"/><circle cx="${X1 + 70}" cy="${TOP + 10}" r="22" fill="#fff"/>
  </svg>`
}

export default {
  alt: 'Artwork of a yellow tape measure running into a violet case on dotted paper, with one violet bell icon standing on it at 16, 24, 32, 48 and 64 pixels',
  bg: `radial-gradient(${rgba(INK, 0.12)} 2px, transparent 2.5px) 0 0 / 36px 36px, radial-gradient(120% 90% at 70% 30%, #FFFFFF 0%, #F6F1E7 100%)`,
  art: () => [
    at(tape(), { x: 0, y: 0, cls: 'sz' }),
    ...STEPS.map(([s, cx]) => at(icon('bell', 'duo', s * K, C.duo.text), { x: cx - (s * K) / 2, y: TOP - s * K - 6 })),
    at(`<span class="sz-px">px</span>`, { x: X0 + 4, y: TOP - 150 }),
  ].join(''),
  css: `
.sz text { font: 800 40px var(--font-mono); fill: ${INK}; }
.sz-px { font: 700 36px/1 var(--font-mono); color: ${C.duo.text}; }
`,
}
