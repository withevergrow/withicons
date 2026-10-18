// get_loader (src/loaders-tool.mjs): morph items are icon names, "loader:<name>" asks for a loader (0.6.0), and the
// React / Vue code it writes escapes what the caller passed.
import test from 'node:test'
import assert from 'node:assert/strict'

const { getLoader } = await import('../src/loaders-tool.mjs')

test('get_loader morph: plain names stay icon names, loader:<name> is checked and canonical', () => {
  const m = getLoader({ morph: ['wrench', 'settings', 'rocket'], format: 'html' })
  assert.match(m.code, /<with-loader morph="wrench,settings,rocket"/)
  assert.deepEqual(m.morph, ['wrench', 'settings', 'rocket'])
  const alias = getLoader({ morph: ['file', 'loader:loading-spinner'], format: 'html' })
  assert.match(alias.code, /morph="file,loader:spinner"/)
  assert.throws(() => getLoader({ morph: ['file', 'loader:no-such-loader'] }), /no loader "no-such-loader"/)
})

test('get_loader react / vue: label and colour are escaped', () => {
  const bad = 'Say "hi" {x} <b>'
  const r = getLoader({ name: 'spinner', format: 'react', label: bad, color: '#f00' })
  assert.ok(r.code.includes(`label={${JSON.stringify(bad)}}`), r.code)
  assert.ok(r.code.includes('color="#f00"'))
  const v = getLoader({ name: 'spinner', format: 'vue', label: bad, size: 40 })
  assert.ok(v.code.includes('label="Say &quot;hi&quot; {x} &lt;b>"'), v.code)
  assert.ok(v.code.includes(':size="40"'), v.code)
  const vm = getLoader({ morph: ['package', 'truck', 'home'], format: 'vue' })
  assert.match(vm.code, /<Morph :items="\['package', 'truck', 'home'\]"/)
  const rm = getLoader({ morph: ['package', 'truck', 'home'], format: 'react' })
  assert.match(rm.code, /<Morph items=\{\["package","truck","home"\]\}/)
})
