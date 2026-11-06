import { at, tile, chip, C, INK, SUN } from '../tools/hero-kit.mjs'

// Typographic poster, pure artwork (no photo): the classic <i> tag set huge in mono on sunny yellow, the "i" in blue,
// with a row of home icons in four styles beneath it, as if the tag had just printed them.
const vsp = name => at(`<span class="vsp"><i>vs</i>${name}</span>`, { x: 170, y: 130 })
const VSP_CSS = `
.vsp { display: inline-flex; align-items: center; gap: 14px; padding: 10px 28px 10px 10px; border-radius: 999px; background: ${C.line.c}; color: #fff; font: 800 34px/1 var(--font-display); letter-spacing: -.02em; white-space: nowrap; box-shadow: 0 0 0 6px rgba(255,255,255,.85), 0 30px 60px -18px rgba(17,19,24,.55); }
.vsp i { font-style: normal; width: 58px; height: 58px; border-radius: 50%; background: #fff; color: ${C.line.c}; display: grid; place-items: center; font-size: 28px; letter-spacing: -.04em; }`

export default {
  alt: 'Artwork on sunny yellow: a huge monospace i tag with the i in blue, a row of with icons home icons in line, glass, clay, sticker and luxe styles printed beneath it, a class name chip and a blue vs Font Awesome pill',
  bg: `radial-gradient(circle at 70% 40%, #FFE27A 0%, ${SUN} 55%, #F7C21B 100%)`,
  art: () => [
    at(`<svg width="1600" height="1000" viewBox="0 0 1600 1000"><g fill="none" stroke="${INK}" stroke-opacity=".08" stroke-width="2">${[0, 1, 2, 3, 4, 5].map(i => `<circle cx="990" cy="420" r="${140 + i * 90}"/>`).join('')}</g></svg>`, { x: 0, y: 0 }),
    at(`<div class="tag">&lt;<em>i</em>&gt;</div>`, { cx: 990, cy: 400 }),
    chip('class="with with-home"', { x: 820, y: 140, tone: 'ink', size: 28, rot: 3, cls: 'mono' }),
    tile('home', 'line', { x: 730, y: 650, size: 160, tone: 'card', rot: -4 }),
    tile('home', 'glass', { x: 910, y: 680, size: 160, tone: 'card', rot: 3 }),
    tile('home', 'clay', { x: 1090, y: 650, size: 160, tone: 'card', rot: -2 }),
    tile('home', 'sticker', { x: 1270, y: 680, size: 160, tone: 'card', rot: 4 }),
    tile('home', 'luxe', { x: 330, y: 320, size: 150, tone: 'card', rot: -8 }),
    vsp('Font Awesome'),
  ].join(''),
  css: `${VSP_CSS}
.tag { font: 700 400px/1 var(--font-mono); letter-spacing: -.06em; color: ${INK}; white-space: nowrap; }
.tag em { font-style: normal; color: ${C.line.c}; }
.mono b { font-family: var(--font-mono); font-weight: 600; }
`,
}
