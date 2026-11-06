import { at, chip, C, INK, rgba } from '../tools/hero-kit.mjs'

// Photo: a paint-flecked drafting desk with a set square and pencils. On it lies a sheet with a 24 x 24 grid, its
// padding shaded and the four keylines in red, and the with icons bell (its real skeleton path) is being drawn in
// graphite: most of the stroke is done, a violet pencil sits at the end of the line, the rest waits as a guide.
const U = 20, M = 60, SH = 24 * U + 2 * M // grid unit, sheet margin, sheet size
const BELL = 'M6 16.5 V11 A6 6 0 0 1 18 11 V16.5 L19.5 18.5 H4.5 Z' // forge/icons/bell.json
const CLAP = 'M9.5 18.5 A2.5 2.5 0 0 0 14.5 18.5'
const DONE = 0.85 // share of the outline already drawn
const TIP = [M + 9.48 * U, M + 18.5 * U] // where 85% of the outline ends (on the base line)

function grid() {
  let g = ''
  for (let i = 0; i <= 24; i++) {
    const p = M + i * U, w = i % 4 === 0 ? 1.6 : 1, o = i % 4 === 0 ? 0.32 : 0.16
    g += `<path d="M${p} ${M}V${M + 24 * U}M${M} ${p}H${M + 24 * U}" stroke="${rgba(C.duo.c, o)}" stroke-width="${w}"/>`
  }
  return g
}
function pencil() {
  // drawn pointing left from the tip at 0,0, then turned so the body runs to the lower right
  return `<g transform="translate(${TIP[0]} ${TIP[1]}) rotate(38)">
    <path d="M0 0 L64 -19 L64 19 Z" fill="#F2D2A9"/><path d="M0 0 L20 -6 L20 6 Z" fill="#2B2B30"/>
    <rect x="64" y="-19" width="260" height="38" fill="${C.duo.c}"/><rect x="64" y="-19" width="260" height="13" fill="${rgba('#ffffff', 0.22)}"/>
    <rect x="324" y="-20" width="34" height="40" fill="#C9CCD3"/><rect x="330" y="-20" width="4" height="40" fill="#A8ACB6"/><rect x="344" y="-20" width="4" height="40" fill="#A8ACB6"/>
    <rect x="358" y="-19" width="40" height="38" rx="9" fill="#FF8FA3"/>
  </g>`
}
function sheet() {
  const s = `scale(${U})`
  return `<svg width="${SH}" height="${SH}" viewBox="0 0 ${SH} ${SH}" fill="none" style="overflow:visible">
    <path d="M${M} ${M}h${24 * U}v${24 * U}h${-24 * U}Z M${M + 2 * U} ${M + 2 * U}v${20 * U}h${20 * U}v${-20 * U}Z" fill="${rgba(C.duo.c, 0.1)}" fill-rule="evenodd"/>
    ${grid()}
    <g stroke="#F0525A" stroke-width="2" opacity=".75">
      <circle cx="${M + 12 * U}" cy="${M + 12 * U}" r="${10 * U}"/>
      <rect x="${M + 3 * U}" y="${M + 3 * U}" width="${18 * U}" height="${18 * U}"/>
      <rect x="${M + 4 * U}" y="${M + 2 * U}" width="${16 * U}" height="${20 * U}"/>
      <rect x="${M + 2 * U}" y="${M + 4 * U}" width="${20 * U}" height="${16 * U}"/>
    </g>
    <g transform="translate(${M} ${M}) ${s}" stroke-linecap="round" stroke-linejoin="round">
      <path d="${BELL}" stroke="#7C7F88" stroke-width=".12" stroke-dasharray=".4 .4"/>
      <path d="${CLAP}" stroke="#7C7F88" stroke-width=".12" stroke-dasharray=".4 .4"/>
      <path d="${BELL}" stroke="#2B2B30" stroke-width="1.75" pathLength="100" stroke-dasharray="${DONE * 100} 200" opacity=".92"/>
    </g>
    ${pencil()}
  </svg>`
}

export default {
  photoFile: 'how-to-design-an-icon-desk.jpg',
  credit: { by: 'Skylar Kang', profile: 'https://www.pexels.com/@skylar-kang/', source: 'https://www.pexels.com/photo/measuring-triangle-ruler-and-pencils-on-table-6368897/', license: 'Pexels License' },
  alt: 'A paint-flecked wooden drafting desk with a set square and pencils, and on it a sheet with a 24 by 24 grid, shaded padding and four red keylines, where a violet pencil is drawing the outline of a bell icon',
  photo: { filter: 'saturate(1) brightness(1.04)', pos: '50% 50%' },
  overlay: `radial-gradient(70% 80% at 65% 45%, ${rgba('#FFF6E8', 0.12)}, ${rgba('#1A140E', 0.18)})`,
  art: () => [
    at(`<div class="sheet">${sheet()}</div>`, { cx: 1010, cy: 470, rot: 4 }),
    chip('24 x 24 grid', { x: 300, y: 190, tone: 'color', style: 'duo', size: 34, icon: ['layout-grid', 'duo'], rot: -3 }),
    chip('4 keylines', { x: 360, y: 290, tone: 'card', size: 30, icon: ['circle', 'line'], rot: 2 }),
  ].join(''),
  css: `
.sheet { width: ${SH}px; height: ${SH}px; border-radius: 10px; background: #FFFEFB; box-shadow: 0 2px 0 rgba(17,19,24,.05), 0 60px 90px -40px rgba(30,18,6,.75); }
.sheet svg { display: block; }
.hk-chip .hk-icon { color: currentColor; }
`,
}
