// forge/hand/sketch/gavel.mjs — a fat pencil gavel head with two collar bands, an outlined 2.5u handle and a firm block
// line, replacing thin single-stroke parts whose head and handle melted into a scribble at 16px.
export default function render() {
  return [
    ['path', { d: 'M7.3 9.1L9.1 7.3M8.3 9.9L9.9 8.3', 'stroke-width': 0.8, 'stroke-opacity': 0.5, class: 'wm-shine' }],
    ['path', { d: 'M3.5 10.2Q6.7 6.9 9.6 4Q10.4 3.25 11.15 4Q12.3 5.1 13.6 6.3Q14.2 7.05 13.5 7.75Q10.4 10.8 7.4 13.75Q6.6 14.4 5.9 13.7Q4.8 12.6 3.6 11.4Q3 10.8 3.5 10.2ZM4.9 9.1Q6.6 10.8 8.3 12.6M9.1 4.9Q10.8 6.6 12.6 8.3', 'stroke-width': 0.5, 'stroke-opacity': 0.5, class: 'wm-k' }],
    ['path', { d: 'M3.7 9.8Q6.8 6.75 9.8 3.7Q10.5 3 11.2 3.7Q12.25 4.75 13.3 5.8Q14 6.5 13.3 7.2Q10.25 10.25 7.2 13.3Q6.5 14 5.8 13.3Q4.75 12.25 3.7 11.2Q3 10.5 3.7 9.8ZM4.6 8.9Q6.35 10.65 8.1 12.4M8.9 4.6Q10.65 6.35 12.4 8.1', 'stroke-width': 1.5, class: 'wm-k' }],
    ['path', { d: 'M12.3 10.5Q15.7 13.8 20.3 18.6Q20.9 19.6 19.9 20.3Q18.9 20.7 18.2 19.9Q13.9 15.6 10.5 12.3', 'stroke-width': 0.5, 'stroke-opacity': 0.5, class: 'wm-a' }],
    ['path', { d: 'M12.03 10.27Q15.6 13.85 20.13 18.37Q20.85 19.25 20.05 20.05Q19.25 20.85 18.37 20.13Q13.85 15.6 10.27 12.03', 'stroke-width': 1.5, class: 'wm-a' }],
    ['path', { d: 'M2.8 21.4Q7 21.15 11.4 21.3', 'stroke-width': 0.5, 'stroke-opacity': 0.5, class: 'wm-s' }],
    ['path', { d: 'M3 21Q7 20.9 11 21.05', 'stroke-width': 1.5, class: 'wm-s' }],
  ]
}
