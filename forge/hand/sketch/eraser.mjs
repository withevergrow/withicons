const F = { "stroke-width": 0.5, "stroke-opacity": 0.5 };
const HT = { "stroke-width": 0.8, "stroke-opacity": 0.5 };
export default function render() {
  return [
    ["path", { d: "M13.6 7.4l2.8-2.8M14.3 10.2l4.2-4.2M16.1 11.9l3-3", ...HT }],
    ["path", { d: "M14.8 3.9l5.4 5.3-9.6 9.7H6.9L3.7 15.6z", ...F, class: "wm-k" }],
    ["path", { d: "M14.5 3.6q2.8 2.6 5.6 5.6l-9.7 9.6H7.2Q5.4 17.1 3.6 15.3z", class: "wm-k" }],
    ["path", { d: "M9.1 9.2q2.7 2.8 5.6 5.6", class: "wm-a" }],
    ["path", { d: "M10.4 20.6q4.8-.2 9.9 0", "stroke-width": 1.1 }],
  ];
}
