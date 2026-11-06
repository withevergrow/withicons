import { at, icon, chip, C, INK, PAPER } from '../../tools/hero-kit.mjs'

// Four transparent canvases drawn to one scale (0.82 stage px per image px), bottoms on one line, the same kawaii
// rocket centred in each; under each its app, its size and its file limit (from the post's table).
const K = 0.82, BASE = 610
const CANVASES = [
  { px: 128, name: 'Slack and<br>Discord emoji', limit: '128 KB / 256 KB' },
  { px: 280, name: 'Notion<br>page icon', limit: 'Not stated' },
  { px: 320, name: 'Discord<br>sticker', limit: '512 KB' },
  { px: 512, name: 'WhatsApp sticker<br>(sticker apps)', limit: '100 KB', margin: 16 },
]
let x = 160
const BOXES = CANVASES.map(c => { const w = Math.round(c.px * K), b = { ...c, w, x }; x += w + 107; return b })

function canvas(b) {
  const m = b.margin ? `<i class="cv__m" style="inset:${Math.round(b.margin * K)}px"></i><span class="cv__ml">${b.margin} px margin</span>` : ''
  return at(`<div class="cv" style="width:${b.w}px;height:${b.w}px">${m}${icon('rocket', 'kawaii', Math.round(b.w * 0.62))}</div>`, { x: b.x, y: BASE - b.w })
}
function label(b) {
  const w = Math.max(b.w + 112, 260)
  return at(`<div class="lb"><b>${b.name}</b><code>${b.px} x ${b.px}</code><span>${b.limit}</span></div>`, { x: b.x + b.w / 2 - w / 2, y: BASE + 30, w })
}

export default {
  alt: 'Four transparent checkerboard canvases drawn to scale with the same kawaii rocket icon: 128 px for Slack and Discord emoji, 280 px for a Notion page icon, 320 px for a Discord sticker and 512 px with a 16 px margin for a WhatsApp sticker, each with its file limit',
  bg: `radial-gradient(130% 100% at 50% 0%, #FFFFFF 0%, ${PAPER} 70%)`,
  art: () => [
    chip('Drawn to scale', { x: 100, y: 84, tone: 'soft', style: 'solid', size: 30, icon: ['ruler', 'solid'] }),
    at('<i class="base"></i>', { x: 80, y: BASE, w: 1440, h: 3 }),
    ...BOXES.map(canvas), ...BOXES.map(label),
  ].join(''),
  css: `
.cv { position: relative; display: grid; place-items: center; border-radius: 6px; box-shadow: 0 0 0 2px #D8D1C6, 0 30px 50px -30px rgba(17,19,24,.4);
  background: repeating-conic-gradient(#EFEAE2 0 25%, #FFFFFF 0 50%) 0 0 / 22px 22px; }
.cv__m { position: absolute; border: 3px dotted ${C.solid.c}; border-radius: 2px; }
.cv__ml { position: absolute; left: 26px; top: 24px; font: 700 28px/1 var(--font-mono); color: ${C.solid.text}; }
.base { display: block; width: 100%; height: 100%; background: #CFC6B9; border-radius: 2px; }
.lb { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 10px; font-family: var(--font-display); color: ${INK}; }
.lb b { font-size: 30px; font-weight: 800; line-height: 1.08; letter-spacing: -.02em; }
.lb code { font: 600 28px/1 var(--font-mono); color: #5A606D; }
.lb span { display: inline-block; padding: 7px 14px; border-radius: 999px; background: ${C.solid.soft}; color: ${C.solid.text}; font: 700 28px/1 var(--font-display); white-space: nowrap; }
`,
}
