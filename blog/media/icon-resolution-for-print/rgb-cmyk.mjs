import { at, icon, C, INK, PAPER, rgba } from '../../tools/hero-kit.mjs'

// Two panels. Left, a generic laptop in a dim room: the rocket glows electric blue on the screen ("RGB: light").
// Right, the same rocket printed on a paper card: a slightly deeper, flatter blue, with C M Y K ink dots in the corner.
const O = C.solid, SCREEN_BLUE = '#2D5BFF', INK_BLUE = '#2E4FC4'
const DOTS = [['#00A0E3', 0, 0], ['#E5007E', 1, 0], ['#FFED00', 0, 1], ['#1A1A1A', 1, 1]]

export default {
  bg: PAPER,
  alt: 'Two panels: a laptop screen in a dim room shows a rocket icon glowing in vivid electric blue, labelled RGB light, and a paper card shows the same rocket printed in a slightly deeper blue with cyan, magenta, yellow and black ink dots, labelled CMYK ink',
  art: () => [
    at(`<div class="rc is-dark">
      <div class="rc__lap"><div class="rc__scr"><div class="rc__glow"></div>${icon('rocket', 'solid', 230, SCREEN_BLUE)}</div><div class="rc__base"></div></div>
      <span class="rc__tag is-light">${icon('monitor', 'line', 36, '#fff')}RGB: light</span></div>`, { x: 64, y: 64, w: 716, h: 872 }),
    at(`<div class="rc is-paper">
      <div class="rc__card">${icon('rocket', 'solid', 230, INK_BLUE)}<div class="rc__dots">${DOTS.map(([c, x, y]) => `<i style="background:${c};left:${x * 34}px;top:${y * 34}px"></i>`).join('')}</div></div>
      <span class="rc__tag">${icon('printer', 'line', 36, INK)}CMYK: ink</span></div>`, { x: 820, y: 64, w: 716, h: 872 }),
  ].join(''),
  css: `
.rc { box-sizing: border-box; height: 100%; padding: 60px 40px 54px; border-radius: 36px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 110px; font-family: var(--font-display); box-shadow: 0 2px 0 rgba(17,19,24,.04), 0 40px 80px -44px rgba(17,19,24,.45); overflow: hidden; }
.rc.is-dark { background: radial-gradient(80% 60% at 50% 40%, #2A3150 0%, #141724 100%); }
.rc.is-paper { background: linear-gradient(160deg, #EFE6D6, #E2D5BF); }
.rc__lap { height: 400px; justify-content: center; display: flex; flex-direction: column; align-items: center; }
.rc__scr { position: relative; width: 520px; height: 340px; box-sizing: border-box; border: 16px solid #0B0C12; border-radius: 26px 26px 10px 10px; background: #0E1430; display: grid; place-items: center; overflow: hidden; box-shadow: 0 0 80px 10px ${rgba(SCREEN_BLUE, 0.35)}; }
.rc__scr .hk-icon { position: relative; filter: drop-shadow(0 0 16px ${rgba('#4F7BFF', 0.75)}); }
.rc__glow { position: absolute; inset: 0; background: radial-gradient(circle at 50% 50%, ${rgba(SCREEN_BLUE, 0.35)} 0%, transparent 60%); }
.rc__base { width: 620px; height: 26px; border-radius: 4px 4px 18px 18px; background: linear-gradient(#C9CCD6, #8D919E); }
.rc__card { position: relative; width: 460px; height: 400px; border-radius: 10px; background: #FBF8F1; display: grid; place-items: center; rotate: -3deg; box-shadow: 0 2px 0 rgba(0,0,0,.05), 0 40px 60px -30px rgba(60,40,10,.55); }
.rc__card .hk-icon { opacity: .96; }
.rc__dots { position: absolute; right: 30px; bottom: 30px; width: 62px; height: 62px; }
.rc__dots i { position: absolute; width: 26px; height: 26px; border-radius: 50%; mix-blend-mode: multiply; }
.rc__tag { display: inline-flex; align-items: center; gap: 14px; padding: 16px 30px 16px 22px; border-radius: 999px; background: #fff; color: ${INK}; font: 800 36px/1 var(--font-display); letter-spacing: -.02em; box-shadow: 0 16px 30px -18px rgba(17,19,24,.5); }
.rc__tag.is-light { background: ${SCREEN_BLUE}; color: #fff; }
`,
}
