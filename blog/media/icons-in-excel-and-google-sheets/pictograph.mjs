import { at, chip, icon, C, INK, rgba } from '../../tools/hero-kit.mjs'

// In-post: one value (4,500) drawn three ways on a light chart: a plain bar, one people icon stretched along the bar,
// and Stack and Scale (four and a half crisp icons, the last one cut in half). Generic chart, no app branding.
const O = C.solid
const UNIT = 184, CX = 520, VAL = 4.5
const ROW_Y = [150, 390, 630], BH = 150

function axis() {
  let s = ''
  for (let k = 0; k <= 5; k++) {
    const x = CX + k * UNIT
    s += `<path d="M${x} 110 V830" stroke="rgba(17,19,24,${k ? 0.08 : 0.35})" stroke-width="${k ? 2 : 4}"/><text x="${x}" y="874" text-anchor="middle">${k ? `${k},000` : '0'}</text>`
  }
  return `<svg width="1600" height="1000" viewBox="0 0 1600 1000" fill="none" class="pg__ax">${s}</svg>`
}
/** The users icon's own SVG, forced to w x h (no aspect ratio kept): what a stretched picture fill looks like. */
const stretched = (w, h) => icon('users', 'solid', h).match(/<svg[\s\S]*<\/svg>/)[0].replace(/width="\d+" height="\d+"/, `width="${w}" height="${h}" preserveAspectRatio="none"`)
const label = (t, sub, y) => at(`<div class="pg__lb"><b>${t}</b>${sub ? `<span>${sub}</span>` : ''}</div>`, { x: 96, y, w: 390, h: BH })

export default {
  alt: 'A chart with three bars of the same 4,500 value: a plain orange bar, one people icon stretched along the bar, and four and a half crisp people icons stacked in a row',
  bg: `radial-gradient(${rgba(INK, 0.08)} 2px, transparent 2.5px) 0 0 / 34px 34px, linear-gradient(180deg, #FBF8F3, #F3EEE5)`,
  art: () => [
    at('<div class="pg__card"></div>', { x: 72, y: 80, w: 1456, h: 840 }),
    at(axis(), { x: 0, y: 0 }),
    label('Plain bar', '', ROW_Y[0]),
    at('<i class="pg__bar"></i>', { x: CX, y: ROW_Y[0] + 30, w: UNIT * VAL, h: BH - 60 }),
    label('Stretch', 'one icon, pulled wide', ROW_Y[1]),
    at(`<span class="pg__str" style="color:${O.c}">${stretched(UNIT * VAL, BH)}</span>`, { x: CX, y: ROW_Y[1], w: UNIT * VAL, h: BH }),
    label('Stack and Scale', '1 icon = 1,000', ROW_Y[2]),
    ...[0, 1, 2, 3, 4].map(k => at(`<span class="pg__ic${k === 4 ? ' is-half' : ''}">${icon('users', 'solid', 150, O.c)}</span>`, { x: CX + k * UNIT + (UNIT - 150) / 2, y: ROW_Y[2] })),
    chip('1 icon = 1,000 visitors', { x: 1060, y: 566, tone: 'card', size: 28, icon: ['users', 'solid'] }),
    at(`<span class="pg__val">4,500</span>`, { x: CX + UNIT * VAL + 22, y: ROW_Y[0] + 52 }),
  ].join(''),
  css: `
.pg__card { height: 100%; border-radius: 36px; background: #fff; box-shadow: 0 2px 0 rgba(17,19,24,.04), 0 40px 80px -40px rgba(17,19,24,.45); border: 2px solid rgba(17,19,24,.06); }
.pg__ax { display: block; } .pg__ax text { font: 600 26px var(--font-mono); fill: #8A8F9A; }
.pg__lb { box-sizing: border-box; height: 100%; display: flex; flex-direction: column; justify-content: center; gap: 10px; padding-left: 36px; }
.pg__lb b { font: 800 40px/1 var(--font-display); letter-spacing: -.03em; color: ${INK}; }
.pg__lb span { font: 600 28px/1 var(--font-display); color: ${O.text}; }
.pg__bar { display: block; height: 100%; border-radius: 0 18px 18px 0; background: ${O.c}; }
.pg__str { display: block; line-height: 0; } .pg__str svg { display: block; }
.pg__ic { display: block; line-height: 0; } .pg__ic.is-half { clip-path: inset(0 50% 0 0); }
.pg__val { font: 800 34px/1 var(--font-mono); color: ${INK}; letter-spacing: -.03em; }
`,
}
