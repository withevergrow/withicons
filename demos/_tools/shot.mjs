#!/usr/bin/env node
// Render a demo page in headless Edge/Chrome, save screenshots (sliced so they stay readable) and print a QA report.
//
//   node demos/_tools/shot.mjs site/demos/haunted-hollow.html --level 2 --style gothic --width 1280 --out .preview/hh
//   node demos/_tools/shot.mjs site/demos/haunted-hollow.html --mobile --level 1            (390px wide)
//   options:
//     --level 0|1|2     kit level (default: the page's own)        --style <name>   kit style (default: the page's own)
//     --width 1280      viewport width   --height 900   viewport height   --mobile  390x844 touch
//     --slice 1800      cut the full-page screenshot into slices of this height (default 1800; 0 = one image)
//     --max-slices 8    stop after this many slices                 --out <prefix>   default .preview/shot-<page>-L<level>-<style>-<width>
//     --panel bar|open|hide  floating kit: collapsed bar (default), panel open, or hidden (thumbnails)
//     --click "sel1,sel2"    click these CSS selectors in order, then screenshot (e.g. open a cart drawer)
//     --settle 450           ms to wait after each click (raise it for lazy-loaded UI)
//                            kit controls live in a shadow root: pierce it with  "#withicons-kit >>> #b-open"
//     --eval "js"            run this JS in the page before the screenshot and print its result
//     --wait 12000           max ms to wait for icons to render     --viewport-only  only the first screen
//     --thumb                also write the hub thumbnail site/demos/_thumbs/<slug>.jpg (use with --level 2 and no --style)
// Prints one JSON report (also saved as <out>.json). Exit code 1 when there are hard errors.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { launch, autoscroll, sleep } from './browser.mjs'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
const argv = process.argv.slice(2)
const a = { _: [] }
for (let i = 0; i < argv.length; i++) {
  if (argv[i].startsWith('--')) { const k = argv[i].slice(2); const v = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[++i] : true; a[k] = v } else a._.push(argv[i])
}
if (!a._[0]) { console.error('usage: shot.mjs <page.html> [options]  (see the header of this file)'); process.exit(2) }
const file = path.resolve(a._[0])
if (!fs.existsSync(file)) { console.error('No such file', file); process.exit(2) }
const slug = path.basename(file).replace(/\.html$/, '')
const mobile = !!a.mobile
const W = mobile ? 390 : Number(a.width || 1280), H = mobile ? 844 : Number(a.height || 900)
const hash = new URLSearchParams()
if (a.level != null) hash.set('lv', a.level)
if (a.style) hash.set('ico', a.style)
hash.set('panel', a.panel === 'open' ? 'open' : a.panel === 'hide' ? 'hide' : 'bar')
const url = pathToFileURL(file).href + '#' + hash.toString()

// catalogue (for photo checks)
const catFile = path.join(ROOT, 'demos', '_data', 'photos', `${slug}.json`)
const catalogue = fs.existsSync(catFile) ? JSON.parse(fs.readFileSync(catFile, 'utf8')).photos || [] : null

const browser = await launch()
const page = await browser.newPage()
await page.setViewport({ width: W, height: H, deviceScaleFactor: 1, isMobile: mobile, hasTouch: mobile })
// a fresh profile each run: ignore any saved kit state
await page.evaluateOnNewDocument(() => { try { localStorage.clear() } catch (e) {} })

const consoleMsgs = [], pageErrors = [], failed = [], bad = []
page.on('console', m => { const t = m.type(); if (t === 'error' || t === 'warning') consoleMsgs.push(`${t}: ${m.text()}`.slice(0, 300)) })
page.on('pageerror', e => pageErrors.push(String(e.message || e).slice(0, 300)))
page.on('requestfailed', r => { const u = r.url(); if (!/google-analytics|googletagmanager/.test(u)) failed.push(`${r.failure()?.errorText || 'failed'} ${u.slice(0, 160)}`) })
page.on('response', r => { if (r.status() >= 400) bad.push(`${r.status()} ${r.url().slice(0, 160)}`) })

await page.goto(url, { waitUntil: 'networkidle2', timeout: 90000 }).catch(e => pageErrors.push('goto: ' + e.message))
await page.evaluate(() => document.fonts && document.fonts.ready).catch(() => {})
// wait for kit icons to render
const t0 = Date.now(), maxWait = Number(a.wait || 12000)
while (Date.now() - t0 < maxWait) {
  const pending = await page.evaluate(() => [...document.querySelectorAll('.kit-ico,.kit-live')].filter(h => h.getClientRects().length && !h.hasAttribute('data-ready')).length).catch(() => 0)
  if (!pending) break
  await sleep(250)
}
if (!a['viewport-only']) await autoscroll(page)
await sleep(700)

