const F = { "stroke-width": 0.5, "stroke-opacity": 0.5 };
const HT = { "stroke-width": 0.8, "stroke-opacity": 0.5 };
export default function render() {
  return [
    ["path", { d: "M3.4 17.3q.4-5.6 4.4-8.4 4-2.5 8.4-.6 4.5 2.4 4.6 8.9-8.7.6-17.4.1", ...F, class: "wm-k" }],
    ["path", { d: "M3.2 17q.2-5.5 4.3-8.3 4.1-2.6 8.6-.7 4.4 2.3 4.7 9.1-8.7.5-17.6-.1", class: "wm-k" }],
    ["path", { d: "M6.8 9.4q.3-2 2.1-1.6.4-2 2.3-1.7 1-1.7 2.6-.6 1.8-.6 2.2 1.4 1.9.1 1.8 2", class: "wm-a" }],
    ["path", { d: "M8.9 7.8q.4 1.9 1.3 3.3M11.3 6.1q.4 2.1.9 4M13.9 6.4q-.1 2-.4 3.7M16.1 8.8q-.5 1.4-1.3 2.4", "stroke-width": 0.9, class: "wm-a" }],
    ["path", { d: "M3.6 19.3q8.4.4 16.8-.1", "stroke-width": 0.9 }],
  ];
}
