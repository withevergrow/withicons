import { C, INK, rgba } from '../../tools/hero-kit.mjs'

// Shared look for this post's in-post images: warm dotted paper, white cards, blueprint cyan for the viewBox and grid,
// red for what breaks, green for the fix. Not a spec itself (the leading underscore keeps hero-art from rendering it).
export const B = C.blueprint, RED = '#E5484D', GREEN = '#16A34A'
export const BG = `radial-gradient(${rgba(INK, 0.1)} 2px, transparent 2.5px) 0 0 / 36px 36px, linear-gradient(180deg, #FBF8F3, #F3EEE4)`
/** a 24-unit graph paper as a CSS background, `u` px per unit */
export const grid = (u, a = 0.2) => `background-image: linear-gradient(${rgba(B.c, a)} 1.5px, transparent 1.5px), linear-gradient(90deg, ${rgba(B.c, a)} 1.5px, transparent 1.5px); background-size: ${u}px ${u}px; background-position: -0.75px -0.75px;`
export const LOOK_CSS = `
.lk-card { box-sizing: border-box; height: 100%; display: flex; flex-direction: column; align-items: center; background: #fff; border-radius: 36px; padding: 36px 32px 34px; box-shadow: 0 2px 0 rgba(17,19,24,.04), 0 40px 80px -40px rgba(17,19,24,.45); border: 1.5px solid rgba(17,19,24,.06); }
.lk-vis { position: relative; flex: 1; width: 100%; display: grid; place-items: center; }
.lk-h { font: 800 40px/1.05 var(--font-display); letter-spacing: -.03em; color: ${INK}; text-align: center; }
.lk-m { font: 600 29px/1.2 var(--font-mono); color: ${B.text}; text-align: center; margin-top: 10px; }
.lk-hand { font: 600 38px/1 var(--font-hand); color: #5B6070; text-align: center; margin-top: 8px; }
.lk-bad .lk-m { color: ${RED}; } .lk-ok .lk-m { color: ${GREEN}; }
.lk-badge { display: inline-grid; place-items: center; width: 54px; height: 54px; border-radius: 50%; color: #fff; box-shadow: 0 10px 20px -8px rgba(17,19,24,.5); }
.lk-num { font: 700 28px/1 var(--font-mono); color: ${B.text}; }
`
