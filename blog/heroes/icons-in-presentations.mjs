import { at, chip, icon, glow, C, INK, rgba } from '../tools/hero-kit.mjs'

// A 16:9 slide with the classic three-icon layout (icon, heading bar, two text bars), and the deck's
// filmstrip under it, the current slide outlined in orange.
const O = C.solid
const COLS = ['target', 'users', 'rocket']
const col = n => `<div class="sl__col"><span class="sl__ic">${icon(n, 'solid', 78, O.c)}</span><i class="h"></i><i></i><i class="s"></i></div>`
const thumb = (names, on) => `<div class="th${on ? ' is-on' : ''}"><i class="th__t"></i><div class="th__row">${names.map(n => icon(n, 'solid', 26, on ? O.c : '#8A8F9A')).join('')}</div></div>`

export default {
  base: 'slides2',
  alt: 'A man presenting to a seated team in a brick office, with a slide mockup of three orange with icons in circles and a filmstrip of slides below it',
  photo: { filter: 'saturate(.85) brightness(.62)', pos: '30% 50%' },
  overlay: `linear-gradient(90deg, ${rgba('#111318', 0.1)} 0%, ${rgba('#111318', 0.45)} 55%, ${rgba('#111318', 0.55)} 100%)`,
  art: () => [
    glow({ cx: 1080, cy: 420, r: 380, color: O.c, opacity: 0.32 }),
    at(`<div class="tv"><div class="sl"><div class="sl__head"><b>Our plan</b><i></i></div><div class="sl__cols">${COLS.map(col).join('')}</div></div></div>`, { x: 646, y: 120 }),
    at(`<div class="strip">${thumb(['flag', 'star', 'heart'], false)}${thumb(COLS, true)}${thumb(['chart-bar', 'chart-pie'], false)}${thumb(['check-circle'], false)}</div>`, { x: 760, y: 610 }),
    chip('SVG or PNG', { x: 1140, y: 98, tone: 'sun', icon: ['file-image', 'solid'], rot: 5, size: 30, z: 3 }),
  ].join(''),
  css: `
.tv { padding: 16px; border-radius: 30px; background: linear-gradient(160deg, #2A2E38, #121419); box-shadow: 0 2px 0 rgba(255,255,255,.08) inset, 0 60px 110px -40px rgba(0,0,0,.9); }
.sl { width: 760px; height: 428px; box-sizing: border-box; padding: 40px 46px; border-radius: 14px; background: #fff; font-family: var(--font-display); color: ${INK}; }
.sl__head { display: flex; align-items: center; gap: 22px; }
.sl__head b { font-weight: 800; font-size: 50px; letter-spacing: -.03em; line-height: 1; }
.sl__head i { flex: 1; height: 6px; border-radius: 6px; background: ${O.c}; opacity: .9; }
.sl__cols { display: grid; grid-template-columns: repeat(3, 1fr); gap: 34px; margin-top: 42px; }
.sl__col { display: grid; justify-items: center; gap: 12px; }
.sl__ic { width: 146px; height: 146px; border-radius: 50%; display: grid; place-items: center; background: ${O.soft}; margin-bottom: 8px; }
.sl__col i { display: block; width: 150px; height: 13px; border-radius: 8px; background: rgba(17,19,24,.13); }
.sl__col i.h { width: 120px; height: 18px; background: rgba(17,19,24,.7); }
.sl__col i.s { width: 100px; }
.strip { display: flex; gap: 22px; padding: 18px; border-radius: 26px; background: rgba(21,23,30,.78); backdrop-filter: blur(10px); box-shadow: 0 40px 80px -40px rgba(0,0,0,.9); }
.th { width: 140px; height: 80px; box-sizing: border-box; padding: 12px 14px; border-radius: 10px; background: #fff; display: grid; align-content: space-between; outline: 4px solid transparent; outline-offset: 4px; }
.th.is-on { outline-color: ${O.c}; }
.th__t { display: block; width: 60px; height: 8px; border-radius: 4px; background: rgba(17,19,24,.55); }
.th__row { display: flex; gap: 10px; }
`,
}
