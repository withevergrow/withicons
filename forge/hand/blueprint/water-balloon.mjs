const A = "var(--with-accent, currentColor)";
export default function render() {
  return [
    ["path", { d: "M4.5 23H19.5M4.5 21.7V23.3M19.5 21.7V23.3", color: A, stroke: "currentColor", "stroke-width": 0.45, "stroke-opacity": 0.5, class: "wm-deco" }],
    ["path", { d: "M3.85 23.65L5.15 22.35M18.85 23.65L20.15 22.35", color: A, stroke: "currentColor", "stroke-width": 0.5, "stroke-opacity": 0.75, class: "wm-deco" }],
    ["path", { d: "M12 7.5C8.25 8.5 4.5 11.25 4.5 14.9C4.5 18.5 7.75 20.5 12 20.5C16.25 20.5 19.5 18.5 19.5 14.9C19.5 11.25 15.75 8.5 12 7.5Z", class: "wm-k" }],
    ["path", { d: "M12 7.5C11.25 6.5 10.25 5.25 9.75 3C11.25 3.5 12.75 3.5 14.25 3C13.75 5.25 12.75 6.5 12 7.5Z", class: "wm-k" }],
    ["path", { d: "M6.9 15.9C8.6 14.9 10.3 16.9 12 15.9C13.7 14.9 15.4 16.9 17.1 15.9", class: "wm-a" }],
    ["path", { d: "M7.6 12.6C8.1 11.5 8.8 10.8 9.8 10.3", class: "wm-shine" }],
  ];
}
