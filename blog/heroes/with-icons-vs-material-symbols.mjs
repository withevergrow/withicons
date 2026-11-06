import { at, chip, icon, C } from '../tools/hero-kit.mjs'
import { N_STYLES } from '../lib/blocks.mjs'

// Pure artwork, a technical drawing: one big blueprint-style camera on blue grid paper, measured like a part. Two
// dimension lines are the variable-font axes (weight, fill); the third callout leads off the drawing to a column of
// the same camera in three finished styles, the axis that changes everything.
const vsp = name => at(`<span class="vsp"><i>vs</i>${name}</span>`, { x: 170, y: 130 })
const VSP_CSS = `
.vsp { display: inline-flex; align-items: center; gap: 14px; padding: 10px 28px 10px 10px; border-radius: 999px; background: ${C.line.c}; color: #fff; font: 800 34px/1 var(--font-display); letter-spacing: -.02em; white-space: nowrap; box-shadow: 0 0 0 6px rgba(255,255,255,.85), 0 30px 60px -18px rgba(0,0,0,.5); }
.vsp i { font-style: normal; width: 58px; height: 58px; border-radius: 50%; background: #fff; color: ${C.line.c}; display: grid; place-items: center; font-size: 28px; letter-spacing: -.04em; }`

const BG = '#0F3B8C', LN = 'rgba(255,255,255,.9)'
const IX = 640, IY = 210, IS = 390 // the drawn icon's box
const arrow = (x1, y1, x2, y2) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" marker-start="url(#ah)" marker-end="url(#ah)"/>`

export default {
  alt: 'Artwork on blue grid paper: a large blueprint-style camera icon measured with dimension lines for weight and fill, and a callout to the same camera in anime, skeuo and pastel styles, with an Android chip and a blue vs Material Symbols pill',
  bg: `linear-gradient(rgba(255,255,255,.07) 2px, transparent 2px) 0 0 / 40px 40px, linear-gradient(90deg, rgba(255,255,255,.07) 2px, transparent 2px) 0 0 / 40px 40px, linear-gradient(rgba(255,255,255,.14) 2px, transparent 2px) 0 0 / 200px 200px, linear-gradient(90deg, rgba(255,255,255,.14) 2px, transparent 2px) 0 0 / 200px 200px, radial-gradient(circle at 50% 45%, #1A51B5, ${BG} 75%)`,
  art: () => [
    at(icon('camera', 'blueprint', IS, '#fff'), { x: IX, y: IY }),
    at(`<svg width="1600" height="1000" viewBox="0 0 1600 1000" class="dim">
      <defs><marker id="ah" viewBox="0 0 12 12" refX="6" refY="6" markerWidth="14" markerHeight="14" orient="auto-start-reverse"><path d="M1 1 L11 6 L1 11" fill="none" stroke="#fff" stroke-width="2"/></marker></defs>
      <g stroke="${LN}" stroke-width="2.5" fill="none">
        <line x1="${IX}" y1="${IY + IS + 10}" x2="${IX}" y2="${IY + IS + 70}" stroke-dasharray="6 6"/>
        <line x1="${IX + IS}" y1="${IY + IS + 10}" x2="${IX + IS}" y2="${IY + IS + 70}" stroke-dasharray="6 6"/>
        ${arrow(IX + 6, IY + IS + 50, IX + IS - 6, IY + IS + 50)}
        <line x1="${IX - 10}" y1="${IY}" x2="${IX - 70}" y2="${IY}" stroke-dasharray="6 6"/>
        <line x1="${IX - 10}" y1="${IY + IS}" x2="${IX - 70}" y2="${IY + IS}" stroke-dasharray="6 6"/>
        ${arrow(IX - 50, IY + 6, IX - 50, IY + IS - 6)}
        <path d="M${IX + IS - 40} ${IY + 120} L${IX + IS + 120} ${IY + 40} L${IX + IS + 190} ${IY + 40}" stroke="${C.line.soft}" stroke-width="3"/>
        <circle cx="${IX + IS - 40}" cy="${IY + 120}" r="9" fill="${C.line.soft}" stroke="none"/>
      </g>
    </svg>`, { x: 0, y: 0 }),
    at(`<span class="lbl">wght 100–700</span>`, { cx: IX + IS / 2, cy: IY + IS + 92 }),
    at(`<span class="lbl">FILL 0–1</span>`, { cx: IX - 50, cy: IY + IS / 2, rot: -90 }),
    at(`<div class="col">${['anime', 'skeuo', 'pastel'].map(s => `<span>${icon('camera', s, 104)}</span>`).join('')}</div>`, { x: IX + IS + 200, y: 180 }),
    chip(`style × ${N_STYLES}`, { x: IX + IS + 185, y: 660, tone: 'color', style: 'line', size: 32, icon: ['palette', 'line'], rot: -3 }),
    chip('Android', { x: 1170, y: 790, tone: 'card', size: 30, icon: ['smartphone', 'line'], rot: 3 }),
    vsp('Material Symbols'),
  ].join(''),
  css: `${VSP_CSS}
.dim { overflow: visible; }
.lbl { display: inline-block; padding: 8px 16px; border-radius: 10px; background: ${BG}; border: 2px solid rgba(255,255,255,.5); color: #fff; font: 600 28px/1 var(--font-mono); white-space: nowrap; }
.col { display: grid; gap: 22px; }
.col span { width: 136px; height: 136px; border-radius: 36px; display: grid; place-items: center; background: #fff; box-shadow: 0 30px 50px -24px rgba(0,0,0,.7); }
`,
}
