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
