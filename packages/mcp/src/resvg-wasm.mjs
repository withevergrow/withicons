// The hosted server's PNG renderer: @resvg/resvg-wasm (the same Rust resvg as the native @resvg/resvg-js that the CLI and
// the local server load) behind the part of the resvg-js API the export engine calls (packages/cli/src/export.mjs):
//   new Resvg(svg, opts).render() -> { width, height, pixels (premultiplied RGBA), asPng() }, innerBBox(), getBBox()
// Only the Lambda bundle uses it: forge/lib/emit-mcp.mjs aliases '@resvg/resvg-js' to this file in dist/lambda.mjs and copies
// the .wasm next to it (dist/resvg.wasm; scripts/deploy.mjs zips it as mcp/resvg.wasm). lambda.mjs registers initResvg()
// with export-tool.mjs, which awaits it before the first PNG-based export: the wasm (2.4 MB) is compiled once per execution
// environment, on the first request that needs it, never at cold start (most requests never render a PNG).
// wasm memory is not managed by the JS garbage collector, so every wasm object is freed as soon as it has been read.
import fs from 'node:fs'
import { initWasm, Resvg as WasmResvg } from '@resvg/resvg-wasm'

export const WASM_FILE = 'resvg.wasm'
let ready = null
/** Compile and instantiate the wasm once. -> Promise<{ ms }> (ms: how long the first initialisation took). Rejects when the file is missing. */
export function initResvg() {
  if (!ready) {
    ready = (async () => {
      const t = performance.now()
      await initWasm(fs.readFileSync(new URL('./' + WASM_FILE, import.meta.url)))
      return { ms: Math.round(performance.now() - t) }
    })()
    ready.catch(() => { ready = null })   // a failed start (no file) is retried by the next request
  }
  return ready
}

const plainBox = b => {
  if (!b) return b
  try { return { x: b.x, y: b.y, width: b.width, height: b.height } } finally { b.free() }
}

class Rendered {
  constructor(img) { this.width = img.width; this.height = img.height; this.img = img }
  // the image is freed after its first read; the other form is not kept (the export engine reads one of them)
  read(fn) {
    const img = this.img
    if (!img) throw new Error('resvg-wasm: this rendered image was already read')
    this.img = null
    try { return fn(img) } finally { img.free() }
  }
  get pixels() { return this.px || (this.px = this.read(i => i.pixels)) }
  asPng() { return this.png || (this.png = this.read(i => i.asPng())) }
}

export class Resvg {
  constructor(svg, options) {
    this.svg = svg; this.options = options
    this.r = new WasmResvg(svg, options)   // parses now: an invalid SVG throws here, as in resvg-js
  }
  // each call parses at most once more and frees the tree straight after
  use(fn) {
    const r = this.r || new WasmResvg(this.svg, this.options)
    this.r = null
    try { return fn(r) } finally { r.free() }
  }
  get width() { return this.use(r => r.width) }
  get height() { return this.use(r => r.height) }
  render() { return new Rendered(this.use(r => r.render())) }
  innerBBox() { return this.use(r => plainBox(r.innerBBox())) }
  getBBox() { return this.use(r => plainBox(r.getBBox())) }
}

export default { Resvg, initResvg }
