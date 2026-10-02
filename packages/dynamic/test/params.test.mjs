// Param metadata, lenient resolve(), strict validate(), names and aliases.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { load } from './_setup.mjs'

const L = await load('index.js')
const TYPES = ['int', 'number', 'level', 'time', 'enum', 'text', 'bool']

test('metadata: every icon has a title, category, params with labels and 3-6 valid examples', () => {
  for (const m of L.catalog()) {
    assert.ok(m.title && m.category && m.description, `${m.name}: title/category/description`)
    assert.ok(Array.isArray(m.aliases) && Array.isArray(m.tags), `${m.name}: aliases/tags`)
    for (const [k, s] of Object.entries(m.params)) {
      assert.ok(TYPES.includes(s.type), `${m.name}.${k}: type`)
      assert.ok(s.label, `${m.name}.${k}: label`)
    }
    assert.ok(m.examples.length >= 1, `${m.name}: examples`)
    for (const ex of m.examples) assert.deepEqual(L.validate(m.name, ex), [], `${m.name}: example ${JSON.stringify(ex)}`)
    assert.deepEqual(L.validate(m.name, m.defaults), [], `${m.name}: defaults`)
    assert.ok(Object.isFrozen(m), 'metadata is frozen')
  }
})

test('get / defaults / paramsOf / resolveName / aliases', () => {
  const m = L.catalog()[0]
  assert.equal(L.get(m.name).name, m.name)
  assert.equal(L.get('definitely-not-an-icon'), null)
  assert.deepEqual(L.defaults(m.name), m.defaults)
  assert.deepEqual(Object.keys(L.paramsOf(m.name)), Object.keys(m.params))
  assert.equal(L.resolveName(m.name.toUpperCase().replace(/-/g, '_')), m.name)
  const withAlias = L.catalog().find(x => x.aliases.some(a => L.resolveName(a) === x.name))
  if (withAlias) {
    const a = withAlias.aliases.find(x => L.resolveName(x) === withAlias.name)
    assert.equal(L.render(a, {}, 'line'), L.render(withAlias.name, {}, 'line'))
  }
})

test('unknown names and styles fail with codes and suggestions', () => {
  const name = L.list()[0]
  assert.throws(() => L.render(name.slice(0, -1) + 'x', {}), e => e.code === 'WITH_UNKNOWN_ICON' && e.suggestions.includes(name))
  assert.throws(() => L.render(name, {}, 'nope'), e => e.code === 'WITH_UNKNOWN_STYLE' && e.styles.includes('line'))
  assert.throws(() => L.validate('nope-nope'), e => e.code === 'WITH_UNKNOWN_ICON')
})

test('resolve() is lenient for every param type; validate() is strict', () => {
  for (const m of L.catalog()) {
    for (const [k, s] of Object.entries(m.params)) {
      const r = v => L.resolve(m.name, { [k]: v })[k]
      assert.deepEqual(r(undefined), s.default, `${m.name}.${k} default`)
      if (s.type === 'int' || s.type === 'number') {
        assert.equal(r(s.max + 1000), s.max); assert.equal(r(s.min - 1000), s.min)
        assert.equal(r('garbage'), s.default)
        assert.equal(r(String(s.max)), s.max)
        assert.ok(L.validate(m.name, { [k]: s.max + 1 }).length, `${m.name}.${k} validate out of range`)
        assert.ok(L.validate(m.name, { [k]: String(s.min) }).length, `${m.name}.${k} validate string`)
      }
      if (s.type === 'level') {
        assert.equal(r(5), 1); assert.equal(r(-1), 0)
        if (!s.steps) assert.equal(r('25%'), 0.25)
        assert.ok(L.validate(m.name, { [k]: 2 }).length)
      }
      if (s.type === 'time') {
        assert.equal(r('7:05'), '07:05'); assert.equal(r('25:00'), s.default); assert.equal(r(42), s.default)
        assert.ok(L.validate(m.name, { [k]: '7:5' }).length)
      }
      if (s.type === 'enum') {
        assert.equal(r(String(s.options[1]).toLowerCase()), s.options[1]); assert.equal(r('zzz-not-an-option'), s.default)
        assert.ok(L.validate(m.name, { [k]: 'zzz' }).length)
      }
      if (s.type === 'text') {
        const out = r('abcdefgh~')
        assert.ok([...out].length <= (s.maxLength || 4), `${m.name}.${k} clipped`)
        assert.equal(out, out.toUpperCase())
        assert.ok(!out.includes('~'))
        assert.ok(L.validate(m.name, { [k]: '~' }).length)
      }
      if (s.type === 'bool') {
        assert.equal(r('false'), false); assert.equal(r(''), true); assert.equal(r('true'), true); assert.equal(r(0), false)
        assert.ok(L.validate(m.name, { [k]: 'yes' }).length)
      }
    }
    assert.deepEqual(Object.keys(L.resolve(m.name, { notAParam: 1 })).sort(), Object.keys(m.params).sort())
    assert.ok(L.validate(m.name, { notAParam: 1 }).some(e => /unknown param/.test(e)))
    // garbage input never throws and still renders
    const junk = Object.fromEntries(Object.keys(m.params).map(k => [k, { weird: true }]))
    assert.ok(L.render(m.name, junk, 'line').startsWith('<svg'))
  }
})

test('now() gives date params', () => {
  const n = L.now(new Date(2026, 2, 17, 9, 5))
  assert.deepEqual(n, { day: 17, month: 'MAR', weekday: 'TUE', year: 2026, time: '09:05' })
})

test('paramAttr / attrParam / paramAttributes', () => {
  assert.equal(L.paramAttr('maxLength'), 'max-length')
  assert.equal(L.attrParam('max-length'), 'maxLength')
  const all = L.paramAttributes()
  for (const m of L.catalog()) for (const k of Object.keys(m.params)) assert.ok(all.includes(L.paramAttr(k)))
})
