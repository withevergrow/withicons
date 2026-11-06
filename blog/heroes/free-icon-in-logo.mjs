import { at, icon, C, rgba, INK } from '../tools/hero-kit.mjs'

// A real blank shop sign hanging from a facade becomes "Meadow": a free leaf icon printed on it as the mark, with a
// little orange ® tag. Off to the right, the very same leaf turns up on two other business cards, linked by a dashed
// orange thread and a handwritten "same icon?" doubt.
const O = C.solid.c, GREEN = '#21402F'
const mini = (rot, tone) => `<div class="bc" style="rotate:${rot}deg;background:${tone}">${icon('leaf', 'solid', 92, GREEN)}<div class="bc__l"><i></i><i></i><i></i></div></div>`

export default {
  photoFile: 'free-icon-in-logo-sign.jpg',
  credit: { by: 'Farhad Ibrahimzade', profile: 'https://unsplash.com/@ferhadd', source: 'https://unsplash.com/photos/a-white-sign-hanging-from-the-side-of-a-building-vcXLCpRhtD4', license: 'Unsplash License' },
  alt: 'A blank shop sign hanging from a building now shows a green leaf icon above the made-up name Meadow with an orange registered tag, while two business cards on the right carry the very same leaf, joined by a dashed orange line and a handwritten note asking same icon?',
  photo: { pos: '50% 45%', filter: 'saturate(.9) brightness(.97)' },
  overlay: `linear-gradient(90deg, ${rgba(INK, 0.28)} 0%, transparent 30%, transparent 70%, ${rgba(INK, 0.32)} 100%)`,
  art: () => [
    // the mark, printed on the sign
    at(`<div class="mark">${icon('leaf', 'solid', 300, GREEN)}<span class="mark__w">Meadow</span></div>`, { cx: 830, cy: 420 }),
    at(`<span class="reg"><b>R</b></span>`, { cx: 1010, cy: 205, rot: 8 }),
    // thread from the sign's leaf to the look-alikes
    at(`<svg width="1600" height="1000" fill="none"><path d="M985 330 C 1090 300, 1150 270, 1230 300" stroke="${O}" stroke-width="5" stroke-dasharray="4 14" stroke-linecap="round"/><path d="M985 400 C 1100 460, 1140 560, 1236 590" stroke="${O}" stroke-width="5" stroke-dasharray="4 14" stroke-linecap="round"/></svg>`, { x: 0, y: 0 }),
    at(mini(5, '#FFFFFF'), { x: 1210, y: 230 }),
    at(mini(-6, '#F4EFE4'), { x: 1222, y: 520 }),
    at(`<span class="doubt">same icon?</span>`, { x: 1080, y: 112, rot: -5 }),
  ].join(''),
  css: `
.mark { display: flex; flex-direction: column; align-items: center; gap: 4px; mix-blend-mode: multiply; }
.mark__w { font: 400 120px/1 var(--font-serif); letter-spacing: -.02em; color: ${GREEN}; }
.reg { display: grid; place-items: center; width: 92px; height: 92px; border-radius: 50%; background: ${O}; box-shadow: 0 0 0 6px #fff, 0 24px 40px -16px rgba(17,19,24,.6); }
.reg b { display: grid; place-items: center; width: 58px; height: 58px; box-sizing: border-box; border: 5px solid #fff; border-radius: 50%; color: #fff; font: 800 34px/1 var(--font-display); }
.bc { box-sizing: border-box; width: 230px; height: 230px; padding: 24px; border-radius: 30px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 18px; box-shadow: 0 2px 0 rgba(17,19,24,.05), 0 40px 70px -30px rgba(17,19,24,.75); }
.bc__l { display: grid; gap: 9px; width: 120px; } .bc__l i { height: 9px; border-radius: 9px; background: rgba(17,19,24,.16); } .bc__l i:nth-child(2) { width: 70%; } .bc__l i:nth-child(3) { width: 45%; }
.doubt { font: 700 64px/1 var(--font-hand); color: ${O}; white-space: nowrap; text-shadow: 0 0 2px #fff, 0 0 10px #fff, 0 0 22px #fff; }
`,
}
