// forge/hand/sketch/move.mjs — a clean pencil cross with four single-stroke chevron heads and faint second passes kept
// off the centre, replacing crossed head arms with tick blobs at every tip that muddied the cross at 16px.
export default function render() {
  return [
    ['path', { d: 'M11.8 4.1Q12.05 6.6 11.9 9.3M12.15 14.8Q11.9 17.5 12.05 19.9M4.1 12.2Q6.6 11.95 9.3 12.1M14.8 11.85Q17.5 12.1 19.9 11.95', 'stroke-width': 0.5, 'stroke-opacity': 0.5, class: 'wm-k' }],
    ['path', { d: 'M12 3.2Q11.8 7.6 12 12Q12.2 16.4 12 20.8M3.2 12Q7.6 12.2 12 12Q16.4 11.8 20.8 12', class: 'wm-k' }],
    ['path', { d: 'M9.1 5.9Q10.55 4.5 12 3.1Q13.45 4.5 14.9 5.95M18.05 9.1Q19.5 10.55 20.9 12Q19.5 13.45 18.05 14.9M14.9 18.1Q13.45 19.5 12 20.9Q10.55 19.5 9.1 18.05M5.95 14.9Q4.5 13.45 3.1 12Q4.5 10.55 5.9 9.1', class: 'wm-a' }],
  ]
}
