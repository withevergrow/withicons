import { at, chip, icon, C, INK, rgba } from '../tools/hero-kit.mjs'

// Treatment: an offset press running sheets, darkened. Over it floats a single proof sheet framed like a real print
// job: crop marks at the corners, registration targets on the edges, and a CMYK colour bar along the foot, with one
// big retro printer icon in the live area. Orange (guides) accent on the DPI chip.
const SX = 760, SY = 150, SW = 520, SH = 660 // the sheet
const BAR = ['#00A0E3', '#E5007E', '#FFED00', '#1A1A1A', '#2D2E83', '#E30613', '#009846', '#8E8E8E']
function marks() {
  const L = 54, G = 18, s = 'stroke="#fff" stroke-width="3"'
  const corner = (x, y, dx, dy) => `<line x1="${x + dx * G}" y1="${y}" x2="${x + dx * (G + L)}" y2="${y}" ${s}/><line x1="${x}" y1="${y + dy * G}" x2="${x}" y2="${y + dy * (G + L)}" ${s}/>`
  const reg = (cx, cy) => `<circle cx="${cx}" cy="${cy}" r="16" fill="none" ${s}/><circle cx="${cx}" cy="${cy}" r="7" fill="#fff"/><line x1="${cx - 28}" y1="${cy}" x2="${cx + 28}" y2="${cy}" ${s}/><line x1="${cx}" y1="${cy - 28}" x2="${cx}" y2="${cy + 28}" ${s}/>`
  const x0 = SX, y0 = SY, x1 = SX + SW, y1 = SY + SH
  return `<svg width="1600" height="1000" viewBox="0 0 1600 1000">${corner(x0, y0, -1, -1)}${corner(x1, y0, 1, -1)}${corner(x0, y1, -1, 1)}${corner(x1, y1, 1, 1)}${reg(SX + SW / 2, SY - 52)}${reg(SX + SW + 52, SY + SH / 2)}${reg(SX - 52, SY + SH / 2)}</svg>`
}

export default {
  photoFile: 'icon-resolution-for-print-press.jpg',
  credit: { by: 'Bank Phrom', profile: 'https://unsplash.com/@bank_phrom', source: 'https://unsplash.com/photos/printing-machine-Tzm3Oyu_6sk', license: 'Unsplash License' },
  alt: 'A darkened offset printing press with a proof sheet floating over it: crop marks at its corners, registration targets on its edges, a CMYK colour bar along the bottom and a big retro printer icon in the middle',
  photo: { filter: 'saturate(.7) brightness(.5) contrast(1.05)', pos: '50% 60%' },
  overlay: `radial-gradient(60% 70% at 64% 48%, ${rgba('#0E1220', 0.1)} 0%, ${rgba('#0E1220', 0.55)} 100%)`,
  art: () => [
    at(marks(), { x: 0, y: 0 }),
    at(`<div class="ps"><div class="ps__live">${icon('printer', 'retro', 340)}</div><div class="ps__bar">${BAR.map(c => `<i style="background:${c}"></i>`).join('')}</div><span class="ps__slug">proof 1 / 1</span></div>`, { x: SX, y: SY, w: SW, h: SH }),
    chip('300 DPI', { x: 470, y: 250, tone: 'color', style: 'solid', size: 36, rot: 4 }),
    chip('Vector PDF', { x: 400, y: 350, tone: 'card', size: 30, icon: ['file', 'line'], rot: -3 }),
  ].join(''),
  css: `
.ps { position: relative; width: 100%; height: 100%; box-sizing: border-box; background: #FFFDF8; border-radius: 4px; box-shadow: 0 60px 120px -40px rgba(0,0,0,.85), 0 0 0 1px rgba(255,255,255,.4); }
.ps__live { position: absolute; left: 40px; right: 40px; top: 40px; bottom: 120px; border-radius: 26px; background: #F6EEDF; display: grid; place-items: center; outline: 2px dashed ${rgba(INK, 0.18)}; outline-offset: 12px; }
.ps__bar { position: absolute; left: 40px; right: 40px; bottom: 40px; height: 44px; display: grid; grid-template-columns: repeat(8, 1fr); border-radius: 6px; overflow: hidden; }
.ps__bar i { display: block; }
.ps__slug { position: absolute; right: 40px; bottom: 94px; font: 500 16px/1 var(--font-mono); color: ${rgba(INK, 0.45)}; }
`,
}
