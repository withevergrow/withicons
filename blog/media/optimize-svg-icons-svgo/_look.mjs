import { C, INK, rgba } from '../../tools/hero-kit.mjs'

// Shared look for this post's in-post images: warm dotted paper, white cards, blueprint cyan accents, soft red for
// what an optimiser strips or breaks, green for what to keep. Not a spec (leading underscore).
export const B = C.blueprint, RED = '#E5484D', GREEN = '#16A34A', RED_SOFT = '#FDE7E8', GREEN_SOFT = '#DDF5E5'
export const BG = `radial-gradient(${rgba(INK, 0.1)} 2px, transparent 2.5px) 0 0 / 36px 36px, linear-gradient(180deg, #FBF8F3, #F3EEE4)`
export const LOOK_CSS = `
.ok-card { box-sizing: border-box; height: 100%; background: #fff; border-radius: 36px; box-shadow: 0 2px 0 rgba(17,19,24,.04), 0 40px 80px -40px rgba(17,19,24,.45); border: 1.5px solid rgba(17,19,24,.06); font-family: var(--font-display); color: ${INK}; }
.ok-badge { display: inline-grid; place-items: center; width: 50px; height: 50px; border-radius: 50%; color: #fff; box-shadow: 0 10px 20px -8px rgba(17,19,24,.5); flex: none; }
.ok-badge.is-ok { background: ${GREEN}; } .ok-badge.is-bad { background: ${RED}; }
`
