// forge/hand/rangoli/avatar-ghost.mjs: ghost avatar as a head+shoulders bust like its rangoli avatar siblings
// (pale glowing ghost head with a wavy hem resting on a flat c4 garment), big solid ink face that holds at 16px.
const head = (dx, dy) => {
  const x = v => +(v + dx).toFixed(2), y = v => +(v + dy).toFixed(2)
  return `M${x(5.5)} ${y(16.5)}V${y(10.5)}A6.5 6.5 0 0 1 ${x(18.5)} ${y(10.5)}V${y(16.5)}` +
    `C${x(18.5)} ${y(17.6)} ${x(17.4)} ${y(18.1)} ${x(16.6)} ${y(17.4)}C${x(15.8)} ${y(16.7)} ${x(14.9)} ${y(16.7)} ${x(14.2)} ${y(17.4)}` +
    `C${x(13.5)} ${y(18.1)} ${x(12.5)} ${y(18.1)} ${x(12)} ${y(17.6)}C${x(11.5)} ${y(18.1)} ${x(10.5)} ${y(18.1)} ${x(9.8)} ${y(17.4)}` +
    `C${x(9.1)} ${y(16.7)} ${x(8.2)} ${y(16.7)} ${x(7.4)} ${y(17.4)}C${x(6.6)} ${y(18.1)} ${x(5.5)} ${y(17.6)} ${x(5.5)} ${y(16.5)}Z`
}
const shoulders = 'M6 21.6C6 19.7 7.6 18.6 9.4 18.6H14.6C16.4 18.6 18 19.7 18 21.6V21.7C18 22.2 17.6 22.5 17.1 22.5H6.9C6.4 22.5 6 22.2 6 21.7Z'

export default function render() {
  const g = 'wg-rangoli-avatar-ghost-0'
  return [
    ['defs', {}, [
      ['radialGradient', { id: g, cx: 9.5, cy: 7.5, r: 13, gradientUnits: 'userSpaceOnUse' }, [
        ['stop', { offset: 0, 'stop-color': 'var(--with-rangoli-shine, #FFFFFF)' }],
        ['stop', { offset: 0.55, 'stop-color': 'var(--with-rangoli-tint, #F1EAFB)' }],
        ['stop', { offset: 1, 'stop-color': 'var(--with-rangoli-accent, #C9B8EC)' }],
      ]],
    ]],
    ['path', { d: head(0.3, 0.5), fill: 'var(--with-rangoli-ink, #2B1660)', 'fill-opacity': 0.3, class: 'wm-shadow' }],
    ['path', { d: shoulders, fill: 'var(--with-rangoli-c4, #F2A01B)', class: 'wm-a' }],
    ['path', { d: head(0, 0), fill: `url(#${g})`, stroke: 'var(--with-rangoli-ink, #2B1660)', 'stroke-width': 0.8, 'stroke-linejoin': 'round', class: 'wm-k' }],
    ['ellipse', { cx: 8.3, cy: 13.4, rx: 0.9, ry: 0.55, fill: 'var(--with-rangoli-c3, #E81F7A)', 'fill-opacity': 0.5, class: 'wm-deco' }],
    ['ellipse', { cx: 15.7, cy: 13.4, rx: 0.9, ry: 0.55, fill: 'var(--with-rangoli-c3, #E81F7A)', 'fill-opacity': 0.5, class: 'wm-deco' }],
    ['ellipse', { cx: 9.6, cy: 11, rx: 1.25, ry: 1.6, fill: 'var(--with-rangoli-ink, #2B1660)', class: 'wm-k' }],
    ['ellipse', { cx: 14.4, cy: 11, rx: 1.25, ry: 1.6, fill: 'var(--with-rangoli-ink, #2B1660)', class: 'wm-k' }],
    ['ellipse', { cx: 12, cy: 14.3, rx: 1, ry: 1.2, fill: 'var(--with-rangoli-ink, #2B1660)', class: 'wm-k' }],
    ['circle', { cx: 10, cy: 10.4, r: 0.4, fill: 'var(--with-rangoli-shine, #FFFFFF)', class: 'wm-shine' }],
    ['circle', { cx: 14.8, cy: 10.4, r: 0.4, fill: 'var(--with-rangoli-shine, #FFFFFF)', class: 'wm-shine' }],
  ]
}
