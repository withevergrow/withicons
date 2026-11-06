import { at, chip, icon, glow, C, rgba } from '../tools/hero-kit.mjs'

// An opened love-letter envelope: the letter slides out with a Valentine-style heart pair and a handwritten note,
// hearts float up out of it. The laptop photo behind is washed into a pink duotone.
const EX = 760, EY = 500, EW = 540, EH = 330

export default {
  base: 'dark1',
  alt: 'A glowing laptop washed into a pink duotone behind an open love-letter envelope, its letter showing a pair of hearts and a handwritten be mine, with Valentine-style heart icons floating up',
  photo: { filter: 'grayscale(1) contrast(1.15) brightness(1.05)', pos: '50% 50%' },
  overlay: '#5A1432',
  art: () => [
    at('<div class="tint"></div>', { x: 0, y: 0, w: 1600, h: 1000 }),
    glow({ cx: EX + EW / 2, cy: 470, r: 360, color: '#FFD3E0', opacity: 0.4, blur: 110 }),
    at('<div class="env-flap"></div>', { x: EX, y: EY - 210 }),
    at('<div class="env-back"></div>', { x: EX, y: EY }),
    at(`<div class="letter">${icon('heart-pair', 'valentine', 200)}<span>be mine</span></div>`, { x: EX + 60, y: EY - 300, rot: -3 }),
    at(`<div class="env-front"></div>`, { x: EX, y: EY }),
    at(`<div class="seal">${icon('heart', 'valentine', 74)}</div>`, { cx: EX + EW / 2, cy: EY + 200 }),
    // hearts floating up
    at(icon('heart', 'valentine', 120), { x: 1330, y: 230, rot: 12 }),
    at(icon('heart-balloon', 'valentine', 130), { x: 590, y: 190, rot: -10 }),
    at(icon('rose', 'valentine', 110), { x: 1340, y: 560, rot: 8 }),
    at(icon('heart', 'valentine', 70), { x: 1220, y: 130, rot: -8 }),
    chip('Valentine style', { x: 250, y: 420, tone: 'color', style: 'solid', size: 32, icon: ['love-letter', 'valentine'], rot: -4 }),
  ].join(''),
  css: `
.stage__overlay { mix-blend-mode: lighten; }
.tint { width: 100%; height: 100%; background: linear-gradient(135deg, #FF8FB0 0%, #E2456F 60%, #9E1F45 100%); mix-blend-mode: color; }
.env-back { width: ${EW}px; height: ${EH}px; border-radius: 26px; background: #B8264A; box-shadow: 0 60px 100px -40px rgba(40,0,15,.9); }
.env-flap { width: ${EW}px; height: 214px; background: #C93558; clip-path: polygon(0 100%, 50% 4%, 100% 100%); border-radius: 26px; }
.env-front { width: ${EW}px; height: ${EH}px; border-radius: 26px; background: linear-gradient(180deg, #FFB0C4, #FF6F92);
  clip-path: polygon(0 0, 50% 58%, 100% 0, 100% 100%, 0 100%); }
.letter { width: 420px; height: 420px; box-sizing: border-box; padding-top: 40px; border-radius: 22px; background: #FFF8F0; display: flex; flex-direction: column; align-items: center; gap: 4px;
  background-image: repeating-linear-gradient(180deg, transparent 0 46px, ${rgba('#FF5C82', 0.15)} 46px 48px); box-shadow: 0 30px 50px -30px rgba(40,0,15,.6); }
.letter span { font: 700 70px/1 var(--font-hand); color: ${C.valentine.text}; }
.seal { width: 120px; height: 120px; border-radius: 50%; display: grid; place-items: center; background: radial-gradient(circle at 40% 35%, #FFE3EA, #FFC2D2);
  box-shadow: 0 0 0 6px #fff, 0 20px 30px -12px rgba(40,0,15,.6); }
`,
}
