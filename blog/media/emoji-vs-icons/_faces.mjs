// Three generic smiley faces drawn for this post (not any vendor's emoji artwork): the same "smiling face" character
// as three different devices might draw it. Shared by the featured image and the in-post images (files starting with
// _ are not rendered on their own). Each takes a size and a unique id prefix for its gradients.

/** soft round yellow, open smile */
export const round = (size, id) => `<svg width="${size}" height="${size}" viewBox="0 0 100 100">
  <defs><radialGradient id="${id}" cx="40%" cy="32%" r="75%"><stop offset="0" stop-color="#FFE98A"/><stop offset=".65" stop-color="#FFC93C"/><stop offset="1" stop-color="#F5A623"/></radialGradient></defs>
  <circle cx="50" cy="50" r="46" fill="url(#${id})"/>
  <ellipse cx="36" cy="40" rx="5" ry="8" fill="#5B3A1A"/><ellipse cx="64" cy="40" rx="5" ry="8" fill="#5B3A1A"/>
  <path d="M27 57 Q50 84 73 57 Q50 66 27 57 Z" fill="#5B3A1A"/><path d="M38 68 Q50 76 62 68 Q50 72 38 68 Z" fill="#FF7A7A"/>
</svg>`

/** flat with a thick outline, dot eyes, a thin arc */
export const flat = (size) => `<svg width="${size}" height="${size}" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="43" fill="#FFD43B" stroke="#1B1B1F" stroke-width="6"/>
  <circle cx="36" cy="42" r="5.5" fill="#1B1B1F"/><circle cx="64" cy="42" r="5.5" fill="#1B1B1F"/>
  <path d="M31 60 Q50 76 69 60" fill="none" stroke="#1B1B1F" stroke-width="6" stroke-linecap="round"/>
</svg>`

/** glossy orange, happy closed eyes, a wide toothy grin */
export const gloss = (size, id) => `<svg width="${size}" height="${size}" viewBox="0 0 100 100">
  <defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFD15C"/><stop offset="1" stop-color="#FF8A1F"/></linearGradient></defs>
  <circle cx="50" cy="50" r="46" fill="url(#${id})"/>
  <ellipse cx="38" cy="22" rx="22" ry="11" fill="#fff" opacity=".55"/>
  <path d="M28 44 Q35 35 42 44 M58 44 Q65 35 72 44" fill="none" stroke="#6A2E05" stroke-width="5" stroke-linecap="round"/>
  <path d="M24 55 H76 Q74 80 50 82 Q26 80 24 55 Z" fill="#6A2E05"/><path d="M28 56 H72 V63 H28 Z" fill="#fff"/>
</svg>`

export const FACES = [round, flat, gloss]
