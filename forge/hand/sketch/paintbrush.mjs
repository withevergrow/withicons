// forge/hand/sketch/paintbrush.mjs — large diagonal brush: long handle, banded ferrule, broad fan bristle head with hatch.
const HANDLE = 'M20.6 3.4Q21.3 4.1 20.7 4.8L15.3 10.6Q14.4 9.6 13.4 8.7L19.2 3.3Q19.9 2.7 20.6 3.4Z'
const FERRULE = 'M13.4 8.7L10.9 11.2Q12.6 12.4 12.8 13.1L15.3 10.6M12.1 9.95L14.05 11.9'
const HEAD = 'M10.9 11.2Q8.2 11.6 6.6 13.5Q4.6 16 3.2 20.8Q8 19.4 10.5 17.4Q12.4 15.8 12.8 13.1Q11.9 11.9 10.9 11.2Z'
const HATCH = 'M5.2 18.8L9.2 14.8M6.6 18.7L10.6 14.7M5.3 16.6L8.2 13.7'
export default function render() {
  return [
    ['path', { d: HEAD.replace(/Z$/, ''), 'stroke-width': 0.5, 'stroke-opacity': 0.5, class: 'wm-k' }],
    ['path', { d: HATCH, 'stroke-width': 0.9, 'stroke-opacity': 0.6, class: 'wm-k' }],
    ['path', { d: HEAD, class: 'wm-k' }],
    ['path', { d: FERRULE, class: 'wm-k' }],
    ['path', { d: HANDLE, class: 'wm-a' }],
  ]
}
