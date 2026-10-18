// forge/hand/pixel/address-book.mjs — Address book: bound book with three binder rings on the left spine and a clean head-and-shoulders contact.
// Cell-aligned 1u pixel art: ink outline, body + shade tones, one shine, details tagged wm-a.
export default function render(icon) {
  return [
    [
      "path",
      {
        "d": "M6 3h13v1h-13zM6 4h1v1h-1zM9 4h10v1h-10zM8 5h4v1h-4zM15 5h4v1h-4zM8 6h3v1h-3zM16 6h3v1h-3zM6 7h5v1h-5zM16 7h3v1h-3zM6 8h5v1h-5zM16 8h3v1h-3zM6 9h6v1h-6zM15 9h4v1h-4zM8 10h11v1h-11zM8 11h3v1h-3zM16 11h3v1h-3zM6 12h4v1h-4zM17 12h2v1h-2zM6 13h4v1h-4zM17 13h2v1h-2zM6 14h4v1h-4zM17 14h2v1h-2zM8 15h11v1h-11zM8 16h11v1h-11zM6 17h4v1h-4zM17 17h2v1h-2zM6 18h4v1h-4zM17 18h2v1h-2zM6 19h13v1h-13z",
        "fill": "var(--with-pixel-fill, currentColor)",
        "fill-opacity": "0.28"
      }
    ],
    [
      "path",
      {
        "d": "M19 3h1v1h-1zM19 4h1v1h-1zM19 5h1v1h-1zM19 6h1v1h-1zM19 7h1v1h-1zM19 8h1v1h-1zM19 9h1v1h-1zM19 10h1v1h-1zM19 11h1v1h-1zM19 12h1v1h-1zM19 13h1v1h-1zM19 14h1v1h-1zM19 15h1v1h-1zM19 16h1v1h-1zM19 17h1v1h-1zM19 18h1v1h-1zM19 19h1v1h-1zM6 20h14v1h-14z",
        "fill": "var(--with-pixel-fill, currentColor)",
        "fill-opacity": "0.55"
      }
    ],
    [
      "path",
      {
        "d": "M6 2h14v1h-14zM5 3h1v1h-1zM20 3h1v1h-1zM5 4h1v1h-1zM20 4h1v1h-1zM3 5h5v1h-5zM20 5h1v1h-1zM3 6h5v1h-5zM20 6h1v1h-1zM5 7h1v1h-1zM20 7h1v1h-1zM5 8h1v1h-1zM20 8h1v1h-1zM5 9h1v1h-1zM20 9h1v1h-1zM3 10h5v1h-5zM20 10h1v1h-1zM3 11h5v1h-5zM20 11h1v1h-1zM5 12h1v1h-1zM20 12h1v1h-1zM5 13h1v1h-1zM20 13h1v1h-1zM5 14h1v1h-1zM20 14h1v1h-1zM3 15h5v1h-5zM20 15h1v1h-1zM3 16h5v1h-5zM20 16h1v1h-1zM5 17h1v1h-1zM20 17h1v1h-1zM5 18h1v1h-1zM20 18h1v1h-1zM5 19h1v1h-1zM20 19h1v1h-1zM5 20h1v1h-1zM20 20h1v1h-1zM6 21h14v1h-14z"
      }
    ],
    [
      "path",
      {
        "d": "M12 5h3v1h-3zM11 6h5v1h-5zM11 7h5v1h-5zM11 8h5v1h-5zM12 9h3v1h-3zM11 11h5v1h-5zM10 12h7v1h-7zM10 13h7v1h-7zM10 14h7v1h-7zM10 17h7v1h-7zM10 18h7v1h-7z",
        "class": "wm-a"
      }
    ],
    [
      "path",
      {
        "d": "M7 4h2v1h-2z",
        "fill": "var(--with-pixel-shine, #FFFFFF)",
        "class": "wm-shine"
      }
    ]
  ]
}
