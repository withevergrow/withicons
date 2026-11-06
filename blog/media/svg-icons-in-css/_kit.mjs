// Shared look for this post's in-post images: a pale blueprint grid (the "code" category colour), white cards with the
// site's soft shadow, mono labels.
import { C, INK, rgba } from '../../tools/hero-kit.mjs'

export const BLUE = C.blueprint.c, BTEXT = C.blueprint.text
export const BG = `linear-gradient(${rgba(BLUE, 0.1)} 2px, transparent 2px) 0 0 / 40px 40px, linear-gradient(90deg, ${rgba(BLUE, 0.1)} 2px, transparent 2px) 0 0 / 40px 40px, #F5FAFB`
export const CSS = `
.k-card { box-sizing: border-box; width: 100%; height: 100%; border-radius: 34px; background: #fff; border: 2px solid ${rgba(INK, 0.06)}; box-shadow: 0 2px 0 ${rgba(INK, 0.04)}, 0 40px 80px -40px ${rgba(INK, 0.45)}; }
.k-lbl { display: block; font: 600 30px/1.3 var(--font-mono); color: ${INK}; white-space: nowrap; }
.k-lbl em { font-style: normal; color: ${BTEXT}; }
.k-hand { font: 700 42px/1.05 'Caveat', cursive; color: ${BTEXT}; white-space: nowrap; }
.k-code { margin: 0; font: 500 28px/1.55 var(--font-mono); color: ${INK}; white-space: pre; }
.k-code em { font-style: normal; color: ${BTEXT}; } .k-code s { text-decoration: none; color: ${rgba(INK, 0.45)}; } .k-code b { font-weight: 700; color: #C2410C; }
`
