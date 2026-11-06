import { at, chip, icon, C, INK, rgba } from '../tools/hero-kit.mjs'

// Treatment: a sheet printed with the grey-and-white "transparency" checkerboard covers the left of a dusk sea photo and
// is torn away down the middle. One rocket straddles the tear: its left half sits in a hard black box on the
// checkerboard (the pasted, flattened copy), its right half floats cleanly over the real photo. Orange (guides) accent.
const O = C.solid

// deterministic jitter (no Math.random): a small LCG
const lcg = seed => () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648)
function edge(seed, off) {
  const r = lcg(seed), pts = []
  for (let y = -20; y <= 1020; y += 16) {
    const base = 745 + y * 0.17 + Math.sin(y / 95) * 16
    pts.push([Math.round(base + off + (r() - 0.5) * 22), y])
  }
  return pts
}
const poly = pts => `polygon(-10px -20px, ${pts.map(([x, y]) => `${x}px ${y}px`).join(', ')}, -10px 1020px)`
const TEAR = edge(7, 0), RIM = edge(19, 14)

export default {
  photoFile: 'icon-black-or-white-background-sea.jpg',
  credit: { by: '은 하 (galaxim)', profile: 'https://unsplash.com/@galaxim', source: 'https://unsplash.com/photos/purple-and-blue-sky-over-the-sea-ZDOd2UNl1TQ', license: 'Unsplash License' },
  alt: 'A grey and white transparency checkerboard torn away to reveal a purple dusk sea, with a 3D rocket icon across the tear: its left half sits in a black box, its right half floats cleanly over the photo',
  photo: { filter: 'saturate(1.1) brightness(.9)', pos: '50% 50%' },
  overlay: `linear-gradient(90deg, transparent 40%, ${rgba('#1A0B2A', 0.25)} 100%)`,
  art: () => [
    at(`<div class="tw"><div class="tw__rim" style="clip-path:${poly(RIM)}"></div><div class="tw__sheet" style="clip-path:${poly(TEAR)}"><i class="tw__box"></i></div></div>`, { x: 0, y: 0, w: 1600, h: 1000 }),
    at(icon('rocket', 'soft3d', 470), { cx: 815, cy: 410, style: 'filter: drop-shadow(0 40px 50px rgba(0,0,0,.35))' }),
    chip('Black box', { x: 300, y: 150, tone: 'ink', size: 34, rot: -3 }),
    chip('Real PNG', { x: 1120, y: 200, tone: 'color', style: 'solid', size: 36, icon: ['check', 'line'], rot: 3 }),
  ].join(''),
  css: `
.tw { position: relative; width: 100%; height: 100%; filter: drop-shadow(14px 0 22px rgba(10,4,20,.45)); }
.tw__rim, .tw__sheet { position: absolute; inset: 0; }
.tw__rim { background: #F6F2EA; }
.tw__sheet { background: #fff conic-gradient(#D9DCE2 25%, #fff 0 50%, #D9DCE2 0 75%, #fff 0) 0 0 / 80px 80px; }
.tw__box { position: absolute; left: 585px; top: 170px; width: 520px; height: 440px; background: ${INK}; }
`,
}
