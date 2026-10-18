// forge/hand/pixel/circle-arrow-up.mjs - Circle arrow up: shaded disc with a pointed triangle head on a 2px shaft, inset from the ring.
// Cell-aligned 1u pixel art: ink outline, body + shade tones, one shine, details tagged wm-a.
export default function render(icon) {
  return [
  [
    "path",
    {
      "d": "M9 3h6v1h-6zM7 4h10v1h-10zM6 5h1v1h-1zM9 5h9v1h-9zM5 6h1v1h-1zM7 6h4v1h-4zM13 6h6v1h-6zM4 7h6v1h-6zM14 7h5v1h-5zM4 8h5v1h-5zM15 8h4v1h-4zM3 9h5v1h-5zM16 9h4v1h-4zM3 10h4v1h-4zM17 10h3v1h-3zM3 11h8v1h-8zM13 11h6v1h-6zM3 12h8v1h-8zM13 12h6v1h-6zM3 13h8v1h-8zM13 13h6v1h-6zM3 14h8v1h-8zM13 14h6v1h-6zM4 15h7v1h-7zM13 15h5v1h-5zM4 16h7v1h-7zM13 16h5v1h-5zM5 17h6v1h-6zM13 17h4v1h-4zM6 18h9v1h-9z",
      "fill": "var(--with-pixel-fill, currentColor)",
      "fill-opacity": "0.28"
    }
  ],
  [
    "path",
    {
      "d": "M19 7h1v1h-1zM19 8h1v1h-1zM20 9h1v1h-1zM20 10h1v1h-1zM19 11h2v1h-2zM19 12h2v1h-2zM19 13h2v1h-2zM19 14h2v1h-2zM18 15h2v1h-2zM18 16h2v1h-2zM17 17h2v1h-2zM15 18h3v1h-3zM7 19h10v1h-10zM9 20h6v1h-6z",
      "fill": "var(--with-pixel-fill, currentColor)",
      "fill-opacity": "0.55"
    }
  ],
  [
    "path",
    {
      "d": "M9 2h6v1h-6zM7 3h2v1h-2zM15 3h2v1h-2zM6 4h1v1h-1zM17 4h1v1h-1zM5 5h1v1h-1zM18 5h1v1h-1zM4 6h1v1h-1zM19 6h1v1h-1zM3 7h1v1h-1zM20 7h1v1h-1zM3 8h1v1h-1zM20 8h1v1h-1zM2 9h1v1h-1zM21 9h1v1h-1zM2 10h1v1h-1zM21 10h1v1h-1zM2 11h1v1h-1zM21 11h1v1h-1zM2 12h1v1h-1zM21 12h1v1h-1zM2 13h1v1h-1zM21 13h1v1h-1zM2 14h1v1h-1zM21 14h1v1h-1zM3 15h1v1h-1zM20 15h1v1h-1zM3 16h1v1h-1zM20 16h1v1h-1zM4 17h1v1h-1zM19 17h1v1h-1zM5 18h1v1h-1zM18 18h1v1h-1zM6 19h1v1h-1zM17 19h1v1h-1zM7 20h2v1h-2zM15 20h2v1h-2zM9 21h6v1h-6z"
    }
  ],
  [
    "path",
    {
      "d": "M11 6h2v1h-2zM10 7h4v1h-4zM9 8h6v1h-6zM8 9h8v1h-8zM7 10h10v1h-10zM11 11h2v1h-2zM11 12h2v1h-2zM11 13h2v1h-2zM11 14h2v1h-2zM11 15h2v1h-2zM11 16h2v1h-2zM11 17h2v1h-2z",
      "class": "wm-a"
    }
  ],
  [
    "path",
    {
      "d": "M7 5h2v1h-2zM6 6h1v1h-1z",
      "fill": "var(--with-pixel-shine, #FFFFFF)",
      "class": "wm-shine"
    }
  ]
];
}
