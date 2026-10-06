// <with-icon motion="hover|once|loop"> in a real browser (headless Chrome via puppeteer-core): the host box never moves,
// only the nodes in its shadow root do, with the spec's part lags (bell: the clapper rings 0.08 s behind), exactly as
// the inline-SVG runtime (motion(span, name)) animates the same SVG; a hover one-shot clears wm-run when its last part
// ends, so it plays again. Skipped when Chrome, puppeteer-core or @withicons/web's dist are not available.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import http from 'node:http'
import path from 'node:path'
import { createRequire } from 'node:module'
import { repo } from './_setup.mjs'

const CHROME = process.env.CHROME_PATH || ['C:/Program Files/Google/Chrome/Application/chrome.exe', '/usr/bin/google-chrome', '/usr/bin/chromium',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'].find(p => fs.existsSync(p))
let puppeteer = null
try { puppeteer = createRequire(path.join(repo, 'package.json'))('puppeteer-core') } catch { /* not installed */ }
const web = path.join(repo, 'packages', 'web', 'dist', 'cdn.js')
const skip = !CHROME ? 'no Chrome' : !puppeteer ? 'no puppeteer-core' : !fs.existsSync(web) ? 'no @withicons/web dist' : false

const ICONS = ['bell', 'heart', 'piggy-bank'], STYLES = ['line', 'sticker'], MOTIONS = ['hover', 'once', 'loop']
const PAGE = `<!doctype html><link rel="stylesheet" href="/packages/motion/dist/motion.css"><link rel="stylesheet" href="/packages/motion/dist/icons.css">
<script type="module" src="/packages/web/dist/cdn.js"></script><script type="module" src="/packages/motion/dist/element.js"></script><body>` +
  MOTIONS.flatMap(m => ICONS.flatMap(n => STYLES.map(s => `<with-icon name="${n}" variant="${s}" motion="${m}" size="48" data-k="${m}|${n}|${s}"></with-icon>`))).join('') + '</body>'

test('<with-icon motion>: host still, parts animate with the spec lags, same as the inline runtime', { skip, timeout: 60000 }, async () => {
  const MIME = { '.js': 'text/javascript', '.css': 'text/css' }
  const srv = http.createServer((q, r) => {
    if (q.url === '/') { r.setHeader('content-type', 'text/html'); return r.end(PAGE) }
    const f = path.join(repo, decodeURIComponent(q.url.split('?')[0]))
    if (!f.startsWith(repo)) { r.statusCode = 403; return r.end() }
    fs.readFile(f, (e, d) => { if (e) { r.statusCode = 404; return r.end() } r.setHeader('content-type', MIME[path.extname(f)] || 'application/octet-stream'); r.end(d) })
  }).listen(0)
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: true })
  try {
    const page = await browser.newPage()
    await page.goto(`http://localhost:${srv.address().port}/`)
    await page.waitForFunction(() => [...document.querySelectorAll('with-icon')].every(h => h.shadowRoot && h.shadowRoot.querySelector('svg')), { timeout: 20000 })
    await new Promise(r => setTimeout(r, 300))
    const r = await page.evaluate(async () => {
      const { motion } = await import('/packages/motion/dist/runtime.js')
      const parts = root => [...new Set([...root.querySelectorAll('svg > *')].flatMap(x => x.getAnimations().map(a => `${x.getAttribute('class') || 'obj'}:${a.animationName}:${a.effect.getTiming().delay}`)))].sort()
      const hosts = [...document.querySelectorAll('with-icon')]
      for (const h of hosts) if (h.getAttribute('motion') === 'hover') h.dispatchEvent(new PointerEvent('pointerenter', { pointerType: 'mouse' }))
      await new Promise(res => setTimeout(res, 100))
      const out = []
      for (const h of hosts) {
        const [trig, name] = h.dataset.k.split('|')
        const span = document.createElement('span'); span.className = 'wm'
        span.innerHTML = h.shadowRoot.querySelector('svg').outerHTML
        document.body.appendChild(span)
        motion(span, name, { trigger: trig })
        if (trig !== 'loop') span.dispatchEvent(new PointerEvent('pointerenter', { pointerType: 'mouse' }))
        await new Promise(res => setTimeout(res, 20))
        out.push({ k: h.dataset.k, host: h.getAnimations().map(a => a.animationName), parts: parts(h.shadowRoot), inline: parts(span), tagged: !!h.shadowRoot.querySelector('svg>.wm-a,svg>.wm-s,svg>.wm-deco,svg>.wm-shadow') })
      }
      await new Promise(res => setTimeout(res, 2500))
      const after = [...document.querySelectorAll('with-icon[motion="hover"]')].filter(h => h.classList.contains('wm-run')).map(h => h.dataset.k)
      return { out, after }
    })
    for (const x of r.out) {
      assert.deepEqual(x.host, [], `${x.k}: the host box must not animate`)
      assert.ok(x.parts.length, `${x.k}: its parts animate`)
      if (x.tagged) assert.deepEqual(x.parts, x.inline, `${x.k}: same parts and delays as motion() on inline SVG`)
    }
    const get = k => r.out.find(x => x.k === k).parts
    for (const m of MOTIONS) {
      assert.ok(get(`${m}|bell|line`).some(p => /^wm-a:wm-ring(-loop)?:80$/.test(p)), `${m} bell: the clapper rings 0.08 s behind`)
      assert.ok(get(`${m}|bell|line`).some(p => /^obj:wm-ring(-loop)?:0$/.test(p)), `${m} bell: the body starts at once`)
      assert.ok(get(`${m}|piggy-bank|line`).some(p => /^wm-a:wm-blink(-loop)?:400$/.test(p)), `${m} piggy-bank: the eye blinks 0.4 s in`)
    }
    assert.deepEqual(r.after, [], 'hover one-shots clear wm-run once every part has ended (so they play again)')
  } finally {
    await browser.close()
    srv.close()
  }
})
