import { at, icon, INK } from '../../tools/hero-kit.mjs'
import { B, RED, GREEN, BG, LOOK_CSS, tofu } from './_look.mjs'

// The same app toolbar twice. Before (icon font failed): the word "home" and four tofu boxes. After (SVG icons): the
// with icons home, search, bell, settings and user icons in line style.
const TOOLS = [['search', 'F002'], ['bell', 'F0F3'], ['settings', 'F013'], ['user', 'F007']]
function bar(svg) {
  const home = svg ? icon('home', 'line', 52, INK) : '<span class="tq-word ba-word">home</span>'
  const btns = TOOLS.map(([n, hex]) => `<span class="tq-btn ba-btn">${svg ? icon(n, 'line', 52, INK) : tofu(hex, 72)}</span>`).join('')
  return `<div class="ba-bar${svg ? ' is-ok' : ''}"><span class="ba-nav">${home}<b>Home</b></span><i class="ba-sk"></i><i class="ba-sk" style="width:90px"></i><span class="ba-tools">${btns}</span></div>`
}

export default {
  alt: 'The same app toolbar twice: before, labelled Icon font failed, the word home and four empty tofu boxes; after an arrow, labelled SVG icons, crisp home, search, bell, settings and user line icons',
  bg: BG,
  art: () => [
    at(`<span class="tq-chip" style="background:${RED}">${icon('alert-triangle', 'line', 38, '#fff')}Icon font failed</span>`, { x: 120, y: 96 }),
    at(bar(false), { x: 96, y: 180, w: 1408 }),
    at(`<span class="ba-arrow">${icon('arrow-down', 'line', 56, '#fff')}</span>`, { cx: 800, cy: 500 }),
    at(`<span class="tq-chip" style="background:${GREEN}">${icon('check-circle', 'line', 38, '#fff')}SVG icons</span>`, { x: 120, y: 586 }),
    at(bar(true), { x: 96, y: 670, w: 1408 }),
  ].join(''),
  css: `${LOOK_CSS}
.ba-bar { box-sizing: border-box; display: flex; align-items: center; gap: 30px; height: 200px; padding: 0 44px; border-radius: 34px; background: #fff; box-shadow: 0 0 0 2px rgba(17,19,24,.06), 0 40px 70px -36px rgba(17,19,24,.45); }
.ba-bar.is-ok { box-shadow: 0 0 0 4px ${B.c}, 0 40px 70px -36px rgba(0,60,80,.45); }
.ba-nav { display: flex; align-items: center; gap: 18px; padding: 22px 30px; border-radius: 24px; background: ${B.soft}; }
.ba-nav b { font: 700 38px/1 var(--font-display); letter-spacing: -.02em; color: ${INK}; }
.ba-word { font-size: 40px; }
.ba-sk { display: block; width: 130px; height: 16px; border-radius: 8px; background: rgba(17,19,24,.1); }
.ba-tools { display: flex; gap: 22px; margin-left: auto; }
.ba-btn { width: 112px; height: 112px; }
.ba-arrow { display: grid; place-items: center; width: 100px; height: 100px; border-radius: 50%; background: ${INK}; box-shadow: 0 24px 40px -16px rgba(17,19,24,.5); }
`,
}
