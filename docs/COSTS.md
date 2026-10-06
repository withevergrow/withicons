# withicons.com: monthly AWS cost estimate

**Bottom line:** at ~20,000 monthly users the stack costs about **$0.50 to $1.50 a month** (Route 53 plus pennies),
and **about $6 a month even with no free tier at all**. The $50 budget is roughly 8x the free-tier-less worst case.
At 10x traffic it is still about **$6 to $15**. Prices are us-east-1 / CloudFront North America list prices
(October 2026); verify them in the AWS Pricing Calculator before launch. Indian AWS accounts (AISPL) add 18% GST.

## 1. What a page view weighs (measured from `site/`, 2026-10-01)

Measured with `zlib` brotli q5 (CloudFront compresses on the fly with gzip or brotli). woff2 and PNG don't compress further.

| file class | files | raw | brotli |
|---|---:|---:|---:|
| HTML (326 generated pages plus 4 hand-written) | 330 | 29.6 MB | 4.3 MB |
| CSS | 14 | 5.1 MB | 1.0 MB |
| JS (site runtime + `data/*.js`) | 21 | 4.6 MB | 1.1 MB |
| SVG sprites | 8 | 2.2 MB | 0.5 MB |
| fonts (woff2) | 11 | 0.33 MB | 0.33 MB |
| OG images (png, avg 23 KB) | 301 | 7.0 MB | 7.0 MB |
| txt / xml / json (llms, sitemap, icons.json) | 9 | 0.8 MB | 0.1 MB |
| **total in bucket** | **~700** | **~50 MB** | |

| page (everything it loads from withicons.com) | raw | over the wire (brotli) | + fonts on first visit |
|---|---:|---:|---:|
| home `index.html` (css x3, site.js, home.js, meta.js, style-line.js) | 378 KB | **97 KB** | +~180 KB |
| library `icons.html` (+ 2 style data files) | 771 KB | **212 KB** | +~180 KB |
| icon page `icons/<name>.html` (avg page 90 KB raw / 13 KB br) | 198 KB | **43 KB** | +~180 KB |
| about | 227 KB | **51 KB** | +~180 KB |

Icon pages link the per-style SVG downloads from jsDelivr (`cdn.jsdelivr.net/npm/@withicons/...`), and so does every
`npx`/npm/CDN user. **jsDelivr serves npm packages free**, so none of that traffic hits AWS.

## 2. Traffic assumptions (20,000 users/month)

- 5 page views per user gives **100,000 page views**.
- **Pessimistic transfer**: every view is a cold view with no browser cache, ~300 KB average, which is **30 GB**.
  A realistic figure is 1 cold view (~280 KB) plus 4 warm views (~40 KB) per user, about 9 GB.
- Crawlers, link unfurls (OG images), `llms.txt` / `icons.json` fetches: **+5 GB**, so 35 GB budgeted.
- Requests: ~12 per cold view, giving **1.2M**, plus bots and API traffic of **0.3M**, so **1.5M requests**.
- CloudFront Function (www redirect + index rewrite) only runs on the HTML behaviour: **~150k invocations**.
- API: **100k edge requests** to `/api/*` and `/mcp` (AI agents, CLI, site search fallback). `/api/search` is cached
  per query for a day behind Origin Shield, so ~60% of it is served from cache; MCP POSTs are never cached. That leaves
  **~70k Lambda invocations**, ~100 ms each at 1024 MB arm64, so **~7,000 GB-s**, plus **8,640 keep-warm pings** (section 6).
- ~30 deploys/month, each uploading ~50 changed files and invalidating ≤ 40 paths (wildcards collapse the rest).

## 3. Itemised monthly cost

