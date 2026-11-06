import { at, icon, C, rgba, INK } from '../tools/hero-kit.mjs'

// A stroboscopic exposure: one heart hops along a violet dotted arc, caught nine times. The copies bunch up at both
// ends (ease in, ease out) and fade in toward the landing, where the real 3D heart squashes. Three timing marks below.
const P0 = [250, 410], P1 = [780, -30], P2 = [1240, 410], N = 9
const bez = t => [0, 1].map(k => (1 - t) ** 2 * P0[k] + 2 * (1 - t) * t * P1[k] + t * t * P2[k])
const ease = t => t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2
const SIZE = 150

function strobe() {
  let out = ''
  for (let i = 0; i < N - 1; i++) {
    const t = ease(i / (N - 1)), [x, y] = bez(t)
    out += at(icon('heart', 'duo', SIZE, '#C9BCFF'), { x: x - SIZE / 2, y: y - SIZE / 2, rot: -20 + 40 * t, style: `opacity:${(0.3 + 0.6 * i / N).toFixed(2)}` })
  }
  const [x, y] = bez(1)
  return out + at(icon('heart', 'soft3d', 200), { x: x - 100, y: y - 110, scale: '1.12 .9', style: 'transform-origin:50% 100%' })
}
const path = () => {
  const d = `M${P0[0]} ${P0[1]} Q${P1[0]} ${P1[1]} ${P2[0]} ${P2[1]}`
  return `<svg width="1600" height="1000" viewBox="0 0 1600 1000" fill="none"><path d="${d}" stroke="${C.duo.c}" stroke-width="8" stroke-linecap="round" stroke-dasharray="2 22"/>
    <ellipse cx="${P2[0]}" cy="${P2[1] + 92}" rx="110" ry="16" fill="${rgba('#000000', 0.35)}"/></svg>`
}
const mark = (t, text) => { const [x] = bez(ease(t)); return at(`<span class="st-mark">${text}</span>`, { cx: x, cy: 575 }) }

export default {
  base: 'xanim3',
  alt: 'Golden light trails behind a stroboscopic sequence of a violet heart hopping along a dotted arc and landing as a 3D heart, with 0, 150 and 300 ms timing marks',
  photo: { filter: 'saturate(1) brightness(.5)', pos: '50% 50%' },
  overlay: `linear-gradient(180deg, ${rgba(INK, 0.45)} 0%, ${rgba(INK, 0.15)} 55%, ${rgba(INK, 0.5)} 100%)`,
  art: () => [
    at(path(), { x: 0, y: 0 }),
    strobe(),
    at(`<svg width="1100" height="20" viewBox="0 0 1100 20"><path d="M0 10H1100" stroke="rgba(255,255,255,.35)" stroke-width="3"/></svg>`, { x: 250, y: 565 }),
    mark(0.0001, '0 ms'), mark(0.5, '150 ms'), mark(1, '300 ms'),
  ].join(''),
  css: `
.st-mark { display: inline-block; padding: 10px 18px; border-radius: 999px; background: #fff; color: ${INK}; font: 700 28px/1 var(--font-mono); box-shadow: 0 16px 30px -14px rgba(0,0,0,.8); white-space: nowrap; }
.stage__art > .hk-at:nth-last-child(1) .st-mark { background: ${C.duo.c}; color: #fff; }
`,
}
