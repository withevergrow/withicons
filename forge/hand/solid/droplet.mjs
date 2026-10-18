// forge/hand/solid/droplet.mjs — droplet redrawn for solid: the long curved highlight read as a phone handset, so the
// drop keeps its clean teardrop silhouette and carries one short, slightly tilted capsule cut-out low in the belly.
export default function render() {
  const body = 'M12 1.6C11.7 1.6 11.4 1.75 11.2 2L7.2 6.9C5.4 9.2 4 11.8 4 14.5C4 18.9 7.6 22.5 12 22.5C16.4 22.5 20 18.9 20 14.5C20 11.8 18.6 9.2 16.8 6.9L12.8 2C12.6 1.75 12.3 1.6 12 1.6Z'
  const hl = 'M7.85 14.2A0.85 0.85 0 0 1 9.55 14.05L9.75 15.75A0.85 0.85 0 0 1 8.05 15.9Z'
  return [['path', { d: body + hl, 'fill-rule': 'evenodd', class: 'wm-k' }]]
}
