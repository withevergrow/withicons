import { at, chip, icon, C, INK, rgba } from '../tools/hero-kit.mjs'

// Treatment: a design-tool canvas, pure artwork (no photo). A dotted grey canvas with a toolbar, a layers panel with the
// selected Vector, and two frames: one holds a big blue line icon in a selection box with handles and a size badge, the
// other a row of icon instances in other styles. Drawn here, no tool logos. Blue (comparisons) accent.
const B = C.line
const layer = (name, w, on, indent) => `<div class="fg__layer${on ? ' is-on' : ''}" style="padding-left:${14 + indent * 24}px">${icon(name, 'line', 28, on ? B.c : '#6B7180')}${on ? '<b>Vector</b>' : `<i class="sk" style="width:${w}px"></i>`}</div>`
const handle = (l, t) => `<i class="fg__h" style="left:${l};top:${t}"></i>`
const tools = ['cursor', 'square', 'pen-tool', 'type', 'hand'].map((n, i) => `<span class="fg__tool${i === 2 ? ' is-on' : ''}">${icon(n, 'line', 30, i === 2 ? '#fff' : '#E8EAF0')}</span>`).join('')

export default {
  alt: 'Artwork of a design canvas: a dotted grey canvas with a layers panel showing a selected vector, a frame where a big blue palette icon sits in a selection box with handles and a 24 by 24 badge, and a frame of icon instances in other styles',
  bg: `radial-gradient(70% 80% at 65% 40%, #F4F5F8 0%, #E4E7EE 100%)`,
  art: () => [
    at('<div class="fg__dots"></div>', { x: 0, y: 0, w: 1600, h: 1000 }),
    at(`<div class="fg__panel">
      <div class="fg__title">Layers</div>
      ${layer('layout-template', 130, false, 0)}${layer('component', 110, false, 1)}${layer('pen-tool', 0, true, 2)}${layer('square', 90, false, 2)}${layer('type', 120, false, 1)}${layer('image', 100, false, 1)}
    </div>`, { x: 170, y: 140, w: 360 }),
    at('<span class="fg__flabel">icon / palette</span>', { x: 720, y: 128 }),
    at(`<div class="fg__frame"><div class="fg__sel">${icon('palette', 'line', 330, B.c)}${handle('-11px', '-11px')}${handle('calc(100% - 11px)', '-11px')}${handle('-11px', 'calc(100% - 11px)')}${handle('calc(100% - 11px)', 'calc(100% - 11px)')}<span class="fg__size">24 × 24</span></div></div>`, { x: 720, y: 165, w: 520, h: 520 }),
    at(`<div class="fg__inst">${[['palette', 'solid', B.c], ['palette', 'duo', C.duo.c], ['palette', 'sticker'], ['palette', 'clay']].map(([n, s, col]) => `<span>${icon(n, s, 84, col)}</span>`).join('')}</div>`, { x: 760, y: 735 }),
    at(icon('cursor', 'solid', 64, INK), { x: 1150, y: 560, style: 'filter:drop-shadow(0 6px 10px rgba(0,0,0,.25))' }),
    at(`<div class="fg__tools">${tools}</div>`, { x: 1300, y: 200 }),
    chip('Editable vector', { x: 1080, y: 112, tone: 'color', style: 'line', icon: ['pen-tool', 'line'], size: 30, rot: 4 }),
  ].join(''),
  css: `
.fg__dots { background-image: radial-gradient(rgba(17,19,24,.16) 2px, transparent 2.6px); background-size: 36px 36px; }
.fg__panel { background: #fff; border-radius: 26px; padding: 20px 14px; box-shadow: 0 2px 0 rgba(17,19,24,.04), 0 40px 80px -40px rgba(17,19,24,.45); }
.fg__title { font: 800 26px/1 var(--font-display); letter-spacing: -.02em; padding: 4px 14px 16px; }
.fg__layer { display: flex; align-items: center; gap: 14px; padding: 13px 14px; border-radius: 14px; }
.fg__layer.is-on { background: ${B.soft}; }
.fg__layer b { font: 700 24px/1 var(--font-display); color: ${B.text}; }
.sk { display: block; height: 13px; border-radius: 8px; background: rgba(17,19,24,.12); }
.fg__flabel { font: 600 20px/1 var(--font-mono); color: #6B7180; }
.fg__frame { width: 100%; height: 100%; display: grid; place-items: center; background: #fff; border-radius: 18px; box-shadow: 0 2px 0 rgba(17,19,24,.04), 0 50px 90px -40px rgba(17,19,24,.45); }
.fg__sel { position: relative; padding: 24px; outline: 3px solid ${B.c}; line-height: 0; }
.fg__h { position: absolute; width: 18px; height: 18px; background: #fff; border: 3px solid ${B.c}; border-radius: 3px; }
.fg__size { position: absolute; left: 50%; bottom: -58px; translate: -50% 0; padding: 8px 14px; border-radius: 8px; background: ${B.c}; color: #fff; font: 700 22px/1 var(--font-mono); white-space: nowrap; }
.fg__inst { display: flex; gap: 18px; padding: 18px; background: #fff; border-radius: 22px; outline: 2px dashed ${rgba('#9747FF', 0.7)}; outline-offset: 6px; box-shadow: 0 30px 60px -30px rgba(17,19,24,.4); }
.fg__inst span { width: 104px; height: 104px; border-radius: 26px; display: grid; place-items: center; background: #F4F5F8; }
.fg__tools { display: flex; flex-direction: column; gap: 8px; padding: 10px; border-radius: 22px; background: ${INK}; box-shadow: 0 30px 60px -30px rgba(17,19,24,.6); }
.fg__tool { width: 64px; height: 64px; border-radius: 16px; display: grid; place-items: center; }
.fg__tool.is-on { background: ${B.c}; }
`,
}
