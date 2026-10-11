// node --test packages/mcp/test/nearest.test.mjs   (needs dist: cd packages/mcp && npm run build)
// resolve_icon / get_icon: the "nearest" names of an unknown word are kept only when they are really near
// (a typo, the start of a name), not the loosely related padding the engine used to add ("sheep" -> moon, radar, table).
import { test, describe } from 'node:test'
import assert from 'node:assert/strict'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const lib = await import(pathToFileURL(path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist', 'lib.mjs')).href)

describe('nearest names of an unknown word', () => {
  for (const w of ['sheep', 'comet', 'beaver', 'taco']) {
    test(`"${w}": no junk names, a browse hint instead`, t => {
      const r = lib.resolveIcon(w)
      if (r.status !== 'unknown') return t.skip(`"${w}" now means an icon (${r.name}): choose another word`)
      assert.deepEqual(r.nearest, [], `${w}: ${r.nearest.join(', ')}`)
      assert.ok(r.hint, 'a hint says where to browse')
    })
  }
  test('a real typo keeps its icon and loses the padding ("playgroud" -> playground, not circle-play)', () => {
    const r = lib.resolveIcon('playgroud')
    assert.equal(r.status, 'unknown')
    assert.deepEqual(r.nearest, ['playground'])
  })
  test('"croisant" -> croissant only', () => {
    assert.deepEqual(lib.resolveIcon('croisant').nearest, ['croissant'])
  })
  test('get_icon of an unknown name: the error has no junk "Did you mean"', t => {
    if (lib.resolveIcon('sheep').status !== 'unknown') return t.skip('"sheep" is now an icon')
    assert.throws(() => lib.getIcon({ name: 'sheep' }), e => e instanceof lib.IconError && e.code === 'unknown_icon' && !/Did you mean/.test(e.message) && e.nearest.length === 0)
    assert.throws(() => lib.getIcon({ name: 'croisant' }), e => /Did you mean: croissant\?/.test(e.message))
  })
  test('meaning still wins over spelling: "favourites" resolves through the engine', () => {
    const r = lib.resolveIcon('favourites')
    assert.ok(['synonym', 'resolved'].includes(r.status), r.status)
  })
})
