// SUITE per-icon tuning: small, named exceptions to the automatic construction.
// Never in skeletons. Keys are icon names (Live icons too).
//   warm: true       the body takes the warm accent hue (alerts, warnings, alarms)
//   cells: false     never split the body into multi-hue cells
//   backHue: role    hue of the back plane (default c2)
//   panelY: y        the body above y is a deeper back sheet (folders)
const WARM = ['alert-triangle', 'alert-circle', 'alert-octagon', 'siren', 'shield-alert', 'flame', 'triangle-alert', 'octagon-alert', 'circle-alert', 'bug', 'zap', 'plug-zap', 'flag', 'star', 'trophy', 'award', 'medal', 'lightbulb']
const T = {}
// folders: the tab is the back sheet, the front panel starts below it
for (const n of ['folder', 'folder-plus', 'folder-minus', 'folder-search', 'folder-label', 'folder-lock', 'folder-check', 'folder-x', 'folder-up', 'folder-down']) T[n] = { panelY: 9.5 }
for (const n of WARM) T[n] = { ...(T[n] || {}), warm: true }
// the piggy bank's face: a dark eye and two nostrils on the snout
T['piggy-bank'] = { dots: [[15.75, 12.3, 0.85], [19.2, 13.5, 0.42], [20.3, 13.5, 0.42]] }
export const tuneFor = name => T[name] || {}
