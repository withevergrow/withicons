import { at, chip, icon, glow, C, rgba } from '../tools/hero-kit.mjs'

// A fan of paint-chip cards over the paint pots: every chip carries the same star, recoloured to the chip's own
// swatch. The orange one is pulled out of the fan, with its hex code on the band.
const SW = ['#2F5BFF', '#7252FF', '#E2456F', '#FFB020', '#22A861', '#0E9F9A']
const PICK = '#FF5A36'
const PX = 950, PY = 900, R = 560, W = 160, H = 270
const fan = SW.map((c, i) => `<div class="pc" style="rotate:${-36 + i * 14}deg;z-index:${i}"><div class="pc__ic">${icon('star', 'solid', 104, c)}</div><div class="pc__band" style="background:${c}"></div></div>`).join('')

export default {
  base: 'xcolor0',
  alt: 'Open paint pots behind a fan of paint-chip cards that each show the same with icons star in another colour, with the orange chip pulled out',
  photo: { filter: 'saturate(1.15) brightness(.7) blur(2px)', pos: '50% 50%', scale: 1.04 },
  overlay: `radial-gradient(70% 80% at 62% 55%, ${rgba('#111318', 0.55)} 0%, ${rgba('#111318', 0.25)} 100%)`,
  art: () => [
    glow({ cx: PX, cy: 520, r: 360, color: PICK, opacity: 0.4 }),
    at(`<div class="fan">${fan}</div>`, { x: PX, y: PY }),
    // the picked chip, pulled out and bigger
    at(`<div class="pc is-pick"><div class="pc__ic">${icon('star', 'solid', 150, PICK)}</div><div class="pc__band" style="background:${PICK}"><span>${PICK}</span></div></div>`, { x: 1185, y: 200, rot: 10, z: 20 }),
    chip('Any colour', { x: 700, y: 200, tone: 'card', style: 'solid', icon: ['pipette', 'solid'], rot: -5, size: 32, z: 21 }),
  ].join(''),
  css: `
.fan { position: relative; width: 0; height: 0; }
.pc { width: ${W}px; height: ${H}px; box-sizing: border-box; border-radius: 24px; background: #fff; overflow: hidden; display: flex; flex-direction: column; box-shadow: 0 2px 0 rgba(17,19,24,.05), 0 30px 50px -26px rgba(17,19,24,.6); }
.fan .pc { position: absolute; left: ${-W / 2}px; top: ${-R}px; transform-origin: ${W / 2}px ${R}px; }
.pc__ic { flex: 1; display: grid; place-items: start center; padding-top: 30px; }
.pc__band { height: 62px; display: grid; place-items: center; }
.pc.is-pick { width: 230px; height: 360px; border-radius: 32px; box-shadow: 0 50px 90px -30px rgba(0,0,0,.8); }
.pc.is-pick .pc__ic { padding-top: 46px; }
.pc.is-pick .pc__band { height: 86px; }
.pc__band span { font: 700 30px/1 var(--font-mono); color: #fff; letter-spacing: .02em; }
`,
}
