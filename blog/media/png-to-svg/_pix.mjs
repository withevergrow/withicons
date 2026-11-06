// Helpers for the raster demos in these posts (not a spec: files starting with _ are skipped by hero-art).
// pixIcon() rasterises a real with icons SVG at a tiny size on a canvas, then blows it up, so readers see what a small
// PNG really looks like when enlarged. Drawn by a tiny inline script when the image loads (deterministic, no randomness).
import { icon as blockIcon } from '../../lib/blocks.mjs'

const flat = s => s.replace(/var\(--[a-z0-9-]+,\s*(#[0-9A-Fa-f]{3,8})\)/g, '$1')
/** the icon as a standalone SVG string (palette variables flattened, currentColor set) */
export const rawSvg = (name, style, size = 240, color = '#111318') => flat(blockIcon(name, style, size)).replace('<svg ', `<svg style="color:${color}" `)
/** data: URL of the icon */
export const svgData = (name, style, color) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(rawSvg(name, style, 240, color))}`

/**
 * A blown-up raster of an icon. o: { res = 16 (source pixels), size = 400 (shown px), color, smooth = false (blurry
 * upscale instead of hard blocks), view = [x, y, w] (show only this square of the res x res raster, for zooms), pad = 0 }
 */
export function pixIcon(name, style, o = {}) {
  const { res = 16, size = 400, color = '#111318', smooth = false, view } = o
  const [vx, vy, vw] = view || [0, 0, res]
  return `<span class="pix" style="display:block;width:${size}px;height:${size}px;line-height:0"><img src="${svgData(name, style, color)}" width="${res}" height="${res}" alt="" style="display:none"><canvas width="${size}" height="${size}" style="width:${size}px;height:${size}px"></canvas><script>(() => {
  const c = document.currentScript.previousElementSibling, i = c.previousElementSibling
  const go = () => {
    const t = document.createElement('canvas'); t.width = ${res}; t.height = ${res}
    t.getContext('2d').drawImage(i, 0, 0, ${res}, ${res})
    const x = c.getContext('2d'); x.imageSmoothingEnabled = ${smooth ? 'true' : 'false'}; x.imageSmoothingQuality = 'high'
    x.drawImage(t, ${vx}, ${vy}, ${vw}, ${vw}, 0, 0, ${size}, ${size})
  }
  i.complete && i.naturalWidth ? go() : i.addEventListener('load', go)
})()</script></span>`
}
