import { at, icon, INK, rgba } from '../../tools/hero-kit.mjs'
import { BG, CSS, O, B, plate, bare } from './_kit.mjs'

// The minimal favicon set as five labelled cards (ICO, SVG, Apple touch icon, the two manifest PNGs, the optional
// maskable icon), all wearing one orange solid rocket. Below, three faded, crossed-out cards for what to drop.
const card = (x, w, preview, size, file, o = {}) => at(`<div class="fv-card">
  <div class="st-pre${o.check ? ' fv-check' : ''}">${preview}${o.tag ? `<span class="fv-chip is-soft st-tag">${o.tag}</span>` : ''}</div>
  <div class="st-lab"><b>${size}</b><span class="fv-mono">${file}</span></div>
</div>`, { x, y: 150, w, h: 548 })

const skip = (x, w, text) => at(`<div class="st-skip">${icon('close', 'line', 34, '#B4AFA6')}<span class="fv-mono">${text}</span></div>`, { x, y: 770, w, h: 130 })

export default {
  alt: 'Five white cards showing the favicon files to ship, each with an orange rocket: favicon.ico at 16, 32 and 48 px, favicon.svg with a sun and moon, a 180 px Apple touch icon, 192 and 512 px manifest icons, and an optional maskable icon in a dashed circle; below, mstile, browserconfig.xml and old Apple sizes are crossed out',
  bg: BG,
  art: () => [
    at(`<span class="fv-chip is-b">${icon('check', 'line', 32, '#fff')}Ship</span><span class="st-note">5 files, plus 1 if people install your site</span>`, { x: 64, y: 70, cls: 'st-head' }),
    card(64, 240, `<div class="st-ico">${plate(32, { k: 0.72 })}${plate(64, { k: 0.66 })}${plate(96)}</div>`, '32 px', 'favicon.ico'),
    card(320, 240, `<div class="st-svg">${plate(150)}<span class="st-sm">${icon('sun', 'solid', 34, '#F2A100')}${icon('moon', 'solid', 30, '#3B3F5C')}</span></div>`, 'any size', 'favicon.svg'),
    card(576, 290, plate(180, { round: 42 }), '180 px', 'apple-touch-<br>icon.png'),
    card(882, 350, `<div class="st-two">${bare(112)}${bare(196)}</div>`, '192 + 512', 'icon-192.png<br>icon-512.png', { check: true }),
    card(1248, 288, `<div class="st-mask">${plate(214, { round: 0, k: 0.46 })}<i></i></div>`, '512 px', 'icon-maskable-<br>512.png', { tag: 'optional' }),
    at(`<span class="fv-chip is-ink">Skip</span>`, { x: 64, y: 808 }),
    skip(210, 380, 'mstile-*.png'),
    skip(610, 440, 'browserconfig.xml'),
    skip(1070, 466, '57, 72, 114, 152 px'),
  ].join(''),
  css: `${CSS}
.st-head { display: flex; align-items: center; gap: 22px; }
.st-note { font: 600 30px/1 var(--font-display); color: #5A606D; letter-spacing: -.01em; }
.st-pre { position: relative; flex: 1; display: grid; place-items: center; background: #F7F4EE; border-bottom: 1.5px solid rgba(17,19,24,.06); }
.st-lab { display: flex; flex-direction: column; gap: 12px; padding: 24px 22px 0; height: 168px; box-sizing: border-box; }
.st-lab b { font: 800 44px/1 var(--font-display); letter-spacing: -.03em; }
.st-lab .fv-mono { color: ${B.text}; word-break: break-word; }
.st-ico { display: flex; align-items: flex-end; gap: 10px; }
.st-svg { position: relative; }
.st-sm { position: absolute; right: -26px; top: -26px; display: flex; gap: 6px; padding: 10px 14px; border-radius: 999px; background: #fff; box-shadow: 0 10px 24px -12px rgba(17,19,24,.5); }
.st-pre.fv-check { background: repeating-conic-gradient(#ECE8DF 0 25%, #FBF9F5 0 50%) 0 0 / 32px 32px; }
.st-two { display: flex; align-items: flex-end; gap: 22px; }
.st-tag { position: absolute; right: 16px; top: 16px; font-size: 28px; padding: 8px 16px; }
.st-mask { position: relative; display: grid; place-items: center; }
.st-mask i { position: absolute; width: 172px; height: 172px; border-radius: 50%; border: 4px dashed #fff; }
.st-skip { box-sizing: border-box; height: 100%; display: flex; align-items: center; gap: 16px; padding: 0 28px; border-radius: 28px; background: ${rgba('#ffffff', 0.55)}; border: 2px dashed rgba(17,19,24,.14); color: #A39E95; }
.st-skip .fv-mono { font-size: 30px; text-decoration: line-through; text-decoration-thickness: 3px; text-decoration-color: ${rgba(O.c, 0.7)}; }
`,
}
