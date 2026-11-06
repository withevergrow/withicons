import { at, icon, C, INK, PAPER, rgba } from '../../tools/hero-kit.mjs'

// A 3.5 x 2 in business card drawn to scale (PPI stage px per inch), front view: an orange panel that runs into the
// bleed, placeholder contact lines with solid phone / mail / globe / map-pin icons at their real 0.2 in size, and the
// three print guides (bleed dashed, trim solid, safe area dotted) with a legend and a callout on one icon.
const O = C.solid, PPI = 260, B = 0.125 * PPI
const TX = 110, TY = 150, TW = 3.5 * PPI, TH = 2 * PPI // trim box
const IC = Math.round(0.2 * PPI)
const line = (w, h = 14, a = 0.16) => `<i class="bc__bar" style="width:${w}px;height:${h}px;background:${rgba(INK, a)}"></i>`
// centre of the phone icon (first contact row), from the card layout below
const PX = Math.round(TX - B + B + 0.95 * PPI + B + 20 + IC / 2), PY = Math.round(TY - B + 2 * B + 18 + 30 + 14 + 16 + 14 + 22 + IC / 2)
const contact = n => `<div class="bc__row">${icon(n, 'solid', IC, O.c)}${line(n === 'map-pin' ? 230 : 280)}</div>`

export default {
  bg: PAPER,
  alt: 'A business card drawn to scale with an orange side panel, placeholder contact lines and small solid phone, mail, globe and map pin icons, overlaid with dashed bleed, solid trim and dotted safe area guides and a callout on the phone icon',
  art: () => [
    // the printed artwork, including the bleed
    at(`<div class="bc"><div class="bc__panel">${icon('sparkles', 'solid', 110, '#fff')}</div>
      <div class="bc__body">${line(330, 30, 0.75)}${line(220, 16, 0.3)}<div class="bc__rows">${['phone', 'mail', 'globe', 'map-pin'].map(contact).join('')}</div></div></div>`, { x: TX - B, y: TY - B, w: TW + 2 * B, h: TH + 2 * B }),
    // guides
    at(`<svg width="${TW + 2 * B + 20}" height="${TH + 2 * B + 20}" viewBox="${-10} ${-10} ${TW + 2 * B + 20} ${TH + 2 * B + 20}" fill="none">
      <rect x="0" y="0" width="${TW + 2 * B}" height="${TH + 2 * B}" stroke="${INK}" stroke-width="3" stroke-dasharray="14 10"/>
      <rect x="${B}" y="${B}" width="${TW}" height="${TH}" stroke="${INK}" stroke-width="4"/>
      <rect x="${2 * B}" y="${2 * B}" width="${TW - 2 * B}" height="${TH - 2 * B}" stroke="${C.blueprint.c}" stroke-width="4" stroke-dasharray="2 9" stroke-linecap="round"/>
    </svg>`, { x: TX - B - 10, y: TY - B - 10 }),
    // callout on the phone icon: a ring round it and a leader to the note
    at(`<svg width="1600" height="1000" viewBox="0 0 1600 1000" fill="none"><circle cx="${PX}" cy="${PY}" r="${IC * 0.85}" stroke="${O.c}" stroke-width="5"/><path d="M1078 236 C 900 236, 700 ${PY}, ${PX + IC * 0.85 + 6} ${PY}" stroke="${O.c}" stroke-width="5" stroke-linecap="round"/></svg>`, { x: 0, y: 0 }),
    at(`<div class="bc__note"><b>0.2 in icon</b><span>= 60 px PNG</span><span>or any size as PDF</span></div>`, { x: 1080, y: 150, w: 456 }),
    at(`<div class="bc__legend">
      <span><svg width="70" height="14"><line x1="0" y1="7" x2="70" y2="7" stroke="${INK}" stroke-width="4" stroke-dasharray="14 10"/></svg>Bleed 0.125 in</span>
      <span><svg width="70" height="14"><line x1="0" y1="7" x2="70" y2="7" stroke="${INK}" stroke-width="5"/></svg>Trim 3.5 x 2 in</span>
      <span><svg width="70" height="14"><line x1="2" y1="7" x2="70" y2="7" stroke="${C.blueprint.c}" stroke-width="5" stroke-dasharray="2 9" stroke-linecap="round"/></svg>Safe area</span>
    </div>`, { x: 64, y: 830, w: 1472 }),
  ].join(''),
  css: `
.bc { width: 100%; height: 100%; display: flex; background: #fff; box-shadow: 0 40px 80px -40px rgba(17,19,24,.45); }
.bc__panel { width: ${Math.round(B + 0.95 * PPI)}px; flex: none; background: ${O.c}; display: grid; place-items: center; padding-left: ${Math.round(B / 2)}px; }
.bc__body { flex: 1; padding: ${Math.round(2 * B + 18)}px ${Math.round(2 * B)}px 0 ${Math.round(B + 20)}px; display: flex; flex-direction: column; gap: 14px; }
.bc__bar { display: block; border-radius: 8px; }
.bc__rows { display: grid; grid-template-columns: 1fr; gap: 16px; margin-top: 22px; }
.bc__row { display: flex; align-items: center; gap: 22px; }
.bc__note { box-sizing: border-box; padding: 34px 38px; border-radius: 32px; background: #fff; font-family: var(--font-display); color: ${INK}; display: flex; flex-direction: column; gap: 8px; box-shadow: 0 2px 0 rgba(17,19,24,.04), 0 40px 80px -44px rgba(17,19,24,.45); border: 3px solid ${O.c}; }
.bc__note b { font: 800 46px/1.05 var(--font-display); letter-spacing: -.025em; color: ${O.text}; }
.bc__note span { font: 600 34px/1.2 var(--font-display); }
.bc__legend { display: flex; justify-content: center; gap: 64px; font: 700 32px/1 var(--font-display); color: ${INK}; }
.bc__legend > span { display: inline-flex; align-items: center; gap: 18px; }
`,
}
