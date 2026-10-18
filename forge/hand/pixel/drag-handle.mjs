// forge/hand/pixel/drag-handle.mjs: a 2x3 grid of heavy 4px ink dots that fills the canvas like the line version.
// Drawn as a 24x24 cell map (1u cells), merged into one path per tone.
export default function render(icon) {
  return [
    [
      "path",
      {
        "d": "M7 3h4v1h-4zM13 3h4v1h-4zM7 4h4v1h-4zM13 4h4v1h-4zM7 5h4v1h-4zM13 5h4v1h-4zM7 6h4v1h-4zM13 6h4v1h-4zM7 10h4v1h-4zM13 10h4v1h-4zM7 11h4v1h-4zM13 11h4v1h-4zM7 12h4v1h-4zM13 12h4v1h-4zM7 13h4v1h-4zM13 13h4v1h-4zM7 17h4v1h-4zM13 17h4v1h-4zM7 18h4v1h-4zM13 18h4v1h-4zM7 19h4v1h-4zM13 19h4v1h-4zM7 20h4v1h-4zM13 20h4v1h-4z",
        "class": "wm-k"
      }
    ]
  ]
}
