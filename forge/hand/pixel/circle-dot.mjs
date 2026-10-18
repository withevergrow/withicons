// forge/hand/pixel/circle-dot.mjs - Circle dot: clean round 2px ring with a solid, symmetric centre dot.
// Cell-aligned 1u pixel art: ink outline, body + shade tones, one shine, details tagged wm-a.
export default function render(icon) {
  return [
  [
    "path",
    {
      "d": "M9 2h6v1h-6zM7 3h10v1h-10zM6 4h4v1h-4zM14 4h4v1h-4zM5 5h3v1h-3zM16 5h3v1h-3zM4 6h2v1h-2zM18 6h2v1h-2zM3 7h3v1h-3zM18 7h3v1h-3zM3 8h2v1h-2zM19 8h2v1h-2zM2 9h3v1h-3zM19 9h3v1h-3zM2 10h2v1h-2zM20 10h2v1h-2zM2 11h2v1h-2zM20 11h2v1h-2zM2 12h2v1h-2zM20 12h2v1h-2zM2 13h2v1h-2zM20 13h2v1h-2zM2 14h3v1h-3zM19 14h3v1h-3zM3 15h2v1h-2zM19 15h2v1h-2zM3 16h3v1h-3zM18 16h3v1h-3zM4 17h2v1h-2zM18 17h2v1h-2zM5 18h3v1h-3zM16 18h3v1h-3zM6 19h4v1h-4zM14 19h4v1h-4zM7 20h10v1h-10zM9 21h6v1h-6z"
    }
  ],
  [
    "path",
    {
      "d": "M10 9h4v1h-4zM9 10h6v1h-6zM9 11h6v1h-6zM9 12h6v1h-6zM9 13h6v1h-6zM10 14h4v1h-4z",
      "class": "wm-a"
    }
  ]
];
}
