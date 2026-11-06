// Shared look for the animation post's in-post images: a deep navy blueprint sheet with a soft cyan grid, white
// labels, blueprint cyan for the good path, solid orange for warnings, mono for code words.
import { C, rgba } from '../../tools/hero-kit.mjs'

export const B = C.blueprint, WARN = C.solid.c, NAVY = '#0E1B29'
export const BG = `linear-gradient(${rgba(B.c, 0.16)} 1.5px, transparent 1.5px) 0 0 / 50px 50px, linear-gradient(90deg, ${rgba(B.c, 0.16)} 1.5px, transparent 1.5px) 0 0 / 50px 50px, linear-gradient(${rgba(B.c, 0.06)} 1px, transparent 1px) 0 0 / 10px 10px, linear-gradient(90deg, ${rgba(B.c, 0.06)} 1px, transparent 1px) 0 0 / 10px 10px, radial-gradient(120% 100% at 50% 30%, #13283A 0%, ${NAVY} 70%)`
export const CSS = `
.an-mono { font: 700 30px/1.1 var(--font-mono); letter-spacing: -.02em; color: #9FE7F5; white-space: nowrap; }
.an-text { font: 600 32px/1.15 var(--font-display); letter-spacing: -.015em; color: #EAF2F6; }
.an-chip { display: inline-flex; align-items: center; gap: 10px; padding: 10px 20px; border-radius: 999px; background: ${B.c}; color: #fff; font: 700 30px/1 var(--font-mono); letter-spacing: -.02em; white-space: nowrap; box-shadow: 0 16px 30px -14px rgba(0,0,0,.6); }
`
