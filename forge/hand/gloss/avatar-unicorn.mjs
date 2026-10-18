// forge/hand/gloss/avatar-unicorn.mjs: unicorn head in 3/4 view facing left, ringed horn, ear, flowing mane, eye and nostril.
const r = (n) => Math.round(n * 100) / 100
const ell = (cx, cy, rx, ry) => `M${r(cx - rx)} ${cy}a${rx} ${ry} 0 1 0 ${r(2 * rx)} 0a${rx} ${ry} 0 1 0 ${r(-2 * rx)} 0Z`
export default function render() {
  const head = 'M9.6 7.2C7.5 8.6 5.6 11 4.5 13.6C3.9 15.1 4.5 16.9 6.1 17.2C7.6 17.5 9 16.9 10.4 16.3C10.8 18.3 10.2 20.3 9 22H17.5C16.9 18.5 16.8 15 16 11.5C15.6 9.6 15.1 8 14.6 6.8L14 3.6L12 6.5C11.2 6.5 10.4 6.7 9.6 7.2Z'
  const eye = ell(10.8, 11.2, 1, 1.2)
  const nostril = ell(6, 15.3, 0.55, 0.65)
  const shine = 'M12.2 18.6C12.6 17.4 12.6 16.2 12.3 15C13 16.1 13.2 17.4 12.9 18.6Z'
  // horn: three stacked bands from base (9.4,6.4)-(11.9,5.5) to tip (7.4,1.4)
  const horn = 'M9.3 6.4L11.9 5.4L11.3 4.7L9 5.6ZM8.8 5L11 4.1L10.3 3.3L8.5 4ZM8.3 3.4L9.9 2.7L7.4 1.4Z'
  return [
    ['path', { d: head + eye + nostril + shine, 'fill-rule': 'evenodd', class: 'wm-k' }],
    ['path', { d: 'M15.6 5.5C18.2 5.4 20.3 7.1 20.6 9.6C20.9 12 20 13.5 21 15.6C21.6 17.1 21 19.6 19.6 21.6C19.8 19.1 19.1 17.6 18.3 16C17.7 13.5 17.6 11 16.9 9C16.6 7.8 16.1 6.6 15.6 5.5Z', class: 'wm-a' }],
    ['path', { d: horn, class: 'wm-s' }],
    ['circle', { cx: 11.1, cy: 11.4, r: 0.45 }],
  ]
}
