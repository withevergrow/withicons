// Shared look for the favicon post's in-post images: warm paper with a faint dot grid, white cards, an orange solid
// rocket as the example site's favicon, blueprint-cyan labels (the code category accent).
import { icon, C, INK, rgba } from '../../tools/hero-kit.mjs'

export const O = C.solid, B = C.blueprint
export const BG = `radial-gradient(${rgba(INK, 0.09)} 2px, transparent 2.5px) 0 0 / 32px 32px, linear-gradient(160deg, #FFFDF8 0%, #F4EFE4 100%)`
// the example favicon: a white solid rocket on an orange plate (or bare, coloured, on transparency)
export const plate = (size, o = {}) => `<span class="fv-plate" style="width:${size}px;height:${size}px;border-radius:${o.round ?? Math.round(size * 0.22)}px;background:${o.bg || O.c}">${icon(o.name || 'rocket', 'solid', Math.round(size * (o.k || 0.62)), o.fg || '#fff')}</span>`
export const bare = (size, color = O.c, name = 'rocket') => icon(name, 'solid', size, color)
export const CSS = `
.fv-plate { display: inline-grid; place-items: center; flex: none; box-shadow: 0 2px 0 rgba(17,19,24,.05), 0 18px 30px -18px rgba(17,19,24,.45); }
.fv-card { box-sizing: border-box; height: 100%; display: flex; flex-direction: column; border-radius: 32px; background: #fff; overflow: hidden;
  box-shadow: 0 2px 0 rgba(17,19,24,.04), 0 40px 80px -44px rgba(17,19,24,.5); border: 1.5px solid rgba(17,19,24,.06); font-family: var(--font-display); color: ${INK}; }
.fv-chip { display: inline-flex; align-items: center; gap: 10px; padding: 10px 20px; border-radius: 999px; font: 700 30px/1 var(--font-display); letter-spacing: -.01em; white-space: nowrap; }
.fv-chip.is-b { background: ${B.c}; color: #fff; } .fv-chip.is-ink { background: ${INK}; color: #fff; } .fv-chip.is-soft { background: ${B.soft}; color: ${B.text}; }
.fv-mono { font: 600 28px/1.1 var(--font-mono); letter-spacing: -.02em; }
.fv-check { background: repeating-conic-gradient(#E9E5DC 0 25%, #fff 0 50%) 0 0 / 28px 28px; }
`
