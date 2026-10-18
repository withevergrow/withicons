// forge/hand/kawaii/avatar-older-man.mjs: bald head with two grey side tufts (outlined in ink so white hair never merges
// with the sticker rim), fluffy moustache over a tiny smile, round glinting eyes, blush, slate shirt. Same construction as
// avatar-man (fills first, outlines on top) at the same 1.4 outline weight.
const SKIN = 'var(--with-kawaii-c1, #F3D1B5)'
const HAIR = 'var(--with-kawaii-c2, #CFD3D9)'
const SHIRT = 'var(--with-kawaii-c4, #8D97B0)'
const BLUSH = 'var(--with-kawaii-blush, #FF6F9C)'
const FACE = 'var(--with-kawaii-face, #34231E)'
const SHINE = 'var(--with-kawaii-shine, #FFFFFF)'

const HEAD = 'M6.5 10.5A5.5 6 0 1 0 17.5 10.5A5.5 6 0 1 0 6.5 10.5Z'
const TUFT_L = 'M8.2 5.9C6.4 6.2 4.9 7.6 4.6 9.6C4.4 10.9 5.2 11.9 6.6 12.2A5.5 6 0 0 1 8.2 5.9Z'
const TUFT_R = 'M15.8 5.9C17.6 6.2 19.1 7.6 19.4 9.6C19.6 10.9 18.8 11.9 17.4 12.2A5.5 6 0 0 0 15.8 5.9Z'
const MOUSTACHE = 'M12 13.3C11.3 12.6 10.1 12.6 9.4 13.3C8.9 13.8 9.1 14.5 9.8 14.6C10.6 14.7 11.5 14.4 12 13.9C12.5 14.4 13.4 14.7 14.2 14.6C14.9 14.5 15.1 13.8 14.6 13.3C13.9 12.6 12.7 12.6 12 13.3Z'
const BODY = 'M4.5 21.5C4.5 19.25 6.25 18 8.5 18C9.75 18 10.75 18.75 12 18.75C13.25 18.75 14.25 18 15.5 18C17.75 18 19.5 19.25 19.5 21.5'
const disc = (x, y, r) => `M${x - r} ${y}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0Z`

export default function render() {
  return [
    ['path', { d: HEAD, fill: SKIN, 'fill-opacity': 0.94, stroke: 'none' }],
    ['path', { d: TUFT_L + TUFT_R, fill: HAIR, 'fill-opacity': 0.95, stroke: 'none' }],
    ['path', { d: BODY + 'Z', fill: SHIRT, 'fill-opacity': 0.82, stroke: 'none' }],
    ['path', { d: 'M6.75 12.3a1.1 .7 0 1 0 2.2 0a1.1 .7 0 1 0 -2.2 0ZM15.05 12.3a1.1 .7 0 1 0 2.2 0a1.1 .7 0 1 0 -2.2 0Z', fill: BLUSH, 'fill-opacity': 0.6, stroke: 'none' }],
    ['path', { d: 'M11.2 4.7L10.3 4.9L9.6 5.3', stroke: SHINE, 'stroke-width': 0.85, 'stroke-opacity': 0.9, class: 'wm-shine' }],
    ['path', { d: HEAD, 'stroke-width': 1.4, class: 'wm-k' }],
    ['path', { d: TUFT_L + TUFT_R + BODY, 'stroke-width': 1.4, class: 'wm-a' }],
    ['path', { d: 'M8.5 8.3Q9.4 7.7 10.4 8.2M13.6 8.2Q14.6 7.7 15.5 8.3', stroke: FACE, 'stroke-width': 0.7, 'stroke-opacity': 0.6 }],
    ['path', { d: disc(9.6, 10.5, 1) + disc(14.4, 10.5, 1), fill: FACE, stroke: 'none' }],
    ['path', { d: MOUSTACHE, fill: HAIR, stroke: FACE, 'stroke-width': 0.5 }],
    ['path', { d: 'M11.1 15.5Q12 16.3 12.9 15.5', stroke: FACE, 'stroke-width': 0.65 }],
    ['path', { d: disc(9.95, 10.15, 0.34) + disc(14.75, 10.15, 0.34), fill: SHINE, stroke: 'none', class: 'wm-shine' }],
  ]
}
