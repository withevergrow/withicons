import { at, icon, C, INK, rgba } from '../tools/hero-kit.mjs'

// Bento grid over the blurred laptop photo: a small, polished set laid out like a Tailwind landing-page bento.
// One big clay rocket cell, an outline/solid pair, a dark utility-class cell, a strip of styles, two single icons.
const vsp = name => at(`<span class="vsp"><i>vs</i>${name}</span>`, { x: 170, y: 130 })
const VSP_CSS = `
.vsp { display: inline-flex; align-items: center; gap: 14px; padding: 10px 28px 10px 10px; border-radius: 999px; background: ${C.line.c}; color: #fff; font: 800 34px/1 var(--font-display); letter-spacing: -.02em; white-space: nowrap; box-shadow: 0 0 0 6px rgba(255,255,255,.85), 0 30px 60px -18px rgba(17,19,24,.55); }
.vsp i { font-style: normal; width: 58px; height: 58px; border-radius: 50%; background: #fff; color: ${C.line.c}; display: grid; place-items: center; font-size: 28px; letter-spacing: -.04em; }`

const X = 700, Y = 130, CW = 171, RH = 222, G = 18
// cell(col, row, colSpan, rowSpan, html, cls)
const cell = (c, r, cs, rs, html, cls = '') => at(`<div class="bc ${cls}">${html}</div>`, { x: X + c * (CW + G), y: Y + r * (RH + G), w: cs * CW + (cs - 1) * G, h: rs * RH + (rs - 1) * G })

export default {
  base: 'hero2',
  alt: 'A blurred laptop on a sunlit desk behind a bento grid of rounded tiles: a big clay rocket, outline and solid bells, a dark Tailwind size-6 class tile, a strip of four styles, a row of line icons and kawaii, sticker and anime icons, with a blue vs Heroicons pill',
  photo: { filter: 'blur(14px) saturate(1.1) brightness(.85)', scale: 1.08, pos: '60% 50%' },
  overlay: `linear-gradient(90deg, ${rgba('#2F5BFF', 0.18)} 0%, ${rgba('#111318', 0.25)} 100%)`,
  art: () => [
    cell(0, 0, 2, 2, icon('rocket', 'clay', 300), 'is-accent'),
    cell(2, 0, 1, 1, icon('bell', 'line', 96, INK)),
    cell(3, 0, 1, 1, icon('bell', 'solid', 96, INK)),
    cell(2, 1, 2, 1, `<div class="tw"><span>Tailwind</span><code>class="size-6"</code></div>`, 'is-ink'),
    cell(0, 2, 1, 1, icon('star', 'sticker', 110)),
    cell(1, 2, 2, 1, `<div class="strip">${[['heart', 'duo'], ['heart', 'luxe'], ['heart', 'retro'], ['heart', 'glass']].map(([n, s]) => icon(n, s, 74, s === 'duo' ? INK : undefined)).join('')}</div>`),
    cell(3, 2, 1, 1, icon('camera', 'kawaii', 110)),
    cell(-1, 0, 1, 1, icon('sparkles', 'anime', 104)),
    cell(-2, 1, 2, 1, `<div class="strip">${['home', 'search', 'user', 'settings'].map(n => icon(n, 'line', 62, INK)).join('')}</div>`),
    vsp('Heroicons'),
  ].join(''),
  css: `${VSP_CSS}
.bc { box-sizing: border-box; height: 100%; display: grid; place-items: center; border-radius: 34px; background: rgba(255,255,255,.92); box-shadow: 0 2px 0 rgba(17,19,24,.04), 0 40px 80px -36px rgba(17,19,24,.6); }
.bc.is-accent { background: linear-gradient(160deg, ${C.line.soft}, #fff); box-shadow: inset 0 0 0 3px ${C.line.c}, 0 40px 80px -36px rgba(17,19,24,.6); }
.bc.is-ink { background: ${INK}; color: #F4F0E8; }
.tw { display: grid; gap: 16px; padding: 0 34px; width: 100%; box-sizing: border-box; }
.tw span { font: 800 46px/1 var(--font-display); letter-spacing: -.03em; }
.tw code { font: 600 34px/1 var(--font-mono); color: #8FB0FF; }
.strip { display: flex; gap: 22px; align-items: center; }
`,
}
