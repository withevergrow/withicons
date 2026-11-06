import { at, icon, C, rgba, INK } from '../tools/hero-kit.mjs'

// Pure artwork: an isometric scene of two slabs. On the left slab a duo rocket is printed flat onto the top face; on the
// right slab the same rocket stands up in Soft 3D with its shadow. Two small labels name the looks.
const slab = (cx, cy, a, d, top, left, right) => `<svg width="1600" height="1000" viewBox="0 0 1600 1000" fill="none">
  <path d="M${cx - a} ${cy}L${cx} ${cy + a / 2}V${cy + a / 2 + d}L${cx - a} ${cy + d}Z" fill="${left}"/>
  <path d="M${cx + a} ${cy}L${cx} ${cy + a / 2}V${cy + a / 2 + d}L${cx + a} ${cy + d}Z" fill="${right}"/>
  <path d="M${cx} ${cy - a / 2}L${cx + a} ${cy}L${cx} ${cy + a / 2}L${cx - a} ${cy}Z" fill="${top}"/></svg>`
const A = 250, D = 64, L = [560, 395], R = [1140, 395]

export default {
  alt: 'Artwork of two isometric slabs on a lilac gradient: a violet rocket printed flat on the left slab and the same rocket standing up in glossy 3D on the right',
  bg: `radial-gradient(90% 90% at 50% 30%, #F4F0FF 0%, #DCD3FF 55%, #B9A9FF 100%)`,
  art: () => [
    at(`<svg width="1600" height="1000" viewBox="0 0 1600 1000"><g stroke="${rgba(C.duo.c, 0.16)}" stroke-width="2">${Array.from({ length: 30 }, (_, i) => `<path d="M${-600 + i * 100} 1000L${1400 + i * 100} 0M${-600 + i * 100} 0L${1400 + i * 100} 1000"/>`).join('')}</g></svg>`, { x: 0, y: 0, style: 'opacity:.7' }),
    at(slab(L[0], L[1], A, D, C.duo.soft, '#B6A6FF', C.duo.c), { x: 0, y: 0 }),
    at(slab(R[0], R[1], A, D, '#FFF6DD', '#F2C452', '#D9A21A'), { x: 0, y: 0 }),
    // flat: the icon lies on the top face (rotate 45deg, squash to half height)
    at(`<div class="iso-flat">${icon('rocket', 'duo', 250, C.duo.text)}</div>`, { cx: L[0], cy: L[1] }),
    // 3D: standing on the top face, with a soft contact shadow
    at(`<div class="iso-shadow"></div>`, { cx: R[0] + 10, cy: R[1] + 6 }),
    at(icon('rocket', 'soft3d', 300), { x: R[0] - 150, y: R[1] - 270 }),
    at(`<span class="iso-l">Flat</span>`, { cx: L[0], cy: 170 }),
    at(`<span class="iso-l is-3d">3D</span>`, { cx: R[0] + 200, cy: 170 }),
  ].join(''),
  css: `
.iso-flat { width: 320px; height: 320px; display: grid; place-items: center; transform: scaleY(.5) rotate(45deg); }
.iso-shadow { width: 260px; height: 90px; border-radius: 50%; background: radial-gradient(closest-side, rgba(120,80,0,.35), transparent); }
.iso-l { display: inline-block; padding: 14px 30px; border-radius: 999px; background: #fff; color: ${INK}; font: 800 46px/1 var(--font-display); letter-spacing: -.02em; box-shadow: 0 24px 40px -20px rgba(40,20,120,.6); }
.iso-l:not(.is-3d) { background: ${C.duo.c}; color: #fff; }
.iso-l.is-3d { background: #FFD23F; }
`,
}
