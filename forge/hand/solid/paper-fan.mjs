// forge/hand/solid/paper-fan.mjs — solid folding fan: three broad blades split by clear paper gaps, round pivot below.
export default function render() {
  return [
    ['path', {
      d: 'M12 18.2L2.6 10.4A10.5 10.5 0 0 1 8.3 4.2Z' +
        'M12 18.2L9.9 3.7A10.5 10.5 0 0 1 14.1 3.7Z' +
        'M12 18.2L15.7 4.2A10.5 10.5 0 0 1 21.4 10.4Z',
      class: 'wm-k',
    }],
    ['circle', { cx: 12, cy: 19, r: 2.5, class: 'wm-a' }],
  ]
}