| item | usage | free tier (always free) | cost with free tier | cost with NO free tier |
|---|---|---|---:|---:|
| CloudFront data transfer out | 35 GB | 1 TB/month | $0.00 | $2.98 (35 x $0.085) |
| CloudFront HTTPS requests | 1.5M | 10M/month | $0.00 | $1.50 ($0.01 / 10k) |
| CloudFront Functions | 0.15M | 2M/month | $0.00 | $0.02 |
| CloudFront invalidations | ≤ 1,000 paths | 1,000 paths/month | $0.00 | $0.00 |
| S3 storage (50 MB + noncurrent versions, 30-day expiry) | ≤ 0.3 GB | (5 GB, first 12 months only) | $0.01 | $0.01 |
| S3 requests (CloudFront cache misses + deploy PUTs/LIST) | ~60k GET, ~2k PUT | | $0.03 | $0.03 |
| S3 to CloudFront transfer | | always free | $0.00 | $0.00 |
| Lambda requests (incl. 8,640 keep-warm pings) | 79k | 1M/month | $0.00 | $0.02 |
| Lambda compute (arm64, 1024 MB, incl. billed cold-start INIT) | ~7,100 GB-s | 400k GB-s/month | $0.00 | $0.10 |
| EventBridge schedule (keep-warm, `KeepWarm=true`) | 8,640 events | scheduled rules are free | $0.00 | $0.00 |
| CloudFront Origin Shield on the API (`ApiOriginShield=true`) | ≤ 100k req | none | $0.08 | $0.08 |
| Lambda Function URL | | no charge | $0.00 | $0.00 |
| CloudWatch Logs (14-day retention) | ~30 MB | 5 GB | $0.00 | $0.02 |
| CloudWatch alarms (2) | | 10 alarms | $0.00 | $0.20 |
| SNS email alerts | < 100 | 1,000 emails | $0.00 | $0.00 |
| ACM certificate | 1 | public certs are free | $0.00 | $0.00 |
| Route 53 hosted zone | 1 zone | none | **$0.50** | $0.50 |
| Route 53 queries (alias to CloudFront is free) | | | $0.00 | $0.00 |
| AWS Budgets (1 budget, 4 alerts) | | first 2 budgets free | $0.00 | $0.00 |
| **Total** | | | **≈ $0.65** | **≈ $5.45** |
| optional: WAF rate limit (`EnableWaf=true`) | 1.5M req | none | +$6.90 | +$6.90 |
| optional: CloudFront access logs (`EnableAccessLogs=true`) | ~0.6 GB | | +$0.05 | +$0.05 |
| outside AWS: domain renewal (.com) | | | ~$1.25/mo amortised | |
| outside AWS: GitHub (public repo, Actions), npm (public packages), jsDelivr | | | $0 | $0 |

The budget alarm (`infra/site.yaml`, `MonthlyBudget`) emails at **$20, $40 and $50 actual, plus $50 forecast**.
Any of those emails means something abnormal, most likely abuse of the API.

## 4. Worst case: what keeps the API bounded

