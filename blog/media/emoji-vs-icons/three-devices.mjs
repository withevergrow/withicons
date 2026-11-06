import { at, icon, C, INK, PAPER, rgba } from '../../tools/hero-kit.mjs'
import { round, flat, gloss } from './_faces.mjs'

// Three generic devices show the same message. The smiley after "Launch day!" is drawn differently on each (three
// generic drawings, not vendor art); the duo rocket under the bubble is identical on all three.
const EMOJI = '#F5B400'
// screen boxes (stage px) and the frame drawn around each
const DEV = [
  { kind: 'phone', x: 110, y: 214, w: 310, h: 540, face: s => round(s, 'evd-r') },
  { kind: 'tablet', x: 500, y: 174, w: 450, h: 580, face: s => flat(s) },
  { kind: 'laptop', x: 1062, y: 390, w: 420, h: 320, face: s => gloss(s, 'evd-g') },
]
function frame(d) {
  if (d.kind === 'laptop') return at(`<div class="fr is-laptop"></div><div class="lap-base"></div>`, { x: d.x - 18, y: d.y - 18, w: d.w + 36, h: d.h + 36 })
  return at(`<div class="fr is-${d.kind}"></div>`, { x: d.x - 14, y: d.y - 14, w: d.w + 28, h: d.h + 28 })
}
function screen(d) {
  const cx = d.x + d.w / 2
  const lap = d.kind === 'laptop', by = lap ? d.y + 24 : d.y + d.h / 2 - 120
  return [
    at(`<div class="scr"></div>`, { x: d.x, y: d.y, w: d.w, h: d.h }),
    lap ? '' : at(`<div class="inc"><i></i><i></i></div>`, { x: d.x + 24, y: by - 74 }),
    at(`<div class="bub"><span>Launch day!</span><b class="ring is-emoji">${d.face(58)}</b></div>`, { cx, cy: by + 40 }),
    at(`<div class="ring is-icon"><div class="rk">${icon('rocket', 'duo', 64, C.duo.text)}</div></div>`, { cx, cy: by + (lap ? 180 : 190) }),
  ].join('')
}
const legend = (y, cls, text) => at(`<div class="lg"><i class="ring ${cls}"></i><span>${text}</span></div>`, { x: 150, y })

export default {
  alt: 'A phone, a tablet and a laptop each show a Launch day! chat bubble whose smiley is drawn three different ways, while the duo rocket icon below each bubble looks exactly the same on all three screens',
  bg: `radial-gradient(120% 100% at 50% 0%, #FFFFFF 0%, ${PAPER} 75%)`,
  art: () => [
    legend(84, 'is-emoji', '<b>Emoji:</b> redrawn by each device'),
    ...DEV.map(frame), ...DEV.map(screen),
    legend(856, 'is-icon', '<b>Icon:</b> the same everywhere'),
  ].join(''),
  css: `
.fr { width: 100%; height: 100%; box-sizing: border-box; background: #1E2027; box-shadow: 0 50px 80px -40px rgba(17,19,24,.55); }
.fr.is-phone { border-radius: 44px; } .fr.is-tablet { border-radius: 36px; } .fr.is-laptop { border-radius: 22px 22px 6px 6px; }
.lap-base { position: absolute; left: -46px; right: -46px; bottom: -26px; height: 26px; border-radius: 4px 4px 22px 22px; background: linear-gradient(#D9DCE3, #B9BDC7); box-shadow: 0 30px 40px -20px rgba(17,19,24,.5); }
.inc { padding: 16px 20px; border-radius: 22px 22px 22px 6px; background: #E2E4EB; display: flex; flex-direction: column; gap: 9px; }
.inc i { display: block; width: 130px; height: 10px; border-radius: 5px; background: #C5C9D3; } .inc i + i { width: 86px; }
.scr { width: 100%; height: 100%; border-radius: 30px; background: #F1F2F6; }
.fr.is-laptop + .lap-base { }
.bub { display: flex; align-items: center; justify-content: center; gap: 10px; padding: 14px 16px 14px 20px; border-radius: 26px 26px 26px 8px; background: #fff; box-shadow: 0 10px 24px -14px rgba(17,19,24,.4); font: 700 30px/1 var(--font-display); color: ${INK}; white-space: nowrap; }
.bub .ring svg { display: block; }
.ring { flex: none; display: grid; place-items: center; border-radius: 50%; line-height: 0; }
.bub .ring { padding: 6px; box-shadow: 0 0 0 4px ${EMOJI}; }
.ring.is-icon { padding: 12px; border-radius: 34px; box-shadow: 0 0 0 4px ${C.duo.c}; }
.rk { width: 100px; height: 100px; border-radius: 26px; background: ${C.duo.soft}; display: grid; place-items: center; }
.lg { display: flex; align-items: center; gap: 18px; font: 500 38px/1 var(--font-display); color: ${INK}; letter-spacing: -.01em; }
.lg b { font-weight: 800; }
.lg i.ring { width: 34px; height: 34px; box-sizing: border-box; border: 5px solid; border-radius: 50%; }
.lg i.ring.is-emoji { border-color: ${EMOJI}; } .lg i.ring.is-icon { border-color: ${C.duo.c}; border-radius: 10px; box-shadow: none; padding: 0; }
`,
}
