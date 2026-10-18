// forge/hand/engrave/skip-back.mjs — the stop bar is cut at 2u with a swell that ends inside its round caps, and the triangle has crisp 1u corners (matching fast-forward) with four open burin cuts in its shade corner and cast shade only on its right side, so it reads cleanly at 16px.
export default function render() {
  return [
    ['path',{d:'M19.98 5.51l.24.21.19.26.14.29.1.57 0 11.38-.05.32-.1.31-.16.28-.21.24-.26.19-.29.15-.31.08-.32.02-.32-.04-.54-.23-8.72-5.69-.74-.72.34.1 8.71 5.69.49.21.29.03.58-.1.26-.13.23-.18.34-.47.13-.57 0-11.37-.09-.53-.31-.49-.12-.31zM17.21 8.59l.78.89.44.34-.34-.44zM15.86 9.51l2.08 2.28.49.29-.29-.49zM14.94 10.85l2.94 3.26.55.23-.23-.54zM13.66 11.83l4.17 4.6.6.18-.17-.61zM12.76 13.2l1.36 1.52.47.31-.31-.47z',fill:'currentColor',stroke:'none',class:'wm-k'}],
    ['path',{d:'M5.43 5.01L5.55 5.15L5.65 5.5L5.65 18.3L5.5 18.9L5 18.9L5 5L4.92 4.73L4.93 4.51Z',fill:'currentColor',stroke:'none',class:'wm-a'}],
    ['path',{d:'M20.7 7.72l.95.95M20.7 8.92l.95.95M20.7 10.12l.95.95M20.7 11.32l.95.95M20.7 12.52l.95.96M20.7 13.73l.95.95M20.7 14.93l.95.95M20.7 16.13l.95.95M20.7 17.33l.95.95M20.66 18.5l.96.96M5.7 5.94l.95.95M5.7 7.14l.95.95M5.7 8.34l.95.95M5.7 9.55l.95.95M5.7 10.75l.95.95M5.7 11.95l.95.95M5.7 13.15l.95.95M5.7 14.35l.95.95M5.7 15.56l.95.95M5.7 16.76l.95.95M5.7 17.96l.95.95M5.7 19.16l.95.95','stroke-width':0.3,class:'wm-shadow'}],
    ['path',{d:'M19.5 6.34 A1 1 0 0 0 17.95 5.5 L9.28 11.16 A1 1 0 0 0 9.28 12.84 L17.95 18.5 A1 1 0 0 0 19.5 17.66 Z',class:'wm-k'}],
    ['path',{d:'M4.5 5 V19',class:'wm-a','stroke-width':2}],
  ]
}
