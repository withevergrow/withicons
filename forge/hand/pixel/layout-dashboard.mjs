// forge/hand/pixel/layout-dashboard.mjs: four layout-grid tiles on one grid with 3px gutters: tall top-left, small top-right, tall bottom-right, short bottom-left.
// Drawn as a 24x24 cell map (1u cells), merged into one path per tone.
export default function render(icon) {
  return [
    [
      "path",
      {
        "d": "M3 3h7v1h-7zM15 3h6v1h-6zM3 4h1v1h-1zM6 4h3v1h-3zM15 4h1v1h-1zM18 4h2v1h-2zM3 5h1v1h-1zM5 5h4v1h-4zM15 5h1v1h-1zM17 5h3v1h-3zM3 6h6v1h-6zM15 6h5v1h-5zM3 7h6v1h-6zM15 7h1v1h-1zM3 8h6v1h-6zM3 9h6v1h-6zM3 10h6v1h-6zM3 11h1v1h-1zM15 13h6v1h-6zM15 14h1v1h-1zM18 14h2v1h-2zM15 15h1v1h-1zM17 15h3v1h-3zM15 16h5v1h-5zM3 17h7v1h-7zM15 17h5v1h-5zM3 18h1v1h-1zM6 18h3v1h-3zM15 18h5v1h-5zM3 19h1v1h-1zM5 19h4v1h-4zM15 19h5v1h-5zM3 20h1v1h-1zM15 20h1v1h-1z",
        "fill": "var(--with-pixel-fill, currentColor)",
        "fill-opacity": "0.28",
        "class": "wm-k"
      }
    ],
    [
      "path",
      {
        "d": "M9 4h1v1h-1zM20 4h1v1h-1zM9 5h1v1h-1zM20 5h1v1h-1zM9 6h1v1h-1zM20 6h1v1h-1zM9 7h1v1h-1zM16 7h5v1h-5zM9 8h1v1h-1zM9 9h1v1h-1zM9 10h1v1h-1zM4 11h6v1h-6zM20 14h1v1h-1zM20 15h1v1h-1zM20 16h1v1h-1zM20 17h1v1h-1zM9 18h1v1h-1zM20 18h1v1h-1zM9 19h1v1h-1zM20 19h1v1h-1zM4 20h6v1h-6zM16 20h5v1h-5z",
        "fill": "var(--with-pixel-fill, currentColor)",
        "fill-opacity": "0.55",
        "class": "wm-k"
      }
    ],
    [
      "path",
      {
        "d": "M3 2h7v1h-7zM15 2h6v1h-6zM2 3h1v1h-1zM10 3h1v1h-1zM14 3h1v1h-1zM21 3h1v1h-1zM2 4h1v1h-1zM10 4h1v1h-1zM14 4h1v1h-1zM21 4h1v1h-1zM2 5h1v1h-1zM10 5h1v1h-1zM14 5h1v1h-1zM21 5h1v1h-1zM2 6h1v1h-1zM10 6h1v1h-1zM14 6h1v1h-1zM21 6h1v1h-1zM2 7h1v1h-1zM10 7h1v1h-1zM14 7h1v1h-1zM21 7h1v1h-1zM2 8h1v1h-1zM10 8h1v1h-1zM15 8h6v1h-6zM2 9h1v1h-1zM10 9h1v1h-1zM2 10h1v1h-1zM10 10h1v1h-1zM2 11h1v1h-1zM10 11h1v1h-1zM3 12h7v1h-7zM15 12h6v1h-6zM14 13h1v1h-1zM21 13h1v1h-1zM14 14h1v1h-1zM21 14h1v1h-1zM14 15h1v1h-1zM21 15h1v1h-1zM3 16h7v1h-7zM14 16h1v1h-1zM21 16h1v1h-1zM2 17h1v1h-1zM10 17h1v1h-1zM14 17h1v1h-1zM21 17h1v1h-1zM2 18h1v1h-1zM10 18h1v1h-1zM14 18h1v1h-1zM21 18h1v1h-1zM2 19h1v1h-1zM10 19h1v1h-1zM14 19h1v1h-1zM21 19h1v1h-1zM2 20h1v1h-1zM10 20h1v1h-1zM14 20h1v1h-1zM21 20h1v1h-1zM3 21h7v1h-7zM15 21h6v1h-6z",
        "class": "wm-k"
      }
    ],
    [
      "path",
      {
        "d": "M4 4h2v1h-2zM16 4h2v1h-2zM4 5h1v1h-1zM16 5h1v1h-1zM16 14h2v1h-2zM16 15h1v1h-1zM4 18h2v1h-2zM4 19h1v1h-1z",
        "fill": "var(--with-pixel-shine, #FFFFFF)",
        "class": "wm-shine"
      }
    ]
  ]
}
