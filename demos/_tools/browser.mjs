// Shared headless-browser launcher for the demo tools (puppeteer-core + the Edge/Chrome already on the machine).
import fs from 'node:fs'
import puppeteer from 'puppeteer-core'

const CANDIDATES = [
  process.env.CHROME_PATH,
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  '/usr/bin/google-chrome', '/usr/bin/chromium', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].filter(Boolean)

export function findBrowser() {
  const hit = CANDIDATES.find(p => fs.existsSync(p))
  if (!hit) throw new Error('No Chrome/Edge found. Set CHROME_PATH to a browser executable.')
  return hit
}

export const sleep = ms => new Promise(r => setTimeout(r, ms))

export function launch() {
  return puppeteer.launch({
    executablePath: findBrowser(),
    headless: true,
    args: ['--no-sandbox', '--hide-scrollbars', '--force-device-scale-factor=1', '--disable-gpu', '--mute-audio'],
  })
}

// Scroll the whole page once so loading="lazy" images and IntersectionObserver reveals fire, then go back to the top.
export async function autoscroll(page) {
  await page.evaluate(async () => {
    const step = Math.max(300, Math.floor(innerHeight * 0.7))
    for (let y = 0; y < document.documentElement.scrollHeight + step; y += step) {
      scrollTo(0, y)
      await new Promise(r => setTimeout(r, 140))
    }
    scrollTo(0, 0)
    await new Promise(r => setTimeout(r, 200))
  })
}
