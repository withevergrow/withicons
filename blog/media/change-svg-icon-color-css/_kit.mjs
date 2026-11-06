// Shared look for this post's in-post images: warm paper with a faint square grid, white cards, mono labels,
// blueprint cyan as the accent (the "code" category colour).
import { C, INK, rgba } from '../../tools/hero-kit.mjs'

export const BLUE = C.blueprint.c
export const BG = `linear-gradient(${rgba(INK, 0.05)} 2px, transparent 2px) 0 0 / 50px 50px, linear-gradient(90deg, ${rgba(INK, 0.05)} 2px, transparent 2px) 0 0 / 50px 50px, #FBF8F3`
export const CSS = `
.k-card { box-sizing: border-box; width: 100%; height: 100%; display: grid; place-items: center; border-radius: 44px; background: #fff; border: 2px solid ${rgba(INK, 0.06)}; box-shadow: 0 2px 0 ${rgba(INK, 0.04)}, 0 40px 80px -40px ${rgba(INK, 0.45)}; }
.k-lbl { display: block; text-align: center; font: 600 30px/1.3 var(--font-mono); color: ${INK}; white-space: nowrap; }
.k-lbl em { font-style: normal; color: ${C.blueprint.text}; }
.k-op { font: 800 110px/1 var(--font-display); color: ${rgba(INK, 0.35)}; }
.k-hand { font: 700 44px/1.05 'Caveat', cursive; color: ${C.blueprint.text}; white-space: nowrap; }
`
