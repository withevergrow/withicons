import { at, chip, icon, glow, C, INK, rgba } from '../tools/hero-kit.mjs'
import { MANIFEST } from '../lib/blocks.mjs'

// Wallpaper: a dense pattern of tiny ink outline icons on paper (the photo pushed far back, a faint ghost under it);
// a big magnifier picks one out and shows it as a rich, hand-finished 3D icon. Thousands vs curated.
const VSP_CSS = `
.vsp { display: inline-flex; align-items: center; gap: 14px; padding: 10px 28px 10px 10px; border-radius: 999px; background: ${C.line.c}; color: #fff; font: 800 34px/1 var(--font-display); letter-spacing: -.02em; white-space: nowrap; box-shadow: 0 0 0 6px rgba(255,255,255,.85), 0 30px 60px -18px rgba(17,19,24,.7); }
.vsp i { font-style: normal; width: 58px; height: 58px; border-radius: 50%; background: #fff; color: ${C.line.c}; display: grid; place-items: center; font-size: 28px; letter-spacing: -.04em; }`

const ALL = MANIFEST.icons.map(i => typeof i === 'string' ? i : i.name)
const COLS = 22, ROWS = 11, STEP = 57, X0 = 200, Y0 = 130
const LX = 1010, LY = 450, LR = 190 // lens centre and radius

function wall() {
  const out = []
  for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
    const x = X0 + c * STEP, y = Y0 + r * STEP
    if (x < 700 && y > 560) continue // keep the reserved corner clear
    if (Math.hypot(x + 17 - LX, y + 17 - LY) < LR + 26) continue // under the lens
    out.push(at(icon(ALL[(r * 53 + c * 17) % ALL.length], 'line', 34, INK), { x, y, style: 'opacity:.3' }))
  }
  return out.join('')
}

export default {
  base: 'tabler0',
  alt: 'A paper wallpaper of tiny ink outline icons over a faint analytics laptop photo, with a magnifier lifting out one glossy 3D rocket from with icons, a curated chip and a blue vs Tabler Icons pill',
  photo: { filter: 'grayscale(1) blur(2px)', pos: '50% 50%' },
  overlay: rgba('#F6F2EA', 0.9),
  art: () => [
    wall(),
    glow({ cx: LX, cy: LY, r: 250, color: C.line.c, opacity: 0.25 }),
    at(`<div class="handle"></div>`, { x: LX + LR * 0.66, y: LY + LR * 0.66 - 28 }),
    at(`<div class="lens">${icon('rocket', 'soft3d', 230)}</div>`, { cx: LX, cy: LY }),
    chip('6,000+ outline', { x: 1150, y: 150, tone: 'ink', size: 28, icon: ['layout-grid', 'line'], rot: 3 }),
    chip('Curated', { x: 1240, y: 600, tone: 'color', style: 'line', size: 34, icon: ['badge-check', 'line'], rot: -4 }),
    at(`<span class="vsp"><i>vs</i>Tabler Icons</span>`, { x: 170, y: 130 }),
  ].join(''),
  css: `${VSP_CSS}
.lens { width: ${LR * 2}px; height: ${LR * 2}px; border-radius: 50%; display: grid; place-items: center; background: radial-gradient(circle at 35% 30%, #fff 0%, #F4F1EB 70%); box-shadow: 0 0 0 16px #fff, 0 0 0 22px ${C.line.c}, 0 60px 100px -30px rgba(17,19,24,.45); }
.handle { width: 230px; height: 56px; border-radius: 28px; transform-origin: 0 50%; transform: rotate(45deg); background: linear-gradient(${C.line.c}, ${C.line.text}); box-shadow: 0 30px 50px -20px rgba(17,19,24,.4); }
`,
}
