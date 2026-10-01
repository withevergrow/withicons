// Dev build for the search + MCP + CLI packages only: renders every icon like forge/build.mjs, then runs
// emit-search and emit-mcp (and nothing else — no site-data / SEO regeneration). `node packages/mcp/scripts/dev-build.mjs`
import fs from 'fs'
import path from 'path'
import { pathToFileURL } from 'url'
import { ROOT, listIcons, loadIcon, loadStyles, renderIcon, toSvg, nodesToMarkup } from '../../../forge/lib/load.mjs'

const t0 = Date.now()
const ORDER = ['line', 'solid', 'duo', 'gloss', 'engrave', 'blueprint', 'sketch']
const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'))
const version = pkg.withiconsVersion || pkg.egopeniconsVersion || '0.1.0'
const styles = Object.values(await loadStyles()).sort((a, b) => ((ORDER.indexOf(a.name) + 99) % 99) - ((ORDER.indexOf(b.name) + 99) % 99))
const pascal = n => n.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join('')
const icons = listIcons().map(name => {
  const icon = loadIcon(name)
  const render = {}
  for (const s of styles) { try { const nodes = renderIcon(s, icon); render[s.name] = { nodes, inner: nodesToMarkup(nodes), svg: toSvg(s, nodes) } } catch {} }
  const p = pascal(name)
  return { name, category: icon.category, description: icon.description || '', aliases: icon.aliases || [], tags: icon.tags || [], pascal: p, camel: p[0].toLowerCase() + p.slice(1), render }
})
const ctx = {
  version, root: ROOT, defaultStyle: 'line',
  styles: styles.map(s => ({ name: s.name, title: s.title, kind: s.kind, description: s.description, strokeWidth: s.strokeWidth || false, root: s.root })),
  icons, aliasIndex: {},
  write(rel, text) { const f = path.join(ROOT, rel); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, text) },
}
console.log(`rendered ${icons.length} x ${styles.length} in ${Date.now() - t0} ms`)
for (const name of ['search', 'mcp']) {
  const mod = await import(pathToFileURL(path.join(ROOT, 'forge', 'lib', `emit-${name}.mjs`)).href)
  const t = Date.now()
  console.log(`  emit-${name}: ${await mod.default(ctx)} (${Date.now() - t} ms)`)
}
