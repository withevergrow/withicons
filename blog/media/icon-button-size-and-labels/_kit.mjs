// Shared look for the icon button post's in-post images: pale blueprint paper with a cyan grid, white rounded panels,
// cyan for what passes and solid orange for what fails, short mono labels.
import { icon, C, INK, rgba } from '../../tools/hero-kit.mjs'

export const B = C.blueprint, BAD = C.solid.c
export const BG = `linear-gradient(${rgba(B.c, 0.13)} 2px, transparent 2px) 0 0 / 48px 48px, linear-gradient(90deg, ${rgba(B.c, 0.13)} 2px, transparent 2px) 0 0 / 48px 48px, linear-gradient(${rgba(B.c, 0.06)} 1px, transparent 1px) 0 0 / 12px 12px, linear-gradient(90deg, ${rgba(B.c, 0.06)} 1px, transparent 1px) 0 0 / 12px 12px, #F2FAFC`
export const verdict = (text, ok) => `<span class="ib-verdict ${ok ? 'is-ok' : 'is-bad'}">${icon(ok ? 'check' : 'close', 'line', 32, '#fff')}${text}</span>`
export const CSS = `
.ib-verdict { display: inline-flex; align-items: center; gap: 12px; padding: 12px 24px 12px 14px; border-radius: 999px; font: 700 32px/1 var(--font-display); letter-spacing: -.01em; white-space: nowrap; color: #fff; box-shadow: 0 16px 30px -16px rgba(17,19,24,.5); }
.ib-verdict.is-ok { background: ${B.c}; } .ib-verdict.is-bad { background: ${BAD}; }
.ib-mono { font: 700 30px/1 var(--font-mono); color: ${B.text}; letter-spacing: -.02em; white-space: nowrap; }
.ib-panel { box-sizing: border-box; height: 100%; border-radius: 34px; background: #fff; box-shadow: 0 2px 0 rgba(17,19,24,.04), 0 40px 80px -46px rgba(0,60,80,.55); border: 1.5px solid ${rgba(B.c, 0.2)}; }
`
