import { at, icon, C, rgba } from '../tools/hero-kit.mjs'

// Pure artwork: an arcade "character select" screen where the fighters are one cat in six playful styles.
// Kawaii is picked (P1 cursor); arcade buttons and a joystick sit below the screen.
const SLOTS = ['kawaii', 'pixel', 'sticker', 'retro', 'plush', 'anime']
const slot = (s, i) => `<div class="slot${i === 0 ? ' is-on' : ''}">${i === 0 ? '<b class="p1">P1</b>' : ''}${icon('cat', s, 104, s === 'pixel' ? '#9BE15D' : undefined)}</div>`

export default {
  bg: `linear-gradient(${rgba('#FFFFFF', 0.05)} 2px, transparent 2px) 0 0 / 40px 40px,
    linear-gradient(90deg, ${rgba('#FFFFFF', 0.05)} 2px, transparent 2px) 0 0 / 40px 40px,
    radial-gradient(90% 90% at 60% 25%, #4A2FB8 0%, #1B1245 60%, #0E0A26 100%)`,
  alt: 'Pixel-grid arcade artwork: a violet-framed character select screen where the fighters are one cat icon in six playful with icons styles, kawaii picked by the P1 cursor, above glowing arcade buttons and a joystick',
  art: () => [
    at(`<div class="scr">
      <div class="scr__top"><span>Select style</span><span class="lives">${icon('heart', 'sticker', 44)}${icon('heart', 'sticker', 44)}${icon('heart', 'sticker', 44)}</span></div>
      <div class="scr__row">${SLOTS.map(slot).join('')}</div>
      <div class="scr__name">${icon('star', 'sticker', 44)}<span>Kawaii</span>${icon('star', 'sticker', 44)}</div>
    </div>`, { x: 210, y: 120 }),
    at(`<div class="pad">
      <i class="base"></i><i class="lever"></i><i class="ball"></i>
      <i class="btn" style="--b:#FF4F7B"></i><i class="btn" style="--b:#FFD23F"></i><i class="btn" style="--b:#38BDF8"></i><i class="btn" style="--b:${C.pixel.c}"></i>
    </div>`, { x: 780, y: 650 }),
  ].join(''),
  css: `
.scr { width: 1180px; height: 450px; box-sizing: border-box; padding: 34px 50px; border-radius: 44px; background: #0D0A1F; position: relative; overflow: hidden;
  box-shadow: 0 0 0 16px ${C.duo.c}, 0 0 0 22px ${rgba('#FFFFFF', 0.15)}, 0 0 120px 20px ${rgba(C.duo.c, 0.55)}, 0 60px 100px -30px rgba(0,0,0,.8); }
.scr::after { content: ''; position: absolute; inset: 0; background: repeating-linear-gradient(0deg, ${rgba('#FFFFFF', 0.035)} 0 2px, transparent 2px 6px); pointer-events: none; }
.scr__top { display: flex; justify-content: space-between; align-items: center; font: 800 46px/1 var(--font-mono); text-transform: uppercase; letter-spacing: .08em; color: #fff;
  text-shadow: 4px 4px 0 ${C.duo.c}; }
.lives { display: flex; gap: 10px; }
.scr__row { display: flex; gap: 22px; margin-top: 44px; }
.slot { position: relative; width: 158px; height: 158px; border-radius: 28px; display: grid; place-items: center; background: ${rgba('#FFFFFF', 0.08)};
  box-shadow: inset 0 0 0 3px ${rgba('#FFFFFF', 0.12)}; }
.slot.is-on { background: ${rgba(C.duo.c, 0.35)}; box-shadow: 0 0 0 7px #FFD23F, 0 0 40px 10px ${rgba('#FFD23F', 0.45)}; }
.p1 { position: absolute; top: -34px; left: 50%; translate: -50% 0; padding: 6px 14px; border-radius: 10px; background: #FFD23F; color: #0D0A1F; font: 800 24px/1 var(--font-mono); }
.scr__name { display: flex; align-items: center; justify-content: center; gap: 22px; margin-top: 34px; color: #FFD23F; font: 800 52px/1 var(--font-mono); text-transform: uppercase; letter-spacing: .14em; }
.pad { width: 620px; height: 170px; border-radius: 40px; background: linear-gradient(180deg, #2C2063, #1A1340); box-shadow: 0 2px 0 ${rgba('#FFFFFF', 0.1)} inset, 0 40px 70px -30px rgba(0,0,0,.8);
  position: relative; }
.base { position: absolute; left: 50px; top: 104px; width: 120px; height: 40px; border-radius: 50%; background: #0D0A1F; }
.lever { position: absolute; left: 100px; top: 60px; width: 20px; height: 66px; border-radius: 8px; background: linear-gradient(90deg, #E8E3F7, #A79FC7); }
.ball { position: absolute; left: 70px; top: 10px; width: 80px; height: 80px; border-radius: 50%; background: radial-gradient(circle at 35% 30%, #FFB3C8, #E2456F 60%, #A3234A); box-shadow: 0 10px 18px -6px rgba(0,0,0,.6); }
.btn { position: absolute; top: 50px; width: 74px; height: 74px; border-radius: 50%; background: radial-gradient(circle at 35% 30%, #fff 0%, var(--b) 35%, color-mix(in srgb, var(--b) 70%, #000) 100%);
  box-shadow: 0 8px 0 color-mix(in srgb, var(--b) 50%, #000), 0 0 30px var(--b); }
.btn:nth-of-type(4) { left: 250px; } .btn:nth-of-type(5) { left: 340px; top: 30px; } .btn:nth-of-type(6) { left: 430px; } .btn:nth-of-type(7) { left: 520px; top: 30px; }
`,
}
