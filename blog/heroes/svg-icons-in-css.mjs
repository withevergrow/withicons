import { at, icon, C, INK, rgba } from '../tools/hero-kit.mjs'

// Spray cans, out of focus. In front: a kraft-paper stencil with the with icons zap bolt cut clean out of it (a real CSS
// mask cut-out, so the scene shows through), lifted off a sheet of white paper where the same bolt has just been
// sprayed in blueprint cyan, with a soft overspray halo. Two tags name the two halves of the trick.
const BLUE = C.blueprint.c
const svgOf = (name, style) => icon(name, style, 24).replace(/^<span[^>]*>|<\/span>$/g, '')
const uri = s => `url("data:image/svg+xml,${encodeURIComponent(s)}")`
const BOLT = uri(svgOf('zap', 'solid'))

// deterministic overspray speckles around the sprayed bolt
function speckles(n, cx, cy, rx, ry) {
  let s = 7, out = ''
  const r = () => (s = (s * 16807) % 2147483647) / 2147483647
  for (let i = 0; i < n; i++) {
    const a = r() * Math.PI * 2, d = Math.sqrt(r())
    out += `<circle cx="${(cx + Math.cos(a) * rx * d).toFixed(1)}" cy="${(cy + Math.sin(a) * ry * d).toFixed(1)}" r="${(0.8 + r() * 2.4).toFixed(1)}" opacity="${(0.25 + r() * 0.5).toFixed(2)}"/>`
  }
  return out
}

const SHEET = { x: 740, y: 210, w: 600, h: 600 } // the white paper with the sprayed result
const ART = 420 // bolt size on the paper
const STEN = 350 // bolt size in the stencil

export default {
  photoFile: 'svg-icons-in-css-cans.jpg',
  credit: { by: 'Felicity Tai', profile: 'https://www.pexels.com/@felicity-tai/', source: 'https://www.pexels.com/photo/spray-paints-without-caps-7952069/', license: 'Pexels License' },
  alt: 'Blurred spray paint cans behind a kraft paper stencil with a lightning bolt cut out of it, lifted off a white sheet where the same with icons bolt has been sprayed in bright cyan, with tags reading mask and background-color',
  photo: { filter: 'saturate(1.1) brightness(.6) blur(4px)', pos: '50% 45%', scale: 1.06 },
  overlay: `radial-gradient(70% 80% at 60% 50%, ${rgba(INK, 0.1)} 0%, ${rgba(INK, 0.55)} 100%)`,
  art: () => [
    // the paper with the sprayed bolt and its overspray
    at(`<div class="paper">
      <div class="haze"></div>
      <svg class="dots" width="${SHEET.w}" height="${SHEET.h}" viewBox="0 0 ${SHEET.w} ${SHEET.h}" fill="${BLUE}">${speckles(260, SHEET.w / 2, SHEET.h / 2, 250, 250)}</svg>
      <div class="sprayed"></div>
    </div>`, { x: SHEET.x, y: SHEET.y, w: SHEET.w, h: SHEET.h, rot: 3 }),
    // the stencil, lifted and slid up-left, with a true cut-out
    at(`<div class="stencil"><div class="cut"></div></div>`, { x: 255, y: 130, w: 465, h: 465, rot: -7, z: 2 }),
    at(`<span class="tag"><i>mask:</i> url(zap.svg)</span>`, { x: 200, y: 500, z: 3, rot: -3 }),
    at(`<span class="tag is-blue"><i>background:</i> currentColor</span>`, { x: 870, y: 790, z: 3, rot: 2 }),
  ].join(''),
  css: `
.paper { position: relative; width: 100%; height: 100%; border-radius: 36px; background: #FBF8F3; overflow: hidden; box-shadow: 0 2px 0 rgba(17,19,24,.05), 0 60px 120px -40px rgba(0,0,0,.8); }
.haze { position: absolute; inset: 70px; border-radius: 60px; background: ${BLUE}; opacity: .16; filter: blur(30px); }
.dots { position: absolute; inset: 0; }
.sprayed { position: absolute; left: ${(SHEET.w - ART) / 2}px; top: ${(SHEET.h - ART) / 2}px; width: ${ART}px; height: ${ART}px; background: ${BLUE}; -webkit-mask: ${BOLT} center / contain no-repeat; mask: ${BOLT} center / contain no-repeat; filter: blur(.8px) drop-shadow(0 0 6px ${rgba(BLUE, 0.6)}); }
.stencil { position: relative; width: 100%; height: 100%; filter: drop-shadow(0 50px 50px rgba(0,0,0,.55)) drop-shadow(0 4px 6px rgba(0,0,0,.25)); }
.cut { width: 100%; height: 100%; border-radius: 30px;
  background: radial-gradient(rgba(90,60,20,.10) 1.2px, transparent 1.6px) 0 0 / 9px 9px, linear-gradient(140deg, #E2CBA0 0%, #CDB083 100%);
  -webkit-mask: linear-gradient(#000 0 0), ${BOLT} center / ${STEN}px ${STEN}px no-repeat; -webkit-mask-composite: xor;
  mask: linear-gradient(#000 0 0), ${BOLT} center / ${STEN}px ${STEN}px no-repeat; mask-composite: exclude; }
.tag { display: inline-flex; gap: 14px; padding: 18px 28px; border-radius: 999px; background: ${INK}; color: #fff; font: 600 34px/1 var(--font-mono); white-space: nowrap; box-shadow: 0 30px 60px -20px rgba(0,0,0,.7); }
.tag i { font-style: normal; color: #E9D3A8; }
.tag.is-blue { background: #fff; color: ${INK}; } .tag.is-blue i { color: ${C.blueprint.text}; }
`,
}
