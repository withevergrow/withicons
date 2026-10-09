// VALENTINE per-icon tuning (never in skeletons).
//   k a s     roles of the K body, A parts, S badges ('grad' = the pink-to-red body gradient)
//   paint     [[x, y, role], ...] the piece of the mass under (x, y) takes that role
//   draw      [[part, role, width | 'heart' | 'sparkle' | 'oval' | 'smile' | omitted], ...] laid over the body in order; part is
//             { path: [x, y] } (the skeleton path nearest that point), { cut: [x, y] } (nearest cutout), own path data,
//             or a path index (avoid: breaks when a skeleton is reordered). No width: filled and outlined; a width:
//             stroked with an ink casing (role 'ink': a plain ink stroke); 'heart' / 'sparkle': that shape centred on the
//             part; 'smile': a little nose line + mouth under it
//   inlayAt   [[x, y, role], ...] the knockout hole around (x, y) shows that role instead of cream
//   header    y: the K body above this line (a calendar's header) is painted c2; true: the top piece if it stands apart
//   inlay     role of the paper showing through knockouts (default c4 cream)
//   face      true / false / omitted (the FACE rule decides)   faceAt [[x, y, scale], ...] fixed faces
//   faces     how many faces at most (default 1; two hugging hearts get one each)
//   fdx fdy   face nudge (fdy defaults to +0.3: faces sit a touch low, the baby schema)   fs  face scale
//   expr      'smile' | 'open'           deco  'dots' | 'sprinkles' | 'hearts' | null   decoBox [x0, y0, x1, y1]
//   hide      [part, ...] skeleton paths left out of the mass (redrawn through 'draw'); part as in draw
//   hearts    floating hearts (0-3)      blush [[x, y, scale], ...] cheeks only (an icon that draws its own face)
//
// Roles (the colour logic of a Valentine card): c1 pink + c2 red are the heroes (hearts, gifts, bows, headers),
// c3 chocolate (food, teddy, cardboard), c4 cream (paper, mugs, clouds), tint gold (champagne, stars, rings),
// accent green (leaves), shine white (highlights, polka dots, marshmallows), edge blush, shadow the shade.

// the 15 Valentine icons (forge/.claims/new-33.json) + the heart family: the style's home turf
export const VALENTINE = new Set(['love-letter', 'heart-pair', 'rose-bouquet', 'choco-strawberry', 'teddy-bear', 'heart-gift',
  'champagne-toast', 'cupid-bow', 'chocolate-box', 'love-scroll', 'hot-cocoa', 'heart-balloon', 'ring-box', 'rose', 'love-lock',
  'heart'])

// round, friendly objects that may wear a face
export const FACE = /^(heart|heart-pair|heart-balloon|love-letter|hot-cocoa|choco-strawberry|teddy-bear|mug|cup|coffee|tea|cookie|donut|cake|cupcake|apple|cherry|strawberry|egg|cloud|sun|moon|balloon|candy|ice-cream|pumpkin|lemon|orange|piggy-bank|pie|muffin|pear|peach|avocado|bread|toast|croissant|onigiri|dumpling|lantern|cocoa|bubble-tea|milk|jar|planet|fish|blob|slime|chat|message-circle|mail|envelope)$/
export const NO_FACE = /crack|off|slash|x$|minus|plus|^avatar-|smile|laugh|frown|meh|angry|face|skull|lantern-face/
// sweets get sprinkles (presents get polka dots through MATERIALS)
export const SPRINKLES = /^(donut|cake|cupcake|ice-cream|cookie|choco-strawberry|muffin|candy|lollipop)$/

