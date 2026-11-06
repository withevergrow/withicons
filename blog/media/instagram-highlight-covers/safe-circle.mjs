import { at, icon, card, C, INK, PAPER, rgba } from '../../tools/hero-kit.mjs'

// The 1080 x 1080 cover canvas: the circle Instagram shows (dashed, full width), the safe circle (dotted, 60%) with the
// icon inside it, the corners that get cropped away hatched. Right: a legend, then the same set at real profile size.
const X = 100, Y = 120, S = 760, CX = X + S / 2, CY = Y + S / 2, R = S / 2, RI = Math.round(S * 0.3)
const BRAND = '#EE6A4C'
const COVERS = [['shopping-bag', 'Shop'], ['star', 'Reviews'], ['help-circle', 'FAQ'], ['utensils', 'Menu'], ['mail', 'Contact']]

function canvas() {
  const hatch = `<pattern id="ig-h" width="18" height="18" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="18" height="18" fill="${rgba(INK, 0.22)}"/><rect width="7" height="18" fill="${rgba('#ffffff', 0.32)}"/></pattern>`
  return at(`<svg width="1600" height="1000" viewBox="0 0 1600 1000" fill="none">
    <defs>${hatch}<mask id="ig-m"><rect width="1600" height="1000" fill="#fff"/><circle cx="${CX}" cy="${CY}" r="${R}" fill="#000"/></mask></defs>
    <rect x="${X}" y="${Y}" width="${S}" height="${S}" rx="8" fill="${BRAND}"/>
    <rect x="${X}" y="${Y}" width="${S}" height="${S}" rx="8" fill="url(#ig-h)" mask="url(#ig-m)"/>
    <circle cx="${CX}" cy="${CY}" r="${R - 3}" stroke="#fff" stroke-width="6" stroke-dasharray="22 14"/>
    <circle cx="${CX}" cy="${CY}" r="${RI}" stroke="#fff" stroke-width="6" stroke-dasharray="1 16" stroke-linecap="round"/>
    <path d="M${CX + R * 0.866} ${CY - R * 0.5} L 948 222" stroke="${INK}" stroke-width="3"/><circle cx="${CX + R * 0.866}" cy="${CY - R * 0.5}" r="9" fill="${INK}" stroke="#fff" stroke-width="4"/>
    <path d="M${CX + RI * 0.94} ${CY - RI * 0.34} L 948 352" stroke="${INK}" stroke-width="3"/><circle cx="${CX + RI * 0.94}" cy="${CY - RI * 0.34}" r="9" fill="${INK}" stroke="#fff" stroke-width="4"/>
    <path d="M${X + S - 40} ${Y + S - 40} L 948 482" stroke="${INK}" stroke-width="3"/><circle cx="${X + S - 40}" cy="${Y + S - 40}" r="9" fill="${INK}" stroke="#fff" stroke-width="4"/>
  </svg>`, { x: 0, y: 0 })
}
const legend = (y, title, sub) => at(`<div class="lg"><b>${title}</b><span>${sub}</span></div>`, { x: 960, y })

function row() {
  const items = COVERS.map(([n, l], i) => `<div class="pr"><div class="pr__c${i ? '' : ' is-on'}">${icon(n, 'solid', 34, '#fff')}</div><span>${l}</span></div>`).join('')
  return card(`<div class="row__t">On your profile</div><div class="row">${items}</div>`, { x: 960, y: 620, w: 576, h: 260, pad: '26px 28px', radius: 32 })
}

export default {
  alt: 'A square orange 1080 by 1080 cover with a white shopping bag icon inside a dotted safe circle, a dashed circle showing what Instagram displays, hatched corners that get cropped, and the same set of five covers shown tiny in a profile row',
  bg: `radial-gradient(120% 90% at 70% 20%, #FFFFFF 0%, ${PAPER} 60%, #F5EEE4 100%)`,
  art: () => [
    canvas(),
    at(icon('shopping-bag', 'solid', 300, '#fff'), { cx: CX, cy: CY }),
    at(`<span class="dim">1080 x 1080 px</span>`, { x: X + 22, y: Y + 22 }),
    legend(196, 'What Instagram shows', 'the full circle'),
    legend(326, 'Keep the icon in here', 'the middle 60%'),
    legend(456, 'Cropped away', 'the corners'),
    row(),
  ].join(''),
  css: `
.dim { display: inline-block; padding: 8px 14px; border-radius: 999px; background: #fff; font: 700 28px/1 var(--font-mono); color: ${INK}; }
.lg { display: flex; flex-direction: column; gap: 6px; font-family: var(--font-display); color: ${INK}; }
.lg b { font-weight: 800; font-size: 40px; letter-spacing: -.02em; line-height: 1; }
.lg span { font-size: 28px; color: #5A606D; }
.row__t { font: 800 30px/1 var(--font-display); letter-spacing: -.02em; margin-bottom: 26px; color: ${C.solid.text}; }
.row { display: flex; justify-content: space-between; }
.pr { display: flex; flex-direction: column; align-items: center; gap: 12px; }
.pr span { font: 600 26px/1 var(--font-display); color: ${INK}; }
.pr__c { width: 80px; height: 80px; border-radius: 50%; display: grid; place-items: center; background: ${BRAND}; box-shadow: 0 0 0 4px #fff, 0 0 0 6px #E2DCD3; }
.pr__c.is-on { box-shadow: 0 0 0 4px #fff, 0 0 0 8px ${INK}; }
`,
}
