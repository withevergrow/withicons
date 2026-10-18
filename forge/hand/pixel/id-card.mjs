// forge/hand/pixel/id-card.mjs — ID card: crisp card outline, a clean head-and-shoulders portrait and three aligned text bars.
// Cell-aligned 1u pixel art: ink outline, body + shade tones, one shine, details tagged wm-a.
export default function render(icon) {
  return [
    [
      "path",
      {
        "d": "M2 5h19v1h-19zM2 6h1v1h-1zM5 6h16v1h-16zM2 7h1v1h-1zM4 7h2v1h-2zM9 7h12v1h-12zM2 8h3v1h-3zM10 8h3v1h-3zM20 8h1v1h-1zM2 9h3v1h-3zM10 9h3v1h-3zM20 9h1v1h-1zM2 10h3v1h-3zM10 10h11v1h-11zM2 11h4v1h-4zM9 11h4v1h-4zM20 11h1v1h-1zM2 12h11v1h-11zM20 12h1v1h-1zM2 13h3v1h-3zM10 13h11v1h-11zM2 14h2v1h-2zM11 14h2v1h-2zM18 14h3v1h-3zM2 15h2v1h-2zM11 15h2v1h-2zM18 15h3v1h-3zM2 16h2v1h-2zM11 16h10v1h-10zM2 17h19v1h-19z",
        "fill": "var(--with-pixel-fill, currentColor)",
        "fill-opacity": "0.28"
      }
    ],
    [
      "path",
      {
        "d": "M21 5h1v1h-1zM21 6h1v1h-1zM21 7h1v1h-1zM21 8h1v1h-1zM21 9h1v1h-1zM21 10h1v1h-1zM21 11h1v1h-1zM21 12h1v1h-1zM21 13h1v1h-1zM21 14h1v1h-1zM21 15h1v1h-1zM21 16h1v1h-1zM21 17h1v1h-1zM2 18h20v1h-20z",
        "fill": "var(--with-pixel-fill, currentColor)",
        "fill-opacity": "0.55"
      }
    ],
    [
      "path",
      {
        "d": "M2 4h20v1h-20zM1 5h1v1h-1zM22 5h1v1h-1zM1 6h1v1h-1zM22 6h1v1h-1zM1 7h1v1h-1zM22 7h1v1h-1zM1 8h1v1h-1zM22 8h1v1h-1zM1 9h1v1h-1zM22 9h1v1h-1zM1 10h1v1h-1zM22 10h1v1h-1zM1 11h1v1h-1zM22 11h1v1h-1zM1 12h1v1h-1zM22 12h1v1h-1zM1 13h1v1h-1zM22 13h1v1h-1zM1 14h1v1h-1zM22 14h1v1h-1zM1 15h1v1h-1zM22 15h1v1h-1zM1 16h1v1h-1zM22 16h1v1h-1zM1 17h1v1h-1zM22 17h1v1h-1zM1 18h1v1h-1zM22 18h1v1h-1zM2 19h20v1h-20z"
      }
    ],
    [
      "path",
      {
        "d": "M6 7h3v1h-3zM5 8h5v1h-5zM13 8h7v1h-7zM5 9h5v1h-5zM13 9h7v1h-7zM5 10h5v1h-5zM6 11h3v1h-3zM13 11h7v1h-7zM13 12h7v1h-7zM5 13h5v1h-5zM4 14h7v1h-7zM13 14h5v1h-5zM4 15h7v1h-7zM13 15h5v1h-5zM4 16h7v1h-7z",
        "class": "wm-a"
      }
    ],
    [
      "path",
      {
        "d": "M3 6h2v1h-2zM3 7h1v1h-1z",
        "fill": "var(--with-pixel-shine, #FFFFFF)",
        "class": "wm-shine"
      }
    ]
  ]
}
