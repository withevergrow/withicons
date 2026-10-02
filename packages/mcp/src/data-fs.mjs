// Data from JSON files next to the bundle (dist/data/*.json). Style SVG files load lazily, on first use.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

function dataDir() {
  const here = path.dirname(fileURLToPath(import.meta.url))
  for (const d of [path.join(here, 'data'), path.join(here, '..', 'dist', 'data')]) if (fs.existsSync(path.join(d, 'meta.json'))) return d
  throw new Error('@withicons/mcp: icon data not found (dist/data/meta.json). Run the forge build.')
}

export function loadData() {
  const dir = dataDir()
  const read = f => JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'))
  const svgs = {}
  let palettes = null
  return {
    meta: read('meta.json'),
    // optional: animation specs from @withicons/motion (absent in older builds)
    motion: fs.existsSync(path.join(dir, 'motion.json')) ? read('motion.json') : null,
    index: read('search-index.json'),
    svg: style => svgs[style] || (svgs[style] = read(`svg-${style}.json`)),
    // optional: per-icon colour palettes from @withicons/core (absent in older builds); read on first use
    palettes: () => palettes || (palettes = fs.existsSync(path.join(dir, 'palettes.json')) ? read('palettes.json') : { roles: [], icons: {} }),
  }
}
