import { at, chip, icon, C, INK, rgba } from '../../tools/hero-kit.mjs'

// In-post: one 16:9 slide with three solid icons at three sizes (a bullet icon, one of a row of three, a half-slide
// hero), each with a measuring bracket and the PNG size to download for it.
const O = C.solid
const SX = 180, SY = 96, SW = 1240, SH = 698
const bar = (x, y, w, h = 16, o = 0.13) => at(`<i class="sg__bar" style="background:rgba(17,19,24,${o})"></i>`, { x, y, w, h })
const bracket = (x, y, w, above) => at(`<i class="sg__br${above ? ' is-above' : ''}"></i>`, { x, y, w, h: 22 })
const tag = (text, x, y) => chip(text, { x, y, tone: 'color', style: 'solid', size: 30 })

export default {
  alt: 'A white 16:9 slide with an orange lightbulb icon by a bullet, a rocket in a row of three and a big target, each measured and labelled 256-512 px, 1024 px and 2048 px',
  bg: `radial-gradient(${rgba(INK, 0.09)} 2px, transparent 2.5px) 0 0 / 34px 34px, linear-gradient(180deg, #FBF8F3, #F3EEE5)`,
  art: () => [
    at('<div class="sg__slide"></div>', { x: SX, y: SY, w: SW, h: SH }),
    at('<b class="sg__h">Launch plan</b>', { x: 240, y: 140 }),
    // small: a bullet icon
    at(icon('lightbulb', 'solid', 64, O.c), { x: 240, y: 232 }),
    bar(330, 246, 300, 18, 0.5), bar(330, 276, 220),
    bracket(240, 306, 64), tag('256-512 px', 322, 300),
    // medium: one of a row of three
    at(icon('rocket', 'solid', 140, O.c), { x: 240, y: 420 }),
    at(icon('users', 'solid', 140, O.c), { x: 420, y: 420 }),
    at(icon('chart-bar', 'solid', 140, O.c), { x: 600, y: 420 }),
    bar(250, 580, 120, 14, 0.4), bar(430, 580, 120, 14, 0.4), bar(610, 580, 120, 14, 0.4),
    bracket(240, 618, 140), tag('1024 px', 230, 654),
    // large: half the slide
    at(icon('target', 'solid', 500, O.c), { x: 850, y: 236 }),
    bracket(880, 198, 440, true), tag('2048 px', 1030, 134),
    // the rule of thumb
    at(`<span class="sg__note">${icon('sparkles', 'solid', 36, INK)}double the on-screen width</span>`, { x: 760, y: 836, rot: -1.5 }),
  ].join(''),
  css: `
.sg__slide { height: 100%; border-radius: 22px; background: #fff; box-shadow: 0 0 0 14px #E7E3DC, 0 0 0 16px rgba(17,19,24,.06), 0 50px 90px -40px rgba(17,19,24,.5); }
.sg__br.is-above { border-top: 4px solid ${INK}; border-bottom: 0; border-radius: 6px 6px 0 0; }
.sg__h { font: 800 48px/1 var(--font-display); letter-spacing: -.03em; color: ${INK}; }
.sg__bar { display: block; height: 100%; border-radius: 9px; }
.sg__br { display: block; height: 100%; box-sizing: border-box; border: 4px solid ${INK}; border-top: 0; border-radius: 0 0 6px 6px; opacity: .75; }
.sg__note { display: inline-flex; align-items: center; gap: 12px; padding: 18px 28px; border-radius: 20px; background: #FFD23F; font: 700 40px/1 var(--font-hand); color: ${INK}; box-shadow: 0 24px 40px -22px rgba(17,19,24,.6); font-size: 46px; }
`,
}
