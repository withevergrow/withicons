// old (pre-rework) drawing restored on request; pupil now shows on both sides of the slash
export default function render() {
  return [
    ["path", { d: "M10.14 5.19 C10.74 5.06 11.36 5 12 5 C16 5 19.5 7.5 21.5 12 C21.02 13.07 20.46 14.03 19.82 14.87" }],
    ["path", { d: "M13.86 18.81 C13.26 18.94 12.64 19 12 19 C8 19 4.5 16.5 2.5 12 C2.98 10.93 3.54 9.97 4.18 9.13" }],
    ["path", { d: "M12.78 14.9 A3 3 0 0 1 9.1 11.22", class: "wm-a" }],
    ["path", { d: "M11.22 9.1 A3 3 0 0 1 14.9 12.78", class: "wm-a" }],
    ["path", { d: "M3 3 L21 21", class: "wm-s" }],
  ];
}
