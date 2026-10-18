// forge/hand/pixel/syringe.mjs — pixel syringe on the 45-degree diagonal: a solid barrel with tick marks, a one-pixel needle at bottom-left, the plunger rod and T handle (part A) at top-right
export default function render() {
  return [
    ["path",{"d":"M12 7h1v1h-1zM11 8h3v1h-3zM10 9h1v1h-1zM12 9h3v1h-3zM9 10h1v1h-1zM11 10h5v1h-5zM8 11h9v1h-9zM7 12h1v1h-1zM9 12h6v1h-6zM6 13h8v1h-8zM7 14h6v1h-6zM8 15h4v1h-4zM9 16h2v1h-2z","fill":"var(--with-pixel-fill, currentColor)","fill-opacity":"0.28","class":"wm-k"}],
    ["path",{"d":"M15 12h1v1h-1zM14 13h1v1h-1zM13 14h1v1h-1zM12 15h1v1h-1zM11 16h1v1h-1zM10 17h1v1h-1z","fill":"var(--with-pixel-fill, currentColor)","fill-opacity":"0.55","class":"wm-k"}],
    ["path",{"d":"M11 7h1v1h-1zM10 8h1v1h-1zM9 9h1v1h-1zM8 10h1v1h-1zM10 10h1v1h-1zM7 11h1v1h-1zM6 12h1v1h-1zM8 12h1v1h-1zM16 12h1v1h-1zM5 13h1v1h-1zM15 13h1v1h-1zM6 14h1v1h-1zM14 14h1v1h-1zM7 15h1v1h-1zM13 15h1v1h-1zM7 16h2v1h-2zM12 16h1v1h-1zM6 17h1v1h-1zM9 17h1v1h-1zM11 17h1v1h-1zM5 18h1v1h-1zM10 18h1v1h-1zM4 19h1v1h-1zM3 20h1v1h-1z","class":"wm-k"}],
    ["path",{"d":"M16 2h2v1h-2zM17 3h2v1h-2zM18 4h2v1h-2zM11 5h2v1h-2zM18 5h3v1h-3zM12 6h2v1h-2zM17 6h1v1h-1zM20 6h2v1h-2zM13 7h2v1h-2zM16 7h1v1h-1zM21 7h1v1h-1zM14 8h2v1h-2zM15 9h2v1h-2zM16 10h2v1h-2zM17 11h2v1h-2zM18 12h1v1h-1z","class":"wm-a"}],
    ["path",{"d":"M11 9h1v1h-1z","fill":"var(--with-pixel-shine, #FFFFFF)","class":"wm-shine"}]
  ]
}
