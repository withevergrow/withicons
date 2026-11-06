import { at, chip, icon, glow, C, rgba } from '../tools/hero-kit.mjs'

// Treatment: hands hold a phone up against a desert sunset. Its screen becomes a calm home screen, and a fan of
// custom app tiles in one cohesive style (soft3d icons on cream tiles) rises out of it like a peacock tail, with
// thin golden rays joining each tile to the phone. Orange (guides) accent on the chips.
const ST = 'soft3d'
const FAN = ['camera', 'music-note', 'book-open', 'heart', 'map-pin', 'mail', 'calendar']
const OX = 775, OY = 640, R = 450
const pos = i => {
  const a = (-165 + i * 25) * Math.PI / 180
  return [Math.round(OX + R * Math.cos(a)), Math.round(OY + R * Math.sin(a)), Math.round((-165 + i * 25 + 90) * 0.35)]
}
const fan = () => FAN.map((n, i) => {
  const [cx, cy, rot] = pos(i)
  return at(`<span class="ai__tile">${icon(n, ST, 104)}</span>`, { cx, cy, rot, z: 3 })
}).join('')
const rays = () => `<svg width="1600" height="1000" viewBox="0 0 1600 1000" fill="none">${FAN.map((n, i) => {
  const [cx, cy] = pos(i)
  return `<line x1="${OX}" y1="${OY - 120}" x2="${cx}" y2="${cy}" stroke="${rgba('#FFE6B8', 0.55)}" stroke-width="3" stroke-linecap="round" stroke-dasharray="2 12"/>`
}).join('')}</svg>`

const HOME = ['camera', 'music-note', 'book-open', 'heart', 'map-pin', 'mail', 'calendar', 'clock', 'image', 'headphones', 'message-circle', 'sun', 'palette', 'leaf', 'gamepad', 'coffee']
const DOCK = ['phone', 'message-circle', 'music-note', 'camera']

export default {
  photoFile: 'custom-app-icons-iphone-sunset.jpg',
  credit: { by: 'Jana Al Mubaslat', profile: 'https://www.pexels.com/@jana-al-mubaslat-257095383/', source: 'https://www.pexels.com/photo/close-up-photo-of-person-taking-photo-using-iphone-13926637/', license: 'Pexels License' },
  alt: 'Two hands hold a phone up against a peach desert sunset; its dusk-coloured screen shows a home screen of matching tiles, and a fan of seven cream app tiles with soft 3D camera, music, book, heart, pin, mail and calendar icons rises from it in an arc',
  photo: { filter: 'saturate(1.08) brightness(.9)', pos: '50% 50%' },
  overlay: `radial-gradient(70% 70% at 50% 60%, ${rgba('#2A1408', 0)} 0%, ${rgba('#2A1408', 0.35)} 100%)`,
  art: () => [
    glow({ cx: OX, cy: 420, r: 330, color: '#FFC98A', opacity: 0.45, blur: 110 }),
    at(rays(), { x: 0, y: 0, z: 1 }),
    // the phone's screen, re-skinned as a home screen of the same set
    at(`<div class="ai__screen"><i class="ai__island"></i><span class="ai__time">7:42</span><div class="ai__grid">${HOME.map(n => `<span class="ai__app">${icon(n, ST, 46)}</span>`).join('')}</div><div class="ai__dock">${DOCK.map(n => `<span class="ai__app">${icon(n, ST, 46)}</span>`).join('')}</div></div>`, { x: 617, y: 268, w: 316, h: 690, z: 2 }),
    fan(),
    chip('One style', { x: 1180, y: 640, tone: 'color', style: 'solid', size: 30, icon: ['sparkles', 'line'], rot: -4, z: 5 }),
    chip('Your picture', { x: 1150, y: 740, tone: 'card', size: 30, icon: ['image', 'line'], rot: 3, z: 5 }),
  ].join(''),
  css: `
.ai__screen { box-sizing: border-box; height: 100%; border-radius: 44px; padding: 20px 20px 22px; position: relative; display: flex; flex-direction: column;
  background: linear-gradient(180deg, #2E2350 0%, #7E3F72 42%, #D9705E 75%, #F3A766 100%); box-shadow: inset 0 0 0 2px rgba(255,255,255,.08); }
.ai__island { position: absolute; left: 50%; top: 14px; translate: -50% 0; width: 110px; height: 30px; border-radius: 999px; background: #0B0B0E; }
.ai__time { display: block; margin: 58px 0 24px; text-align: center; font: 700 64px/1 var(--font-display); letter-spacing: -.04em; color: rgba(255,255,255,.92); text-shadow: 0 2px 12px rgba(80,30,10,.25); }
.ai__grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px 10px; justify-items: center; }
.ai__dock { margin-top: auto; display: grid; grid-template-columns: repeat(4, 1fr); justify-items: center; padding: 10px 4px; border-radius: 30px; background: rgba(255,255,255,.22); }
.ai__app { width: 58px; height: 58px; border-radius: 16px; display: grid; place-items: center; background: #FFF6EA; box-shadow: 0 6px 14px -6px rgba(80,30,10,.45); }
.ai__tile { width: 150px; height: 150px; border-radius: 40px; display: grid; place-items: center; background: linear-gradient(160deg, #FFFBF4, #FBEBD7);
  box-shadow: 0 2px 0 rgba(255,255,255,.8) inset, 0 34px 50px -22px rgba(60,20,4,.7); border: 1.5px solid rgba(255,255,255,.8); }
`,
}
