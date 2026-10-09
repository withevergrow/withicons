import { test } from 'node:test'
import assert from 'node:assert/strict'
import path from 'node:path'
import { createRequire } from 'node:module'
import { dist, repo, load } from './_setup.mjs'

// a string only the spec table holds: the bell's intent
const SENTINEL = (await load('icons.js')).default.bell.intent

// The runtime must stay tiny: motion() / swap() read icon defaults from icons.css, so a bundler can drop the
// 500-icon spec table (icons.js) unless motionFor() / motionAttrs() are used. Needs esbuild (repo dev dependency).
let esbuild = null
try { esbuild = createRequire(path.join(repo, 'package.json'))('esbuild') } catch { /* not installed: skip */ }

const bundle = async code => {
  const r = await esbuild.build({ stdin: { contents: code, resolveDir: dist, loader: 'js' }, bundle: true, minify: true, write: false, format: 'esm', logLevel: 'silent' })
  return r.outputFiles[0].text
}

test('motion() + swap() bundle without the spec table', { skip: !esbuild && 'esbuild not available' }, async () => {
  const js = await bundle(`import { motion, swap } from './index.js'; window.x = [motion, swap]`)
  assert.ok(!js.includes(SENTINEL), 'icons.js is tree-shaken away')
  // 16 KB until run 12; + the 3D profile (PROFILE_3D, styleSpec: style-aware motion)
  assert.ok(js.length < 17500, 'runtime stays small: ' + js.length + ' bytes minified')
})

test('the element bundles without the spec table', { skip: !esbuild && 'esbuild not available' }, async () => {
  const js = await bundle(`import './element.js'`)
  assert.ok(!js.includes(SENTINEL))
  // + the parts keyframes generator for shadow roots (parts-css.js)
  // + the 3D keyframes generator (run 12)
  assert.ok(js.length < 44000, js.length + ' bytes minified')
})

test('motionFor() still brings the table', { skip: !esbuild && 'esbuild not available' }, async () => {
  const js = await bundle(`import { motionFor } from './index.js'; window.x = motionFor`)
  assert.ok(js.includes(SENTINEL))
})
