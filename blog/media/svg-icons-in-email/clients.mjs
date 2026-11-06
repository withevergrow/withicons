import { at, icon, INK, rgba } from '../../tools/hero-kit.mjs'
import { BG, CSS, BLUE, ICONS, verdict } from './_kit.mjs'

// The same newsletter in three generic email windows. Its footer has four solid contact icons linked as SVG files.
// Apple Mail: crisp. Gmail: shown, but each one tagged PNG (Gmail rasterises them). Outlook 2016: empty dashed boxes.
const footer = mode => `<div class="cl-foot">${ICONS.map(n => mode === 'none'
  ? '<span class="cl-ic is-empty"></span>'
  : `<span class="cl-ic">${icon(n, 'solid', 50, BLUE)}</span>`).join('')}${mode === 'png' ? '<b class="cl-tag">.png</b>' : mode === 'svg' ? '<b class="cl-tag is-svg">.svg</b>' : '<b class="cl-tag is-none">?</b>'}</div>`
const mail = (title, mode) => `<div class="cl-win">
  <div class="cl-bar"><i></i><i></i><i></i><span>${title}</span></div>
  <div class="cl-body">
    <span class="cl-hero"></span>
    <i class="ml-sk" style="width:86%"></i><i class="ml-sk" style="width:70%"></i><i class="ml-sk" style="width:78%"></i>
    ${footer(mode)}
  </div>
</div>`
const COLS = [
  ['Apple Mail', 'svg', 'Shows the SVG', true],
  ['Gmail', 'png', 'Shows a PNG copy', null],
  ['Outlook 2016', 'none', 'Shows nothing', false],
]

export default {
  alt: 'The same newsletter open in three generic email windows: in Apple Mail its four blue contact icons show crisply, in Gmail they show but are tagged PNG, and in Outlook 2016 only empty boxes appear where the icons should be',
  bg: BG,
  art: () => COLS.map(([t, mode, v, ok], i) => {
    const x = 80 + i * 488
    return at(mail(t, mode), { x, y: 118, w: 456, h: 650 }) + at(verdict(v, ok), { cx: x + 228, cy: 848 })
  }).join(''),
  css: `${CSS}
.cl-win { box-sizing: border-box; height: 100%; display: flex; flex-direction: column; border-radius: 30px; overflow: hidden; background: #fff;
  box-shadow: 0 2px 0 rgba(17,19,24,.04), 0 44px 80px -44px rgba(17,19,24,.55); border: 1.5px solid rgba(17,19,24,.07); font-family: var(--font-display); }
.cl-bar { display: flex; align-items: center; gap: 10px; padding: 22px 24px; border-bottom: 1.5px solid rgba(17,19,24,.07); background: #F6F4EF; }
.cl-bar i { width: 15px; height: 15px; border-radius: 50%; background: rgba(17,19,24,.16); }
.cl-bar span { margin-left: 12px; font: 700 30px/1 var(--font-display); color: ${INK}; letter-spacing: -.02em; }
.cl-body { flex: 1; display: flex; flex-direction: column; gap: 16px; padding: 26px 28px; }
.cl-hero { height: 150px; border-radius: 18px; background: linear-gradient(120deg, #E3E9FF, #F2E9FF); margin-bottom: 8px; }
.cl-foot { position: relative; margin-top: auto; display: flex; justify-content: space-between; padding: 22px 18px; border-radius: 20px; background: #F6F4EF; }
.cl-ic { position: relative; width: 74px; height: 74px; display: grid; place-items: center; border-radius: 18px; background: #fff; box-shadow: 0 8px 18px -12px rgba(17,19,24,.4); }
.cl-ic.is-empty { background: none; box-shadow: none; border: 3px dashed ${rgba(INK, 0.22)}; box-sizing: border-box; }
.cl-tag { position: absolute; right: -10px; top: -26px; padding: 8px 14px; border-radius: 12px; background: ${INK}; color: #fff; font: 700 28px/1 var(--font-mono); rotate: 4deg; }
.cl-tag.is-svg { background: ${BLUE}; } .cl-tag.is-none { background: #fff; color: ${INK}; border: 3px dashed ${rgba(INK, 0.3)}; }
`,
}
