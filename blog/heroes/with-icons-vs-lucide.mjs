import { at, tile, icon, C, INK } from '../tools/hero-kit.mjs'

// Editorial split: a flat cream field, the desk photo cropped into a tall arch on the right, and a dark shadcn/ui
// command menu (cmdk look) laid over the arch's edge, its results drawn in different with icons styles. A serif
// italic "the default" label on the left sets the question.
const vsp = name => at(`<span class="vsp"><i>vs</i>${name}</span>`, { x: 170, y: 130 })
const VSP_CSS = `
.vsp { display: inline-flex; align-items: center; gap: 14px; padding: 10px 28px 10px 10px; border-radius: 999px; background: ${C.line.c}; color: #fff; font: 800 34px/1 var(--font-display); letter-spacing: -.02em; white-space: nowrap; box-shadow: 0 0 0 6px rgba(255,255,255,.85), 0 30px 60px -18px rgba(17,19,24,.45); }
.vsp i { font-style: normal; width: 58px; height: 58px; border-radius: 50%; background: #fff; color: ${C.line.c}; display: grid; place-items: center; font-size: 28px; letter-spacing: -.04em; }`

const ROWS = [['home', 'line', 'Home'], ['rocket', 'clay', 'Launch'], ['bell', 'gloss', 'Alerts']]
const ON = 1
const AX = 1010, AW = 430, AT = 120, AB = 880 // arch box

export default {
  base: 'lucide0',
  alt: 'Editorial layout on cream: a white desk with a monitor cropped into a tall arch, overlapped by a dark shadcn-style command menu with with icons in line, clay and gloss styles, a serif the default label and a blue vs Lucide pill',
  photo: { filter: 'saturate(.9) brightness(.95)', pos: '50% 45%' },
  overlay: 'none',
  art: () => [
    at(`<div class="ed"><span>shadcn/ui’s</span><em>default</em></div>`, { x: 176, y: 250 }),
    at(`<div class="cmd">
      <div class="cmd__in">${icon('search', 'line', 34, '#A1A1AA')}<span class="t">Search icons</span><kbd>⌘K</kbd></div>
      <div class="cmd__list">${ROWS.map(([n, s, l], i) => `<div class="cmd__row${i === ON ? ' on' : ''}"><span class="cmd__ic">${icon(n, s, 64, s === 'line' ? '#FAFAFA' : undefined)}</span><b>${l}</b></div>`).join('')}</div>
    </div>`, { x: 720, y: 300, w: 560 }),
    tile('sparkles', 'sticker', { x: 1290, y: 180, size: 130, tone: 'card', rot: 8 }),
    vsp('Lucide'),
  ].join(''),
  css: `${VSP_CSS}
.stage { background: #F3EEE4; }
.stage__photo { clip-path: inset(${AT}px ${1600 - AX - AW}px ${1000 - AB}px ${AX}px round ${AW / 2}px ${AW / 2}px 28px 28px); }
.ed { display: grid; color: ${INK}; }
.ed span { font: 700 44px/1 var(--font-display); letter-spacing: -.02em; color: #5A606D; }
.ed em { font: italic 400 170px/.9 var(--font-serif); letter-spacing: -.03em; }
.cmd { border-radius: 30px; background: #09090B; border: 2px solid #27272A; box-shadow: 0 60px 120px -40px rgba(17,19,24,.75); color: #FAFAFA; font-family: var(--font-display); overflow: hidden; }
.cmd__in { display: flex; align-items: center; gap: 18px; padding: 26px 28px; border-bottom: 2px solid #27272A; font: 500 30px/1 var(--font-display); color: #71717A; }
.cmd__in .t { flex: 1; }
.cmd__in kbd { font: 600 22px/1 var(--font-mono); padding: 8px 12px; border-radius: 10px; background: #27272A; color: #A1A1AA; }
.cmd__list { padding: 14px; display: grid; gap: 6px; }
.cmd__row { display: flex; align-items: center; gap: 26px; padding: 14px 18px; border-radius: 20px; font-size: 36px; letter-spacing: -.02em; }
.cmd__row b { font-weight: 600; }
.cmd__row.on { background: #27272A; box-shadow: inset 0 0 0 2px ${C.line.c}; }
.cmd__ic { width: 84px; height: 84px; display: grid; place-items: center; border-radius: 22px; background: #18181B; }
`,
}
