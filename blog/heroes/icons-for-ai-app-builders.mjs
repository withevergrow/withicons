import { at, chip, icon, C, INK, rgba } from '../tools/hero-kit.mjs'

// Treatment: aurora gradient mesh with glass. The circuit-board photo sinks into a pink / violet / teal aurora; a glass
// prompt bar asks for icons, and real gloss icons pop out of it in a fan of glass tiles. The builders float as chips.
// Pink (ai) accent.
const P = C.gloss
const fan = [['home', -14, 0], ['bell', -5, -24], ['settings', 5, -24], ['wallet', 14, 0]]
  .map(([n, r, dy], i) => at(`<span class="au__tile">${icon(n, 'gloss', 112, P.c)}</span>`, { x: 690 + i * 180, y: 380 + dy, rot: r })).join('')

export default {
  base: 'ai3',
  alt: 'A teal circuit board with big 3D letters Ai, sunk into a pink and violet aurora, with a glass prompt bar asking for app icons and four pink gloss icons fanning out of it on glass tiles, plus Lovable, v0, Bolt and Cursor chips',
  photo: { filter: 'blur(3px) saturate(1.1) brightness(.8)', pos: '50% 50%' },
  overlay: `radial-gradient(45% 55% at 78% 30%, ${rgba(P.c, 0.75)} 0%, transparent 70%), radial-gradient(40% 50% at 55% 85%, ${rgba('#7252FF', 0.7)} 0%, transparent 70%), radial-gradient(35% 45% at 20% 20%, ${rgba('#14C8B4', 0.45)} 0%, transparent 70%), linear-gradient(180deg, ${rgba('#120A2A', 0.35)}, ${rgba('#120A2A', 0.55)})`,
  art: () => [
    at(`<div class="au__prompt">${icon('sparkles', 'gloss', 46, '#fff')}<em>add icons to my app</em><b>${icon('send-horizontal', 'solid', 30, P.c)}</b></div>`, { x: 690, y: 160 }),
    fan,
    chip('Lovable', { x: 760, y: 640, tone: 'color', style: 'gloss', size: 34, rot: -5 }),
    chip('v0', { x: 990, y: 680, tone: 'card', size: 34, rot: 4 }),
    chip('Bolt', { x: 1110, y: 620, tone: 'card', size: 34, rot: -3 }),
    chip('Cursor', { x: 1250, y: 700, tone: 'ink', size: 34, rot: 5 }),
  ].join(''),
  css: `
.au__prompt { display: flex; align-items: center; gap: 20px; width: 700px; box-sizing: border-box; padding: 22px 22px 22px 30px; border-radius: 999px; background: rgba(255,255,255,.18); border: 2px solid rgba(255,255,255,.55); backdrop-filter: blur(22px) saturate(1.4); box-shadow: 0 30px 70px -30px rgba(10,0,40,.8), inset 0 1px 0 rgba(255,255,255,.6); color: #fff; font: 700 40px/1 var(--font-display); letter-spacing: -.02em; }
.au__prompt em { flex: 1; font-style: normal; white-space: nowrap; }
.au__prompt b { width: 72px; height: 72px; border-radius: 50%; background: #fff; display: grid; place-items: center; }
.au__tile { width: 160px; height: 160px; border-radius: 44px; display: grid; place-items: center; background: rgba(255,255,255,.72); border: 2px solid rgba(255,255,255,.85); backdrop-filter: blur(16px); box-shadow: 0 40px 70px -30px rgba(40,0,60,.8); }
`,
}
