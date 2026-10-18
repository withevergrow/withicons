// forge/hand/pixel/log-out.mjs — Log out: squared door bracket on the left with a bold arrow leaving it to the right.
// Cell-aligned 1u pixel art: ink outline, body + shade tones, one shine, details tagged wm-a.
export default function render(icon) {
  return [
    [
      "path",
      {
        "d": "M4 3h6v1h-6zM3 4h7v1h-7zM3 5h2v1h-2zM3 6h2v1h-2zM3 7h2v1h-2zM3 8h2v1h-2zM3 9h2v1h-2zM3 10h2v1h-2zM3 11h2v1h-2zM3 12h2v1h-2zM3 13h2v1h-2zM3 14h2v1h-2zM3 15h2v1h-2zM3 16h2v1h-2zM3 17h2v1h-2zM3 18h2v1h-2zM3 19h7v1h-7zM4 20h6v1h-6z"
      }
    ],
    [
      "path",
      {
        "d": "M15 7h3v1h-3zM16 8h3v1h-3zM17 9h3v1h-3zM18 10h3v1h-3zM8 11h14v1h-14zM8 12h14v1h-14zM18 13h3v1h-3zM17 14h3v1h-3zM16 15h3v1h-3zM15 16h3v1h-3z",
        "class": "wm-a"
      }
    ]
  ]
}
