import { C, INK, rgba } from '../../tools/hero-kit.mjs'

// Shared look for this post's in-post images: neutral grey-white, simple app chrome, tofu boxes in ink, with icons
// line icons where the font worked, blueprint cyan (code) accent, red / green status chips.
export const B = C.blueprint
export const RED = '#D93A3F', GREEN = '#178A4C'
export const BG = `radial-gradient(${rgba(INK, 0.08)} 2px, transparent 2.5px) 0 0 / 36px 36px, linear-gradient(160deg, #F7F7F5 0%, #ECEDEF 100%)`
/** a tofu box: an empty rectangle with the missing character's hex code */
export const tofu = (hex, h = 64) => `<span class="tq-tofu" style="width:${Math.round(h * 0.68)}px;height:${h}px;font-size:${Math.round(h * 0.24)}px"><i>${hex.slice(0, 2)}</i><i>${hex.slice(2)}</i></span>`
export const LOOK_CSS = `
.hk-at > svg { display: block; overflow: visible; }
.tq-tofu { box-sizing: border-box; display: inline-grid; align-content: center; justify-items: center; gap: 2px; border: 3.5px solid ${INK}; border-radius: 4px; font-family: var(--font-mono); font-weight: 700; line-height: 1; color: ${INK}; }
.tq-tofu i { font-style: normal; }
.tq-word { font: 400 40px/1 'Times New Roman', var(--font-serif); color: ${INK}; letter-spacing: 0; }
.tq-chip { display: inline-flex; align-items: center; gap: 12px; padding: 14px 24px 14px 18px; border-radius: 999px; color: #fff; font: 700 30px/1 var(--font-display); letter-spacing: -.01em; white-space: nowrap; box-shadow: 0 20px 34px -18px rgba(17,19,24,.55); }
.tq-btn { display: grid; place-items: center; border-radius: 26px; background: #F3F4F6; border: 2px solid rgba(17,19,24,.08); }
`
