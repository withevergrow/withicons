import { at, icon, C, INK, rgba } from '../../tools/hero-kit.mjs'

// One sprite symbol (the duo home icon, its tint and accent written as CSS variables), shown three times. Each tile
// sets only color, --with-duo and --with-duo-accent on the outer svg; a swatch legend under each lists the three.
const B = C.blueprint
const SETS = [
  { bg: '#fff', ink: '#1E3A8A', tint: '#38BDF8', acc: '#F59E0B', fg: INK },
  { bg: '#fff', ink: '#15803D', tint: '#6EE7B7', acc: '#FB7185', fg: INK },
  { bg: '#15171E', ink: '#FFFFFF', tint: '#A78BFA', acc: '#F472B6', fg: '#F4F0E8' },
]
const legend = s => [['color', s.ink], ['--with-duo', s.tint], ['--with-duo-accent', s.acc]]
  .map(([k, v]) => `<li><i style="background:${v}"></i>${k}</li>`).join('')
const tile = s => `<div class="rc-tile" style="background:${s.bg};color:${s.fg}">
  <div class="rc-ic" style="--with-duo:${s.tint};--with-duo-accent:${s.acc}">${icon('home', 'duo', 300, s.ink)}</div>
  <ul class="rc-leg">${legend(s)}</ul></div>`

export default {
  alt: 'The same duo home icon from one sprite symbol in three colour sets: navy with sky tint and amber door, green with mint tint and coral door, and white on a dark tile with violet tint and pink door, each with a legend of its CSS values',
  bg: `radial-gradient(${rgba(INK, 0.1)} 2px, transparent 2.5px) 0 0 / 36px 36px, linear-gradient(180deg, #FBF8F3, #F3EEE4)`,
  art: () => [
    at(`<div class="rc-strip">${icon('layers', 'blueprint', 44, B.c)}<b>same symbol, no file edits</b><code>#with-home</code></div>`, { cx: 800, cy: 118 }),
    ...SETS.map((s, i) => at(tile(s), { x: 64 + i * 504, y: 200, w: 464, h: 736 })),
  ].join(''),
  css: `
.rc-strip { display: flex; align-items: center; gap: 18px; padding: 18px 20px 18px 26px; border-radius: 999px; background: #fff; box-shadow: 0 24px 50px -28px rgba(17,19,24,.5); white-space: nowrap; }
.rc-strip b { font: 800 40px/1 var(--font-display); letter-spacing: -.03em; color: ${INK}; }
.rc-strip code { font: 700 30px/1 var(--font-mono); color: ${B.text}; background: ${B.soft}; padding: 12px 20px; border-radius: 999px; margin-left: 8px; }
.rc-tile { box-sizing: border-box; height: 100%; border-radius: 36px; padding: 40px 36px; display: flex; flex-direction: column; align-items: center; justify-content: space-between; box-shadow: 0 2px 0 rgba(17,19,24,.04), 0 40px 80px -40px rgba(17,19,24,.5); border: 1.5px solid rgba(17,19,24,.06); }
.rc-ic { flex: 1; display: grid; place-items: center; }
.rc-leg { list-style: none; margin: 0; padding: 22px 0 0; width: 100%; border-top: 2px solid ${rgba('#888888', 0.2)}; display: flex; flex-direction: column; gap: 14px; }
.rc-leg li { display: flex; align-items: center; gap: 16px; font: 600 29px/1 var(--font-mono); }
.rc-leg i { flex: none; width: 34px; height: 34px; border-radius: 10px; box-shadow: inset 0 0 0 2px rgba(127,127,127,.35); }
`,
}
