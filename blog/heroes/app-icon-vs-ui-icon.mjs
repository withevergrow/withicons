import { at, icon, C, rgba, INK } from '../tools/hero-kit.mjs'

// Big vs small: a home-screen dock of four chunky app icons (the Dock style) above a slim editor toolbar of 24 px line
// icons, each tagged with its size in mono, over the photo of a hand holding a phone.
const DOCK = ['camera', 'music-note', 'mail', 'calendar']
const TOOLS = ['bold', 'italic', 'underline', 'link', 'image', 'list', 'align-left', 'undo']

export default {
  base: 'xapp4',
  alt: 'A hand holding a phone against a grey wall behind a dock of four big colourful app icons and, below it, a slim toolbar of small line UI icons, tagged 180 px and 24 px',
  photo: { filter: 'saturate(.9) brightness(.62)', pos: '50% 50%' },
  overlay: `linear-gradient(90deg, ${rgba(INK, 0.2)} 0%, ${rgba(INK, 0.35)} 45%, ${rgba(INK, 0.6)} 100%)`,
  art: () => [
    at(`<div class="dk">${DOCK.map(n => icon(n, 'dock', 170)).join('')}</div>`, { x: 600, y: 150, w: 840 }),
    at(`<span class="tg is-big">App icons <b>180 px</b></span>`, { x: 640, y: 400, rot: -3 }),
    at(`<div class="tb">${TOOLS.map((n, i) => `<span class="${i === 3 ? 'is-on' : ''}">${icon(n, 'line', 40)}</span>`).join('')}</div>`, { x: 760, y: 560, w: 680 }),
    at(`<span class="tg">UI icons <b>24 px</b></span>`, { x: 1120, y: 680, rot: 3 }),
  ].join(''),
  css: `
.dk { display: flex; justify-content: space-between; padding: 26px 34px; border-radius: 64px; background: rgba(255,255,255,.22); border: 2px solid rgba(255,255,255,.4); box-shadow: 0 60px 110px -40px rgba(0,0,0,.85); backdrop-filter: blur(20px) saturate(1.3); }
.dk svg { filter: drop-shadow(0 18px 20px rgba(0,0,0,.35)); }
.tb { display: flex; justify-content: space-between; align-items: center; padding: 16px 22px; border-radius: 22px; background: #fff; color: #4A4F5C; box-shadow: 0 40px 80px -30px rgba(0,0,0,.85); }
.tb span { display: grid; place-items: center; width: 64px; height: 64px; border-radius: 14px; }
.tb span.is-on { background: ${C.duo.soft}; color: ${C.duo.c}; }
.tg { display: inline-flex; align-items: center; gap: 14px; padding: 12px 14px 12px 24px; border-radius: 999px; background: #fff; color: ${INK}; font: 800 34px/1 var(--font-display); letter-spacing: -.02em; box-shadow: 0 20px 40px -18px rgba(0,0,0,.7); }
.tg b { padding: 8px 14px; border-radius: 999px; background: ${C.duo.c}; color: #fff; font: 700 26px/1 var(--font-mono); letter-spacing: 0; }
.tg.is-big b { background: ${INK}; }
`,
}
