// with icons API - origin guard (zip entry point, handler "index.handler").
//
// The Lambda Function URL is AuthType NONE (CloudFront OAC for Lambda requires clients to sign
// POST bodies with x-amz-content-sha256, which generic MCP clients never do). Instead CloudFront
// adds a secret x-origin-verify header to every origin request; anything that reaches the
// Function URL without it is rejected here before the real handler runs.
//
// scripts/deploy.mjs zips this file at the root and packages/mcp/dist/** under mcp/, so the real
// handler is ./mcp/lambda.mjs (export `handler`, Function URL payload v2 in, {statusCode, headers, body} out).
import { timingSafeEqual } from 'node:crypto'

const SECRET = Buffer.from(process.env.ORIGIN_VERIFY_SECRET || '')
let inner

function verified(headers) {
  if (!SECRET.length) return true // no secret configured (local testing)
  const got = Buffer.from((headers && headers['x-origin-verify']) || '')
  return got.length === SECRET.length && timingSafeEqual(got, SECRET)
}

export async function handler(event, context) {
  if (!verified(event && event.headers)) {
    return {
      statusCode: 401,
      headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
      body: JSON.stringify({ error: 'Use https://withicons.com/mcp or https://withicons.com/api/' }),
    }
  }
  if (event.headers) delete event.headers['x-origin-verify'] // never leak the secret to the app
  inner ||= (await import('./mcp/lambda.mjs')).handler
  return inner(event, context)
}
