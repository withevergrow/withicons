// GLASS per-icon tuning. Skeletons stay style-agnostic: any icon that needs a
// nudge for glass gets it here, never in forge/icons.
//   scale        drawing scale about the centre (default 0.94)
//   r            rod radius (default 1.4); rK / rA / rS override it per plate
//   shiftMass    how far big masses' colour body sits down-right (default 1.0u); shiftRod for rods (0.35u); shiftF
//                how far the pane sits up-left (grid cells, default 5 = 0.5u)
//   erodeMax     how much slimmer a big mass's colour body is (default 0.4u); erodeMin for rods (0.3u)
//   keepInterior treat lines inside the fills as structure, not etched detail
//   noParting    no parting cut between attached A parts and the object
//   noFills      ignore the skeleton's fills (glass rods read better than a solid-style mass)
//   noCutouts    ignore the skeleton's cutouts; skipCut: [i] ignores only those cutout subpaths
//   part         SVG path (skeleton coordinates): a parting cut through both panes, partW wide (0.42u)
//   through      true/false: closed cutouts go through both panes / only the front pane (default by size)
//   noKeepOpen   let glass rods close Line's narrow counters and gaps
//   frost        scale of the pane's frost (default 1)
//   edge         opacity of the pane's currentColor hairline (default 0.2)
//   noRim        no light rim on the lit edges: a Live value whose edge moves (a bar's top, a slice) keeps its contrast
//                on white at 24px (a white rim on a moving top edge reads as background)
export const TUNE = {
  // Live icons (forge/DYNAMIC.md): an empty battery / the dry part of a drop reads empty, not as a lit window
  'battery-level': { through: true },
  'battery-charging-level': { through: true },
  'battery-vertical': { through: true },
  'humidity': { through: true },
  // five bars stay five countable rods
  // piggy-bank: a parting cut rings the snout so the face reads apart from the body
  'piggy-bank': { part: 'M21.6 13.75 A1.85 2.6 0 1 1 17.9 13.75 A1.85 2.6 0 1 1 21.6 13.75 Z' },
  'bar-values': { r: 1.1, noRim: true, shiftF: 0, shiftRod: 0, erodeMin: 0, frost: 0.1 },
  // the elapsed sector reads as an empty slice, not a window the colour glows through
  stopwatch: { through: true },
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
