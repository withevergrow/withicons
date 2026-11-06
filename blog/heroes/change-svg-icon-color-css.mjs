import { at, icon, glow, C, INK, rgba } from '../tools/hero-kit.mjs'

// A fanned paint-swatch book, close up. Over it floats one big white card holding the with icons home icon, sliced
// into five vertical bands, each band painted in a colour picked from the swatches under it: one icon, any colour.
// A dark code pill in the free top-left corner names the one property that does it.
const BANDS = ['#0F8A6E', '#1F63C6', '#7B3FA0', '#E5432F', '#F5A11A']
const CARD = { cx: 1000, cy: 460, s: 560 }
const ICON = 400

function sliced() {
  const w = 100 / BANDS.length
  return BANDS.map((c, i) => `<div class="sl" style="clip-path: inset(0 ${(100 - (i + 1) * w).toFixed(3)}% 0 ${(i * w).toFixed(3)}%)">${icon('home', 'line', ICON, c)}</div>`).join('')
}

export default {
  photoFile: 'change-svg-icon-color-css-swatches.jpg',
  credit: { by: 'Peter Olexa', profile: 'https://www.pexels.com/@peter-olexa-2214257/', source: 'https://www.pexels.com/photo/palette-of-colors-14299950/', license: 'Pexels License' },
  alt: 'A rainbow fan of paint swatch cards behind a big white card with the with icons home outline sliced into green, blue, purple, red and orange bands, next to a dark code pill reading stroke: currentColor',
  photo: { filter: 'saturate(1.1) brightness(.78) blur(2px)', pos: '50% 50%', scale: 1.04 },
  overlay: `radial-gradient(55% 70% at 62% 46%, ${rgba(INK, 0.35)} 0%, ${rgba(INK, 0.05)} 100%), linear-gradient(90deg, ${rgba(INK, 0.55)} 0%, transparent 45%)`,
  art: () => [
    glow({ cx: CARD.cx, cy: CARD.cy, r: 330, color: '#ffffff', opacity: 0.25 }),
    at(`<div class="big"><div class="stack">${sliced()}</div></div>`, { cx: CARD.cx, cy: CARD.cy, w: CARD.s, h: CARD.s }),
    // a thin tick under each band, like the swatch strip it came from
    at(`<div class="strip">${BANDS.map(c => `<i style="background:${c}"></i>`).join('')}</div>`, { cx: CARD.cx, cy: CARD.cy + CARD.s / 2 - 62, z: 2 }),
    at(`<span class="cpill"><i>stroke:</i> currentColor</span>`, { x: 190, y: 170, z: 3 }),
  ].join(''),
  css: `
.big { box-sizing: border-box; width: 100%; height: 100%; display: grid; place-items: center; border-radius: 140px; background: rgba(255,255,255,.9); border: 2px solid #fff; box-shadow: 0 2px 0 rgba(17,19,24,.05), 0 70px 130px -40px rgba(0,0,0,.8); }
.stack { position: relative; width: ${ICON}px; height: ${ICON}px; margin-top: -40px; }
.sl { position: absolute; inset: 0; }
.strip { display: flex; gap: 0; width: ${ICON - 60}px; height: 18px; border-radius: 9px; overflow: hidden; }
.strip i { flex: 1; }
.cpill { display: inline-flex; align-items: center; gap: 16px; padding: 22px 34px; border-radius: 999px; background: ${INK}; color: #fff; font: 600 40px/1 var(--font-mono); white-space: nowrap; box-shadow: 0 0 0 2px rgba(255,255,255,.12), 0 30px 60px -20px rgba(0,0,0,.7); }
.cpill i { font-style: normal; color: ${C.blueprint.c}; }
`,
}
