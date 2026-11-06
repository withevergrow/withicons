// Shared look for this post's in-post images (files starting with _ are not specs).
import { C, INK, PAPER, rgba } from '../../tools/hero-kit.mjs'

export const O = C.solid, OK = '#1F9D55', BAD = '#E5484D'
export const CHECKER = (n = 40, a = '#D5D8DE', b = '#fff') => `${b} conic-gradient(${a} 25%, ${b} 0 50%, ${a} 0 75%, ${b} 0) 0 0 / ${n}px ${n}px`
export const CSS = `
.lk { font-family: var(--font-display); color: ${INK}; }
.lk-card { box-sizing: border-box; width: 100%; height: 100%; background: #fff; border-radius: 36px; box-shadow: 0 2px 0 rgba(17,19,24,.04), 0 40px 80px -44px rgba(17,19,24,.45); border: 1.5px solid ${rgba(INK, 0.06)}; }
.lk-t { font: 800 44px/1.05 var(--font-display); letter-spacing: -.025em; }
.lk-s { font: 500 30px/1.25 var(--font-display); color: #4A505C; }
.lk-tag { display: inline-flex; align-items: center; gap: 12px; padding: 12px 22px 12px 16px; border-radius: 999px; font: 700 30px/1 var(--font-display); white-space: nowrap; }
.lk-tag.is-ok { background: #E3F6EA; color: #13703A; } .lk-tag.is-bad { background: #FDE7E7; color: #B4232A; } .lk-tag.is-o { background: ${O.soft}; color: ${O.text}; }
.lk-num { display: inline-grid; place-items: center; width: 54px; height: 54px; border-radius: 50%; background: ${O.c}; color: #fff; font: 800 30px/1 var(--font-display); flex: none; }
`
export { C, INK, PAPER, rgba }
