import path from 'path'
import { fileURLToPath, pathToFileURL } from 'url'
import { at, icon, C, INK, PAPER, rgba } from '../../tools/hero-kit.mjs'

const SEA = pathToFileURL(path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'photos', 'icon-black-or-white-background-sea.jpg')).href

// Three steps left to right. 1: a small design (sticker star + a word) exported on bright green. 2: the same image in a
// generic editor window, "Remove background" pressed, the green half gone. 3: the result on a dark sea photo (the base
// photo, clipped to that panel) with a magnifier on the star's edge showing the leftover green fringe.
const O = C.solid, GREEN = '#22D34B'
const W = 450, GAP = 61, Y = 110, H = 780
const X = [64, 64 + W + GAP, 64 + 2 * (W + GAP)]
const design = (size = 1) => `<div class="wk__d" style="scale:${size}">${icon('star', 'sticker', 150)}<b>Sale</b></div>`
const label = (n, t) => `<div class="wk__lbl"><span class="wk__n">${n}</span><span>${t}</span></div>`
const CHECK = `#fff conic-gradient(#D9DCE2 25%, #fff 0 50%, #D9DCE2 0 75%, #fff 0) 0 0 / 30px 30px`

export default {
  photoFile: 'icon-black-or-white-background-sea.jpg',
  credit: { by: '은 하 (galaxim)', profile: 'https://unsplash.com/@galaxim', source: 'https://unsplash.com/photos/purple-and-blue-sky-over-the-sea-ZDOd2UNl1TQ', license: 'Unsplash License' },
  bg: PAPER,
  alt: 'Three steps: a star sticker and the word Sale exported on bright green, the same image in a generic editor with Remove background pressed, and the result on a dark sea photo with a magnifier showing a faint green fringe on the star edge',
  photo: { filter: 'brightness(.55) saturate(1.1)', pos: '50% 50%' },
  art: () => [
    at(`<div class="wk__card"><div class="wk__stage" style="background:${GREEN}">${design()}</div>${label(1, 'Export PNG on green')}</div>`, { x: X[0], y: Y, w: W, h: H }),
    at(`<div class="wk__card"><div class="wk__win"><div class="wk__bar"><i></i><i></i><i></i></div><div class="wk__tools"><span class="wk__rb">${icon('wand-sparkles', 'line', 30, '#fff')}Remove background</span></div><div class="wk__canvas" style="background:linear-gradient(90deg, transparent 55%, ${GREEN} 55%), ${CHECK}">${design(0.82)}</div></div>${label(2, 'Remove the green')}</div>`, { x: X[1], y: Y, w: W, h: H }),
    at(`<div class="wk__card is-photo"><div class="wk__stage is-clear"><img class="wk__photo" src="${SEA}" alt="">${design()}<div class="wk__lens"><div class="wk__zoom">${icon('star', 'sticker', 150)}</div></div></div>${label(3, 'Zoom in: check the edges')}</div>`, { x: X[2], y: Y, w: W, h: H }),
  ].join(''),
  css: `
.stage { background: ${PAPER}; }
.stage__photo { display: none; }
.wk__photo { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; border-radius: 26px; filter: brightness(.55) saturate(1.1); }
.wk__card { box-sizing: border-box; height: 100%; padding: 30px; border-radius: 36px; background: #fff; display: flex; flex-direction: column; gap: 34px; font-family: var(--font-display); color: ${INK}; box-shadow: 0 2px 0 rgba(17,19,24,.04), 0 40px 80px -44px rgba(17,19,24,.45); border: 1.5px solid ${rgba(INK, 0.06)}; }
.wk__card.is-photo { background: #fff; }
.wk__stage { position: relative; height: 560px; flex: none; border-radius: 26px; display: grid; place-items: center; }
.wk__stage.is-clear { background: transparent; }
.wk__d { position: relative; display: flex; flex-direction: column; align-items: center; gap: 4px; }
.wk__d b { font: 800 76px/1 var(--font-display); letter-spacing: -.04em; color: #fff; -webkit-text-stroke: 8px ${INK}; paint-order: stroke fill; }
.is-photo .wk__d { filter: drop-shadow(0 0 2px ${GREEN}); }
.wk__win { height: 560px; flex: none; border-radius: 26px; overflow: hidden; display: flex; flex-direction: column; background: #F2F2F5; box-shadow: inset 0 0 0 2px ${rgba(INK, 0.08)}; }
.wk__bar { display: flex; gap: 9px; padding: 16px 18px; background: #fff; border-bottom: 2px solid ${rgba(INK, 0.06)}; }
.wk__bar i { width: 14px; height: 14px; border-radius: 50%; background: #D5D7DD; }
.wk__tools { padding: 16px 18px 0; }
.wk__rb { display: inline-flex; align-items: center; gap: 10px; padding: 14px 20px; border-radius: 16px; background: ${O.c}; color: #fff; font: 800 28px/1 var(--font-display); box-shadow: 0 0 0 5px ${rgba(O.c, 0.25)}; white-space: nowrap; }
.wk__canvas { flex: 1; margin: 18px; border-radius: 16px; display: grid; place-items: center; }
.wk__lens { z-index: 2; position: absolute; right: 18px; top: 18px; width: 190px; height: 190px; border-radius: 50%; overflow: hidden; background: #2A1838; box-shadow: 0 0 0 8px #fff, 0 20px 40px -10px rgba(0,0,0,.6); }
.wk__zoom { position: absolute; left: -230px; top: -80px; line-height: 0; scale: 3.2; transform-origin: 0 0; filter: drop-shadow(0 0 2.2px ${GREEN}) drop-shadow(0 0 1.2px ${GREEN}); }
.wk__lbl { display: flex; align-items: flex-start; gap: 18px; font: 800 38px/1.1 var(--font-display); letter-spacing: -.025em; }
.wk__n { flex: none; display: grid; place-items: center; width: 56px; height: 56px; border-radius: 50%; background: ${O.c}; color: #fff; font-size: 30px; }
`,
}
