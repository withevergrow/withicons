const F = { "stroke-width": 0.5, "stroke-opacity": 0.5 };
const HT = { "stroke-width": 0.8, "stroke-opacity": 0.5 };
export default function render() {
  return [
    ["path", { d: "M14.6 18.5l3.9-3.2M12.9 19.6l6.2-5M16.8 17.9l2.4-1.9", ...HT }],
    ["path", { d: "M12.3 3.2q4.7.1 6.8 3.6 2.3 3.9.3 8.6-2.3 4.4-7.7 4.4-4.9-.3-6.9-4.4-1.9-4.5.6-8.4 2.4-3.6 6.9-3.8", ...F, class: "wm-k" }],
    ["path", { d: "M12 3q4.9 0 7.2 3.7 2.1 4 .1 8.4-2.2 4.6-7.3 4.9-5.1 0-7.4-4.5-2-4.3.3-8.6Q7.3 3.1 12 3", class: "wm-k" }],
    ["path", { d: "M12 6.6q3.6.1 5 3.1 1.1 3.3-1 5.6-2 2.1-5.3 1.5-3.1-.9-3.9-3.9-.6-3.2 1.7-5.1 1.5-1.2 3.5-1.2", "stroke-width": 0.9, class: "wm-a" }],
    ["circle", { cx: 12, cy: 12, r: 1.9, class: "wm-a" }],
  ];
}
