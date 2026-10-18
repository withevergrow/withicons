const A="var(--with-accent, currentColor)";const G=(d,o=0.5)=>["path",{d,color:A,stroke:"currentColor","stroke-width":0.45,"stroke-opacity":o,class:"wm-deco"}];const N=(pts)=>["path",{d:pts.map(([x,y])=>`M${(x+0.8).toFixed(2)} ${y}A.8.8 0 1 0 ${(x-0.8).toFixed(2)} ${y}A.8.8 0 1 0 ${(x+0.8).toFixed(2)} ${y}`).join(""),color:A,stroke:"currentColor","stroke-width":0.5,class:"wm-k"}];const f=n=>+n.toFixed(2);
export default function render() {
  return [
    G("M4.32 2.5H2.9M5 .72V1.82M5 22.18V23.28M2.9 21.5H4.32M19.68 21.5H21.1M19 23.28V22.18M5 23H19M5 22.2V23.3M19 22.2V23.3"),
    ["path", { d: "M12.43 2.5H7A2 2 0 0 0 5 4.5V19.5A2 2 0 0 0 7 21.5H17A2 2 0 0 0 19 19.5V9.07M17.89 6.39L15.11 3.61", class: "wm-k" }],
    ["path", { d: "M14 4.08V6A1.5 1.5 0 0 0 15.5 7.5H17.43", class: "wm-k" }],
    ["path", { d: "M8.75 4.5H10M10 6.5H11.25M8.75 8.5H10M10 10.5H11.25", class: "wm-a" }],
    ["path", { d: "M9.5 13H10.5A1 1 0 0 1 11.5 14V17A1 1 0 0 1 10.5 18H9.5A1 1 0 0 1 8.5 17V14A1 1 0 0 1 9.5 13ZM10 12V13M10 15.5V16", class: "wm-a" }],
    N([[14, 2.5], [19, 7.5]]),
  ];
}
