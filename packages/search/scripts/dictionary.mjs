// dev helper: node packages/search/scripts/dictionary.mjs
// Rewrites COMMON_WORDS in src/engine.mjs from scripts/common-words.txt (one common English word per line).
// Only words the index does not carry and that sit near a vocabulary word (a typo, sound-alike or prefix away;
// every word of 6+ letters, which could also split into two vocabulary words)
// are kept: those are the ones the engine would otherwise "correct" into something they are not.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
const here = path.dirname(fileURLToPath(import.meta.url))
const src = path.join(here, '..', 'src', 'engine.mjs')
const { words, distance, phonetic } = await import(pathToFileURL(src).href)
const index = JSON.parse(fs.readFileSync(path.join(here, '..', 'dist', 'index.json'), 'utf8'))
const vocab = new Set()
for (const r of index.icons) for (const f of [r[0], r[2], r[3], r[4], r[5]]) for (const w of words(String(f || '').replace(/\|/g, ' '))) vocab.add(w)
// compact forms of phrases ("playround" from "play-round") are vocabulary too
for (const r of index.icons) for (const f of [r[0], r[2], r[3], r[4]]) for (const ph of String(f || '').split('|')) { const ws = words(ph); if (ws.length > 1) vocab.add(ws.join('')) }
const voc = [...vocab].filter(t => /^[a-z]+$/.test(t))
const phon = new Set(voc.map(phonetic))
const list = [...new Set(fs.readFileSync(path.join(here, 'common-words.txt'), 'utf8').split(/\s+/).filter(w => /^[a-z]{3,}$/.test(w)))].sort()
const near = w => w.length >= 6 || phon.has(phonetic(w)) || voc.some(t => t.startsWith(w) || (Math.abs(t.length - w.length) <= 2 && distance(w, t, 2) <= 2))
const keep = list.filter(w => !vocab.has(w) && near(w))
const text = fs.readFileSync(src, 'utf8').replace(/const COMMON_WORDS = '[^']*'/, `const COMMON_WORDS = '${keep.join(' ')}'`)
fs.writeFileSync(src, text)
console.log(`${list.length} words, ${keep.length} kept (${(keep.join(' ').length / 1024).toFixed(1)} KB)`)
