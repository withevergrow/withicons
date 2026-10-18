// forge/hand/pixel/receipt.mjs — Receipt: square-topped paper slip with three text lines and a zigzag torn bottom edge.
// Cell-aligned 1u pixel art: ink outline, body + shade tones, one shine, details tagged wm-a.
export default function render(icon) {
  return [
    [
      "path",
      {
        "d": "M5 3h13v1h-13zM5 4h1v1h-1zM8 4h10v1h-10zM5 5h1v1h-1zM7 5h11v1h-11zM5 6h2v1h-2zM17 6h1v1h-1zM5 7h2v1h-2zM17 7h1v1h-1zM5 8h13v1h-13zM5 9h13v1h-13zM5 10h2v1h-2zM17 10h1v1h-1zM5 11h2v1h-2zM17 11h1v1h-1zM5 12h13v1h-13zM5 13h13v1h-13zM5 14h2v1h-2zM14 14h4v1h-4zM5 15h2v1h-2zM14 15h4v1h-4zM5 16h13v1h-13zM5 17h13v1h-13z",
        "fill": "var(--with-pixel-fill, currentColor)",
        "fill-opacity": "0.28"
      }
    ],
    [
      "path",
      {
        "d": "M18 3h1v1h-1zM18 4h1v1h-1zM18 5h1v1h-1zM18 6h1v1h-1zM18 7h1v1h-1zM18 8h1v1h-1zM18 9h1v1h-1zM18 10h1v1h-1zM18 11h1v1h-1zM18 12h1v1h-1zM18 13h1v1h-1zM18 14h1v1h-1zM18 15h1v1h-1zM18 16h1v1h-1zM18 17h1v1h-1zM5 18h14v1h-14zM5 19h2v1h-2zM9 19h2v1h-2zM13 19h2v1h-2zM17 19h2v1h-2z",
        "fill": "var(--with-pixel-fill, currentColor)",
        "fill-opacity": "0.55"
      }
    ],
    [
      "path",
      {
        "d": "M5 2h14v1h-14zM4 3h1v1h-1zM19 3h1v1h-1zM4 4h1v1h-1zM19 4h1v1h-1zM4 5h1v1h-1zM19 5h1v1h-1zM4 6h1v1h-1zM19 6h1v1h-1zM4 7h1v1h-1zM19 7h1v1h-1zM4 8h1v1h-1zM19 8h1v1h-1zM4 9h1v1h-1zM19 9h1v1h-1zM4 10h1v1h-1zM19 10h1v1h-1zM4 11h1v1h-1zM19 11h1v1h-1zM4 12h1v1h-1zM19 12h1v1h-1zM4 13h1v1h-1zM19 13h1v1h-1zM4 14h1v1h-1zM19 14h1v1h-1zM4 15h1v1h-1zM19 15h1v1h-1zM4 16h1v1h-1zM19 16h1v1h-1zM4 17h1v1h-1zM19 17h1v1h-1zM4 18h1v1h-1zM19 18h1v1h-1zM4 19h1v1h-1zM7 19h2v1h-2zM11 19h2v1h-2zM15 19h2v1h-2zM19 19h1v1h-1zM5 20h2v1h-2zM9 20h2v1h-2zM13 20h2v1h-2zM17 20h2v1h-2z"
      }
    ],
    [
      "path",
      {
        "d": "M7 6h10v1h-10zM7 7h10v1h-10zM7 10h10v1h-10zM7 11h10v1h-10zM7 14h7v1h-7zM7 15h7v1h-7z",
        "class": "wm-a"
      }
    ],
    [
      "path",
      {
        "d": "M6 4h2v1h-2zM6 5h1v1h-1z",
        "fill": "var(--with-pixel-shine, #FFFFFF)",
        "class": "wm-shine"
      }
    ]
  ]
}
