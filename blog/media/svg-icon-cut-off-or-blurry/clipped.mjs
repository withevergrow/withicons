import { at, icon, INK, rgba } from '../../tools/hero-kit.mjs'
import { B, RED, GREEN, BG, grid, LOOK_CSS } from './_look.mjs'

// Three ways to clip an icon, one card each, drawn on 24-unit graph paper with the viewBox edge as a dashed red line.
// What gets cut is shown as a faint ghost outside the edge. Under each, the fixed version with a green check.
const U = 12, S = 24 * U // px per unit, sheet size
const ok = (vis, text) => `<div class="cl-fix"><span class="lk-badge" style="background:${GREEN}">${icon('check', 'solid', 32, '#fff')}</span><span class="cl-mini">${vis}</span><b>${text}</b></div>`
const card = (vis, h, sub, fix) => `<div class="lk-card"><div class="lk-vis">${vis}</div><div class="lk-h">${h}</div><div class="lk-hand">${sub}</div><div class="cl-rule"></div>${fix}</div>`

// 1: a circle whose 2-unit stroke is centred on the viewBox edge
const ring = (r, w, id, cut) => `<svg width="${cut ? S + 72 : 96}" height="${cut ? S + 72 : 96}" viewBox="-3 -3 30 30" style="overflow:visible">
  ${cut ? `<defs><clipPath id="${id}"><rect x="0" y="0" width="24" height="24"/></clipPath></defs>
  <circle cx="12" cy="12" r="${r}" fill="none" stroke="${RED}" stroke-opacity=".45" stroke-width="${w}"/>
  <circle cx="12" cy="12" r="${r}" fill="none" stroke="${INK}" stroke-width="${w}" clip-path="url(#${id})"/>
  <rect x="0" y="0" width="24" height="24" fill="none" stroke="${RED}" stroke-width=".28" stroke-dasharray=".8 .6"/>`
    : `<circle cx="12" cy="12" r="${r}" fill="none" stroke="${INK}" stroke-width="${w}"/><rect x="0" y="0" width="24" height="24" fill="none" stroke="${GREEN}" stroke-width=".5" stroke-dasharray="1.4 1"/>`}
</svg>`
const sheet = (inner, extra = '') => `<div class="cl-sheet" style="${grid(U, 0.22)}${extra}">${inner}</div>`

export default {
  alt: 'Three cards on graph paper with a dashed red viewBox edge: a circle whose stroke spills over the edge, a bell icon whose right side is cut by a shifted viewBox, and a gear icon clipped top and bottom by a short button, each with a fixed version and a green check',
  bg: BG,
  art: () => [
    at(card(`<div class="cl-wrap">${sheet(`<span class="cl-abs" style="left:-36px;top:-36px">${ring(12, 2.2, 'cl1', true)}</span>`)}</div>`,
      'stroke on the edge', 'half the stroke is outside',
      ok(ring(10, 2.2, 'cl1b', false), 'pull it in')), { x: 64, y: 64, w: 464, h: 872 }),
    at(card(`<div class="cl-wrap cl-shift">${sheet(`<span class="cl-ghost" style="left:0">${icon('bell', 'line', S, INK)}</span>
        <div class="cl-vb" style="left:${-7 * U}px;width:${S}px"><span class="cl-abs" style="left:${7 * U}px;top:0">${icon('bell', 'line', S, INK)}</span></div>`)}</div>`,
      'wrong viewBox', 'the right side is cut',
      ok(`<span class="cl-okbox">${icon('bell', 'line', 84, INK)}</span>`, 'fix the box')), { x: 568, y: 64, w: 464, h: 872 }),
    at(card(`<div class="cl-wrap"><div class="cl-btnwrap">
        <span class="cl-ghost" style="left:${(320 - 230) / 2}px;top:${(150 - 230) / 2}px">${icon('settings', 'line', 230, INK)}</span>
        <div class="cl-btn"><span class="cl-abs" style="left:${(320 - 230) / 2}px;top:${(150 - 230) / 2}px">${icon('settings', 'line', 230, '#fff')}</span></div>
      </div></div>`,
      'parent too small', 'top and bottom hidden',
      ok(`<span class="cl-okbtn">${icon('settings', 'line', 64, '#fff')}</span>`, 'give it room')), { x: 1072, y: 64, w: 464, h: 872 }),
  ].join(''),
  css: `${LOOK_CSS}
.cl-wrap { position: relative; width: ${S}px; height: ${S}px; }
.cl-sheet { position: relative; width: ${S}px; height: ${S}px; background-color: #F6FCFD; }
.cl-abs, .cl-ghost { position: absolute; top: 0; line-height: 0; }
.cl-ghost { opacity: .2; }
.cl-wrap svg, .cl-mini svg { max-width: none; }
.cl-shift { margin-left: 70px; }
.lk-card .lk-hand { font-size: 34px; }
.cl-vb { position: absolute; top: 0; height: ${S}px; overflow: hidden; outline: 4px dashed ${RED}; outline-offset: 0; }
.cl-btnwrap { position: absolute; left: ${(S - 320) / 2}px; top: ${(S - 150) / 2}px; width: 320px; height: 150px; }
.cl-btn { position: absolute; inset: 0; overflow: hidden; border-radius: 26px; background: ${INK}; outline: 4px dashed ${RED}; outline-offset: 5px; }
.cl-rule { width: 100%; height: 2px; background: ${rgba(INK, 0.08)}; margin: 30px 0 24px; }
.cl-fix { display: flex; align-items: center; gap: 22px; height: 116px; }
.cl-fix b { font: 700 32px/1 var(--font-display); color: ${GREEN}; letter-spacing: -.02em; }
.cl-mini { display: grid; place-items: center; width: 116px; height: 116px; line-height: 0; }
.cl-okbox { display: grid; place-items: center; width: 100px; height: 100px; ${grid(100 / 24, 0.25)} background-color: #F6FCFD; outline: 3px dashed ${rgba(GREEN, 0.7)}; }
.cl-okbtn { display: grid; place-items: center; width: 112px; height: 96px; border-radius: 22px; background: ${INK}; }
`,
}
