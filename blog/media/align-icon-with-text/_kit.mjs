// Shared look for this post's in-post images: warm paper with faint dots, white cards, cyan guide lines and mono labels
// (blueprint cyan = the "code" category colour), a red cross and a green tick for wrong and right.
import { icon, C, INK, rgba } from '../../tools/hero-kit.mjs'

export const BLUE = C.blueprint.c, BTEXT = C.blueprint.text, RED = '#E5484D', GREEN = '#1FA463'
export const BG = `radial-gradient(${rgba(INK, 0.1)} 1.6px, transparent 2px) 0 0 / 32px 32px, #FBF8F3`
// Bricolage Grotesque metrics, in em (measured in the browser): ascent .93, descent .27, cap .66, x-height .53, g tail .16
export const M = { asc: 0.93, desc: 0.27, cap: 0.66, x: 0.53, tail: 0.16 }
export const badge = ok => `<span class="k-badge" style="background:${ok ? GREEN : RED}">${icon(ok ? 'check' : 'close', 'line', 30, '#fff')}</span>`
export const CSS = `
.k-lbl { display: block; font: 600 28px/1.25 var(--font-mono); color: ${INK}; white-space: nowrap; }
.k-lbl em { font-style: normal; color: ${BTEXT}; }
.k-hand { font: 700 40px/1.05 'Caveat', cursive; color: ${BTEXT}; white-space: nowrap; }
.k-badge { display: grid; place-items: center; width: 54px; height: 54px; border-radius: 50%; box-shadow: 0 0 0 5px #fff, 0 14px 26px -10px ${rgba(INK, 0.45)}; }
`
