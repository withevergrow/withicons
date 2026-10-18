// forge/hand/solid/sky-lantern.mjs — solid sky lantern: one tapered paper body, a single flame cutout, and one heavy tassel.
export default function render() {
  return [
    ['path', {
      d: 'M7.2 2.5H16.8Q18.2 2.5 18.4 3.9L19.5 15.6Q19.6 17 18.2 17H5.8Q4.4 17 4.5 15.6L5.6 3.9Q5.8 2.5 7.2 2.5Z' +
        'M12 7.5Q14.5 10.4 14.5 12A2.5 2.5 0 0 1 9.5 12Q9.5 10.4 12 7.5Z',
      'fill-rule': 'evenodd', class: 'wm-k',
    }],
    ['path', { d: 'M9.5 18.5H14.5L13.6 20.4Q13.2 21.5 12 21.5Q10.8 21.5 10.4 20.4Z', class: 'wm-a' }],
  ]
}
