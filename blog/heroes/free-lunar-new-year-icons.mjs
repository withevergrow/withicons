import { at, tile, chip, icon, glow, C, rgba } from '../tools/hero-kit.mjs'

// Red-and-gold waves: lanterns hang from the top on gold cords, a big red envelope with a gold seal is the focal point.
const lantern = (x, len, size, rot = 0) => [
  at('<i class="cord"></i>', { x: x + size / 2 - 2, y: 0, h: len, w: 4 }),
  at(`<div class="lan">${icon('red-lantern', 'lunar', size)}</div>`, { x, y: len - size * 0.08, rot }),
].join('')

export default {
  base: 'trends0',
  alt: 'Flowing wallpaper waves washed in red and gold, with lunar-style red lanterns hanging on gold cords over a large red envelope with a gold seal and mandarin, dumpling and lion head tiles',
  photo: { filter: 'saturate(1.1) brightness(.62) contrast(1.1)', pos: '50% 50%' },
  overlay: `linear-gradient(160deg, #F2B33D 0%, #C8141C 40%, #6E0A16 100%)`,
  art: () => [
    lantern(250, 150, 150, -4),
    lantern(460, 120, 120, 3),
    lantern(1270, 110, 150, 4),
    glow({ cx: 870, cy: 420, r: 300, color: '#FFD23F', opacity: 0.5, blur: 90 }),
    at(`<div class="env"><div class="env__flap"></div><div class="env__seal">${icon('lucky-coin', 'lunar', 120)}</div></div>`, { x: 690, y: 170, rot: -6 }),
    tile('mandarin-orange', 'lunar', { x: 1090, y: 470, size: 150, tone: 'card', rot: 6 }),
    tile('dumpling', 'lunar', { x: 1150, y: 650, size: 130, tone: 'card', rot: -5 }),
    tile('lion-head', 'lunar', { x: 940, y: 690, size: 150, tone: C.solid.soft, rot: 3 }),
    chip('Lunar style', { x: 230, y: 470, tone: 'color', style: 'solid', size: 32, icon: ['red-envelope', 'lunar'], rot: -4 }),
  ].join(''),
  css: `
.stage__overlay { mix-blend-mode: color; }
.cord { display: block; width: 4px; height: 100%; background: linear-gradient(180deg, #FFE08A, #D9A12B); border-radius: 2px; }
.lan { filter: drop-shadow(0 24px 24px rgba(60,0,0,.45)); line-height: 0; }
.env { position: relative; width: 340px; height: 470px; border-radius: 34px; background: linear-gradient(170deg, #F0333A 0%, #C8141C 100%); overflow: hidden;
  box-shadow: 0 2px 0 rgba(0,0,0,.05), 0 60px 90px -40px rgba(60,0,0,.85), inset 0 0 0 6px ${rgba('#FFD45E', 0.85)}; }
.env__flap { position: absolute; left: -10%; right: -10%; top: -46%; height: 82%; border-radius: 0 0 50% 50%; background: linear-gradient(180deg, #E21F27, #B5101A);
  box-shadow: 0 6px 0 ${rgba('#FFD45E', 0.85)}, 0 16px 30px -10px rgba(60,0,0,.6); }
.env__seal { position: absolute; left: 50%; top: 36%; translate: -50% 0; width: 170px; height: 170px; border-radius: 50%; display: grid; place-items: center;
  background: radial-gradient(circle at 40% 35%, #FFE9A8, #F2B33D 70%, #D18E1A); box-shadow: 0 14px 30px -10px rgba(60,0,0,.6); }
`,
}
