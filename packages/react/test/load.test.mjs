// Load structure of the package (no framework needed): the root must reach exactly one style statically,
// every other style only through dynamic import(), and every deep path must be a one-line re-export.
// The same file is copied into packages/{vue,solid}/test; keep them identical.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'

const pkgDir = path.resolve(import.meta.dirname, '..')
const dist = path.join(pkgDir, 'dist')
const pkg = JSON.parse(fs.readFileSync(path.join(pkgDir, 'package.json'), 'utf8'))
const skip = !fs.existsSync(path.join(dist, 'index.js')) && 'build first: node forge/build.mjs ' + pkg.name.split('/')[1]
const styles = skip ? [] : JSON.parse(fs.readFileSync(path.join(dist, 'meta.js'), 'utf8').match(/const styleNames = (\[.*?\])/)[1])

const rel = f => path.relative(dist, f).split(path.sep).join('/')

// static ESM graph from a file: `import ... from './x'` and `export ... from './x'` (not import())
function graph(entry) {
  const seen = new Set(), dyn = new Set()
  const walk = f => {
    if (seen.has(f)) return
    seen.add(f)
    const src = fs.readFileSync(f, 'utf8')
    for (const m of src.matchAll(/^(?:import|export)\b[^'"\n]*?from\s*'(\.[^']+)'/gm)) walk(path.resolve(path.dirname(f), m[1]))
    for (const m of src.matchAll(/import\('(\.[^']+)'\)/g)) dyn.add(rel(path.resolve(path.dirname(f), m[1])))
  }
  walk(entry)
  return { files: [...seen].map(rel).sort(), dyn: [...dyn].sort() }
}

test('root import loads one style statically; the others are dynamic imports', { skip }, () => {
  const { files, dyn } = graph(path.join(dist, 'index.js'))
  const styleFiles = files.filter(f => /^[a-z]+\/index\.js$/.test(f))
  assert.deepEqual(styleFiles, ['line/index.js'], 'root statically reaches: ' + files.join(', '))
  assert.ok(files.length <= 6, 'root graph is small: ' + files.join(', '))
  assert.deepEqual(dyn, styles.filter(s => s !== 'line').map(s => `${s}/index.js`).sort())
})

test('each style is one module; deep paths re-export it', { skip }, () => {
  for (const s of styles) {
    const { files } = graph(path.join(dist, s, 'index.js'))
    // solid: the drawings sit in nodes.js, shared by index.js and index.cjs (react and vue: inline in index.js)
    const data = fs.existsSync(path.join(dist, s, 'nodes.js')) ? [`${s}/nodes.js`] : []
    assert.deepEqual(files, [`${s}/index.js`, 'base.js', ...data].sort(), s)
    const deep = fs.readFileSync(path.join(dist, s, 'icons', 'home.js'), 'utf8')
    assert.equal(deep, "export { Home, HomeIcon, Home as default } from '../index.js'\n")
    assert.ok(fs.existsSync(path.join(dist, s, 'deep.d.ts')) && fs.existsSync(path.join(dist, s, 'index.cjs')), s)
  }
})

test('/icon imports every style up front', { skip }, () => {
  const { files } = graph(path.join(dist, 'icon.js'))
  for (const s of styles) assert.ok(files.includes(`${s}/index.js`), s)
})

test('exports map: every entry points at an existing file; deep paths share one .d.ts per style', { skip }, () => {
  const targets = []
  const collect = v => typeof v === 'string' ? targets.push(v) : Object.values(v).forEach(collect)
  collect(pkg.exports)
  for (const t of targets) {
    const f = path.join(pkgDir, t.replace('*', 'home'))
    assert.ok(fs.existsSync(f), t)
  }
  assert.equal(pkg.exports['./solid/icons/*'].types, './dist/solid/deep.d.ts')
  assert.equal(pkg.sideEffects, false)
})


// What a bundler or an ESM CDN (esm.sh and jsDelivr's +esm build each entry with tree-shaking) ships for one deep
// import: that icon and the shared runtime, never its whole style.
test('one deep import bundles to one icon, not the whole style', { skip }, async () => {
  let esbuild
  try { esbuild = await import('esbuild') } catch { return }   // the repo root has it (dynamic's build)
  for (const s of ['line', ...styles.filter(x => x !== 'line').sort((a, b) => fs.statSync(path.join(dist, b, 'index.js')).size - fs.statSync(path.join(dist, a, 'index.js')).size).slice(0, 1)]) {
    const r = await esbuild.build({ entryPoints: [path.join(dist, s, 'icons', 'home.js')], bundle: true, write: false, format: 'esm', minify: true, packages: 'external', logLevel: 'silent' })
    const out = r.outputFiles[0].text
    const style = fs.statSync(path.join(dist, s, 'index.js')).size + (fs.existsSync(path.join(dist, s, 'nodes.js')) ? fs.statSync(path.join(dist, s, 'nodes.js')).size : 0)
    assert.ok(out.length < 48 * 1024, `${s}/icons/home bundles to ${out.length} bytes (style module ${style} bytes)`)
    assert.ok(!/AlarmClock|alarm-clock/.test(out), `${s}: other icons were bundled`)
  }
})
