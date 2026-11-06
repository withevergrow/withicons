import { C, INK, PAPER, rgba } from '../../tools/hero-kit.mjs'

// Shared look for this post's in-post images (echoes the featured image): the left half is paper (the server), the
// right half is a dark screen (the client), split by a dashed cyan seam. Blueprint cyan (code) accent.
export const B = C.blueprint
export const CY = '#5BE4FF'
export const NAVY = '#0F1621'
export const RED = '#D93A3F', GREEN = '#178A4C'
export const split = (x) => `linear-gradient(${rgba(B.c, 0.08)} 2px, transparent 2px) 0 0 / 50px 50px, linear-gradient(90deg, ${rgba(B.c, 0.08)} 2px, transparent 2px) 0 0 / 50px 50px, linear-gradient(90deg, ${PAPER} 0 ${x}px, ${NAVY} ${x}px 100%)`
export const seam = (x) => `<svg width="40" height="1000" viewBox="0 0 40 1000" style="display:block"><path d="M20 0V1000" stroke="${B.c}" stroke-width="6" stroke-dasharray="22 16" stroke-linecap="round"/></svg>`
export const LOOK_CSS = `
.rs-side { font: 700 60px/1 var(--font-hand); color: ${B.text}; }
.rs-side.is-dark { color: ${CY}; }
.rs-card { box-sizing: border-box; height: 100%; display: flex; flex-direction: column; gap: 14px; padding: 28px 32px; border-radius: 30px; background: #fff; border: 1.5px solid rgba(17,19,24,.08); box-shadow: 0 2px 0 rgba(17,19,24,.04), 0 34px 60px -34px rgba(17,19,24,.55); font-family: var(--font-display); color: ${INK}; }
.rs-card.is-dark { background: #1A2230; border-color: ${rgba(CY, 0.3)}; color: #EEF3FA; box-shadow: 0 0 40px ${rgba(B.c, 0.25)}, 0 40px 70px -34px rgba(0,0,0,.8); }
.rs-mono { font: 600 30px/1.2 var(--font-mono); letter-spacing: -.02em; }
.rs-label { font: 500 28px/1.25 var(--font-display); color: #5A606D; }
.rs-card.is-dark .rs-label { color: #A9B4C6; }
.rs-chip { display: inline-flex; align-items: center; gap: 12px; padding: 14px 24px 14px 18px; border-radius: 999px; font: 700 30px/1 var(--font-display); letter-spacing: -.01em; white-space: nowrap; color: #fff; box-shadow: 0 20px 34px -18px rgba(17,19,24,.6); }
.rs-tab { display: inline-block; padding: 14px 26px; border-radius: 999px; background: ${B.c}; color: #fff; font: 700 30px/1 var(--font-mono); letter-spacing: -.03em; white-space: nowrap; box-shadow: 0 0 0 6px #fff, 0 24px 40px -18px rgba(0,0,0,.6); }
.hk-at > svg { display: block; overflow: visible; }
`
