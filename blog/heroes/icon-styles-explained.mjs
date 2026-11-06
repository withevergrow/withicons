import { at, icon, C, INK, rgba } from '../tools/hero-kit.mjs'

// Pure artwork: a colour chart for styles. One coffee cup runs left to right through the styles, from plain line
// to rich 3D, each cell tinted with its style's colours, and a loupe lifts one cell out to show it up close.
const RUN = ['line', 'solid', 'duo', 'sketch', 'pixel', 'glass', 'kawaii', 'clay', 'soft3d']
const X0 = 170, CW = 140, Y0 = 270, CH = 300
const LOUPE = 6

export default {
  alt: 'A colour chart of the same with icons coffee cup running from plain line to rich 3D styles, each cell tinted, with a loupe enlarging the kawaii cup',
  bg: `radial-gradient(60% 70% at 70% 40%, ${rgba(C.duo.c, 0.22)} 0%, transparent 70%), linear-gradient(160deg, #F7F4FF 0%, #ECE6FF 100%)`,
  art: () => [
    at(`<div class="dots"></div>`, { x: 0, y: 0, w: 1600, h: 1000 }),
    // axis
    at(`<div class="axis"><b>Simple</b><i></i><b>Rich</b></div>`, { x: X0, y: 170, w: CW * RUN.length }),
    // the chart
    at(`<div class="chart">${RUN.map(s => `<div class="cell" style="--s:${C[s].soft};--c:${C[s].c}"><span>${icon('coffee', s, 116, C[s].c)}</span><i></i></div>`).join('')}</div>`, { x: X0, y: Y0 }),
    // loupe on one cell
    at(`<div class="ring"></div>`, { x: X0 + LOUPE * CW - 8, y: Y0 - 8, w: CW + 16, h: CH + 16, z: 2 }),
    at(`<div class="loupe">${icon('coffee', RUN[LOUPE], 190, C[RUN[LOUPE]].c)}</div>`, { cx: X0 + LOUPE * CW + CW / 2 - 30, cy: 715 }),
    at(`<div class="loupe__handle"></div>`, { x: X0 + LOUPE * CW + CW / 2 + 70, y: 800, rot: -45 }),
  ].join(''),
  css: `
.dots { width: 100%; height: 100%; background-image: radial-gradient(${rgba(C.duo.c, 0.18)} 2px, transparent 2.5px); background-size: 36px 36px; }
.axis { display: flex; align-items: center; gap: 22px; font: 800 30px/1 var(--font-display); color: ${C.duo.text}; letter-spacing: -.01em; }
.axis i { flex: 1; height: 8px; border-radius: 8px; background: linear-gradient(90deg, ${C.line.c}, ${C.duo.c}, ${C.kawaii.c}, ${C.soft3d.c}); }
.chart { display: flex; border-radius: 40px; overflow: hidden; box-shadow: 0 2px 0 rgba(17,19,24,.05), 0 60px 110px -50px ${rgba('#2A1E66', 0.75)}; }
.cell { width: ${CW}px; height: ${CH}px; display: flex; flex-direction: column; background: var(--s); border-right: 1.5px solid rgba(255,255,255,.7); }
.cell:last-child { border-right: 0; }
.cell span { flex: 1; display: grid; place-items: center; }
.cell i { height: 70px; background: var(--c); }
.ring { height: 100%; box-sizing: border-box; border: 7px solid ${C.duo.c}; border-radius: 26px; box-shadow: 0 0 0 5px #fff; }
.loupe { width: 280px; height: 280px; border-radius: 50%; display: grid; place-items: center; background: ${C[RUN[LOUPE]].soft}; border: 14px solid #fff; outline: 6px solid ${C.duo.c}; box-shadow: 0 50px 90px -40px rgba(42,30,102,.8); }
.loupe__handle { width: 38px; height: 100px; border-radius: 20px; background: ${INK}; }
`,
}
