const F = { "stroke-width": 0.5, "stroke-opacity": 0.5 };
const HT = { "stroke-width": 0.8, "stroke-opacity": 0.5 };
export default function render() {
  return [
    ["path", { d: "M9.8 14.4l3.6-3.2M10.6 16.6l3.6-3.2", ...HT }],
    ["path", { d: "M9.2 5.2q2.8-.1 5.6 0 1.5.1 1.5 1.6v10.4q0 1.5-1.5 1.6-2.8.1-5.6 0-1.5-.1-1.5-1.6V6.8q0-1.5 1.5-1.6", ...F, class: "wm-k" }],
    ["path", { d: "M9.4 5q2.6-.1 5.2 0Q16 5.1 16 6.5v11q0 1.4-1.4 1.5-2.6.1-5.2 0Q8 18.9 8 17.5v-11Q8 5.1 9.4 5", class: "wm-k" }],
    ["path", { d: "M4 6.8q.1 5.2 0 10.4M20 6.8q-.1 5.2 0 10.4", class: "wm-a" }],
  ];
}
