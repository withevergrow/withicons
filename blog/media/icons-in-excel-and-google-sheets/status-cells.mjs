import { at, icon, C, INK, rgba } from '../../tools/hero-kit.mjs'

// In-post: the same five-row task tracker twice. Left: a built-in icon set (three traffic-light dots). Right: real
// solid icons placed in the Status cells, one shape and colour per status. Generic grid, no app branding.
const O = C.solid
const GREEN = '#1F9D55', AMBER = '#E89A00', RED = '#E5484D', GREY = '#8A8F9A'
const ROWS = [
  ['Write brief', 'AK', 'done'],
  ['Design icons', 'JM', 'doing'],
  ['Review copy', 'RS', 'blocked'],
  ['Print flyers', 'LT', 'dropped'],
  ['Launch', 'AK', 'doing'],
]
const DOT = { done: GREEN, doing: AMBER, blocked: RED, dropped: RED }
const ICON = { done: ['check-circle', GREEN], doing: ['clock', AMBER], blocked: ['alert-triangle', RED], dropped: ['x-circle', GREY] }
const AV = { AK: '#FFD7C9', JM: '#D9F3F8', RS: '#ECE6FF', LT: '#FFF1BF' }

function sheet(kind) {
  const body = ROWS.map(([t, o, s]) => `<div class="sc__tr"><span>${t}</span><span><i class="sc__av" style="background:${AV[o]}">${o}</i></span><span>${kind === 'set' ? `<i class="sc__dot" style="background:${DOT[s]}"></i>` : icon(ICON[s][0], 'solid', 50, ICON[s][1])}</span></div>`).join('')
  return `<div class="sc"><div class="sc__tr is-th"><span>Task</span><span>Owner</span><span>Status</span></div>${body}</div>`
}
const panel = (title, sub, kind, good) => `<div class="sc__panel${good ? ' is-good' : ''}"><div class="sc__head"><b>${title}</b><span>${sub}</span></div>${sheet(kind)}</div>`

export default {
  alt: 'Two copies of a five-row task tracker: on the left the Status column shows plain traffic-light dots, on the right it shows a green tick, amber clock, red warning and grey cross icon',
  bg: `radial-gradient(${rgba(INK, 0.08)} 2px, transparent 2.5px) 0 0 / 34px 34px, linear-gradient(180deg, #FBF8F3, #F3EEE5)`,
  art: () => [
    at(panel('Built-in icon set', 'three colours, fixed shapes', 'set'), { x: 80, y: 116, w: 700 }),
    at(panel('Your own icons', 'any shape, any colour', 'own', true), { x: 820, y: 116, w: 700 }),
  ].join(''),
  css: `
.sc__panel { box-sizing: border-box; border-radius: 34px; background: #fff; padding: 30px 30px 34px; box-shadow: 0 2px 0 rgba(17,19,24,.04), 0 40px 80px -40px rgba(17,19,24,.45); border: 2px solid rgba(17,19,24,.06); }
.sc__panel.is-good { box-shadow: 0 0 0 5px ${O.c}, 0 40px 80px -40px rgba(17,19,24,.45); }
.sc__head { display: flex; flex-direction: column; gap: 8px; margin: 4px 6px 24px; }
.sc__head b { font: 800 42px/1 var(--font-display); letter-spacing: -.03em; color: ${INK}; }
.sc__panel.is-good .sc__head b { color: ${O.text}; }
.sc__head span { font: 500 28px/1 var(--font-display); color: #5A606D; }
.sc { border: 2px solid rgba(17,19,24,.14); border-radius: 14px; overflow: hidden; }
.sc__tr { display: grid; grid-template-columns: 1fr 150px 150px; height: 96px; border-top: 2px solid rgba(17,19,24,.1); }
.sc__tr:first-child { border-top: 0; }
.sc__tr > span { display: flex; align-items: center; padding: 0 22px; font: 600 31px/1 var(--font-display); color: ${INK}; border-left: 2px solid rgba(17,19,24,.1); }
.sc__tr > span:first-child { border-left: 0; }
.sc__tr > span:nth-child(n+2) { justify-content: center; padding: 0; }
.sc__tr.is-th { height: 70px; background: #F3F1EC; }
.sc__tr.is-th > span { font: 800 28px/1 var(--font-display); color: #5A606D; }
.sc__av { width: 54px; height: 54px; border-radius: 50%; display: grid; place-items: center; font: 700 22px/1 var(--font-display); font-style: normal; color: ${INK}; }
.sc__dot { width: 30px; height: 30px; border-radius: 50%; box-shadow: inset 0 -3px 0 rgba(0,0,0,.12); }
`,
}
