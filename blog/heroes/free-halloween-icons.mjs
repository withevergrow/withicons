import { at, chip, icon, glow, C, rgba } from '../tools/hero-kit.mjs'

// Night desk under the lamp: Halloween-style icons sit in the pool of light on the desk, bats stream up to a full moon.
const prop = (name, size, x, rot = 0) => at(`<div class="prop">${icon(name, 'halloween', size)}</div>`, { x, y: 805 - size, rot })

export default {
  base: 'xdark4',
  alt: 'A desk lamp glowing at night over a wooden desk where a jack-o-lantern, black cat and candy bucket in the with icons Halloween style sit, while bats fly up to a big moon',
  photo: { filter: 'saturate(1.1) brightness(.9) contrast(1.05)', pos: '50% 60%' },
  overlay: `radial-gradient(70% 70% at 40% 40%, transparent 0%, ${rgba('#0B0710', 0.35)} 100%), linear-gradient(180deg, ${rgba('#1A0B2E', 0.35)} 0%, transparent 60%)`,
  art: () => [
    // moon
    glow({ cx: 1220, cy: 270, r: 230, color: C.halloween.c, opacity: 0.45, blur: 90 }),
    at('<div class="moon"></div>', { cx: 1220, cy: 270 }),
    // bats streaming from the lamp to the moon
    at(icon('bat', 'halloween', 96), { x: 960, y: 340, rot: -14 }),
    at(icon('bat', 'halloween', 124), { x: 960, y: 170, rot: -8 }),
    at(icon('bat', 'halloween', 150), { x: 1250, y: 110, rot: 10 }),
    at(icon('ghost', 'halloween', 140), { x: 770, y: 360, rot: -8 }),
    // the desk
    glow({ cx: 1000, cy: 700, r: 260, color: '#FFB347', opacity: 0.3, blur: 70 }),
    prop('candy-bucket', 150, 720, -4),
    prop('jack-o-lantern', 260, 872),
    prop('black-cat', 170, 1115, 3),
    chip('Halloween style', { x: 1040, y: 430, tone: 'color', style: 'solid', size: 32, icon: ['jack-o-lantern', 'halloween'], rot: -4 }),
  ].join(''),
  css: `
.moon { width: 250px; height: 250px; border-radius: 50%; background: radial-gradient(circle at 38% 36%, #FFF6DC 0%, #FFE3A6 55%, #F7C46C 100%);
  box-shadow: 0 0 80px 10px rgba(255,214,140,.45), inset -18px -14px 0 rgba(214,150,60,.25); }
.prop { filter: drop-shadow(0 18px 18px rgba(0,0,0,.55)); line-height: 0; }
.stage__art > .hk-at > .hk-icon, .prop .hk-icon { filter: drop-shadow(0 0 22px rgba(255,150,50,.55)) drop-shadow(0 0 6px rgba(190,120,255,.5)); }
`,
}