// what an everyday object is made of: first match wins, a TUNE entry overrides; default is the pink gradient
export const MATERIALS = [
  [/^(file|files|mail|calendar|clipboard|notebook|notepad|sticky-note|receipt|newspaper|book|scroll|ticket|id-card|passport|copy|paste|library|kanban|list-todo|presentation|stamp|captions|message|messages|bot-message|inbox|folder|clapperboard|sidebar|panel|app-window|layout|images?$|image-|gallery)/,
    { k: 'c4', a: 'c2', s: 'c2', deco: 'hearts' }],
  [/^(star|crown|trophy|award|medal|coins|lucky-coin|gold-ingot|key|bell|jingle-bells|sparkles|sun|moon|lightbulb$|zap$|north-star|dollar-sign|euro|pound-sterling|indian-rupee|bauble|gem|wand|badge-check|bolt|diya|kalash|trumpet)/,
    { k: 'tint', a: 'c2', s: 'c2' }],
  [/^(leaf|tree-pine|sprout|plant|holly|mistletoe|bamboo|palm-tree|salad|cactus|wreath|christmas-tree|lotus)/,
    { k: 'accent', a: 'c3', s: 'c2' }],
  [/^(teddy|cookie|bread|gingerbread|package|boxes|warehouse|briefcase|backpack|luggage|wallet|dog|paw-print|avatar-bear|basketball|football|archive|broom|coffin|chopsticks|guitar|hammer|chair|sofa|door|store|tent|dholak|dhak|lunar-drum)/,
    { k: 'c3', a: 'c2', s: 'c2' }],
  [/^(cloud|egg|ghost|snow|bath|toilet|tooth|cup-soda|coffee|teapot|soup|cooking-pot|chef-hat|rabbit|refrigerator|washing-machine|printer|tooth|bed|ice-cream|popcorn|dumpling|mouse$|keyboard|calculator|laptop|monitor|tv|smartphone|tablet|phone$|watch|camera|webcam|speaker|radio|router|server|hard-drive|database|cpu|gamepad|headphones|headset|microphone|plug|usb)/,
    { k: 'c4', a: 'c2', s: 'c2' }],
  [/^(apple|rose$|flame|siren|fire|candy-cane|santa|stop$|alert|shield-alert|x-circle|heart-pulse|heart-crack|first-aid|pill|mandarin|red-|lipstick|cherry|strawberry|chinese-knot|firecracker)/,
    { k: 'c2', a: 'c3', s: 'tint' }],
  [/^(gift|heart-gift|gift-stack|shopping-bag|party-popper|balloon)/, { k: 'grad', a: 'c2', s: 'c2', deco: 'dots' }],
]

export const TUNE = {
  // the 15 Valentine icons
  'love-letter': { k: 'c4', a: 'shine', s: 'c2', face: true, faceAt: [[12, 8.4, 0.62]], deco: null },
  'heart-pair': { k: 'grad', a: 'c2', faces: 2 },
  'piggy-bank': { a: 'c1', s: 'tint', face: false, blush: [[16.4, 14.6, 0.7]] },   // a pink pig with its own eye and a blush, a gold coin
  'rose-bouquet': { k: 'c4', a: 'c2', s: 'c1', deco: null },
  'choco-strawberry': { k: 'c2', a: 'c3', paint: [[12, 18.5, 'c3']], draw: [[{ path: [9, 15.5] }, 'c3', 2], [{ path: [9, 4.75] }, 'accent', 2]], deco: 'sprinkles', decoBox: [2, 15, 22, 22], face: true, faceAt: [[12, 10.4, 0.7]] },
  'teddy-bear': { k: 'c3', a: 'c2', inlay: 'c3', face: false, hearts: 2,
    inlayAt: [[9.5, 7.75, 'ink'], [14.5, 7.75, 'ink'], [7, 4, 'edge'], [17, 4, 'edge']],
    draw: [[{ cut: [12, 9.25] }, 'c4', 'oval'], [{ path: [12, 10.75] }, 'ink', 1.35], [{ path: [12, 10.75] }, 'ink', 'smile'], [{ path: [12, 15.75] }, 'c2']],
    blush: [[8.4, 10.3, 0.75], [15.6, 10.3, 0.75]] },
  'heart-gift': { k: 'grad', a: 'c2', s: 'c2', deco: 'dots' },
  'champagne-toast': { k: 'tint', a: 'shine', s: 'c2', hide: [{ path: [4, 4.5] }, { path: [20, 4.5] }], hearts: 0, draw: [[{ path: [4, 4.5] }, 'c2', 'heart'], [{ path: [20, 4.5] }, 'c1', 'sparkle']] },
  'cupid-bow': { k: 'tint', a: 'c2' },
  'chocolate-box': { k: 'c2', inlay: 'c3', a: 'c4', deco: null, face: false },
  'love-scroll': { k: 'c4', a: 'c2', s: 'c1', deco: null, draw: [[{ path: [10.25, 9.5] }, 'c2']] },
  'hot-cocoa': { k: 'grad', a: 'shine', paint: [[19.7, 14.75, 'c1']], s: 'shine' },
  'heart-balloon': { k: 'grad', a: 'c3', paint: [[7.35, 7.5, 'shine']] },
  'ring-box': { k: 'c2', a: 'tint', s: 'shine', deco: 'dots' },
  'rose': { k: 'c2', a: 'accent' },
  'love-lock': { k: 'grad', a: 'tint', paint: [[12, 14, 'c3']] },
  // everyday icons that read better with a nudge
  'calendar': { header: 10 }, 'calendar-days': { header: 10 }, 'calendar-check': { header: 10 }, 'calendar-plus': { header: 10 },
  'calendar-x': { header: 10 }, 'calendar-clock': { header: 10 }, 'calendar-span': { header: 10 },
  'coffee': { a: 'c3', s: 'c3' },
}
