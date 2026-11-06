import { at, icon, chip, glow, C, rgba } from '../tools/hero-kit.mjs'

// A finger in the dark reaches for a glowing tablet screen. Where it is about to tap sits one small icon button, and
// around it concentric target rings like a bullseye: the 24 px AA box, the 44 px touch ring (dashed, cyan) and a
// faint outer pulse. Two short chips name the rings. Code category accent: blueprint cyan.
const B = C.blueprint
const CX = 820, CY = 478 // the tap point on the screen
const K = 5 // stage px per CSS px

export default {
  photoFile: 'icon-button-size-and-labels-tap4.jpg',
  credit: { by: 'Towfiqu Barbhuiya', profile: 'https://www.pexels.com/@towfiqu-barbhuiya-3440682/', source: 'https://www.pexels.com/photo/person-using-a-touchscreen-device-11337254/', license: 'Pexels License' },
  alt: 'A finger in a dark room reaching for a glowing blue tablet screen, where a small white settings icon button sits inside concentric target rings marked 24 px and 44 px, like a bullseye',
  photo: { filter: 'saturate(1.05) brightness(.95)', pos: '50% 50%' },
  overlay: `radial-gradient(ellipse at ${CX}px ${CY}px, ${rgba('#000814', 0.05)} 0%, ${rgba('#000814', 0.35)} 70%)`,
  art: () => [
    glow({ cx: CX, cy: CY, r: 200, color: B.c, opacity: 0.3, blur: 70 }),
    at(`<svg width="900" height="900" viewBox="-450 -450 900 900" fill="none" class="tr">
      <circle r="400" stroke="${B.c}" stroke-opacity=".35" stroke-width="3"/>
      <circle r="300" stroke="${B.c}" stroke-opacity=".6" stroke-width="4"/>
      <circle r="205" stroke="${B.c}" stroke-opacity=".85" stroke-width="5"/>
      <circle r="${22 * K}" fill="${rgba(B.c, 0.28)}" stroke="#fff" stroke-width="6" stroke-dasharray="14 12"/>
      <path d="M0 -${12 * K + 4} V-170 M${22 * K + 4} 0 H185" stroke="#fff" stroke-width="3"/>
    </svg>`, { cx: CX, cy: CY, w: 900, h: 900, z: 2 }),
    at(`<div class="tb">${icon('settings', 'line', 20 * K - 20, '#fff')}</div>`, { cx: CX, cy: CY, w: 24 * K, h: 24 * K, z: 3 }),
    chip('24 px', { cx: CX, cy: CY - 196, tone: 'card', size: 32, z: 4 }),
    chip('44 px touch', { x: CX + 186, y: CY - 34, tone: 'color', style: 'blueprint', size: 40, z: 4, icon: ['hand', 'line'] }),
  ].join(''),
  css: `
.tr { display: block; overflow: visible; }
.tb { box-sizing: border-box; width: 100%; height: 100%; border-radius: 30px; display: grid; place-items: center;
  background: ${rgba('#0B1B33', 0.55)}; border: 4px solid #fff; box-shadow: 0 0 0 10px ${rgba(B.c, 0.35)}, 0 0 60px ${rgba(B.c, 0.9)}; }
`,
}
