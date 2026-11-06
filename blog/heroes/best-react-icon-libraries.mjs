import { at, chip, icon, C, rgba } from '../tools/hero-kit.mjs'

// Treatment: dark IDE with neon glow. One wide editor (file tree, App.jsx, live preview pane) floating over the code
// photo pushed far back; chrome and liquid rockets glow in the preview. Blue (comparisons) accent.
const B = C.line, NEON = '#6E8BFF'
const tree = [['folder-open', 70, 0], ['file-code', 96, 1, 'App.jsx'], ['file-code', 80, 1], ['file-json', 104, 1], ['folder', 64, 0]]
  .map(([n, w, ind, label]) => `<div class="ide__f${label ? ' is-on' : ''}" style="padding-left:${14 + ind * 22}px">${icon(n, 'line', 24, label ? NEON : '#7C8396')}${label ? `<b>${label}</b>` : `<i style="width:${w}px"></i>`}</div>`).join('')
const lines = [
  '<s>import</s> { Rocket } <s>from</s>',
  '  <em>\'@withicons/react\'</em>',
  '',
  '&lt;Rocket style=<u>"chrome"</u> /&gt;',
  '&lt;Rocket style=<u>"liquid"</u> /&gt;',
].map((l, i) => `<span class="ide__ln">${i + 1}</span>${l}`).join('\n')

export default {
  base: 'hero1',
  alt: 'A laptop full of code, blurred far behind a dark code editor with a neon blue glow: a file tree, an App.jsx file importing with icons for React, and a preview pane showing a chrome rocket and a liquid rocket',
  photo: { filter: 'blur(5px) saturate(1.2) brightness(.42)', pos: '50% 50%', scale: 1.08 },
  overlay: `radial-gradient(55% 60% at 60% 40%, ${rgba(B.c, 0.35)} 0%, ${rgba('#05070F', 0.2)} 60%, ${rgba('#05070F', 0.75)} 100%)`,
  art: () => [
    at(`<div class="ide">
      <div class="ide__bar"><i></i><i></i><i></i><span class="ide__tab">${icon('file-code', 'line', 22, NEON)}App.jsx</span></div>
      <div class="ide__body">
        <div class="ide__tree">${tree}</div>
        <pre class="ide__code">${lines}</pre>
        <div class="ide__prev">
          <span class="ide__glow">${icon('rocket', 'chrome', 150)}</span>
          <span class="ide__glow">${icon('rocket', 'liquid', 150)}</span>
        </div>
      </div>
    </div>`, { x: 175, y: 135, w: 1255 }),
    chip('React', { x: 900, y: 655, tone: 'color', style: 'line', icon: ['code-xml', 'line'], size: 40, rot: -3, cls: 'rx-neon' }),
    chip('Next.js ready', { x: 1120, y: 690, tone: 'ink', icon: ['check-circle', 'line'], size: 30, rot: 3 }),
  ].join(''),
  css: `
.rx-neon .hk-chip { box-shadow: 0 0 40px ${rgba(NEON, 0.7)}; }
.ide { border-radius: 28px; overflow: hidden; background: #0D1019; border: 2px solid ${rgba(NEON, 0.55)}; box-shadow: 0 0 0 1px ${rgba(NEON, 0.2)}, 0 0 60px ${rgba(NEON, 0.45)}, 0 0 160px ${rgba(B.c, 0.35)}, 0 60px 120px -40px #000; font-family: var(--font-display); color: #E8EAF4; }
.ide__bar { display: flex; align-items: center; gap: 10px; padding: 14px 22px; background: #141826; border-bottom: 1.5px solid rgba(255,255,255,.06); }
.ide__bar > i { width: 14px; height: 14px; border-radius: 50%; background: #FF5F57; } .ide__bar > i:nth-child(2) { background: #FEBC2E; } .ide__bar > i:nth-child(3) { background: #28C840; }
.ide__tab { display: flex; align-items: center; gap: 10px; margin-left: 22px; padding: 8px 16px; border-radius: 10px; background: #0D1019; font: 600 20px/1 var(--font-mono); color: #C9D2FF; }
.ide__body { display: grid; grid-template-columns: 220px 1fr 330px; min-height: 380px; }
.ide__tree { padding: 18px 10px; background: #10131E; border-right: 1.5px solid rgba(255,255,255,.05); display: flex; flex-direction: column; gap: 4px; }
.ide__f { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 10px; }
.ide__f i { display: block; height: 10px; border-radius: 6px; background: rgba(255,255,255,.12); }
.ide__f.is-on { background: ${rgba(NEON, 0.16)}; } .ide__f b { font: 600 19px/1 var(--font-mono); color: #C9D2FF; }
.ide__code { margin: 0; padding: 30px 26px; font: 500 29px/1.6 var(--font-mono); white-space: pre; color: #E8EAF4; }
.ide__code s { text-decoration: none; color: #C792EA; } .ide__code em { font-style: normal; color: #9DE3B0; } .ide__code u { text-decoration: none; color: #8FB0FF; text-shadow: 0 0 14px ${rgba(NEON, 0.9)}; }
.ide__ln { display: inline-block; width: 40px; color: rgba(255,255,255,.22); }
.ide__prev { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; background: radial-gradient(80% 70% at 50% 50%, ${rgba(NEON, 0.28)}, transparent 70%), #0A0C14; border-left: 1.5px solid rgba(255,255,255,.05); }
.ide__glow { line-height: 0; filter: drop-shadow(0 0 22px ${rgba(NEON, 0.8)}); }
`,
}
