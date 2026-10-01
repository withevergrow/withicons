#!/usr/bin/env node
// Content pages of withicons.com (D3): guides/index.html + 13 guides, developers.html, ai.html, about.html,
// license.html, faq.html. Static HTML rendered from the real icon data (site/data/*.js) — no runtime build needed.
// Usage: node forge/tools/site-pages.mjs        (styles: site/css/pages.css, behaviour: site/js/pages.js)
import { buildGuides } from './site-pages/guides.mjs'
import { buildPages } from './site-pages/pages.mjs'
const guides = buildGuides()
await buildPages()
console.log(`site-pages: ${guides.length} guides + guides/index.html + developers, ai, about, license, faq`)
