import { at, chip, icon, glow, C, rgba } from '../tools/hero-kit.mjs'

// Pure artwork: a bright studio (wall, arch niche, floor) where 3D-look icons float at different heights and depths,
// each throwing a long soft shadow to the right across the floor, lit from the top left.
const HORIZON = 430
const obj = (name, style, size, cx, cy, floor, color) => {
  const lift = floor - (cy + size / 2)
  const len = size * 0.85 + lift * 0.55, h = Math.round(size * 0.2), o = Math.max(0.28, 0.6 - lift / 900)
  return at(`<i class="sh" style="width:${Math.round(len)}px;height:${h}px;opacity:${o.toFixed(2)}"></i>`, { x: Math.round(cx - size * 0.35), y: Math.round(floor - h / 2), rot: 4 }) +
    at(`<div class="ob">${icon(name, style, size, color)}</div>`, { cx, cy })
}

export default {
  bg: `linear-gradient(180deg, #E4E8FF 0%, #CCD4FB ${HORIZON}px, #F1EEF8 ${HORIZON}px, #E3DDF0 100%)`,
  alt: 'A bright lilac studio with an arched niche where 3D-style with icons float at different heights: a soft 3D rocket, clay heart, chrome star, glass cube, skeuo gem and liquid droplet, each casting a long soft shadow across the floor',
  art: () => [
    at('<div class="arch"></div>', { x: 830, y: 110 }),
    at('<div class="plinth"></div>', { x: 900, y: 660 }),
    glow({ cx: 1030, cy: 360, r: 260, color: C.line.c, opacity: 0.18, blur: 110 }),
    obj('gem', 'skeuo', 130, 770, 390, 630),
    obj('droplet', 'liquid', 110, 610, 470, 585),
    obj('star', 'chrome', 150, 1320, 370, 640),
    obj('rocket', 'soft3d', 290, 1040, 330, 695),
    obj('heart', 'clay', 190, 830, 650, 830),
    obj('cube', 'glass', 170, 1250, 690, 860),
    chip('3D look, still SVG', { x: 270, y: 170, tone: 'color', style: 'line', size: 34, icon: ['cube', 'line'], rot: -3 }),
    chip('Sharp at any size', { x: 290, y: 280, tone: 'card', style: 'line', size: 28, icon: ['maximize-2', 'line'], rot: 2 }),
  ].join(''),
  css: `
.arch { width: 440px; height: 320px; border-radius: 220px 220px 0 0; background: linear-gradient(180deg, #C3CCF8, #B6C0F4); box-shadow: inset 0 30px 60px -30px rgba(40,50,120,.35); }
.plinth { width: 300px; height: 70px; border-radius: 50%; background: linear-gradient(180deg, #FFFFFF, #E4DEF2); box-shadow: 0 20px 30px -16px rgba(60,40,110,.35); }
.sh { display: block; border-radius: 50%; background: radial-gradient(closest-side, rgba(60,40,110,.95), rgba(60,40,110,0)); filter: blur(5px); }
.ob { line-height: 0; }
`,
}
