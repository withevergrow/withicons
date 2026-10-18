// forge/hand/pixel/ship.mjs — hand-drawn 24-grid pixel sprite (ink outline, body tone, shade, shine).
export default function render() {
  return [
    ["path",{"d":"M12 3h1v1h-1zM11 4h1v1h-1zM8 7h8v1h-8zM7 8h1v1h-1zM10 8h1v1h-1zM13 8h1v1h-1zM7 9h1v1h-1zM10 9h1v1h-1zM13 9h1v1h-1zM3 12h1v1h-1zM6 12h14v1h-14zM4 13h15v1h-15zM5 14h13v1h-13z","fill":"var(--with-pixel-fill, currentColor)","fill-opacity":"0.28"}],
    ["path",{"d":"M12 4h1v1h-1zM11 5h2v1h-2zM16 7h1v1h-1zM16 8h1v1h-1zM16 9h1v1h-1zM7 10h10v1h-10zM20 12h1v1h-1zM19 13h1v1h-1zM18 14h1v1h-1zM6 15h12v1h-12z","fill":"var(--with-pixel-fill, currentColor)","fill-opacity":"0.55"}],
    ["path",{"d":"M10 2h4v1h-4zM10 3h1v1h-1zM13 3h1v1h-1zM10 4h1v1h-1zM13 4h1v1h-1zM10 5h1v1h-1zM13 5h1v1h-1zM7 6h10v1h-10zM6 7h1v1h-1zM17 7h1v1h-1zM6 8h1v1h-1zM8 8h2v1h-2zM11 8h2v1h-2zM14 8h2v1h-2zM17 8h1v1h-1zM6 9h1v1h-1zM8 9h2v1h-2zM11 9h2v1h-2zM14 9h2v1h-2zM17 9h1v1h-1zM6 10h1v1h-1zM17 10h1v1h-1zM2 11h20v1h-20zM2 12h1v1h-1zM21 12h1v1h-1zM3 13h1v1h-1zM20 13h1v1h-1zM4 14h1v1h-1zM19 14h1v1h-1zM5 15h1v1h-1zM18 15h1v1h-1zM6 16h12v1h-12zM1 18h2v1h-2zM5 18h2v1h-2zM9 18h2v1h-2zM13 18h2v1h-2zM17 18h2v1h-2zM21 18h2v1h-2zM3 19h2v1h-2zM7 19h2v1h-2zM11 19h2v1h-2zM15 19h2v1h-2zM19 19h2v1h-2zM1 21h2v1h-2zM5 21h2v1h-2zM9 21h2v1h-2zM13 21h2v1h-2zM17 21h2v1h-2zM21 21h2v1h-2zM3 22h2v1h-2zM7 22h2v1h-2zM11 22h2v1h-2zM15 22h2v1h-2zM19 22h2v1h-2z"}],
    ["path",{"d":"M11 3h1v1h-1zM7 7h1v1h-1zM4 12h2v1h-2z","fill":"var(--with-pixel-shine, #FFFFFF)","class":"wm-shine"}],
  ]
}
