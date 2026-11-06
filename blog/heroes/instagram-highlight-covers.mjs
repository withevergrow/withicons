import { at, icon, chip, glow, C, INK, rgba } from '../tools/hero-kit.mjs'

// Photo: a hand holds a blank phone against a pink-violet wall. Out of its screen floats a curved row of five highlight
// covers that match exactly (one solid style, white on one orange, the same ring), and the screen itself shows the
// tiny profile row they end up as.
const COVERS = [['shopping-bag', 'Shop'], ['star', 'Reviews'], ['help-circle', 'FAQ'], ['utensils', 'Menu'], ['mail', 'Contact']]
// the phone's screen in the photo (stage px)
const SX = 700, SY = 300, SW = 274, SH = 492

const cover = (n, size) => `<div class="hc" style="width:${size}px;height:${size}px">${icon(n, 'solid', Math.round(size * 0.42), '#fff')}</div>`
function arc() {
  const out = []
  // a rainbow over the phone: an ellipse centred under the screen
  ;[158, 122, 90, 58, 22].forEach((deg, i) => {
    const a = deg * Math.PI / 180, cx = Math.round(838 + 480 * Math.cos(a)), cy = Math.round(560 - 360 * Math.sin(a))
    out.push(at(`<div class="hcbox">${cover(COVERS[i][0], 140)}<span>${COVERS[i][1]}</span></div>`, { cx, cy: cy + 20 }))
  })
  return out.join('')
}
function screen() {
  const dots = COVERS.map(([n]) => cover(n, 40)).join('')
  return at(`<div class="scr"><div class="scr__top"><i class="scr__av"></i><div><b></b><b></b></div></div><div class="scr__row">${dots}</div><div class="scr__grid">${'<i></i>'.repeat(9)}</div></div>`, { x: SX, y: SY, w: SW, h: SH })
}

export default {
  photoFile: 'instagram-highlight-covers-phone.jpg',
  credit: { by: 'MART PRODUCTION', profile: 'https://www.pexels.com/@mart-production/', source: 'https://www.pexels.com/photo/hand-holding-a-smartphone-with-blank-screen-8217517/', license: 'Pexels License' },
  alt: 'A hand holds a phone against a pink and violet wall while a curved row of five matching orange highlight covers, with white shopping bag, star, help, utensils and mail icons, floats out of its screen',
  photo: { filter: 'saturate(1.05)', pos: '50% 40%' },
  art: () => [
    glow({ cx: 838, cy: 330, r: 420, color: '#fff', opacity: 0.35, blur: 100 }),
    screen(),
    arc(),
    chip('One style, one colour', { x: 1010, y: 650, tone: 'color', style: 'solid', size: 34, icon: ['check', 'solid'], rot: -2 }),
  ].join(''),
  css: `
.hc { border-radius: 50%; display: grid; place-items: center; background: radial-gradient(circle at 35% 30%, #FF7A55, ${C.solid.c} 60%, #E8431F); box-shadow: 0 0 0 4px #fff, 0 0 0 7px ${rgba(C.solid.c, 0.0)}; }
.hcbox { display: flex; flex-direction: column; align-items: center; gap: 14px; }
.hcbox > .hc { box-shadow: 0 0 0 7px #fff, 0 0 0 11px ${rgba(C.solid.c, 0.55)}, 0 40px 60px -26px rgba(60,20,60,.55); }
.hcbox > span { font: 700 26px/1 var(--font-display); color: ${INK}; letter-spacing: -.01em; background: rgba(255,255,255,.82); padding: 6px 12px; border-radius: 999px; }
.scr { height: 100%; box-sizing: border-box; padding: 0 16px; display: flex; flex-direction: column; gap: 20px; overflow: hidden; }
.scr__top { display: flex; align-items: center; gap: 10px; }
.scr__av { width: 60px; height: 60px; border-radius: 50%; background: linear-gradient(135deg, #FFB199, ${C.solid.c}); flex: none; }
.scr__top b { display: block; height: 8px; width: 140px; border-radius: 4px; background: #E6E1EA; margin: 6px 0; }
.scr__top b + b { width: 96px; }
.scr__row { display: flex; justify-content: space-between; }
.scr__row > .hc { box-shadow: 0 0 0 2px #fff, 0 0 0 3.5px #D9D2DF; }
.scr__grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 3px; margin: 0 -16px; }
.scr__grid i { aspect-ratio: 1; background: linear-gradient(135deg, #FBE3DA, #F6CFC2); }
.scr__grid i:nth-child(3n+2) { background: linear-gradient(135deg, #EDE4F7, #DCD0F0); }
.scr__grid i:nth-child(4n+3) { background: linear-gradient(135deg, #FFE9C9, #FFD6A6); }
`,
}
