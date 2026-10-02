#!/usr/bin/env node
// Content pages of withicons.com (D3): guides/index.html + the app guides + "Animate an icon", developers.html (with
// the @withicons/motion docs), ai.html, about.html, license.html, faq.html. Static HTML rendered from the forge
// (forge/icons + forge/styles + forge/motion via forge/lib/load.mjs), so counts and style lists follow the real set.
// Usage: node forge/tools/site-pages.mjs        (styles: site/css/pages.css, behaviour: site/js/pages.js)
import { buildGuides } from './site-pages/guides.mjs'
import { buildPages } from './site-pages/pages.mjs'
const guides = buildGuides()
await buildPages()
console.log(`site-pages: ${guides.length} guides + guides/index.html + developers, ai, about, license, faq`)
