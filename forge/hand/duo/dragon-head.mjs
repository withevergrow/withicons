// forge/hand/duo/dragon-head.mjs: a front-facing dragon head reduced to its big reads for 16px: two swept
// horns, a broad tinted head with slanted brows and nostrils, an open fanged jaw and one accent whisker per side.
const HEAD = 'M5.75 10 C5.75 6.5 8.5 4.75 12 4.75 C15.5 4.75 18.25 6.5 18.25 10 L18.75 14.5 C18.75 18.5 15.75 21.5 12 21.5 C8.25 21.5 5.25 18.5 5.25 14.5 Z'
const ACC = 'var(--with-duo-accent, currentColor)'

export default function render() {
  return [
    ['path', { d: HEAD, fill: 'var(--with-duo, currentColor)', 'fill-opacity': '0.2', stroke: 'none' }],
    ['path', { d: 'M5.4 13 C3.25 12.75 2 13.75 2 15.25 C2 16.5 3.25 16.75 3.75 16 M18.6 13 C20.75 12.75 22 13.75 22 15.25 C22 16.5 20.75 16.75 20.25 16', stroke: ACC, class: 'wm-s' }],
    ['path', { d: HEAD }],
    ['path', { d: 'M9 5.25 C7.5 4.25 6.75 3 6.75 1.5 M7.25 3.75 C6 3.75 4.75 3.25 4 2.25 M15 5.25 C16.5 4.25 17.25 3 17.25 1.5 M16.75 3.75 C18 3.75 19.25 3.25 20 2.25', class: 'wm-a' }],
    ['path', { d: 'M7.75 8.75 L10.25 10.25 M16.25 8.75 L13.75 10.25', class: 'wm-a' }],
    ['path', { d: 'M10.4 12.75 H10.6 M13.4 12.75 H13.6' }],
    ['path', { d: 'M8.25 15.25 H15.75 C15.25 17.75 13.75 19 12 19 C10.25 19 8.75 17.75 8.25 15.25 Z M10 15.25 L10.5 16.5 M14 15.25 L13.5 16.5', class: 'wm-a' }],
  ]
}
