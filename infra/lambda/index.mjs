// with icons API - origin guard (zip entry point, handler "index.handler").
//
// The Lambda Function URL is AuthType NONE (CloudFront OAC for Lambda requires clients to sign
// POST bodies with x-amz-content-sha256, which generic MCP clients never do). Instead CloudFront
// adds a secret x-origin-verify header to every origin request; anything that reaches the
// Function URL without it is rejected here before the real handler runs.
//
// scripts/deploy.mjs zips this file at the root and the API under mcp/ (lambda.mjs + data/svg-<style>.json + data/palettes.json),
// so the real handler is ./mcp/lambda.mjs (export `handler`, Function URL payload v2 in, {statusCode, headers, body} out).
import { timingSafeEqual } from 'node:crypto'
// Imported at the top level, NOT inside the first request: Lambda runs module loading in its INIT phase (full CPU, before
// any request is accepted), so parsing the bundle, building the search tables and warming the MCP SDK (lambda.mjs does
// that while it loads) never lands on a caller's first request.
import { handler as inner } from './mcp/lambda.mjs'

const SECRET = Buffer.from(process.env.ORIGIN_VERIFY_SECRET || '')

function verified(headers) {
  if (!SECRET.length) return true // no secret configured (local testing)
  const got = Buffer.from((headers && headers['x-origin-verify']) || '')
  return got.length === SECRET.length && timingSafeEqual(got, SECRET)
}

// Keep-warm ping from the EventBridge schedule (Rule target Input {"source":"withicons.warm"}): a direct invoke, never an
// HTTP request. Function URL events always carry requestContext, so a caller on the internet cannot pass for one.
const isWarmPing = event => !!event && typeof event === 'object' && !event.requestContext && !event.headers && event.source === 'withicons.warm'

export async function handler(event, context) {
  if (isWarmPing(event)) return { statusCode: 200, body: 'warm' }
  if (!verified(event && event.headers)) {
    return {
      statusCode: 401,
      headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
      body: JSON.stringify({ error: 'Use https://withicons.com/mcp or https://withicons.com/api/' }),
    }
  }
  if (event.headers) delete event.headers['x-origin-verify'] // never leak the secret to the app
  return inner(event, context)
}
