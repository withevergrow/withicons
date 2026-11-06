import { at, chip, icon, C, INK, rgba } from '../tools/hero-kit.mjs'

// Treatment: a monstera leaf photo on white. The left of the photo is a coarse pixel mosaic (drawn from the photo itself on
// a canvas, upscaled with no smoothing); along a stepped "trace front" the pixels give way to smooth orange vector
// outlines with pen-tool anchors and handles. The result waits on the right: a clean leaf icon tagged .svg.
const O = C.solid
const B = 50 // mosaic block size (stage px)
// how many mosaic columns each row keeps (deterministic stepped edge)
const COLS = [12, 12, 13, 12, 13, 13, 14, 13, 13, 14, 14, 15, 14, 14, 15, 15, 16, 15, 15, 16]
const stairs = () => {
  const p = ['0 0']
  COLS.forEach((c, r) => p.push(`${c * B}px ${r * B}px`, `${c * B}px ${(r + 1) * B}px`))
  return p.concat(['0 1000px']).join(', ')
}
const rest = () => {
  const p = ['1600px 0']
  COLS.forEach((c, r) => p.push(`${c * B}px ${r * B}px`, `${c * B}px ${(r + 1) * B}px`))
  return p.concat(['1600px 1000px']).join(', ')
}

// the leaf's outline in stage px (photo flipped, crop offset 330): smooth curves through these points (Catmull-Rom)
const LINES = [
  [[515, 75], [440, 150], [360, 310], [320, 470], [350, 535], [385, 510], [460, 370], [520, 230], [612, 112], [750, 132], [900, 172], [1083, 236], [1072, 310], [1084, 430], [1090, 560], [1102, 612]],
  [[1102, 612], [900, 640], [720, 652], [648, 670], [652, 712], [760, 730], [900, 745], [1060, 690], [1110, 662]],
  [[1110, 662], [1102, 770], [1048, 885], [1000, 955], [820, 930], [640, 880], [430, 832]],
  [[1000, 955], [1010, 1010]],
]
const smooth = pts => {
  let d = `M${pts[0][0]} ${pts[0][1]}`
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6], c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6]
    d += ` C${c1.map(Math.round).join(' ')} ${c2.map(Math.round).join(' ')} ${p2.join(' ')}`
  }
  return d
}
const NODES = [[750, 132], [1083, 236], [1084, 430], [1102, 612], [648, 670], [900, 745], [1102, 770], [1000, 955], [820, 930]]
const node = ([x, y], on) => `<rect x="${x - 9}" y="${y - 9}" width="18" height="18" rx="3" fill="${on ? O.c : '#fff'}" stroke="${O.c}" stroke-width="4"/>`
function trace() {
  const paths = LINES.map(l => `<path d="${smooth(l)}"/>`).join('')
  // one selected anchor (the leaf tip) with its two bezier handles
  const handle = `<g stroke="${O.c}" stroke-width="3"><line x1="1040" y1="200" x2="1110" y2="300"/></g><circle cx="1040" cy="200" r="9" fill="${O.c}"/><circle cx="1110" cy="300" r="9" fill="${O.c}"/>`
  return `<svg width="1600" height="1000" viewBox="0 0 1600 1000" style="clip-path:polygon(${rest()})"><g fill="none" stroke="${O.c}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round">${paths}</g>${handle}${NODES.map((p, i) => node(p, i === 1)).join('')}</svg>`
}

// canvas mosaic of the (flipped) stage photo
const MOSAIC = `<canvas class="pm" width="1600" height="1000" style="clip-path:polygon(${stairs()})"></canvas><i class="pm-grid" style="clip-path:polygon(${stairs()})"></i><script>(() => {
  const cv = document.currentScript.parentNode.querySelector('.pm'), img = document.querySelector('.stage__photo')
  const draw = () => {
    const w = 1600 / ${B}, h = 1000 / ${B}, t = document.createElement('canvas'); t.width = w; t.height = h
    const k = img.naturalWidth / 1600, tc = t.getContext('2d')
    tc.translate(w, 0); tc.scale(-1, 1); tc.drawImage(img, 0, 330 * k, 1600 * k, 1000 * k, 0, 0, w, h)
    const c = cv.getContext('2d'); c.imageSmoothingEnabled = false; c.drawImage(t, 0, 0, 1600, 1000)
  }
  img.complete && img.naturalWidth ? draw() : img.addEventListener('load', draw)
})()</script>`

export default {
  photoFile: 'png-to-svg-leaf.jpg',
  credit: { by: 'Hayley Maxwell', profile: 'https://unsplash.com/@hayleymaxwell', source: 'https://unsplash.com/photos/green-leaf-with-white-background-Z-yBoorc158', license: 'Unsplash License' },
  alt: 'A monstera leaf photo whose left side is a coarse pixel mosaic that turns into smooth orange vector outlines with pen anchors and handles, next to a clean leaf icon tagged .svg',
  photo: { pos: '50% 55%' },
  overlay: `linear-gradient(90deg, transparent 30%, ${rgba('#FFFFFF', 0.6)} 46%, ${rgba('#FBF8F3', 0.78)} 100%)`,
  art: () => [
    at(MOSAIC, { x: 0, y: 0, w: 1600, h: 1000 }),
    at(trace(), { x: 0, y: 0 }),
    chip('Pixels', { x: 190, y: 140, tone: 'ink', size: 32, icon: ['layout-grid', 'line'], rot: -3 }),
    chip('Paths', { x: 820, y: 330, tone: 'color', style: 'solid', size: 32, icon: ['pen-tool', 'line'], rot: 3 }),
    at(`<div class="pr">${icon('leaf', 'solid', 170, '#2F8F47')}</div>`, { cx: 1300, cy: 470 }),
    chip('.svg', { cx: 1300, cy: 650, tone: 'color', style: 'solid', size: 34 }),
  ].join(''),
  css: `
.stage__photo { transform: scaleX(-1); }
.pm, .pm-grid { position: absolute; left: 0; top: 0; width: 1600px; height: 1000px; }
.pm-grid { background: repeating-linear-gradient(90deg, rgba(255,255,255,.55) 0 2px, transparent 2px ${B}px), repeating-linear-gradient(0deg, rgba(255,255,255,.55) 0 2px, transparent 2px ${B}px); }
.pr { width: 250px; height: 250px; border-radius: 68px; background: #fff; display: grid; place-items: center; box-shadow: 0 2px 0 rgba(17,19,24,.04), 0 50px 90px -40px rgba(17,19,24,.55); border: 1.5px solid ${rgba(INK, 0.06)}; }
`,
}
