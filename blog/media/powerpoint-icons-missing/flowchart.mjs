import { at, icon, C, INK, rgba } from '../../tools/hero-kit.mjs'

// In-post: a three-branch decision flowchart. Start: "No Icons button?" Each branch asks one question (duo icon marker)
// and gives the fix; all three meet at the end card: bring your own icons. Generic, no product UI.
const O = C.solid, D = C.duo
const COLS = [
  { cx: 316, q: 'Is the button there but grey?', ic: 'lock', a: '<b>Connected experiences off:</b> turn on, or ask IT' },
  { cx: 800, q: 'Is there no button at all?', ic: 'presentation', a: '<b>Office 2016 or older:</b> use Insert › Pictures' },
  { cx: 1284, q: 'Does it open but fail?', ic: 'wifi-off', a: '<b>Offline or blocked:</b> check your internet or work network' },
]
const W = 440, QY = 250, QH = 150, AY = 480, AH = 170, EY = 780
const card = (html, cls) => `<div class="fc__card ${cls}">${html}</div>`

function lines() {
  const s = []
  for (const c of COLS) {
    s.push(`<path d="M800 186 V214 H${c.cx} V${QY - 8}" />`)
    s.push(`<path d="M${c.cx} ${QY + QH} V${AY - 10}" />`)
    s.push(`<path d="M${c.cx} ${AY + AH} V${EY - 40} H800 V${EY - 8}" class="dash" />`)
  }
  return `<svg width="1600" height="1000" viewBox="0 0 1600 1000" fill="none" class="fc__ln">
    <defs><marker id="ah" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 Z" fill="${INK}"/></marker></defs>
    ${s.join('').replace(/<path /g, '<path marker-end="url(#ah)" ')}</svg>`
}

export default {
  alt: 'A flowchart starting at No Icons button, splitting into three questions with violet icons (grey button, no button, opens but fails), each with its fix, all ending at bring your own icons',
  bg: `radial-gradient(${rgba(INK, 0.08)} 2px, transparent 2.5px) 0 0 / 34px 34px, linear-gradient(180deg, #FBF8F3, #F3EEE5)`,
  art: () => [
    at(lines(), { x: 0, y: 0 }),
    at(card(`${icon('search', 'duo', 44, D.text)}<b>No Icons button?</b>`, 'is-start'), { cx: 800, cy: 132 }),
    ...COLS.flatMap(c => [
      at(card(`<span class="fc__mk">${icon(c.ic, 'duo', 52, D.text)}</span><span>${c.q}</span>`, 'is-q'), { x: c.cx - W / 2, y: QY, w: W, h: QH }),
      at('<span class="fc__yes">yes</span>', { cx: c.cx + 44, cy: (QY + QH + AY) / 2 }),
      at(card(`<span>${c.a}</span>`, "is-a"), { x: c.cx - W / 2, y: AY, w: W, h: AH }),
    ]),
    at('<span class="fc__still">still stuck?</span>', { cx: 1040, cy: EY - 40 }),
    at(card(`${icon('shapes', 'solid', 52, '#fff')}<span>Bring your own SVG or PNG icons</span>`, 'is-end'), { cx: 800, cy: EY + 56 }),
  ].join(''),
  css: `
.fc__ln marker path { stroke: none; opacity: 1; }
.fc__ln { display: block; } .fc__ln path { stroke: ${INK}; stroke-width: 4; stroke-linejoin: round; opacity: .55; } .fc__ln path.dash { stroke-dasharray: 2 12; stroke-linecap: round; }
.fc__card { box-sizing: border-box; height: 100%; display: flex; align-items: center; gap: 18px; border-radius: 30px; font-family: var(--font-display); color: ${INK}; box-shadow: 0 2px 0 rgba(17,19,24,.04), 0 30px 60px -34px rgba(17,19,24,.5); }
.fc__card.is-start { padding: 22px 34px; background: ${INK}; color: #fff; } .fc__card.is-start b { font: 800 40px/1 var(--font-display); letter-spacing: -.02em; }
.fc__card.is-start .hk-icon { color: #fff !important; }
.fc__card.is-q { padding: 22px 28px; background: #fff; font: 700 32px/1.15 var(--font-display); letter-spacing: -.015em; border: 2px solid ${rgba(D.c, 0.18)}; }
.fc__mk { flex: none; width: 88px; height: 88px; border-radius: 26px; display: grid; place-items: center; background: ${D.soft}; }
.fc__card.is-a { padding: 24px 30px; background: ${D.soft}; font: 500 30px/1.25 var(--font-display); box-shadow: none; border: 2px solid ${rgba(D.c, 0.25)}; }
.fc__card.is-a b { color: ${D.text}; font-weight: 800; }
.fc__yes { padding: 6px 14px; border-radius: 999px; background: #fff; font: 700 28px/1 var(--font-display); color: ${D.text}; box-shadow: 0 6px 16px -8px rgba(17,19,24,.4); }
.fc__still { padding: 4px 14px; border-radius: 12px; background: #F6F2EA; font: 700 40px/1 var(--font-hand); color: #5A606D; }
.fc__card.is-end { padding: 24px 38px 24px 30px; background: ${O.c}; color: #fff; font: 800 38px/1 var(--font-display); letter-spacing: -.02em; white-space: nowrap; }
`,
}
