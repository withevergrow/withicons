import { at, icon, INK } from '../../tools/hero-kit.mjs'
import { BEFORE, AFTER, bytes } from './_bell.mjs'
import { B, RED, GREEN, RED_SOFT, GREEN_SOFT, BG, LOOK_CSS } from './_look.mjs'

// Two code cards. Left: the bell as a design tool exports it, with the bloat (XML prolog, comment, metadata, empty
// groups, ids, long decimals) marked in soft red. Right: the same file after SVGO, viewBox, currentColor and short path
// data marked green. Byte badges are measured from the real files in _bell.mjs. Between them, both render identically.
const bad = s => `<mark class="is-bad">${s}</mark>`, good = s => `<mark class="is-good">${s}</mark>`
const BEFORE_LINES = [
  bad('&lt;?xml version="1.0" encoding=…?&gt;'),
  bad('&lt;!-- Generator: Design Tool… --&gt;'),
  `&lt;svg ${bad('version="1.1" id="Layer_1"')}`,
  `  ${bad('xmlns:xlink="http://www.w3…"')}`,
  `  ${bad('x="0px" y="0px"')}`,
  `  width="24${bad('px')}" height="24${bad('px')}"`,
  '  viewBox="0 0 24 24"',
  `  ${bad('style="enable-background:…"')}`,
  `  ${bad('xml:space="preserve"')}`,
  '  fill="none" stroke="currentColor"',
  `  stroke-width="1.75${bad('00000')}" …&gt;`,
  bad('&lt;metadata&gt;&lt;rdf:RDF&gt;…&lt;/metadata&gt;'),
  bad('&lt;g id="Group_12"&gt;&lt;/g&gt;'),
  `${bad('&lt;g id="Layer_2"&gt;')}`,
  ` &lt;path ${bad('id="Path_31"')}`,
  `  d="M6${bad('.0000000')},16.5${bad('000000')}…"/&gt;`,
  ` &lt;path ${bad('id="Path_32"')} d="…"/&gt;`,
  `${bad('&lt;/g&gt;')}&lt;/svg&gt;`,
]
const AFTER_LINES = [
  '&lt;svg xmlns="…/2000/svg"',
  '  width="24" height="24"',
  '  fill="none"',
  `  stroke="${good('currentColor')}"`,
  '  stroke-linecap="round"',
  '  stroke-linejoin="round"',
  '  stroke-width="1.75"',
  `  ${good('viewBox="0 0 24 24"')}&gt;`,
  ` &lt;path d="${good('M6 16.5V11a6 6 0 0 1')}`,
  `   ${good('12 0v5.5l1.5 2h-15Z')}"/&gt;`,
  ` &lt;path d="${good('M9.5 18.5a2.5 2.5 0')}`,
  `   ${good('0 0 5 0')}"/&gt;`,
  '&lt;/svg&gt;',
]
const card = (title, size, tone, lines, note = '') => `<div class="ok-card ba-card">
  <div class="ba-head"><b>${title}</b><span class="ba-size is-${tone}">${size}</span></div>
  <pre class="ba-code">${lines.join('\n')}</pre>${note}</div>`

export default {
  alt: 'Two code cards: on the left the bell icon SVG as a design tool exports it, 1,112 bytes, with its comment, metadata, empty groups, ids and long decimals marked red; on the right the same icon after SVGO, 281 bytes, and between them the two render identically',
  bg: BG,
  art: () => [
    at(card('Before', bytes(BEFORE), 'bad', BEFORE_LINES), { x: 64, y: 64, w: 640, h: 872 }),
    at(card('After SVGO', bytes(AFTER), 'ok', AFTER_LINES, `<div class="ba-note">one line in the real file</div>`), { x: 896, y: 64, w: 640, h: 872 }),
    at(`<div class="ba-mid">
      <span class="ba-tile">${icon('bell', 'line', 96, INK)}</span>
      <span class="ba-eq">=</span>
      <span class="ba-tile">${icon('bell', 'line', 96, INK)}</span>
      <span class="ba-same">same<br>pixels</span>
    </div>`, { cx: 800, cy: 500 }),
  ].join(''),
  css: `${LOOK_CSS}
.ba-card { padding: 30px 30px 28px; display: flex; flex-direction: column; }
.ba-head { display: flex; align-items: center; justify-content: space-between; padding-bottom: 20px; margin-bottom: 18px; border-bottom: 2px solid rgba(17,19,24,.07); }
.ba-head b { font: 800 42px/1 var(--font-display); letter-spacing: -.03em; }
.ba-size { font: 800 30px/1 var(--font-mono); letter-spacing: -.02em; padding: 12px 18px; border-radius: 999px; color: #fff; }
.ba-size.is-bad { background: ${RED}; } .ba-size.is-ok { background: ${GREEN}; }
.ba-code { margin: 0; font: 500 28px/1.36 var(--font-mono); white-space: pre; color: #3A3F4B; letter-spacing: -.035em; }
.ba-code mark { color: inherit; border-radius: 6px; padding: 0 2px; }
.ba-code mark.is-bad { background: ${RED_SOFT}; color: #B4232A; }
.ba-code mark.is-good { background: ${GREEN_SOFT}; color: #116A33; }
.ba-note { margin-top: auto; font: 600 36px/1 var(--font-hand); color: ${B.text}; }
.ba-mid { display: flex; flex-direction: column; align-items: center; gap: 14px; }
.ba-tile { width: 140px; height: 140px; border-radius: 36px; display: grid; place-items: center; background: #fff; box-shadow: 0 0 0 2px rgba(17,19,24,.06), 0 24px 40px -22px rgba(17,19,24,.55); }
.ba-eq { font: 800 60px/1 var(--font-display); color: ${B.c}; }
.ba-same { margin-top: 10px; font: 600 34px/1 var(--font-hand); color: ${B.text}; text-align: center; }
`,
}
