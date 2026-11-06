// Shared look for the email post's in-post images: airmail paper (cream, with a thin red and blue airmail stripe at the
// very edge), white email cards, solid contact icons in the line blue, blueprint-cyan verdict chips (code accent).
import { icon, C, INK, rgba } from '../../tools/hero-kit.mjs'

export const B = C.blueprint, BLUE = C.line.c, RED = C.solid.c
export const ICONS = ['phone', 'mail', 'globe', 'calendar']
export const BG = `repeating-linear-gradient(135deg, ${rgba('#E5484D', 0.55)} 0 22px, transparent 22px 44px, ${rgba('#2F5BFF', 0.5)} 44px 66px, transparent 66px 88px)`
export const PAPER_CSS = `.stage::after { content: ''; position: absolute; inset: 14px; border-radius: 26px; background: radial-gradient(${rgba(INK, 0.07)} 2px, transparent 2.5px) 0 0 / 30px 30px, #FBF8F1; z-index: 0; }
.stage__art { z-index: 1; }`
export const verdict = (text, ok) => `<span class="ml-verdict${ok === true ? ' is-ok' : ok === false ? ' is-bad' : ' is-meh'}">${icon(ok === true ? 'check' : ok === false ? 'close' : 'image', 'line', 32, '#fff')}${text}</span>`
export const CSS = `${PAPER_CSS}
.ml-verdict { display: inline-flex; align-items: center; gap: 12px; padding: 12px 24px 12px 14px; border-radius: 999px; font: 700 30px/1 var(--font-display); letter-spacing: -.01em; white-space: nowrap; color: #fff; box-shadow: 0 16px 30px -16px rgba(17,19,24,.55); }
.ml-verdict svg { flex: none; }
.ml-verdict.is-ok { background: ${B.c}; } .ml-verdict.is-bad { background: ${RED}; } .ml-verdict.is-meh { background: ${INK}; }
.ml-sk { display: block; height: 14px; border-radius: 8px; background: rgba(17,19,24,.1); }
`
