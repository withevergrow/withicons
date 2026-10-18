// forge/hand/pixel/factory.mjs — pixel factory: two sawtooth roof steps on the left, a tall chimney on the right and two lit window blocks (part A)
export default function render() {
  return [
    ["path",{"d":"M17 4h2v1h-2zM18 5h1v1h-1zM17 6h2v7h-2zM6 11h2v1h-2zM11 11h2v1h-2zM4 12h4v1h-4zM9 12h4v1h-4zM4 13h1v1h-1zM6 13h13v1h-13zM4 14h15v2h-15zM4 16h2v2h-2zM8 16h2v2h-2zM12 16h7v2h-7zM4 18h15v1h-15z","fill":"var(--with-pixel-fill, currentColor)","fill-opacity":"0.28","class":"wm-k"}],
    ["path",{"d":"M19 4h1v15h-1zM4 19h16v1h-16z","fill":"var(--with-pixel-fill, currentColor)","fill-opacity":"0.55","class":"wm-k"}],
    ["path",{"d":"M17 3h3v1h-3zM16 4h1v8h-1zM20 4h1v16h-1zM8 9h1v1h-1zM13 9h1v1h-1zM6 10h3v1h-3zM11 10h3v1h-3zM4 11h2v1h-2zM8 11h3v1h-3zM13 11h1v1h-1zM3 12h1v8h-1zM8 12h1v1h-1zM13 12h4v1h-4zM4 20h16v1h-16z","class":"wm-k"}],
    ["path",{"d":"M6 16h2v2h-2zM10 16h2v2h-2z","class":"wm-a"}],
    ["path",{"d":"M17 5h1v1h-1zM5 13h1v1h-1z","fill":"var(--with-pixel-shine, #FFFFFF)","class":"wm-shine"}]
  ]
}
