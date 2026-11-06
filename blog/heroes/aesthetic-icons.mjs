import { at, chip, icon, glow, C, rgba } from '../tools/hero-kit.mjs'

// A phone home screen restyled in one soft mood (pastel), with a mood picker beside it: Pastel picked, Coquette and Kawaii waiting.
const APPS = ['camera', 'image', 'music-note', 'calendar-heart', 'mail', 'map-pin', 'notebook-pen', 'cloud-sun',
  'coffee', 'shopping-bag', 'book-open', 'clock', 'flower', 'heart', 'gamepad', 'settings', 'palette', 'gift', 'leaf', 'moon-star']
const DOCK = ['phone', 'message-circle-heart', 'headphones', 'sparkles']
const app = n => `<span class="app">${icon(n, 'pastel', 58)}</span>`
const phone = () => `<div class="ph"><div class="ph__scr">
  <div class="ph__bar"><b>9:41</b><i class="ph__notch"></i></div>
  <div class="ph__grid">${APPS.map(app).join('')}</div>
  <div class="ph__dock">${DOCK.map(app).join('')}</div>
</div></div>`

export default {
  base: 'trends3',
  alt: 'Soft pastel spheres on a gradient behind a phone home screen whose app icons are all in the with icons pastel style, next to a mood picker with Pastel selected over Coquette and Kawaii',
  photo: { filter: 'saturate(1.1) brightness(1.02)', pos: '50% 50%' },
  overlay: `linear-gradient(90deg, ${rgba('#FFFFFF', 0.12)} 0%, ${rgba('#FFFFFF', 0)} 60%)`,
  art: () => [
    glow({ cx: 1060, cy: 520, r: 300, color: C.solid.c, opacity: 0.22, blur: 120 }),
    at(phone(), { x: 860, y: 110, rot: 4 }),
    chip('Pastel', { x: 470, y: 250, tone: 'color', style: 'solid', size: 40, icon: ['flower', 'pastel'], rot: -3 }),
    chip('Coquette', { x: 430, y: 365, tone: 'glass', size: 34, icon: ['heart', 'coquette'], rot: 2 }),
    chip('Kawaii', { x: 500, y: 465, tone: 'glass', size: 34, icon: ['cat', 'kawaii'], rot: -2 }),
    at(`<span class="tick">${icon('check', 'solid', 30, '#fff')}</span>`, { x: 680, y: 232 }),
  ].join(''),
  css: `
.ph { width: 420px; height: 760px; box-sizing: border-box; padding: 14px; border-radius: 68px; background: #23212B;
  box-shadow: 0 2px 0 rgba(17,19,24,.05), 0 60px 110px -40px rgba(60,40,90,.75), inset 0 0 0 2px rgba(255,255,255,.12); }
.ph__scr { position: relative; height: 100%; border-radius: 56px; overflow: hidden; box-sizing: border-box; padding: 22px 26px;
  background: linear-gradient(165deg, #FDE7EF 0%, #EADFFD 45%, #D9F3EC 100%); display: flex; flex-direction: column; }
.ph__bar { display: flex; align-items: center; height: 36px; font: 700 22px/1 var(--font-display); color: #3A3346; padding: 0 12px; }
.ph__notch { position: absolute; left: 50%; top: 18px; translate: -50% 0; width: 120px; height: 34px; border-radius: 20px; background: #23212B; }
.ph__grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 26px 0; justify-items: center; margin-top: 34px; }
.app { width: 78px; height: 78px; border-radius: 24px; display: grid; place-items: center; background: rgba(255,255,255,.72);
  box-shadow: 0 10px 18px -12px rgba(90,60,120,.55); }
.ph__dock { margin-top: auto; display: grid; grid-template-columns: repeat(4, 1fr); justify-items: center; padding: 14px 6px; border-radius: 36px;
  background: rgba(255,255,255,.45); backdrop-filter: blur(10px); }
.tick { width: 46px; height: 46px; border-radius: 50%; display: grid; place-items: center; background: ${C.solid.text}; box-shadow: 0 0 0 4px #fff; }
`,
}
