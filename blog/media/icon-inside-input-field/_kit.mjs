// Shared look for this post's in-post images: a navy blueprint sheet with a fine cyan grid (the "code" category colour),
// white line work, mono labels, a red cross and a green tick for wrong and right.
import { icon, C, INK, rgba } from '../../tools/hero-kit.mjs'

export const BLUE = C.blueprint.c, CYAN = '#5ED3EA', NAVY = '#0D2236', RED = '#E5484D', GREEN = '#1FA463'
export const BG = `linear-gradient(${rgba(CYAN, 0.09)} 1.5px, transparent 1.5px) 0 0 / 40px 40px, linear-gradient(90deg, ${rgba(CYAN, 0.09)} 1.5px, transparent 1.5px) 0 0 / 40px 40px, radial-gradient(120% 90% at 40% 30%, #12304A 0%, ${NAVY} 100%)`
export const badge = ok => `<span class="k-badge" style="background:${ok ? GREEN : RED}">${icon(ok ? 'check' : 'close', 'line', 30, '#fff')}</span>`
export const CSS = `
.k-lbl { display: block; font: 600 28px/1.3 var(--font-mono); color: #EAF6FA; white-space: nowrap; }
.k-lbl em { font-style: normal; color: ${CYAN}; }
.k-badge { display: grid; place-items: center; width: 54px; height: 54px; border-radius: 50%; box-shadow: 0 0 0 5px ${rgba('#ffffff', 0.9)}, 0 14px 26px -10px ${rgba(INK, 0.6)}; }
`
