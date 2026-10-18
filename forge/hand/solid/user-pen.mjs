// forge/hand/solid/user-pen.mjs — solid user with a pen badge; shoulders pulled in and the pen kept 3u clear so the nib reads at 16px.
export default function render() {
  return [
    ['circle', { cx: 8.25, cy: 7.5, r: 4.25 }],
    ['path', { d: 'M1.5 20.75V19.5Q1.5 14.5 6.5 14.5H8.5Q10 14.5 10 16V21Q10 22 9 22H2.75Q1.5 22 1.5 20.75Z' }],
    ['path', {
      d: 'M18.19 12.99A2 2 0 0 1 21.01 15.81L15.68 21.14L12.86 18.32Z' +
        'M12.57 19.31L14.69 21.43L12.95 21.96Q12.2 22.15 12.3 21.4Z',
      class: 'wm-s',
    }],
  ]
}
