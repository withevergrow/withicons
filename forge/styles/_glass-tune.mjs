// GLASS per-icon tuning. Skeletons stay style-agnostic: any icon that needs a
// nudge for glass gets it here, never in forge/icons.
//   scale        drawing scale about the centre (default 0.94)
//   r            rod radius (default 1.4); rK / rA / rS override it per plate
//   shiftMass    how far big masses' back layer sits down-right (default 1.35u); shiftRod for rods (0.3u)
//   erodeMax     how much slimmer a big mass's back layer is (default 0.8u)
//   keepInterior treat lines inside the fills as structure, not etched detail
//   noParting    no parting cut between attached A parts and the object
//   noFills      ignore the skeleton's fills (glass rods read better than a solid-style mass)
//   noCutouts    ignore the skeleton's cutouts; skipCut: [i] ignores only those cutout subpaths
//   part         SVG path (skeleton coordinates): a parting cut through both panes, partW wide (0.42u)
//   through      true/false: closed cutouts go through both panes / only the front pane (default by size)
//   noKeepOpen   let glass rods close Line's narrow counters and gaps
export const TUNE = {
  // fills and cutouts engineered for Solid's knockouts: as glass, the plain rods read cleaner
  signal: { noFills: true, noCutouts: true },
  wifi: { noFills: true, noCutouts: true },
  'wifi-off': { noFills: true, noCutouts: true },
  target: { noFills: true, noCutouts: true },
  rainbow: { noFills: true, noCutouts: true },
  // crowded rods: slimmer glass so the parts stay apart
  usb: { r: 1.1 },
  'text-cursor-input': { r: 1.2 },
  webhook: { r: 1.2 },
  // a numeral signal: a slim crisp glyph, not a blob
  'repeat-1': { rS: 1.0 },
  // dome and base are two panes; the seam line is the parting cut itself
  siren: { part: 'M4.5 16.2 H19.5', skipCut: [1] },
  // stem and leaf stay two slim parts
  apple: { rA: 1.12 },
  salad: { rA: 1.15 },
  school: { rK: 1.25 },
  // a screen with a window: the screen glows like the other screens
  'picture-in-picture': { through: false },
  // thin wings: a closer back layer keeps the silhouette crisp
  'plane-takeoff': { shiftMass: 0.75, erodeMax: 0.6 },
  'plane-landing': { shiftMass: 0.75, erodeMax: 0.6 },
  plane: { shiftMass: 0.75, erodeMax: 0.6 },
}
export const tuneFor = name => TUNE[name] || {}
