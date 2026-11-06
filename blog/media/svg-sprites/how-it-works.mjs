import { at, win, icon, C, INK, rgba } from '../../tools/hero-kit.mjs'

// Left, the sprite file as a tall card: four <symbol>s, each a real line icon with its id. Right, a web page whose
// sidebar shows the same four icons; a cyan arrow runs from each back to its symbol, and a callout spells out the
// use element for the bell. Blueprint cyan (code) accent on the post's dotted paper.
const B = C.blueprint
const ROWS = [['home', 300], ['search', 455], ['bell', 610], ['settings', 765]]
const CARD = { x: 64, y: 64, w: 524, h: 872 }, SIDE_CX = 830
const sym = ([n]) => `<div class="hw-row"><span class="hw-tile">${icon(n, 'line', 58, INK)}</span><div><s>&lt;symbol</s><b>id="with-${n}"</b></div></div>`
const arrows = () => `<svg width="1600" height="1000" viewBox="0 0 1600 1000" fill="none">
  ${ROWS.map(([, y]) => `<path d="M${SIDE_CX - 58} ${y} H${CARD.x + CARD.w + 26}" stroke="${B.c}" stroke-width="5" stroke-linecap="round"/>
  <path d="M${CARD.x + CARD.w + 40} ${y - 14} L${CARD.x + CARD.w + 18} ${y} L${CARD.x + CARD.w + 40} ${y + 14}" stroke="${B.c}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="${SIDE_CX - 58}" cy="${y}" r="8" fill="${B.c}"/>`).join('')}
</svg>`

export default {
  alt: 'A tall card labelled sprite-line.svg listing four symbols, home, search, bell and settings, with their ids, and cyan arrows from the matching icons in a web page sidebar back to each symbol, with a callout reading use href #with-bell',
  bg: `radial-gradient(${rgba(INK, 0.1)} 2px, transparent 2.5px) 0 0 / 36px 36px, linear-gradient(180deg, #FBF8F3, #F3EEE4)`,
  art: () => [
    at(`<div class="hw-card"><div class="hw-head">${icon('file', 'blueprint', 40, B.c)}<span>sprite-line.svg</span></div>${ROWS.map(sym).join('')}<div class="hw-end">&lt;/svg&gt;</div></div>`, CARD),
    win(null, `<div class="hw-page"><div class="hw-side"></div><div class="hw-main">
        <div class="hw-top"><i class="sk" style="width:220px"></i><span class="hw-av"></span></div>
        <div class="hw-blk"><i class="sk" style="width:300px"></i><i class="sk sk--t" style="width:420px"></i><i class="sk sk--t" style="width:360px"></i></div>
      </div></div>`, { x: 740, y: 120, w: 796, h: 800, tone: 'card', url: 'my-site.com' }),
    arrows(),
    ...ROWS.map(([n, y]) => at(`<span class="hw-ic${n === 'bell' ? ' is-on' : ''}">${icon(n, 'line', 50, n === 'bell' ? '#fff' : INK)}</span>`, { cx: SIDE_CX, cy: y })),
    at(`<div class="hw-call"><code>&lt;use href="<em>#with-bell</em>"/&gt;</code></div>`, { x: 920, y: 578 }),
    at(`<div class="hw-note">one file, drawn once,<br>shown many times</div>`, { x: 920, y: 800 }),
  ].join(''),
  css: `
.hw-card { box-sizing: border-box; height: 100%; padding: 34px 34px 30px; border-radius: 36px; background: #15171E; color: #F4F0E8; box-shadow: 0 50px 100px -40px rgba(17,19,24,.6); position: relative; }
.hw-head { display: flex; align-items: center; gap: 14px; padding-bottom: 24px; border-bottom: 2px solid rgba(255,255,255,.1); }
.hw-head span { font: 700 32px/1 var(--font-mono); letter-spacing: -.02em; }
.hw-row { position: absolute; left: 34px; right: 34px; display: flex; align-items: center; gap: 22px; height: 120px; }
${ROWS.map(([, y], i) => `.hw-row:nth-of-type(${i + 2}) { top: ${y - CARD.y - 60}px; }`).join('\n')}
.hw-tile { flex: none; width: 100px; height: 100px; border-radius: 28px; display: grid; place-items: center; background: ${B.soft}; }
.hw-row div { display: flex; flex-direction: column; gap: 8px; font: 600 28px/1.1 var(--font-mono); }
.hw-row s { text-decoration: none; opacity: .55; } .hw-row b { color: #5FD3EA; font-weight: 700; }
.hw-end { position: absolute; left: 34px; bottom: 30px; font: 600 28px/1 var(--font-mono); opacity: .55; }
.hw-page { position: absolute; inset: 0; display: flex; }
.hw-side { width: 180px; background: #F6F3EC; border-right: 1.5px solid rgba(17,19,24,.07); }
.hw-main { flex: 1; padding: 36px 40px; display: flex; flex-direction: column; gap: 30px; }
.hw-top { display: flex; align-items: center; justify-content: space-between; }
.hw-av { width: 52px; height: 52px; border-radius: 50%; background: ${B.soft}; }
.hw-blk { display: flex; flex-direction: column; gap: 16px; padding: 28px; border-radius: 22px; background: #F7F5F0; }
.hw-ic { width: 96px; height: 96px; border-radius: 26px; display: grid; place-items: center; background: #fff; box-shadow: 0 0 0 2px rgba(17,19,24,.07), 0 14px 26px -14px rgba(17,19,24,.4); }
.hw-ic.is-on { background: ${B.c}; }
.hw-call { position: relative; padding: 18px 26px; border-radius: 20px; background: #15171E; box-shadow: 0 24px 40px -20px rgba(17,19,24,.6); }
.hw-call::before { content: ''; position: absolute; left: -12px; top: 50%; translate: 0 -50%; border: 12px solid transparent; border-left: 0; border-right-color: #15171E; }
.hw-call code { font: 600 30px/1 var(--font-mono); color: #F4F0E8; white-space: nowrap; } .hw-call em { font-style: normal; color: #5FD3EA; }
.hw-note { font: 600 36px/1.1 var(--font-hand); color: ${B.text}; }
.sk { display: block; height: 16px; border-radius: 8px; background: rgba(17,19,24,.13); } .sk--t { height: 12px; background: rgba(17,19,24,.08); }
`,
}
