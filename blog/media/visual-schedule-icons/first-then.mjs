import { at, icon, C, rgba, INK } from '../../tools/hero-kit.mjs'

// A laminated First / Then board lying on a warm wooden classroom table: "First" holds a kawaii pencil card
// (Writing), "Then" a kawaii playground card (Playtime), an arrow between. The hook-and-loop dots show where a card
// sits a little askew and along a spare strip, and a "finished" envelope with a check waits at the side.
const O = C.solid.c, G = C.sketch.c
const BX = 110, BY = 140, BW = 1000, BH = 720
const dot = (x, y) => `<i class="velcro" style="left:${x}px;top:${y}px"></i>`
const card = (n, label, rot = 0) => `<div class="sc" style="rotate:${rot}deg">${icon(n, 'kawaii', 210)}<b>${label}</b></div>`
const slot = (title, tone, inner) => `<div class="slot"><span class="slot__t" style="background:${tone}">${title}</span><div class="slot__in">${dot(16, 18)}${inner}</div></div>`

export default {
  alt: 'A laminated First and Then board on a wooden table, with a kawaii pencil card labelled Writing under First, an arrow, a kawaii playground card labelled Playtime under Then, hook-and-loop dots showing, and a finished envelope with a check mark beside the board',
  bg: `repeating-linear-gradient(90deg, ${rgba('#7A4A22', 0.07)} 0 3px, transparent 3px 46px), repeating-linear-gradient(90deg, ${rgba('#FFFFFF', 0.06)} 0 8px, transparent 8px 133px), linear-gradient(170deg, #E3B57E 0%, #CF9A60 55%, #C18A52 100%)`,
  art: () => [
    at(`<div class="board">
      ${slot('First', O, card('pencil', 'Writing', -2))}
      <div class="arrow"><svg width="80" height="60" viewBox="0 0 80 60" fill="none"><path d="M6 30 H66 M46 10 L70 30 L46 50" stroke="${INK}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
      ${slot('Then', G, card('playground', 'Playtime', 3))}
      <div class="spare">${[0, 1, 2, 3].map(i => `<i class="velcro" style="position:relative"></i>`).join('')}<span>spare dots</span></div>
    </div>`, { x: BX, y: BY, w: BW, h: BH, rot: -1.5 }),
    at(`<div class="env"><div class="env__card">${icon('book-open', 'kawaii', 90)}</div><div class="env__front">${icon('check-circle', 'solid', 64, '#fff')}<b>Finished</b></div></div>`, { x: 1180, y: 300, rot: 4 }),
  ].join(''),
  css: `
.board { position: relative; box-sizing: border-box; height: 100%; padding: 48px 50px; border-radius: 40px; display: grid; grid-template-columns: 1fr 100px 1fr; grid-template-rows: 1fr auto; column-gap: 0; row-gap: 26px; align-items: center;
  background: linear-gradient(120deg, #FFFFFF 0%, #FAF7F1 40%, #FFFFFF 52%, #F7F3EC 100%); box-shadow: inset 0 0 0 3px rgba(255,255,255,.9), 0 2px 0 rgba(17,19,24,.05), 0 60px 90px -40px rgba(70,35,5,.75); }
.board::after { content: ''; position: absolute; inset: 14px; border-radius: 30px; background: linear-gradient(120deg, transparent 32%, rgba(255,255,255,.3) 42%, transparent 52%); pointer-events: none; }
.slot { display: flex; flex-direction: column; align-items: center; gap: 22px; }
.slot__t { padding: 12px 34px; border-radius: 999px; color: #fff; font: 800 48px/1 var(--font-display); letter-spacing: -.02em; }
.slot__in { position: relative; width: 360px; height: 420px; border-radius: 30px; border: 3px dashed ${rgba(INK, 0.18)}; display: grid; place-items: center; }
.slot__in > .velcro { position: absolute; }
.velcro { display: block; width: 58px; height: 58px; border-radius: 50%;
  background: radial-gradient(circle, #2E3038 1.2px, transparent 1.8px) 0 0 / 6px 6px, radial-gradient(circle, #4A4D57 1px, transparent 1.6px) 3px 3px / 6px 6px, #3A3C45; box-shadow: inset 0 2px 4px rgba(0,0,0,.4); }
.sc { position: relative; box-sizing: border-box; width: 300px; height: 360px; margin: 30px 0 0 40px; border-radius: 30px; background: #fff; border: 4px solid #F2E9DC; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 18px; box-shadow: 0 20px 30px -16px rgba(70,35,5,.45); }
.sc b { font: 800 46px/1 var(--font-display); color: ${INK}; letter-spacing: -.02em; }
.arrow { display: grid; place-items: center; padding-top: 70px; }
.spare { grid-column: 1 / -1; display: flex; align-items: center; justify-content: center; gap: 22px; }
.spare span { margin-left: 10px; font: 700 34px/1 var(--font-hand); color: #5A606D; }
.env { position: relative; width: 300px; height: 330px; filter: drop-shadow(0 24px 22px rgba(70,35,5,.45)); }
.env__card { position: absolute; left: 70px; top: 0; width: 160px; height: 190px; border-radius: 22px; background: #fff; border: 4px solid #F2E9DC; display: grid; place-items: center; rotate: -6deg; box-shadow: 0 10px 20px -12px rgba(0,0,0,.4); }
.env__front { position: absolute; left: 0; bottom: 0; width: 300px; height: 200px; box-sizing: border-box; padding-top: 52px; border-radius: 10px 10px 30px 30px; background: ${G}; display: flex; flex-direction: column; align-items: center; gap: 10px;
  clip-path: polygon(0 0, 50% 24%, 100% 0, 100% 100%, 0 100%); }
.env__front b { font: 800 40px/1 var(--font-display); color: #fff; letter-spacing: -.02em; }
`,
}
