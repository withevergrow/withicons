import { at, icon } from '../../tools/hero-kit.mjs'
import { O, OK, BAD, CHECKER, CSS, INK, PAPER, rgba } from './_look.mjs'

// 2 x 2 cards: the same orange duo rocket on a peach "slide", four ways. Each card: the slide, a title, the fix.
const CARDS = [
  ['Pasted', 'Insert the file', `background:${INK}`, false],
  ['Saved as JPG', 'Save as PNG', 'background:#fff;box-shadow:0 0 0 2px rgba(17,19,24,.08)', false],
  ['Fake PNG', 'Get a new copy', `background:${CHECKER(36)}`, false],
  ['Real PNG or SVG', 'Done', 'background:transparent', true],
]
const card = ([t, fix, box, ok], i) => `<div class="lk-card fc"><div class="fc__slide"><div class="fc__box" style="${box}">${icon('rocket', 'duo', 150, O.c)}</div></div>
  <div class="fc__txt"><div class="fc__head"><span class="lk-num" style="${ok ? `background:${OK}` : ''}">${ok ? icon('check', 'line', 32, '#fff') : i + 1}</span><span class="lk-t">${t}</span></div>
  <span class="lk-tag ${ok ? 'is-ok' : 'is-o'}">${icon(ok ? 'check' : 'arrow-right', 'line', 30)}${fix}</span></div></div>`

export default {
  bg: PAPER,
  alt: 'Four cards with the same orange rocket icon on a peach slide: in a black square when pasted, in a white square when saved as JPG, on a baked-in checkerboard as a fake PNG, and floating cleanly as a real PNG or SVG, each with its fix',
  art: () => CARDS.map((c, i) => at(card(c, i), { x: i % 2 ? 820 : 64, y: i < 2 ? 64 : 520, w: 716, h: 416, cls: 'lk' })).join(''),
  css: `${CSS}
.fc { display: flex; align-items: center; gap: 36px; padding: 0 36px; }
.fc__slide { flex: none; width: 300px; height: 300px; border-radius: 26px; background: #FCE6D8; display: grid; place-items: center; }
.fc__box { width: 210px; height: 210px; display: grid; place-items: center; }
.fc__txt { display: flex; flex-direction: column; align-items: flex-start; gap: 30px; }
.fc__head { display: flex; flex-direction: column; align-items: flex-start; gap: 16px; }
`,
}
