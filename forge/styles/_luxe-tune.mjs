// LUXE per-icon tuning. Skeletons stay style-agnostic: anything Luxe needs to know
// about one icon lives here, never in forge/icons.
//   scale       extra drawing scale (multiplies the base 0.9)
//   dx, dy      extra drawing offset (u)
//   wk, wa, ws  tube widths for K / A / S strokes
//   cut         engraved groove width
//   plate       { pathId: 'K'|'A'|'S' } re-plate a path for this style
//   remap       { K: 'A' } re-plate every path of one plate
//   fillPlate   force every fill onto one plate
//   aFront      true/false: A parts are inlays in front / pieces behind (default: by position)
//   noFills     ignore the skeleton's fills (tubes read better than a mass)
//   noCutouts   ignore the skeleton's cutouts
//   addCutouts  [d] extra closed cutouts engraved for Luxe only (a recessed dial)
//   noEngrave   K lines inside the mass fuse into it instead of being engraved
//   noShadow    no cast shadow
//   recFloor    role that lights the floor of the enamel's engraved wells (default: its wall colour)
//   extra       [{ d, plate }] parts added for Luxe only (default plate S: a ruby in a gold bezel)
//   redraw      { paths, fills, cutouts } replaces the skeleton geometry for Luxe (same grid and
//               keylines, coordinates taken from the skeleton so the icon still matches its family)
export const TUNE = {
  // concentric arcs: as a filled wedge they read as a fan; as tubes they read as signal
  wifi: { noFills: true, noCutouts: true },
  'wifi-off': { noFills: true, noCutouts: true },
  rainbow: { noFills: true, noCutouts: true },
  // a prohibition sign is a ring with a bar, not a disc
  // wheels sit in front of the body, gold with engraved hubs
  ambulance: { aFront: true },
  truck: { aFront: true },
  // a film strip is one enamel frame with its sprocket holes and window engraved
  film: { plate: { p1: 'K', p2: 'K', p3: 'K', p4: 'K' } },
  ban: { noFills: true, noCutouts: true },
  // crown jewels: three rubies set into the band
  crown: { extra: [{ d: 'M7.5 13.25 L7.5 13.25' }, { d: 'M12 12.5 L12 12.5' }, { d: 'M16.5 13.25 L16.5 13.25' }], ws: 3.1 },
  // a cut stone: facets engraved into the sapphire rather than laid over it in gold
  // bars split by full-height cutouts: as plain tubes they read as bars, not wells
  signal: { noFills: true, noCutouts: true },
  'signal-bars': { noFills: true, noCutouts: true },
  // three free-standing bars on a gold plinth (the skeleton's one-mass-with-slots reads as a wall)
  'chart-bar': { noCutouts: true, wk: 3.4, redraw: {
    paths: [{ d: 'M6.5 19 V13.5', plate: 'K' }, { d: 'M12 19 V5.75', plate: 'K' }, { d: 'M17.5 19 V10', plate: 'K' }, { d: 'M2.5 20.5 H21.5', plate: 'A' }],
    fills: [], cutouts: [] } },
  // a fine parting line between the two books, not a slot
  library: { cut: 0.75 },
  // a gold snow cap on the peak; the ridge is a fine engraved line
  mountain: { cut: 0.8, aFront: true, redraw: {
    paths: [{ d: 'M2 20 L9.5 5 L14 14 L16.5 10 L22 20 Z', plate: 'K' }, { d: 'M9.5 5 L12.25 10.5 L11 11.75 L9.75 10.5 L8.25 11.75 L6.75 10.5 Z', plate: 'A' }],
    fills: ['M2 20 L9.5 5 L14 14 L16.5 10 L22 20 Z', 'M9.5 5 L12.25 10.5 L11 11.75 L9.75 10.5 L8.25 11.75 L6.75 10.5 Z'], cutouts: ['M14 14 L16.75 19.5'] } },
  // a fine shell plate (a full-weight gold trapezoid reads as the letter A)
  turtle: { wa: 1.3 },
  // a fine gold grid set inside the sheet (full-width rules ran out past its edge)
  'file-spreadsheet': { noCutouts: true, redraw: {
    paths: [{ d: 'M14 2.5 H7 A2 2 0 0 0 5 4.5 V19.5 A2 2 0 0 0 7 21.5 H17 A2 2 0 0 0 19 19.5 V7.5 Z', plate: 'K' },
      { d: 'M14 2.5 V6 A1.5 1.5 0 0 0 15.5 7.5 H19', plate: 'A' },
      { d: 'M7.25 12.5 H16.75', plate: 'A' }, { d: 'M7.25 16.5 H16.75', plate: 'A' }, { d: 'M10.75 12.5 V19.25', plate: 'A' }],
    fills: ['M14 2.5 H7 A2 2 0 0 0 5 4.5 V19.5 A2 2 0 0 0 7 21.5 H17 A2 2 0 0 0 19 19.5 V7.5 Z'],
    cutouts: ['M14 2.5 V6 A1.5 1.5 0 0 0 15.5 7.5 H19'] } },
  gem: { plate: { p1: 'K', p2: 'K', p3: 'K' }, cut: 0.9 },
  // two cast gold wheels with engraved hubs set in front of the enamel tank and seat; the
  // groove round each wheel keeps it a wheel (as one enamel mass the rear wheel fused into the seat)
  motorcycle: { aFront: true, redraw: {
    paths: [{ d: 'M3 10 H15.5 L12 14 H8.5 Z', plate: 'K' }, { d: 'M5.5 17 L8.5 14', plate: 'K' },
      { d: 'M8.5 17 A3 3 0 1 1 2.5 17 A3 3 0 1 1 8.5 17 Z', plate: 'A' }, { d: 'M21.5 17 A3 3 0 1 1 15.5 17 A3 3 0 1 1 21.5 17 Z', plate: 'A' },
      { d: 'M18.5 17 L15.5 8.5 L13 7.5', plate: 'A' }],
    fills: ['M3 10 H15.5 L12 14 H8.5 Z', 'M8.5 17 A3 3 0 1 1 2.5 17 A3 3 0 1 1 8.5 17 Z', 'M21.5 17 A3 3 0 1 1 15.5 17 A3 3 0 1 1 21.5 17 Z'],
    cutouts: ['M6.5 17 A1 1 0 1 1 4.5 17 A1 1 0 1 1 6.5 17 Z', 'M19.5 17 A1 1 0 1 1 17.5 17 A1 1 0 1 1 19.5 17 Z'] } },
  // an enamel case standing proud of polished gold straps, a recessed dark dial and gold hands
  watch: { redraw: {
    paths: [{ d: 'M18.5 12 A6.5 6.5 0 1 1 5.5 12 A6.5 6.5 0 1 1 18.5 12 Z', plate: 'K' },
      { d: 'M8.5 6.523 L9 3.5 A1 1 0 0 1 10 2.5 H14 A1 1 0 0 1 15 3.5 L15.5 6.523', plate: 'A' },
      { d: 'M8.5 17.477 L9 20.5 A1 1 0 0 0 10 21.5 H14 A1 1 0 0 0 15 20.5 L15.5 17.477', plate: 'A' },
      { d: 'M12 9 V12 L14 13.5', plate: 'A' }],
    fills: ['M18.5 12 A6.5 6.5 0 1 1 5.5 12 A6.5 6.5 0 1 1 18.5 12 Z',
      'M8.5 6.523 L9 3.5 A1 1 0 0 1 10 2.5 H14 A1 1 0 0 1 15 3.5 L15.5 6.523 A6.5 6.5 0 0 0 8.5 6.523 Z',
      'M8.5 17.477 L9 20.5 A1 1 0 0 0 10 21.5 H14 A1 1 0 0 0 15 20.5 L15.5 17.477 A6.5 6.5 0 0 1 8.5 17.477 Z'],
    cutouts: ['M16.75 12 A4.75 4.75 0 1 1 7.25 12 A4.75 4.75 0 1 1 16.75 12 Z'] } },
  // windows engraved straight into the enamel, lit gold inside; six gold window blocks, each
  // engraved again, were busy at icon sizes and made the heaviest file in the set
  building: { recFloor: 'accent', redraw: {
    paths: [{ d: 'M5 21.5 V4.5 A2 2 0 0 1 7 2.5 H17 A2 2 0 0 1 19 4.5 V21.5', plate: 'K' }, { d: 'M3 21.5 H21', plate: 'K' },
      { d: 'M10 21.5 V19 A1 1 0 0 1 11 18 H13 A1 1 0 0 1 14 19 V21.5', plate: 'A' }],
    fills: ['M5 21.5 V4.5 A2 2 0 0 1 7 2.5 H17 A2 2 0 0 1 19 4.5 V21.5 Z'],
    cutouts: ['M8.25 5.5 H10.75 V7.5 H8.25 Z', 'M13.25 5.5 H15.75 V7.5 H13.25 Z', 'M8.25 9.5 H10.75 V11.5 H8.25 Z', 'M13.25 9.5 H15.75 V11.5 H13.25 Z',
      'M8.25 13.5 H10.75 V15.5 H8.25 Z', 'M13.25 13.5 H15.75 V15.5 H13.25 Z', 'M10 21.5 V19 A1 1 0 0 1 11 18 H13 A1 1 0 0 1 14 19 V21.5 Z'] } },
  // live twins of the tuned static icons: arcs as tubes, never a filled fan
  'wifi-strength': { noFills: true, noCutouts: true, wk: 2.25 },
  // live twin of watch: gold straps behind the enamel case, a recessed dial under the gold hands
  'watch-time': p => ({ plate: { p1: 'A', p2: 'A' }, addCutouts: [p.shape === 'square'
    ? 'M8.75 7.25 H15.25 A1.5 1.5 0 0 1 16.75 8.75 V15.25 A1.5 1.5 0 0 1 15.25 16.75 H8.75 A1.5 1.5 0 0 1 7.25 15.25 V8.75 A1.5 1.5 0 0 1 8.75 7.25 Z'
    : 'M16.75 12 A4.75 4.75 0 1 1 7.25 12 A4.75 4.75 0 1 1 16.75 12 Z'] }),
  // live: earned stars are polished gold (navy enamel stars sink into a dark page)
  'rating-stars': { remap: { K: 'A' } },
}
// an entry may be a function of a Live icon's params
export const tuneFor = (name, params) => { const t = TUNE[name]; return typeof t === 'function' ? t(params || {}) || {} : t || {} }
