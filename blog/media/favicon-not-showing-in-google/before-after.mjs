import { at, icon, C, INK, rgba } from '../../tools/hero-kit.mjs'

// In-post: the same generic search result twice. Before: a grey globe placeholder. After: the site's own round
// favicon (with icons leaf, solid, white on deep green). Between them, the wait: days to weeks.
const O = C.solid
const GREEN = '#1E5B3A'
const result = on => `<div class="ba__row${on ? ' is-on' : ''}">
  <span class="ba__fav">${on ? icon('leaf', 'solid', 54, '#fff') : icon('globe', 'line', 54, '#8A8F9A')}</span>
  <div class="ba__txt"><b>Fern and Pine Plants</b><i>fernandpine.example</i><span class="sk" style="width:620px"></span><span class="sk" style="width:440px"></span></div>
</div>`
const tag = (t, on) => `<span class="ba__tag${on ? ' is-on' : ''}">${t}</span>`

export default {
  alt: 'Two search result rows for Fern and Pine Plants: before, with a grey globe placeholder, and after, with a round green leaf favicon, joined by a days to weeks clock label',
  bg: `radial-gradient(${rgba(INK, 0.08)} 2px, transparent 2.5px) 0 0 / 34px 34px, linear-gradient(180deg, #FBF8F3, #F3EEE5)`,
  art: () => [
    at(tag('Before'), { x: 110, y: 172 }),
    at(result(false), { x: 340, y: 96, w: 1150 }),
    at(`<svg width="60" height="150" viewBox="0 0 60 150" fill="none"><path d="M30 6 V130 M10 110 L30 134 L50 110" stroke="${INK}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" opacity=".55"/></svg>`, { x: 470, y: 412 }),
    at(`<span class="ba__wait">${icon('clock', 'solid', 40, '#fff')}days to weeks</span>`, { x: 570, y: 450 }),
    at(tag('After', true), { x: 110, y: 690 }),
    at(result(true), { x: 340, y: 614, w: 1150 }),
  ].join(''),
  css: `
.ba__row { box-sizing: border-box; display: flex; align-items: flex-start; gap: 34px; padding: 40px 44px; border-radius: 34px; background: #fff; box-shadow: 0 2px 0 rgba(17,19,24,.04), 0 40px 80px -40px rgba(17,19,24,.45); border: 2px solid rgba(17,19,24,.06); }
.ba__row.is-on { box-shadow: 0 0 0 5px ${rgba(GREEN, 0.35)}, 0 40px 80px -40px rgba(17,19,24,.45); }
.ba__fav { flex: none; width: 112px; height: 112px; border-radius: 50%; display: grid; place-items: center; background: #ECEBE7; }
.ba__row.is-on .ba__fav { background: ${GREEN}; }
.ba__txt { display: flex; flex-direction: column; gap: 14px; padding-top: 6px; }
.ba__txt b { font: 800 50px/1 var(--font-display); letter-spacing: -.03em; color: ${INK}; }
.ba__txt i { font: 500 30px/1 var(--font-mono); font-style: normal; color: #4C7A5E; margin-bottom: 8px; }
.sk { display: block; height: 16px; border-radius: 9px; background: rgba(17,19,24,.1); }
.ba__tag { display: inline-block; padding: 14px 24px; border-radius: 999px; background: #fff; font: 800 34px/1 var(--font-display); color: #5A606D; box-shadow: 0 14px 30px -18px rgba(17,19,24,.5); border: 2px solid rgba(17,19,24,.08); }
.ba__tag.is-on { background: ${GREEN}; color: #fff; border-color: transparent; }
.ba__wait { display: inline-flex; align-items: center; gap: 14px; padding: 16px 28px 16px 20px; border-radius: 999px; background: ${O.c}; color: #fff; font: 800 36px/1 var(--font-display); letter-spacing: -.02em; box-shadow: 0 20px 40px -18px rgba(17,19,24,.55); }
`,
}
