// forge/hand/sketch/cloud-download.mjs: open doubled cloud built from the skeleton's arcs (smooth lobes), a modest
// arrow that starts under the cloud's crown and ends with a clear gap below the cloud edge; hachure on the right
// lobe only, far from the shaft.
export default function render() {
  return [
    ['path', { d: 'M16.6 12.6l2.1-1.6M16.4 10.4l1.7-1.3', 'stroke-width': 0.8, 'stroke-opacity': 0.5 }],
    ['path', { d: 'M5.1 15.3A4.6 4.6 0 0 1 6.4 6.5A6.3 6.3 0 0 1 18.3 7A4.3 4.3 0 0 1 19.4 15.2', 'stroke-width': 0.5, 'stroke-opacity': 0.5, class: 'wm-k' }],
    ['path', { d: 'M4.89 14.97A4.5 4.5 0 0 1 6.2 6.6A6.2 6.2 0 0 1 18.1 7.1A4.25 4.25 0 0 1 19.25 15', class: 'wm-k' }],
    ['path', { d: 'M12 10.2Q11.9 15.4 12 20.2M12.5 11Q12.45 15.4 12.55 19.8', 'stroke-width': 0.5, 'stroke-opacity': 0.5, class: 'wm-s' }],
    ['path', { d: 'M12 10.2Q11.9 15.4 12 20.2M9.1 17.4Q10.6 18.8 12.05 20.4Q13.5 18.8 15 17.4', class: 'wm-s' }],
  ]
}
