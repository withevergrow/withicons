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

// Each drawing ships once: the per-icon .svelte imports its own small data module (dist/<style>/nodes/<name>.js), and the
// generic <Icon>'s nodes.js maps every name to those same modules. A deep import loads one icon, never its whole style.
test('per-icon .svelte imports only its own drawing; nodes.js reuses the same modules', { skip }, async () => {
  const url = f => 'file://' + path.join(dist, f).split(path.sep).join('/')
  for (const s of styles) {
    const svelte = read(`${s}/icons/home.svelte`)
    assert.match(svelte, /import iconNode from '\.\.\/nodes\/home\.js'/, s)
    assert.ok(!/\[\["/.test(svelte), `${s}: no inline drawing in the .svelte file`)
    assert.match(read(`${s}/nodes.js`), /^import Home from '\.\/nodes\/home\.js'$/m, `${s}: nodes.js imports the per-icon module`)
    // evaluating a whole style is 700+ modules: do it for the default style and one rich style only
    if (s === 'line' || s === styles.at(-1)) {
      const own = await import(url(`${s}/nodes/home.js`))
      const all = await import(url(`${s}/nodes.js`))
      assert.equal(all.nodes.home, own.default, `${s}: nodes.js shares the per-icon module`)
      assert.ok(Array.isArray(own.default) && own.default.length, s)
    }
    // the per-icon module's static graph is itself plus the style's small shared values module
    const deps = [...read(`${s}/nodes/home.js`).matchAll(/from '(\.[^']+)'/g)].map(m => m[1])
    assert.ok(deps.every(d => d === '../values.js'), `${s}: ${deps}`)
    assert.ok(fs.statSync(path.join(dist, s, 'values.js')).size < 16 * 1024, `${s}/values.js stays small`)
  }
})
