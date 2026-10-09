// CHROME per-icon tuning (never in skeletons). Keys per icon:
//   scale dx dy        drawing scale / offset          wk wa ws cut   widths
//   plate {pathId:pl}  remap {K:'A'}                   fillPlate      aFront true|false
//   noFills noCutouts noEngrave noGlint  round  glint  redraw {paths, fills, cutouts}  extra [{d, plate}]
const TUNE = {
}
export function tuneFor(name, params) {
  void params
  return TUNE[name] || {}
}
