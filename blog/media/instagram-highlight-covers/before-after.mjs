import { at, icon, C, INK, PAPER, rgba } from '../../tools/hero-kit.mjs'

// Two profile rows of the same five highlights. Before: random photo crops, five icon styles, odd sizes and offsets.
// After: the solid set, white on one orange, centred, one size.
const NAMES = ['Shop', 'Reviews', 'FAQ', 'Menu', 'Contact']
const D = 164, GAP = 74, X0 = 400
const BRAND = '#EE6A4C'
// "photos": soft painted scenes in CSS, plus an icon in a different style each time, off-centre and at odd sizes
const BEFORE = [
  { bg: 'linear-gradient(180deg, #8EC5FF 0%, #CFE8FF 55%, #6FAF5A 56%, #3F7F35 100%)', ic: ['shopping-bag', 'pixel', 70, 30, 38] },
  { bg: 'radial-gradient(circle at 30% 35%, #FFE08A 0 18%, transparent 19%), linear-gradient(135deg, #2B2140, #7A3D6B)', ic: ['star', 'sketch', 92, 58, 52, '#fff'] },
  { bg: '#F4F1EA', ic: ['help-circle', 'gloss', 128, 18, 22, '#3A8DFF'], txt: 'FAQ?' },
  { bg: 'linear-gradient(160deg, #C9783F, #6B3518)', ic: ['utensils', 'retro', 64, 74, 76] },
  { bg: 'repeating-linear-gradient(45deg, #FFB3C7 0 14px, #FFD9E3 14px 28px)', ic: ['mail', 'sticker', 104, 44, 12] },
]

const cx = i => X0 + D / 2 + i * (D + GAP)
function before(y) {
  return BEFORE.map((b, i) => {
    const [n, s, size, l, t, col] = b.ic
    const inner = `<div class="ba__c is-mess" style="background:${b.bg}">${at(icon(n, s, size, col), { x: l, y: t })}${b.txt ? `<i class="ba__txt">${b.txt}</i>` : ''}</div>`
    return at(`<div class="ba">${inner}<span>${NAMES[i]}</span></div>`, { x: cx(i) - 120, y, w: 240 })
  }).join('')
}
function after(y) {
  return ['shopping-bag', 'star', 'help-circle', 'utensils', 'mail'].map((n, i) =>
    at(`<div class="ba"><div class="ba__c is-clean">${icon(n, 'solid', 72, '#fff')}</div><span>${NAMES[i]}</span></div>`, { x: cx(i) - 120, y, w: 240 })).join('')
}
const tag = (text, y, tone) => at(`<span class="tg is-${tone}">${text}</span>`, { x: 96, y })

export default {
  alt: 'Two rows of five highlight circles named Shop, Reviews, FAQ, Menu and Contact: the before row mixes photo crops and five icon styles at odd sizes, the after row uses white solid icons on one orange, centred and the same size',
  bg: `linear-gradient(180deg, #F3EEE7 0 50%, #FFFFFF 50% 100%)`,
  art: () => [
    tag('Before', 194, 'before'), before(141),
    at('<div class="ba-line"></div>', { x: 96, y: 498, w: 1408, h: 4 }),
    tag('After', 694, 'after'), after(641),
  ].join(''),
  css: `
.ba { display: flex; flex-direction: column; align-items: center; gap: 22px; }
.ba > span { font: 600 32px/1 var(--font-display); color: ${INK}; letter-spacing: -.01em; }
.ba__c { position: relative; width: ${D}px; height: ${D}px; border-radius: 50%; overflow: hidden; display: grid; place-items: center; box-shadow: 0 0 0 6px #fff, 0 0 0 9px #D9D2C8, 0 30px 40px -24px rgba(17,19,24,.45); }
.ba__c.is-clean { background: ${BRAND}; }
.ba__txt { position: absolute; right: 16px; bottom: 30px; font: 800 30px/1 var(--font-hand); color: #D23A2A; rotate: -12deg; font-style: normal; }
.ba-line { width: 100%; height: 100%; border-radius: 2px; background: repeating-linear-gradient(90deg, #CFC6B9 0 16px, transparent 16px 28px); }
.tg { display: inline-block; padding: 12px 22px; border-radius: 999px; font: 800 36px/1 var(--font-display); letter-spacing: -.02em; }
.tg.is-before { background: #fff; color: #5A606D; box-shadow: inset 0 0 0 2px #D9D2C8; }
.tg.is-after { background: ${C.solid.c}; color: #fff; box-shadow: 0 16px 30px -16px ${rgba(C.solid.c, 0.8)}; }
`,
}
