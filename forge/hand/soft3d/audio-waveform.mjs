// forge/hand/soft3d/audio-waveform.mjs — the line drawing's waveform (flat lead-in, rising and falling peaks, flat tail)
// as one soft round tube: thick round joins, a darker underside, a lit upper edge, replacing the generated spiky shards.
const v = (r, h) => `var(--with-soft3d-${r}, ${h})`
const TUBE = v('c1', '#F5A524')
const SH = v('shadow', '#1D2130'), SN = v('shine', '#FFFFFF')
const P = (d, a, cls) => ['path', { d, ...a, class: cls }]
const S = (d, stroke, w, extra, cls) => P(d, { fill: 'none', stroke, 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', ...extra }, cls)

export default function render() {
  const wave = (dx, dy) => {
    const p = [[2.6, 12], [4.2, 12], [6.6, 7.9], [9, 16.6], [12, 5], [15, 19], [17.4, 8.9], [19.4, 13.4], [20.2, 12], [21.4, 12]]
    return p.map(([x, y], i) => `${i ? 'L' : 'M'}${+(x + dx).toFixed(2)} ${+(y + dy).toFixed(2)}`).join(' ')
  }
  return [
    P('M2.6 21.2 A9.4 1.6 0 1 0 21.4 21.2 A9.4 1.6 0 1 0 2.6 21.2 Z', { fill: SH, 'fill-opacity': 0.06 }, 'wm-shadow'),
    P('M4.4 21.2 A7.6 1.25 0 1 0 19.6 21.2 A7.6 1.25 0 1 0 4.4 21.2 Z', { fill: SH, 'fill-opacity': 0.08 }, 'wm-shadow'),
    P('M6.6 21.2 A5.4 0.9 0 1 0 17.4 21.2 A5.4 0.9 0 1 0 6.6 21.2 Z', { fill: SH, 'fill-opacity': 0.11 }, 'wm-shadow'),
    // the tube: darker underside, body, a softer lit band, a bright thin edge
    S(wave(0.25, 0.5), SH, 2.8, { 'stroke-opacity': 0.4 }, 'wm-k'),
    S(wave(0, 0), TUBE, 2.8, {}, 'wm-k'),
    S(wave(0.1, 0.25), SH, 1, { 'stroke-opacity': 0.14 }, 'wm-k'),
    S(wave(-0.2, -0.35), SN, 1.1, { 'stroke-opacity': 0.28 }, 'wm-shine'),
    S(wave(-0.4, -0.6), SN, 0.5, { 'stroke-opacity': 0.8 }, 'wm-shine'),
  ]
}