- `/api/search` is edge-cached for a day (MinTTL 86400 s overrides the origin's `s-maxage=3600`) and keyed only on
  `q, query, limit, style, category, format`; `/api/icon/*` for a day too (MinTTL 300 s, origin `s-maxage=86400`).
  Repeated queries never reach Lambda. Deploys invalidate `/api/*` whenever the Lambda code changes.
- **Reserved concurrency 10** caps parallel executions. At ~100 ms per call that is at most ~100 invocations/second.
- `ApiInvocationsAlarm` emails at more than 20,000 invocations in one hour.
- **Kill switch** (stops all API spend in seconds, the site keeps working):
  `aws lambda put-function-concurrency --function-name withicons-site-api --reserved-concurrent-executions 0`
- A sustained flood at the concurrency cap for a whole month would be ~260M invocations, about $225 Lambda
  ($52 requests + $173 compute) plus ~$260 CloudFront requests. Nobody notices that from the bill alone, so the
  hourly alarm and the budget emails exist to catch it within hours. If it ever happens, turn on `EnableWaf=true`
  (per-IP rate limit, ~$7/month) or switch to a CloudFront flat-rate plan (below), which includes WAF and DDoS protection.

## 5. If traffic grows 10x (200k users, 1M page views)

| item | usage | cost |
|---|---|---:|
| CloudFront data | ~350 GB | $0 (still under 1 TB free) |
| CloudFront requests | ~15M | ~$5.00 (5M over the free 10M) |
| CloudFront Functions | ~1.5M | $0 (under 2M free) |
| Lambda | ~0.7M invocations, 35k GB-s | $0 (under free tier) |
| S3, logs, alarms, Route 53 | | ~$0.80 |
| **Total** | | **≈ $6** (≈ $13 with WAF) |

### Cost levers, in order of impact

1. **Fingerprint asset filenames** (`site.4f2a9c1e.js`). `scripts/deploy.mjs` already marks any `name.<hash>.ext`
   as `immutable` for 1 year, which removes revalidation requests (the biggest line item past 10M requests).
2. **CloudFront flat-rate plans** (launched Nov 2025: Free $0, Pro $15, Business $200/month). They bundle requests,
   data, WAF, DDoS protection and Route 53 DNS for a fixed price with no overage bills. Pro becomes cheaper than
   pay-as-you-go plus WAF somewhere past ~10x traffic. Check the current allowances and that Lambda Function URL
   origins are supported before switching.
3. **Price class**: the default `PriceClass_All` costs nothing extra while under 1 TB/month free. Past that,
   `PriceClass_100` (NA + EU edges) cuts per-GB price for traffic from South America / Oceania / Asia, at a latency cost.
4. **Push heavy data to jsDelivr**: `data/style-*.js` (2.2 MB raw) and the sprites could load from
   `cdn.jsdelivr.net/npm/@withicons/web@<ver>/...`, which costs $0. Keep the site copies as fallback.
5. **Fonts**: ~180 KB of woff2 is the largest part of a first visit. Subsetting Caveat to the logo glyphs
   (`caveat-logo.woff2` is already 4 KB) and dropping unused weights cuts cold views by ~40%.
6. **API**: `ApiSearchCachePolicy` already caches a day. Lowering `LambdaMemoryMb` saves cents but brings back multi-second cold starts (section 6).
7. **Invalidations**: deploy collapses changes to directory wildcards; `--full-invalidation` is one path. Staying
   under 1,000 paths/month is automatic unless you deploy hundreds of times.

### 100x (2M users, 10M page views)

~3.5 TB and ~150M requests is ~$215 data + ~$140 requests + small Lambda, about $350/month pay-as-you-go. At that
point the flat-rate Business plan (~$200) or levers 1 + 4 (which cut both lines by half or more) are the move.

## 6. API cold starts (why the Lambda has 1 GB, a keep-warm ping and Origin Shield)

A cold API Lambda took **~3.4 s** at 512 MB (loading the bundled index is CPU-bound), long enough for AI agents such as
ChatGPT browsing to time out on their first search. The fixes, in `infra/site.yaml` and `scripts/deploy.mjs`:

| lever | what it does | monthly cost (no free tier) |
|---|---|---:|
| `LambdaMemoryMb=1024` (allowed: 256-512, 1024, 1536, 1769) | CPU scales with memory: 512 MB is ~0.29 vCPU, 1024 MB ~0.58, 1769 MB one full vCPU. Init roughly halves at 1024 MB. | 7,000 GB-s x $0.0000133 = **$0.09** (was $0.05); free tier covers 400k GB-s |
| cold-start INIT is billed (since Aug 2025) | ~3 s x 1 GB per cold start; a few hundred a month | **< $0.02** |
| `KeepWarm=true`: EventBridge `rate(5 minutes)` -> `{"source":"withicons.warm"}` | keeps **one** execution environment initialised; the handler returns at once (~1-5 ms). A burst that needs a 2nd concurrent instance still cold-starts that one | 8,640 invocations: **$0.002** requests + ~$0.001 compute; EventBridge schedules free |
| `ApiOriginShield=true` (us-east-1) | every edge location shares one cache layer in front of the Lambda, so a query cached once is a hit worldwide | $0.0075 / 10k requests that reach the shield: **~$0.08** at 100k API requests |
| search cache key without Accept-Encoding | one cache entry per query instead of three (identity / gzip / br), so one warm request covers every client; results (~8 KB) go uncompressed | ~0.1 GB more transfer: **$0.01** |
| post-deploy cache warm (`scripts/deploy.mjs`) | after each deploy: invalidates `/api/*` if the Lambda code changed, waits for the invalidation, then GETs the top 150 `/api/search?q=` queries through CloudFront | 150 requests per deploy: **$0** |
| optional: provisioned concurrency (not in the template) | 1 always-initialised instance, no cold start ever for the first concurrent request | **~$9/month** for 1 x 1 GB arm64 (not free-tier); needs a published version + alias, the Function URL on the alias, and `deploy.mjs` publishing a version per deploy. Only worth it if keep-warm is not enough. |

The warm step and the WAF: the per-IP rule (`WafRateLimitPer5Min`, default 200) counts every `/api/*` request,
cache hits included. One warm run sends at most 180 (`--warm-limit`, default 150) at concurrency 6 (reserved
concurrency is 10) and stops at the first 429. Two deploys inside 5 minutes from the same CI runner can rate-limit
that runner's warm, nothing else. `--skip-warm` turns it off, `--warm-only` re-warms without deploying.

Fallbacks agents are told about (llms.txt, the skill): retry once, or use the static `https://withicons.com/icons.json`
(every name, alias and category, CORS `*`, ~1.9 MB raw / far less compressed) and the per-icon pages
`https://withicons.com/icons/<name>.html`. Both come from S3, no Lambda involved.
