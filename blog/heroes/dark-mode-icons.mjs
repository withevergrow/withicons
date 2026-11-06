import { at, icon, C, rgba, INK, PAPER } from '../tools/hero-kit.mjs'

// A hard split down the middle: paper-light on the left, the dark room on the right. Two big duo icons sit right on
// the seam, each drawn twice and clipped, so the left half is the light-mode colour and the right half the dark one.
const SEAM = 800
const split = (name, cy, size) => {
  const x = SEAM - size / 2, y = cy - size / 2
  return at(icon(name, 'duo', size, C.duo.text), { x, y, style: 'clip-path:inset(0 50% 0 0)' }) +
    at(icon(name, 'duo', size, '#BBAEFF'), { x, y, style: 'clip-path:inset(0 0 0 50%)' })
}

export default {
  base: 'xdark5',
  alt: 'A hard split image, paper white on the left and a dark desk with glowing monitors on the right, with two violet icons cut down the seam into light and dark halves',
  photo: { filter: 'saturate(.9) brightness(.62)', pos: '50% 50%' },
  overlay: `linear-gradient(90deg, ${rgba(PAPER, 0.95)} 0 ${SEAM}px, ${rgba(INK, 0.2)} ${SEAM}px 100%)`,
  art: () => [
    at('', { x: SEAM - 2, y: 0, w: 4, h: 1000, style: `background:${C.duo.c}` }),
    at(`<span class="dm-w">${icon('sun', 'line', 64, '#C98A00')}Light</span>`, { x: 250, y: 150 }),
    at(`<span class="dm-w is-dark">Dark${icon('moon', 'line', 64, '#BBAEFF')}</span>`, { x: 1080, y: 150 }),
    split('bell', 340, 230),
    split('heart', 600, 230),
    at(`<div class="dm-dots"><i></i><i></i><i></i></div>`, { x: 300, y: 330 }),
    at(`<div class="dm-dots is-dark"><i></i><i></i><i></i></div>`, { x: 1040, y: 330 }),
  ].join(''),
  css: `
.dm-w { display: inline-flex; align-items: center; gap: 22px; font: 400 128px/1 var(--font-serif); letter-spacing: -.02em; color: ${INK}; }
.dm-w.is-dark { color: #F4F0E8; }
.dm-dots { display: flex; flex-direction: column; gap: 26px; width: 300px; }
.dm-dots i { display: block; height: 22px; border-radius: 11px; background: ${rgba(INK, 0.12)}; }
.dm-dots i:nth-child(2) { width: 78%; } .dm-dots i:nth-child(3) { width: 56%; background: ${rgba(C.duo.c, 0.35)}; }
.dm-dots.is-dark i { background: rgba(255,255,255,.16); } .dm-dots.is-dark i:nth-child(3) { background: ${rgba('#BBAEFF', 0.45)}; }
`,
}
