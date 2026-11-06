import { at, chip, icon, glow, C, rgba } from '../tools/hero-kit.mjs'

// A rangoli drawn in coded SVG (rings of teardrop petals, a dotted border) around a big diya, with festival icons
// set into it in a circle, utsav and rangoli styles alternating. Golden light trails glow behind.
const CX = 1000, CY = 490, R = 278
const RING = [
  ['marigold', 'rangoli'], ['sparkler', 'utsav'], ['laddoo', 'rangoli'], ['sky-lantern', 'utsav'],
  ['lotus', 'rangoli'], ['firecracker', 'utsav'], ['mithai-box', 'rangoli'], ['kalash', 'utsav'],
]
const ring = () => RING.map(([n, s], i) => {
  const a = (i / RING.length) * Math.PI * 2 - Math.PI / 2
  return at(`<div class="petal">${icon(n, s, 96)}</div>`, { cx: Math.round(CX + R * Math.cos(a)), cy: Math.round(CY + R * Math.sin(a)) })
}).join('')

// one teardrop petal, its base r px from the centre, pointing outwards at angle a (degrees)
const drop = (r, len, w, a, fill) => `<path transform="translate(${CX} ${CY}) rotate(${a}) translate(0 ${-r})" d="M0 0 C ${w} ${-len * 0.3} ${w} ${-len * 0.75} 0 ${-len} C ${-w} ${-len * 0.75} ${-w} ${-len * 0.3} 0 0 Z" fill="${fill}" stroke="#FFF3D6" stroke-width="3"/>`
function mandala() {
  let p = ''
  for (let i = 0; i < 16; i++) p += drop(298, 72, 28, i * 22.5 + 11.25, i % 2 ? '#F2B33D' : '#E81F7A')
  for (let i = 0; i < 16; i++) p += drop(310, 42, 13, i * 22.5, '#19A39A')
  for (let i = 0; i < 36; i++) {
    const a = (i / 36) * Math.PI * 2
    p += `<circle cx="${(CX + 398 * Math.cos(a)).toFixed(1)}" cy="${(CY + 398 * Math.sin(a)).toFixed(1)}" r="${i % 2 ? 5 : 8}" fill="#FFD27A"/>`
  }
  for (let i = 0; i < 12; i++) p += drop(160, 54, 19, i * 30 + 15, i % 2 ? '#E81F7A' : '#7B2FBE')
  p += `<circle cx="${CX}" cy="${CY}" r="${R}" fill="none" stroke="#FFF3D6" stroke-width="4" stroke-dasharray="2 14" stroke-linecap="round"/>`
  return at(`<svg width="1600" height="1000" viewBox="0 0 1600 1000">${p}</svg>`, { x: 0, y: 0 })
}

export default {
  base: 'xanim3',
  alt: 'Golden long-exposure light trails behind a rangoli of magenta, gold and teal petals drawn around with icons: a glowing diya in a white circle, ringed by marigold, sparkler, lotus, sweets and lantern icons in the utsav and rangoli styles',
  photo: { filter: 'saturate(1.15) brightness(.62)', pos: '50% 50%' },
  overlay: `radial-gradient(60% 75% at 62% 48%, ${rgba('#1A0A05', 0.25)} 0%, ${rgba('#14051A', 0.7)} 100%)`,
  art: () => [
    glow({ cx: CX, cy: CY, r: 380, color: C.solid.c, opacity: 0.38, blur: 100 }),
    mandala(),
    at(`<div class="core">${icon('diya', 'utsav', 220)}</div>`, { cx: CX, cy: CY }),
    ring(),
    chip('Utsav style', { x: 250, y: 230, tone: 'color', style: 'solid', size: 32, icon: ['diya', 'utsav'], rot: -4 }),
    chip('Rangoli style', { x: 300, y: 330, tone: 'card', style: 'rangoli', size: 30, icon: ['rangoli-pattern', 'rangoli'], rot: 3 }),
  ].join(''),
  css: `
.petal { width: 144px; height: 144px; border-radius: 50%; display: grid; place-items: center; background: #FFF8EC;
  box-shadow: 0 0 0 6px ${rgba(C.utsav.c, 0.95)}, 0 30px 50px -24px rgba(0,0,0,.7); }
.core { width: 290px; height: 290px; border-radius: 50%; display: grid; place-items: center; background: radial-gradient(circle, #FFFDF6 55%, #FFE7C2 100%);
  box-shadow: 0 0 0 10px ${C.solid.c}, 0 0 0 20px ${rgba('#FFD27A', 0.6)}, 0 0 120px 30px ${rgba('#FFB347', 0.55)}; }
`,
}
