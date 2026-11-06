import { C, INK, rgba } from '../../tools/hero-kit.mjs'

// Shared look for this post's in-post images: white cards on a pale blueprint grid, cyan (code) accent.
export const B = C.blueprint
export const BG = `linear-gradient(${rgba(B.c, 0.1)} 2px, transparent 2px) 0 0 / 50px 50px, linear-gradient(90deg, ${rgba(B.c, 0.1)} 2px, transparent 2px) 0 0 / 50px 50px, linear-gradient(160deg, #F4FBFD 0%, #E6F5F9 100%)`
export const LOOK_CSS = `
.fc-card { box-sizing: border-box; height: 100%; display: flex; flex-direction: column; gap: 14px; padding: 28px 32px; border-radius: 30px; background: #fff; border: 1.5px solid ${rgba(B.c, 0.18)}; box-shadow: 0 2px 0 rgba(17,19,24,.04), 0 34px 60px -34px rgba(0,60,80,.5); font-family: var(--font-display); color: ${INK}; }
.fc-card h4 { margin: 0; font: 800 38px/1.05 var(--font-display); letter-spacing: -.03em; }
.fc-card p { margin: 0; font: 500 28px/1.3 var(--font-display); color: #4A505C; }
.fc-card code { font: 600 28px/1.3 var(--font-mono); color: ${B.text}; letter-spacing: -.02em; }
.fc-pill { display: inline-flex; align-items: center; gap: 14px; padding: 20px 32px; border-radius: 999px; background: #fff; border: 3px solid ${B.c}; font: 700 32px/1 var(--font-display); letter-spacing: -.02em; white-space: nowrap; color: ${INK}; box-shadow: 0 24px 40px -26px rgba(0,60,80,.6); }
.fc-pill.is-ink { background: ${INK}; border-color: ${INK}; color: #fff; }
.fc-yn { font: 700 40px/1 var(--font-hand); color: ${B.text}; }
.fc-edges { display: block; overflow: visible; }
`
