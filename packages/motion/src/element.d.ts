// Importing '@withicons/motion/element' upgrades every <with-icon> with motion / preset / swap-to attributes
// (now and in the future). upgradeMotion(root) re-scans a subtree on demand (e.g. inside your own shadow root).
export function upgradeMotion(root?: ParentNode): void
// Served unbundled from a CDN, the element links each animated icon's own defaults (dist/icons/<name>.css) when
// icons.css is not on the page. Point it at your own copy of dist/icons/, or pass null to turn it off.
export function setMotionIconBase(url: string | null): void
