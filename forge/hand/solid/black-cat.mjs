// forge/hand/solid/black-cat.mjs — solid black cat whose tail rises from the hip with a clear 2u gap to the back, so the silhouette never fuses into a blob, and the big slit-pupil eyes of the skeleton cut out of the head.
export default function render() {
  return [
    ['path', {
      d: 'M15.28 3.03L14.88 3.22L14.59 3.6L14.17 4.8L13.9 6L13.84 6.06L12.8 5.67L11.76 5.51L10.8 5.56L9.76 5.83L9.2 6.1L8.72 6.39L7.83 7.12L6.96 8.12L6.23 9.28L5.58 10.64L5.08 12.08L4.93 12.8L4.82 13.92L4.78 15.36L5 21.04L5.04 21.28L5.15 21.52L5.28 21.69L5.52 21.87L5.92 21.99L8.08 21.99L8.4 21.91L8.72 21.69L8.9 21.44L8.99 21.12L9.23 16.72L9.59 16.4L10.24 16.04L10.88 15.84L11.68 15.75L12.48 15.83L13.05 16L13.52 16.24L14 16.64L14.26 21.12L14.35 21.44L14.61 21.76L14.88 21.93L15.2 22L17.6 21.99L17.84 21.94L18.08 21.81L18.4 21.44L18.5 20.96L18.25 13.84L18.31 13.36L18.4 13.2L18.88 13.09L19.52 12.86L20 12.61L20.4 12.33L20.8 11.99L21.2 11.53L21.69 10.72L21.92 10.16L22.06 9.68L22.24 8.48L22.21 6.96L22.09 6L21.75 4.56L21.41 3.6L21.2 3.29L20.88 3.08L20.48 3L20.24 3.04L20 3.14L19.76 3.33L18.36 4.72L17.76 4.75L17.6 4.68L16.08 3.19L15.68 3.02Z' +
        // eyes: the skeleton's big slit-pupil eyes, each two half-almond holes that leave a thin vertical pupil of ink
        'M16.4 7C14.6 7.6 14.6 10.4 16.4 11C16.05 10 16.05 8 16.4 7Z' +
        'M16.4 7C18.2 7.6 18.2 10.4 16.4 11C16.75 10 16.75 8 16.4 7Z' +
        'M19.6 7C17.8 7.6 17.8 10.4 19.6 11C19.25 10 19.25 8 19.6 7Z' +
        'M19.6 7C21.4 7.6 21.4 10.4 19.6 11C19.95 10 19.95 8 19.6 7Z',
      'fill-rule': 'evenodd',
    }],
    ['path', {
      d: 'M5.2 19.6C2.9 19.1 2 17 2 14.5C2 12 2.75 10 2.75 8C2.75 6.4 2.4 5.2 2.25 4.25',
      fill: 'none', stroke: 'currentColor', 'stroke-width': 2, 'stroke-linecap': 'round', class: 'wm-a',
    }],
  ]
}
