// kawaii cast: screen with a plain fill, cast waves in the corner, cute face.
export default function render() {
  const face = 'var(--with-kawaii-face, currentColor)';
  const shine = 'var(--with-kawaii-shine, #FFFFFF)';
  return [
    ['path', { d: 'M4 4H20A2 2 0 0 1 22 6V18A2 2 0 0 1 20 20H4A2 2 0 0 1 2 18V6A2 2 0 0 1 4 4Z', fill: 'var(--with-kawaii-fill-6, #A98BFF)', 'fill-opacity': '0.58', stroke: 'none' }],
    ['path', { d: 'M9.26 11.6a1.11 .68 0 1 0 2.21 0a1.11 .68 0 1 0 -2.21 0ZM17.73 11.6a1.11 .68 0 1 0 2.21 0a1.11 .68 0 1 0 -2.21 0Z', fill: 'var(--with-kawaii-blush, #FF6F9C)', 'fill-opacity': '0.55', stroke: 'none' }],
    ['path', { d: 'M8 6.6H5.2L5 6.65L4.72 6.8', stroke: shine, 'stroke-width': '0.85', 'stroke-opacity': '0.9', class: 'wm-shine' }],
    ['path', { d: 'M2 6.5V6A2 2 0 0 1 4 4H20A2 2 0 0 1 22 6V18A2 2 0 0 1 20 20H15.5', class: 'wm-k' }],
    ['path', { d: 'M2 19A1 1 0 0 1 3 20H2V19ZM2 15A5 5 0 0 1 7 20M2 11A9 9 0 0 1 11 20', class: 'wm-a' }],
    ['path', { d: 'M10.97 10.6a.97 .97 0 1 0 1.94 0a.97 .97 0 1 0 -1.94 0ZM16.28 10.6a.97 .97 0 1 0 1.94 0a.97 .97 0 1 0 -1.94 0Z', fill: face, stroke: 'none' }],
    ['path', { d: 'M13.47 11.37Q14.04 12.16 14.6 11.48Q15.17 12.16 15.73 11.37', stroke: face, 'stroke-width': '0.62' }],
    ['path', { d: 'M11.32 10.27a.33 .33 0 1 0 .66 0a.33 .33 0 1 0 -.66 0ZM16.63 10.27a.33 .33 0 1 0 .66 0a.33 .33 0 1 0 -.66 0Z', fill: shine, stroke: 'none', class: 'wm-shine' }],
  ];
}
