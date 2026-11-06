import { at, icon, C, rgba, INK } from '../tools/hero-kit.mjs'

// Pure artwork: a wayfinding signpost against a dusk sky. Three arrow-shaped blades point different ways, each pairing
// an icon with its one word; the Save blade is the violet one. Stylised clouds, a low sun and violet hills behind.
const blade = (name, text, dir, bg, fg) => `<div class="sg is-${dir}" style="background:${bg};color:${fg}">${icon(name, 'solid', 74, fg)}<b>${text}</b></div>`
const cloud = (x, y, s) => at('<i class="cl"></i>', { x, y, scale: s })

export default {
  alt: 'Artwork of a signpost against a violet to peach dusk sky with three arrow signs: a violet Save sign with a floppy disk, a white Download sign and a green Upload sign',
  bg: `linear-gradient(180deg, #5B3CE0 0%, #9C7BFF 38%, #F6B7C8 74%, #FFD9A8 100%)`,
  art: () => [
    at('', { cx: 420, cy: 640, w: 520, h: 520, style: 'border-radius:50%;background:radial-gradient(circle,#FFF4D6 0%,#FFE3B0 30%,rgba(255,227,176,0) 70%)' }),
    at(`<svg width="1600" height="260" viewBox="0 0 1600 260"><path d="M0 120 C 300 20, 600 40, 900 110 S 1400 60, 1600 90 V260 H0Z" fill="#6B4FE8" opacity=".55"/><path d="M0 190 C 400 110, 800 150, 1100 170 S 1450 140, 1600 160 V260 H0Z" fill="#4A2BD8" opacity=".8"/></svg>`, { x: 0, y: 760 }),
    cloud(220, 210, 1), cloud(420, 430, 0.7), cloud(1150, 700, 0.9),
    at('', { x: 1012, y: 150, w: 26, h: 850, style: `border-radius:13px;background:linear-gradient(90deg,#3A3F4B,#5A6070 50%,#2B2F38)` }),
    at('', { x: 1000, y: 128, w: 50, h: 50, style: 'border-radius:50%;background:#3A3F4B' }),
    at(blade('save', 'Save', 'r', '#fff', C.duo.c), { x: 1025, y: 190, rot: -2, cls: 'is-pick' }),
    at(blade('download', 'Download', 'l', '#fff', INK), { x: 560, y: 350, rot: 2 }),
    at(blade('cloud-upload', 'Upload', 'r', '#1F8A55', '#fff'), { x: 1025, y: 510, rot: 1 }),
    at(`<span class="ok">${icon('check', 'line', 52, '#fff')}</span>`, { x: 1340, y: 160, z: 3 }),
  ].join(''),
  css: `
.sg { display: inline-flex; align-items: center; gap: 22px; height: 128px; box-sizing: border-box; padding: 0 70px 0 34px; font: 800 60px/1 var(--font-display); letter-spacing: -.03em; clip-path: polygon(0 0, calc(100% - 52px) 0, 100% 50%, calc(100% - 52px) 100%, 0 100%); border-radius: 18px 0 0 18px; filter: drop-shadow(0 20px 26px rgba(40,20,90,.4)); }
.sg.is-l { padding: 0 34px 0 76px; clip-path: polygon(52px 0, 100% 0, 100% 100%, 52px 100%, 0 50%); border-radius: 0 18px 18px 0; }
.is-pick .sg { background: ${C.duo.c} !important; color: #fff !important; }
.is-pick .sg .hk-icon { color: #fff !important; }
.ok { display: grid; place-items: center; width: 84px; height: 84px; border-radius: 50%; background: #1F8A55; border: 6px solid #fff; box-shadow: 0 16px 30px -12px rgba(0,0,0,.5); }
.cl { display: block; width: 260px; height: 80px; border-radius: 40px; background: rgba(255,255,255,.55); position: relative; }
.cl::before { content: ''; position: absolute; left: 50px; top: -50px; width: 120px; height: 120px; border-radius: 50%; background: inherit; }
`,
}
