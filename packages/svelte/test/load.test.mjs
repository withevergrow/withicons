// Load structure (no Svelte compiler needed): the root <Icon> must hold only the default style's data;
// other styles are dynamic imports. /icon (IconAll.svelte) is the eager every-style variant.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'

const pkgDir = path.resolve(import.meta.dirname, '..')
const dist = path.join(pkgDir, 'dist')
const skip = !fs.existsSync(path.join(dist, 'find.js')) && 'build first: node forge/build.mjs svelte'
const read = f => fs.readFileSync(path.join(dist, f), 'utf8')
const styles = skip ? [] : JSON.parse(read('meta.js').match(/export const styleNames = (\[.*?\])/)[1])

test('find.js: default style static, every other style a dynamic import', { skip }, async () => {
  const src = read('find.js')
  assert.deepEqual([...src.matchAll(/^import .* from '(\.[^']+)'/gm)].map(m => m[1]).sort(), ['./line/nodes.js', './meta.js'])
  assert.deepEqual([...src.matchAll(/import\('(\.[^']+)'\)/g)].map(m => m[1]).sort(), styles.filter(s => s !== 'line').map(s => `./${s}/nodes.js`).sort())
  const { findIcon, loadStyle, preloadStyles } = await import(path.join(dist, 'find.js').replace(/^/, 'file://'))
  assert.equal(findIcon('house').name, 'home')
  assert.equal(findIcon('home', 'solid'), 'solid')            // not loaded yet
  await loadStyle('solid')
  assert.equal(findIcon('home', 'solid').variant, 'solid')
  await preloadStyles('duo', 'gloss')
  assert.equal(typeof findIcon('home', 'duo'), 'object')
  await assert.rejects(loadStyle('nope'))
})

test('index exports the lazy Icon and preloadStyles; /icon is IconAll', { skip }, () => {
  assert.match(read('index.js'), /export \{ default as Icon \} from '\.\/Icon\.svelte'/)
  assert.match(read('index.js'), /export \{ preloadStyles \} from '\.\/find\.js'/)
  assert.match(read('index.d.ts'), /preloadStyles/)
  assert.match(read('IconAll.svelte'), /from '\.\/find-all\.js'/)
  const pkg = JSON.parse(fs.readFileSync(path.join(pkgDir, 'package.json'), 'utf8'))
  assert.equal(pkg.exports['./icon'].default, './dist/IconAll.svelte')
  for (const s of styles) assert.match(read('find-all.js'), new RegExp(`'\./${s}/nodes\.js'`))
})

// Each drawing ships once, in a chunk module (dist/<style>/nodes/<k>.js, 32 drawings, named exports): the per-icon .svelte
// imports its drawing from its chunk and the generic <Icon>'s nodes.js maps every name to the same exports. No per-icon
// data or .d.ts files (npm refuses ~75,000 files: E415).
test('per-icon .svelte imports its drawing from a chunk; nodes.js reuses the same exports', { skip }, async () => {
  const url = f => 'file://' + path.join(dist, f).split(path.sep).join('/')
  for (const s of styles) {
    const svelte = read(`${s}/icons/home.svelte`)
    const m = svelte.match(/import \{ Home as iconNode \} from '\.\.\/nodes\/(\d+)\.js'/)
    assert.ok(m, s)
    assert.ok(!/\[\["/.test(svelte), `${s}: no inline drawing in the .svelte file`)
    assert.ok(!fs.existsSync(path.join(dist, s, 'icons', 'home.svelte.d.ts')), `${s}: no per-icon .d.ts`)
    assert.match(read(`${s}/nodes.js`), new RegExp(String.raw`^import \{[^}]*\bHome\b[^}]*\} from '\./nodes/${m[1]}\.js'$`, 'm'), `${s}: nodes.js imports the chunk`)
    if (s === 'line' || s === styles.at(-1)) {
      const own = await import(url(`${s}/nodes/${m[1]}.js`))
      const all = await import(url(`${s}/nodes.js`))
      assert.equal(all.nodes.home, own.Home, `${s}: nodes.js shares the chunk export`)
      assert.ok(Array.isArray(own.Home) && own.Home.length, s)
    }
    const deps = [...read(`${s}/nodes/${m[1]}.js`).matchAll(/from '(\.[^']+)'/g)].map(x => x[1])
    assert.ok(deps.every(d => d === '../values.js'), `${s}: ${deps}`)
    assert.ok(fs.statSync(path.join(dist, s, 'values.js')).size < 16 * 1024, `${s}/values.js stays small`)
  }
  const pkg = JSON.parse(fs.readFileSync(new URL('../package.json', import.meta.url), 'utf8'))
  assert.equal(pkg.exports['./line/icons/*'].types, './dist/component.d.ts')
  assert.ok(fs.existsSync(path.join(dist, 'component.d.ts')))
})
