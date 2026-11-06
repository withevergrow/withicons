import { at, icon, C, INK, PAPER, rgba } from '../tools/hero-kit.mjs'

// Treatment: a desk photo split down the middle. The left half is washed to paper: a printed HTML page (the server's
// output) with icons drawn as plain ink. The right half is darkened to a screen: a dark app window with one live
// search box glowing in blueprint cyan. A dashed cyan seam with a "use client" tab marks the boundary.
const B = C.blueprint
const CY = '#5BE4FF'
const SEAM = 800

export default {
  photoFile: 'icons-in-react-server-components-desk2.jpg',
  credit: { by: 'Mikhail Nilov', profile: 'https://www.pexels.com/@mikhail-nilov/', source: 'https://www.pexels.com/photo/laptop-notebook-office-pen-7594479/', license: 'Pexels License' },
  alt: 'A desk with a notebook and a laptop, split down the middle: the left half washed to paper holds a printed page of ink icons labelled Server, the right half darkened to a screen holds an app window with a glowing search box labelled Client, divided by a dashed use client line',
  photo: { filter: 'saturate(.8) brightness(.95)', pos: '50% 50%' },
  overlay: `linear-gradient(90deg, ${rgba(PAPER, 0.72)} 0 ${SEAM}px, ${rgba('#081019', 0.72)} ${SEAM}px 100%)`,
  art: () => [
    // the seam
    at(`<svg width="40" height="1000" viewBox="0 0 40 1000"><path d="M20 0V1000" stroke="${B.c}" stroke-width="6" stroke-dasharray="22 16" stroke-linecap="round"/></svg>`, { x: SEAM - 20, y: 0 }),
    at(`<span class="sc__tab">"use client"</span>`, { cx: SEAM, cy: 150, z: 4 }),
    // server: a printed sheet
    at(`<div class="sc__sheet">
      <span class="sc__hand">server</span>
      <div class="sc__row">${['home', 'search', 'bell', 'user'].map(n => `<span class="sc__ink">${icon(n, 'line', 64, INK)}</span>`).join('')}</div>
      <div class="sc__foot"><span><i class="sk" style="width:200px"></i><i class="sk" style="width:150px"></i></span><span class="sc__kb">0 KB icon JS</span></div>
    </div>`, { x: 190, y: 215, w: 500, rot: -3, z: 3 }),
    // client: a dark app window with a live search box
    at(`<div class="sc__screen">
      <div class="sc__bar"><i></i><i></i><i></i></div>
      <span class="sc__hand is-light">client</span>
      <div class="sc__search">${icon('search', 'line', 58, B.c)}<span>Search icons</span><b></b></div>
      <div class="sc__keys"><span>⌘</span><span>K</span></div>
    </div>`, { x: 900, y: 240, w: 520, rot: 2, z: 3 }),
  ].join(''),
  css: `
.stage__photo { transform: scaleX(-1); }
.sc__tab { display: inline-block; padding: 14px 26px; border-radius: 999px; background: ${B.c}; color: #fff; font: 700 32px/1 var(--font-mono); letter-spacing: -.03em; white-space: nowrap; box-shadow: 0 0 0 6px ${rgba('#ffffff', 0.85)}, 0 30px 50px -18px rgba(0,0,0,.6); }
.sc__sheet { position: relative; display: flex; flex-direction: column; gap: 22px; padding: 40px 44px 46px; border-radius: 26px; background: #fff; box-shadow: 0 2px 0 rgba(17,19,24,.04), 0 50px 90px -40px rgba(17,19,24,.55); background-image: repeating-linear-gradient(transparent 0 46px, ${rgba(B.c, 0.08)} 46px 48px); }
.sc__hand { font: 700 64px/1 var(--font-hand); color: ${B.text}; margin-bottom: 4px; }
.sc__hand.is-light { color: ${CY}; }
.sc__row { display: flex; gap: 22px; margin-bottom: 8px; }
.sc__ink { display: grid; place-items: center; width: 88px; height: 88px; border-radius: 24px; border: 2.5px solid ${rgba(INK, 0.14)}; }
.sk { display: block; height: 14px; border-radius: 8px; background: rgba(17,19,24,.12); }
.sc__foot { display: flex; align-items: center; justify-content: space-between; gap: 20px; } .sc__foot > span:first-child { display: flex; flex-direction: column; gap: 16px; }
.sc__kb { padding: 12px 22px; border-radius: 999px; background: ${INK}; color: #fff; font: 700 30px/1 var(--font-display); letter-spacing: -.02em; white-space: nowrap; rotate: -3deg; box-shadow: 0 24px 40px -18px rgba(17,19,24,.7); }
.sc__screen { display: flex; flex-direction: column; gap: 28px; padding: 26px 40px 48px; border-radius: 30px; background: #12161F; border: 1.5px solid ${rgba(CY, 0.35)}; box-shadow: 0 0 60px ${rgba(B.c, 0.35)}, 0 60px 100px -40px rgba(0,0,0,.9); }
.sc__bar { display: flex; gap: 10px; margin: 0 -14px 4px; } .sc__bar i { width: 14px; height: 14px; border-radius: 50%; background: #FF5F57; } .sc__bar i:nth-child(2) { background: #FEBC2E; } .sc__bar i:nth-child(3) { background: #28C840; }
.sc__search { display: flex; align-items: center; gap: 18px; padding: 20px 26px; border-radius: 22px; background: #fff; border: 3px solid ${CY}; box-shadow: 0 0 0 8px ${rgba(CY, 0.18)}, 0 0 50px ${rgba(CY, 0.5)}; font: 600 34px/1 var(--font-display); color: #5A606D; }
.sc__search b { width: 4px; height: 40px; background: ${B.c}; margin-left: -10px; }
.sc__keys { display: flex; gap: 12px; } .sc__keys span { display: grid; place-items: center; width: 64px; height: 64px; border-radius: 16px; background: #1F2533; color: #C9D2E3; font: 700 30px/1 var(--font-mono); box-shadow: inset 0 -4px 0 rgba(0,0,0,.4); }
`,
}
