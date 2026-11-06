import { at, chip, icon, C, INK, rgba } from '../tools/hero-kit.mjs'

// A real magnifying glass on a desk of printed charts. Under it lies a generic search-results sheet: grey globe
// placeholders on every row except one, which has gained its favicon (a white leaf on deep green). The lens shows that
// row magnified. The photo is shifted and scaled so the real lens sits over the favicon column; its rim is redrawn
// on top of the sheet.
const O = C.solid
const S = 1.1, TY = -100 // photo (pos 50% 100%) transform: lens centre (500, 424) -> (550, 366)
const LX = 550, LY = 366, LR = 168
const CX = 420, CY = 106, CW = 980
const GREEN = '#1E5B3A'

const fav = on => on ? `<span class="fv__fav is-on">${icon('leaf', 'solid', 28, '#fff')}</span>` : `<span class="fv__fav">${icon('globe', 'line', 28, '#9AA0AC')}</span>`
const row = (on, w1, w2) => `<div class="fv__row${on ? ' is-on' : ''}">${fav(on)}<div class="fv__txt">${on ? '<b>Fern and Pine Plants</b><i>fernandpine.example</i>' : `<i class="sk" style="width:${w1}px;height:18px;background:rgba(17,19,24,.28)"></i><i class="sk" style="width:${w2}px"></i>`}<i class="sk sk--l" style="width:640px"></i></div></div>`
// inside the glass: the same three rows drawn bigger (the middle one, with its new favicon, centred)
const zrow = (on, y) => `<div class="fv__z${on ? ' is-on' : ''}" style="top:${y}px">${on ? `<span class="fv__zf is-on">${icon('leaf', 'solid', 50, '#fff')}</span><div><b>Fern and Pine</b><i>fernandpine.example</i></div>` : `<span class="fv__zf">${icon('globe', 'line', 50, '#9AA0AC')}</span><div><i class="sk" style="width:200px;height:26px;background:rgba(17,19,24,.25)"></i><i class="sk" style="width:150px;height:18px"></i></div>`}</div>`
const sheet = () => `<div class="fv__sheet">
  <div class="fv__bar">${icon('search', 'line', 30, '#5A606D')}<i class="sk" style="width:220px"></i></div>
  ${row(false, 260, 180)}${row(true)}${row(false, 300, 160)}
</div>`

export default {
  photoFile: 'favicon-not-showing-in-google-lens.jpg',
  credit: { by: 'RDNE Stock project', profile: 'https://www.pexels.com/@rdne/', source: 'https://www.pexels.com/photo/black-magnifying-glass-on-black-table-7948043/', license: 'Pexels License' },
  alt: 'A magnifying glass on a dark desk rests over a generic list of search results where grey globe icons mark every row but one, which now shows a green leaf favicon, enlarged in the lens',
  photo: { filter: 'saturate(.7) brightness(.62)', pos: '50% 100%' },
  overlay: `radial-gradient(90% 90% at 50% 40%, ${rgba('#111318', 0)} 0%, ${rgba('#111318', 0.35)} 100%)`,
  art: () => [
    at(sheet(), { x: CX, y: CY, w: CW, rot: 0 }),
    // the lens: the rows under it, magnified
    at(`<div class="fv__glass">${zrow(false, LR - 46 - 138)}${zrow(true, LR - 46)}${zrow(false, LR - 46 + 138)}</div>`, { x: LX - LR, y: LY - LR, w: LR * 2, h: LR * 2, z: 3 }),
    at(`<svg width="${LR * 2 + 80}" height="${LR * 2 + 80}" viewBox="0 0 ${LR * 2 + 80} ${LR * 2 + 80}" fill="none"><circle cx="${LR + 40}" cy="${LR + 40}" r="${LR + 14}" stroke="#16171A" stroke-width="30"/><circle cx="${LR + 40}" cy="${LR + 40}" r="${LR + 26}" stroke="rgba(255,255,255,.14)" stroke-width="3"/><path d="M${LR - 70} ${LR - 40} A${LR - 30} ${LR - 30} 0 0 1 ${LR + 60} ${LR - 88}" stroke="rgba(255,255,255,.55)" stroke-width="10" stroke-linecap="round"/></svg>`, { x: LX - LR - 40, y: LY - LR - 40, z: 4, cls: 'fv__rim' }),
    chip('found it', { x: 1210, y: 98, tone: 'color', style: 'solid', size: 30, rot: 4, icon: ['check-circle', 'solid'] }),
  ].join(''),
  css: `
.stage__photo { transform-origin: 0 0; transform: translate(0, ${TY}px) scale(${S}); }
.fv__sheet { box-sizing: border-box; padding: 30px 50px 36px; border-radius: 30px; background: #fff; box-shadow: 0 2px 0 rgba(17,19,24,.04), 0 50px 100px -40px rgba(0,0,0,.8); font-family: var(--font-display); }
.fv__bar { display: flex; align-items: center; gap: 16px; padding: 14px 22px; border-radius: 999px; background: #F3F1EC; width: 520px; margin-bottom: 18px; }
.fv__row { display: flex; align-items: flex-start; gap: 20px; padding: 16px 0; height: 104px; box-sizing: border-box; }
.fv__fav { flex: none; width: 44px; height: 44px; border-radius: 50%; display: grid; place-items: center; background: #EEEDEA; margin-top: 2px; }
.fv__fav.is-on { background: ${GREEN}; box-shadow: 0 0 0 4px ${rgba(O.c, 0)}; }
.fv__txt { display: flex; flex-direction: column; gap: 10px; }
.fv__txt b { font: 800 30px/1 var(--font-display); color: ${INK}; letter-spacing: -.02em; }
.fv__txt i:not(.sk) { font: 500 20px/1 var(--font-mono); font-style: normal; color: #4C7A5E; }
.sk { display: block; height: 13px; border-radius: 8px; background: rgba(17,19,24,.12); }
.sk--l { height: 11px; background: rgba(17,19,24,.08); }
.fv__glass { width: 100%; height: 100%; border-radius: 50%; overflow: hidden; position: relative; background: #fff; }
.fv__z { position: absolute; left: 30px; display: flex; align-items: center; gap: 18px; height: 92px; white-space: nowrap; }
.fv__zf { flex: none; width: 82px; height: 82px; border-radius: 50%; display: grid; place-items: center; background: #EEEDEA; }
.fv__zf.is-on { background: ${GREEN}; box-shadow: 0 0 0 6px #fff, 0 0 0 10px ${rgba(GREEN, 0.25)}; }
.fv__z div { display: flex; flex-direction: column; gap: 10px; }
.fv__z b { font: 800 46px/1 var(--font-display); letter-spacing: -.03em; color: ${INK}; }
.fv__z i:not(.sk) { font: 500 26px/1 var(--font-mono); font-style: normal; color: #4C7A5E; }
.fv__rim { filter: drop-shadow(0 18px 24px rgba(0,0,0,.55)); }
`,
}
