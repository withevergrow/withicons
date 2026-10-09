// CHRISTMAS per-icon tuning (never in skeletons).
//
// BODY: which role paints the object (K plate). Default is cranberry red (c1); evergreens are pine (c2);
//       metal and light are gold (c3); white things are snow cream (c4).
// GLOW: icons that give off light get a soft warm halo behind them.
// NOSNOW: icons that should not wear a snow cap (it would read as something else, or the top IS snow).
// CANDY: icons whose body itself is candy-striped (cream with red stripes).
// NOHOLLY: icons where a holly sprig on the snow would clutter or contradict the object.
// PART: role of A parts per icon (default: candy cream with red stripes, 'candy').

const re = list => new RegExp('^(' + list.join('|') + ')$')

export const GREEN = re([
  'christmas-tree', 'tree-pine', 'trees?', 'palm-tree', 'wreath', 'holly', 'mistletoe', 'leaf', 'leaves', 'sprout',
  'plant', 'potted-plant', 'clover', 'cactus', 'shamrock', 'herb', 'seedling', 'recycle',
])
export const GOLD = re([
  'bell', 'bell-.*', 'jingle-bells', 'star', 'star-half', 'north-star', 'sparkles?', 'crown', 'trophy', 'award', 'medal',
  'coins?', 'hand-coins', 'lucky-coin', 'sun', 'sun-dim', 'sunrise', 'sunset', 'lightbulb', 'lightbulb-off', 'key',
  'gem', 'flame', 'firecracker.*', 'music.*', 'trumpet', 'horn', 'badge.*', 'ticket',
])
export const CREAM = re([
  'snowman', 'snowflake', 'cloud.*', 'cloud-snow', 'snow-globe', 'christmas-candle', 'candle', 'egg', 'ghost',
  'sticky-note', 'scroll',
])
export const GLOW = re([
  'north-star', 'star', 'sparkles?', 'christmas-candle', 'candle', 'flame', 'fireplace', 'lightbulb', 'sun', 'lamp',
  'lantern', 'diya', 'firecracker.*',
])
export const NOSNOW = re([
  'snowflake', 'cloud.*', 'snow-globe', 'flame', 'fireplace', 'christmas-candle', 'candle', 'droplet.*', 'sparkles?',
  'north-star',
])
export const CANDY = re(['candy-cane', 'candy', 'lollipop'])
export const NOHOLLY = re([
  'holly', 'mistletoe', 'wreath', 'poinsettia', 'christmas-tree', 'candy-cane', 'snowflake', 'north-star', 'star',
  'sparkles?', 'loader.*', 'dot.*', 'minus', 'plus', 'x', 'check', 'chevron.*', 'arrow.*', 'menu', 'more-.*',
])
// A parts on festive icons that look better in a plain colour than candy-striped
export const PART = {
  'christmas-tree': 'c3', 'santa-hat': 'c4', 'snowman': 'c1', 'reindeer': 'c3', 'gingerbread-man': 'c4',
  'bauble': 'c3', 'wreath': 'c1', 'holly': 'c1', 'mistletoe': 'c1', 'stocking': 'c4', 'jingle-bells': 'c1',
  'poinsettia': 'c4', 'nutcracker': 'c2', 'christmas-candle': 'c3', 'fireplace': 'c3', 'snow-globe': 'c2',
  'sleigh': 'c3', 'gift-stack': 'c3', 'north-star': 'c3', 'gift': 'c3', 'tree-pine': 'c3', 'cloud-snow': 'tint',
  'piggy-bank': 'c4',
}
// body overrides for festive icons whose real colour is not the family default
export const BODY = {
  'heart': 'c1',
  'gingerbread-man': 'c3', 'reindeer': 'c3', 'sleigh': 'c1', 'nutcracker': 'c1', 'stocking': 'c1', 'santa-hat': 'c1',
  'poinsettia': 'c1', 'bauble': 'c1', 'fireplace': 'c1', 'snow-globe': 'tint', 'christmas-candle': 'c1', 'snowman': 'c4', 'gift-stack': 'c1', 'gift': 'c1',
  'piggy-bank': 'c1',
}
// how steep a top may be and still hold snow (1 = default; evergreens hold snow on their tiers)
export const STEEP = { 'christmas-tree': 1.9, 'tree-pine': 1.9, 'trees': 1.6, 'tree': 1.4, 'santa-hat': 1.5, 'mountain': 1.5, 'mountain-snow': 1.5, 'tent': 1.3 }
// the festive set (forge/.claims/new-31.json): per plate roles (K body, A parts, S badges) and switches.
// K / A go through BODY / PART above; FEST adds the S role and the snow / holly / glow switches.
export const FEST = {
  'christmas-tree': { holly: false },
  'piggy-bank': { S: 'c3' },   // a cranberry piggy bank, a cream snout, a gold coin
  'santa-hat': { snow: false, holly: false },
  'gingerbread-man': { holly: false },
  'snowman': { holly: false },
  'reindeer': { S: 'c1', holly: false },
  'mistletoe': { S: 'c4', snow: false, holly: false },
  'jingle-bells': { S: 'c1', snow: false, holly: false },
  'fireplace': { S: 'c4', spark: false },
  'snow-globe': { S: 'shine', holly: false },
  'poinsettia': { S: 'c3', snow: false, holly: false },
  'nutcracker': { S: 'c3', holly: false },
  'christmas-candle': { S: 'c3' },
  'holly': { snow: false, holly: false },
  'bauble': { holly: false },
}
