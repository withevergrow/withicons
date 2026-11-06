import { at, chip, icon, C, INK, rgba } from '../tools/hero-kit.mjs'
import { icon as blockIcon } from '../lib/blocks.mjs'

// Treatment: a top-down craft table (green cutting mat, scissors). A white sheet of paper has a star-shaped hole cut
// out of it; the star itself, now with no paper around it, lies beside the sheet as a cut-out with a soft shadow,
// with a few more icon cut-outs scattered like a collage. White box versus truly see-through. Orange (guides) accent.
const flat = s => s.replace(/var\(--[a-z0-9-]+,\s*(#[0-9A-Fa-f]{3,8})\)/g, '$1')
const svgUrl = (n, s) => `url("data:image/svg+xml;utf8,${encodeURIComponent(flat(blockIcon(n, s, 240)))}")`
const cut = (n, s, size, o) => at(`<span class="cut">${icon(n, s, size)}</span>`, o)

export default {
  photoFile: 'canva-transparent-png-craft.jpg',
  credit: { by: 'Volodymyr Proskurovskyi', profile: 'https://unsplash.com/@proskurovskiy', source: 'https://unsplash.com/photos/flat-lay-photo-of-school-supplies-ZlPeHjYoAdU', license: 'Unsplash License' },
  alt: 'A top-down craft table with a green cutting mat: a white sheet of paper with a star-shaped hole cut out, the star cut-out lying beside it with no paper around it, plus heart and sparkle cut-outs and scissors',
  photo: { filter: 'saturate(.9) brightness(.95)', pos: '50% 100%' },
  overlay: `radial-gradient(70% 60% at 100% 0%, ${rgba('#1C1610', 0.55)} 0%, transparent 100%), linear-gradient(90deg, ${rgba('#1C1610', 0.08)} 0%, ${rgba('#1C1610', 0.2)} 55%, ${rgba('#1C1610', 0.5)} 100%)`,
  art: () => [
    at(`<div class="sheet"><span class="sheet__lbl">PNG</span></div>`, { x: 672, y: 120, w: 410, h: 470, rot: -6 }),
    cut('star', 'sticker', 320, { cx: 1235, cy: 450, rot: 14 }),
    cut('heart', 'kawaii', 150, { cx: 1340, cy: 205, rot: -12 }),
    cut('sparkles', 'sticker', 130, { cx: 900, cy: 760, rot: 8 }),
    cut('scissors', 'sticker', 160, { cx: 1030, cy: 640, rot: -28 }),
    chip('White box', { x: 712, y: 136, tone: 'card', size: 30, rot: -6 }),
    chip('Transparent', { x: 1120, y: 660, tone: 'color', style: 'solid', size: 34, icon: ['check', 'line'], rot: 4 }),
  ].join(''),
  css: `
.sheet { position: relative; width: 100%; height: 100%; background: #FFFEFB; border-radius: 6px;
  -webkit-mask: ${svgUrl('star', 'sticker')} 50% 50% / 300px 300px no-repeat, linear-gradient(#000 0 0); -webkit-mask-composite: xor; mask-composite: exclude;
  filter: drop-shadow(0 30px 34px rgba(0,0,0,.45)); }
.sheet__lbl { position: absolute; left: 26px; bottom: 22px; font: 600 26px/1 var(--font-mono); color: ${rgba(INK, 0.45)}; }
.cut { display: block; line-height: 0; filter: drop-shadow(5px 0 0 #fff) drop-shadow(-5px 0 0 #fff) drop-shadow(0 5px 0 #fff) drop-shadow(0 -5px 0 #fff) drop-shadow(0 26px 22px rgba(0,0,0,.45)); }
`,
}