if (a.click) {
  for (const sel of String(a.click).split(',').map(s => s.trim()).filter(Boolean)) {
    try { await page.click(sel); await sleep(Number(a.settle || 450)) } catch (e) { pageErrors.push(`click ${sel}: ${e.message.split('\n')[0]}`) }
  }
}
let evalResult
if (a.eval) { try { evalResult = await page.evaluate(String(a.eval)) } catch (e) { evalResult = 'ERR ' + e.message } await sleep(400) }

const report = await page.evaluate((catalogue) => {
  const vis = el => el.getClientRects().length > 0 && getComputedStyle(el).visibility !== 'hidden'
  const out = {}
  out.title = document.title
  out.lang = document.documentElement.lang || ''
  out.viewportMeta = !!document.querySelector('meta[name=viewport]')
  out.h1 = document.querySelectorAll('h1').length
  out.pageHeight = document.documentElement.scrollHeight
  out.level = document.documentElement.getAttribute('data-level')
  out.horizontalOverflow = document.documentElement.scrollWidth > innerWidth + 1
  const wide = []
  document.querySelectorAll('body *').forEach(el => {
    if (el.closest('#withicons-kit')) return
    const r = el.getBoundingClientRect()
    if (r.width && r.right > innerWidth + 2 && vis(el)) {
      let p = el.parentElement, clipped = false
      while (p && p !== document.body) { const o = getComputedStyle(p).overflowX; if (o === 'hidden' || o === 'auto' || o === 'scroll' || o === 'clip') { clipped = true; break } p = p.parentElement }
      if (!clipped && wide.length < 6) wide.push(`${el.tagName.toLowerCase()}${el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/)[0] : ''} right=${Math.round(r.right)}`)
    }
  })
  out.overflowing = wide
  // icons
  const slots = [...document.querySelectorAll('[data-ico]')], live = [...document.querySelectorAll('[data-live]')]
  out.iconSlots = slots.length; out.liveSlots = live.length
  const shown = slots.filter(vis)
  out.iconsVisible = shown.length
  out.iconsNotRendered = shown.filter(h => !h.hasAttribute('data-ready')).map(h => h.getAttribute('data-ico')).slice(0, 12)
  out.liveNotRendered = live.filter(vis).filter(h => !h.hasAttribute('data-ready')).map(h => h.getAttribute('data-live')).slice(0, 12)
  out.distinctIconNames = [...new Set(slots.map(h => h.getAttribute('data-ico')))].length
  out.emptyFallbacks = slots.filter(h => !(h._kit && h._kit.fb)).length
  out.rawWithIcon = document.querySelectorAll('with-icon:not(.kit-ico > with-icon)').length - document.querySelectorAll('#withicons-kit with-icon').length
  // images
  const imgs = [...document.images]
  out.images = imgs.length
  out.imagesBroken = imgs.filter(i => i.complete && i.naturalWidth === 0 && vis(i)).map(i => (i.currentSrc || i.src).slice(0, 120)).slice(0, 8)
  out.imagesNoAlt = imgs.filter(i => !i.hasAttribute('alt')).map(i => (i.currentSrc || i.src).slice(0, 100)).slice(0, 8)
  out.imagesLazyUnloaded = imgs.filter(i => !i.complete && vis(i)).length
  // photo credits against the catalogue
  const html = document.documentElement.outerHTML
  const used = new Map()
  for (const m of html.matchAll(/images\.pexels\.com\/photos\/(\d+)\//g)) used.set('pexels:' + m[1], 1)
  for (const m of html.matchAll(/images\.unsplash\.com\/(photo-[A-Za-z0-9_-]+)/g)) used.set('unsplash:' + m[1], 1)
  out.photosUsed = used.size
  const credits = document.querySelector('#credits')
  out.hasCreditsSection = !!credits
  if (catalogue) {
    const byKey = new Map(catalogue.map(p => [p.src === 'pexels' ? 'pexels:' + p.id : 'unsplash:' + (p.url.match(/(photo-[A-Za-z0-9_-]+)/) || [])[1], p]))
    out.photosNotInCatalogue = [...used.keys()].filter(k => !byKey.has(k))
    const ctext = credits ? credits.innerHTML : ''
    out.photosUncredited = [...used.keys()].filter(k => byKey.has(k)).filter(k => { const p = byKey.get(k); return !(ctext.includes(p.page) || (p.photographerUrl && ctext.includes(p.photographerUrl)) || ctext.includes(p.photographer)) }).map(k => byKey.get(k).slot)
    out.creditsMentionLibrary = /with icons|withicons/i.test(ctext)
  } else out.photosNotInCatalogue = ['(no catalogue found)']
  out.hasDemoDisclaimer = /fictional|demo/i.test(document.body.innerText.slice(-4000))
  // links and forms
  out.deadLinks = [...document.querySelectorAll('a[href="#"],a:not([href])')].length
  out.buttonsNoType = [...document.querySelectorAll('button:not([type])')].filter(b => b.closest('form')).length
  out.forms = document.forms.length
  out.fontsLoaded = [...document.fonts].filter(f => f.status === 'loaded').map(f => f.family.replace(/"/g, '')).filter((v, i, arr) => arr.indexOf(v) === i).slice(0, 8)
  out.kitPresent = !!document.getElementById('withicons-kit')
  out.lowContrastHint = null
  return out
}, catalogue)

// screenshots
const outPrefix = a.out ? path.resolve(a.out) : path.join(ROOT, '.preview', `shot-${slug}-L${report.level}-${a.style || 'page'}-${W}`)
fs.mkdirSync(path.dirname(outPrefix), { recursive: true })
const files = []
const sliceH = a.slice === undefined ? 1800 : Number(a.slice)
const total = Math.min(report.pageHeight, 60000)
if (a['viewport-only']) {
  const f = `${outPrefix}.png`; await page.screenshot({ path: f }); files.push(f)
} else if (!sliceH || total <= sliceH) {
  const f = `${outPrefix}.png`; await page.screenshot({ path: f, fullPage: true, captureBeyondViewport: true }); files.push(f)
} else {
  const maxS = Number(a['max-slices'] || 8)
  for (let i = 0, y = 0; y < total && i < maxS; i++, y += sliceH) {
    const f = `${outPrefix}-${i + 1}.png`
    await page.screenshot({ path: f, clip: { x: 0, y, width: W, height: Math.min(sliceH, total - y) }, captureBeyondViewport: true })
    files.push(f)
  }
  if (total > sliceH * maxS) report.slicesTruncated = `page is ${total}px tall; only the first ${maxS} slices were saved`
}
if (a.thumb) {
  // hub thumbnail: first screen at 1280x800, saved at 768x480 as a small JPEG (no kit bar)
  await page.evaluate(() => { const k = document.getElementById('withicons-kit'); if (k) k.style.display = 'none'; scrollTo(0, 0) })
  await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 0.6 })
  await sleep(500)
  const tf = path.join(ROOT, 'site', 'demos', '_thumbs', `${slug}.jpg`)
  fs.mkdirSync(path.dirname(tf), { recursive: true })
  await page.screenshot({ path: tf, type: 'jpeg', quality: 74 })
  files.push(tf)
}
await browser.close()

// verdict
const errors = []
const warnings = []
if (pageErrors.length) errors.push(`${pageErrors.length} uncaught page error(s)`)
const nonIconConsole = consoleMsgs.filter(m => !/Failed to load resource.*(googletag|google-analytics)/.test(m))
if (nonIconConsole.some(m => /^error/.test(m))) errors.push('console errors')
if (bad.length) errors.push(`${bad.length} HTTP >=400 responses`)
if (failed.length) errors.push(`${failed.length} failed requests`)
if (report.imagesBroken.length) errors.push('broken images')
if (report.photosNotInCatalogue.length && catalogue) errors.push('photos not in the catalogue (invented ids?)')
if (report.photosUncredited && report.photosUncredited.length) errors.push('photos without a credit in #credits')
if (!report.hasCreditsSection) errors.push('no #credits section')
if (report.iconsNotRendered.length || report.liveNotRendered.length) errors.push('icons did not render')
if (report.horizontalOverflow) errors.push('horizontal overflow at ' + W + 'px')
if (!report.viewportMeta) errors.push('no viewport meta')
if (report.h1 !== 1) warnings.push(`h1 count is ${report.h1}`)
if (report.imagesNoAlt.length) warnings.push('images without alt')
if (report.deadLinks) warnings.push(`${report.deadLinks} links with href="#" or no href`)
if (report.buttonsNoType) warnings.push(`${report.buttonsNoType} buttons inside forms without a type`)
if (!report.hasDemoDisclaimer) warnings.push('no "fictional demo" disclaimer near the footer')
if (catalogue && !report.creditsMentionLibrary) warnings.push('credits do not mention with icons')
const result = { file: path.relative(ROOT, file), viewport: `${W}x${H}`, screenshots: files.map(f => path.relative(ROOT, f)), errors, warnings, report, console: nonIconConsole.slice(0, 12), pageErrors, failed: failed.slice(0, 8), badResponses: bad.slice(0, 8) }
if (evalResult !== undefined) result.eval = evalResult
fs.writeFileSync(`${outPrefix}.json`, JSON.stringify(result, null, 2))
console.log(JSON.stringify(result, null, 2))
process.exit(errors.length ? 1 : 0)
