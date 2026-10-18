// forge/hand/solid/mail-open.mjs — solid open envelope: the flap rises as a roof and the mouth is an open V cut into the body, so it no longer reads as a diamond in a box.
export default function render() {
  return [
    ['path', {
      d: 'M1.5 10.2Q1.5 9.4 2.2 8.9L11.1 2.8Q12 2.2 12.9 2.8L21.8 8.9Q22.5 9.4 22.5 10.2V19.5Q22.5 22 20 22H4Q1.5 22 1.5 19.5Z' +
        'M4.75 10.5H19.25Q20.3 10.5 19.5 11.1L12.75 15.95Q12 16.5 11.25 15.95L4.5 11.1Q3.7 10.5 4.75 10.5Z',
      'fill-rule': 'evenodd', class: 'wm-k',
    }],
  ]
}
