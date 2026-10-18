// forge/hand/pixel/zoom-out.mjs: the zoom-in lens sprite (crisp 1px ring, light glass, glint) with a clean 2px minus and the same 2px handle.
// Drawn as a 24x24 cell map (1u cells), merged into one path per tone.
export default function render(icon) {
  return [
    [
      "path",
      {
        "d": "M7 4h6v1h-6zM6 5h8v1h-8zM5 6h7v1h-7zM13 6h2v1h-2zM4 7h8v1h-8zM13 7h3v1h-3zM4 8h11v1h-11zM4 9h2v1h-2zM14 9h1v1h-1zM4 10h2v1h-2zM14 10h1v1h-1zM4 11h11v1h-11zM4 12h11v1h-11zM5 13h8v1h-8zM6 14h6v1h-6zM7 15h1v1h-1z",
        "fill": "var(--with-pixel-fill, currentColor)",
        "fill-opacity": "0.28",
        "class": "wm-k"
      }
    ],
    [
      "path",
      {
        "d": "M15 8h1v1h-1zM15 9h1v1h-1zM15 10h1v1h-1zM15 11h1v1h-1zM15 12h1v1h-1zM13 13h2v1h-2zM12 14h2v1h-2zM8 15h5v1h-5z",
        "fill": "var(--with-pixel-fill, currentColor)",
        "fill-opacity": "0.55",
        "class": "wm-k"
      }
    ],
    [
      "path",
      {
        "d": "M7 3h6v1h-6zM6 4h1v1h-1zM13 4h1v1h-1zM5 5h1v1h-1zM14 5h1v1h-1zM4 6h1v1h-1zM15 6h1v1h-1zM3 7h1v1h-1zM16 7h1v1h-1zM3 8h1v1h-1zM16 8h1v1h-1zM3 9h1v1h-1zM16 9h1v1h-1zM3 10h1v1h-1zM16 10h1v1h-1zM3 11h1v1h-1zM16 11h1v1h-1zM3 12h1v1h-1zM16 12h1v1h-1zM4 13h1v1h-1zM15 13h1v1h-1zM5 14h1v1h-1zM14 14h1v1h-1zM6 15h1v1h-1zM13 15h3v1h-3zM7 16h6v1h-6zM14 16h3v1h-3zM15 17h3v1h-3zM16 18h3v1h-3zM17 19h3v1h-3zM18 20h2v1h-2z",
        "class": "wm-k"
      }
    ],
    [
      "path",
      {
        "d": "M6 9h8v1h-8zM6 10h8v1h-8z",
        "class": "wm-a"
      }
    ],
    [
      "path",
      {
        "d": "M12 6h1v1h-1zM12 7h1v1h-1z",
        "fill": "var(--with-pixel-shine, #FFFFFF)",
        "class": "wm-shine"
      }
    ]
  ]
}
