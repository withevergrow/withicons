# with icons: launch plan (npm, GitHub, AWS, search engines, announcement)

Order of work: **npm setup, then GitHub, then the first release, then AWS, then DNS cut-over, then search engines, then announcement.**
Everything that needs a human (accounts, 2FA, DNS, secrets) is marked **[you]**.

Fixed names:

| thing | value |
|---|---|
| website | https://withicons.com (www redirects to the apex) |
| GitHub | https://github.com/withevergrow/withicons (existing org `withevergrow`) |
| npm packages | `@withicons/core react vue svelte angular solid web classes static search mcp motion dynamic`, plus the unscoped CLI `withicons` (one lockstep version; `scripts/publish.mjs` refuses to run if one is missing) |
| npm publisher | personal npm **user** account `withicons`, which owns the `@withicons` user scope |
| npm org | `with-icons` (scope `@with-icons`): **reserved, unused** for now |
| AWS stacks | `withicons-dns`, `withicons-site` (both us-east-1) |

---

## 1. npm setup (do this first)

`@withicons/*` is the **user scope** of the npm account `withicons`, so no npm org is needed to publish.
Trusted Publishing can only be configured on a package that **already exists**, so the first publish is done by
hand and everything after that is published by GitHub Actions without tokens.

1. **[you] Secure the `withicons` npm account**
   - npmjs.com, then Account, then Two-Factor Authentication: enable **"Authorization and writes"**, using a security key or passkey if you can, with
     an authenticator app as backup. Store the recovery codes in your password manager.
   - Use a mailbox you will keep forever (a role address, not a personal one) and verify it.
2. **[you] Keep the `with-icons` org reserved.** You have already created it, so leave it empty. If several people
   later need shared ownership, you can move packages into `@with-icons/*` or add the org's members as owners. It is optional and nothing depends on it.
3. **Check names** (a 404 means free):
   ```bash
   npm view withicons            # unscoped CLI name
   npm view @withicons/core      # every scoped name is yours, but check nothing was published
   ```
4. **Build and inspect** (from a clean checkout of `main`):
   ```bash
   npm ci && node forge/build.mjs && node forge/tools/check.mjs && node forge/tools/check-motion.mjs
   node forge/tools/check-palettes.mjs --quiet && node scripts/skill-sync.mjs --check && npm test --workspaces --if-present
   node scripts/publish.mjs --dry-run        # npm publish --dry-run per package, in dependency order
   ```
   Read the file lists printed by the dry run: only `dist/`, `README.md`, `LICENSE`, `package.json` should ship.
5. **[you] First publish, by hand, as user `withicons`**
   ```bash
   npm login                                  # as withicons, 2FA prompt
   npm whoami                                 # -> withicons
   node scripts/publish.mjs                   # runs `npm publish --access public` per package; asks for an OTP each time
   # or one at a time:  cd packages/core && npm publish --access public --otp 123456
   ```
   This covers every `packages/*` that is not `"private": true`, including the unscoped CLI package `withicons` once
   it exists. `scripts/publish.mjs` skips versions that are already on npm, so re-running after a failure is safe.
   Do **not** use `--provenance` locally (it only works in CI). The first release has no provenance, and every later one does.
6. **[you] Turn on Trusted Publishing for every package** (npmjs.com, then the package, then Settings, then **Trusted Publisher**):
   - Publisher: **GitHub Actions**
   - Organization or user: **`withevergrow`** · Repository: **`withicons`**
   - Workflow filename: **`release.yml`** · Environment: **`npm`**
   - Then, in the same settings page under **Publishing access**, choose *"Require two-factor authentication and disallow tokens"*.
   Repeat for each package (`@withicons/core`, `react`, `vue`, `svelte`, `angular`, `solid`, `web`, `classes`, `static`, `search`,
   `mcp`, `motion`, `dynamic`, and `withicons`).
7. **[you] Remove tokens.** If you created an `NPM_TOKEN` (granular, publish-only, 7-day expiry) as a stop-gap,
   delete the GitHub secret and revoke the token at npmjs.com, then Access Tokens. `release.yml` works without it.
8. **Co-maintainers** (later): they create their own npm accounts with 2FA, then
   ```bash
   for p in core react vue svelte angular solid web classes static search mcp motion dynamic; do npm owner add <user> @withicons/$p; done
   npm owner add <user> withicons
   ```
9. **Verify** after the first CI release: `npm audit signatures` in a project that installs a package, and the
   "Provenance" badge on the npm page.

## 2. GitHub (`withevergrow/withicons`)

1. **Before the first push**, review history for anything private: `git log --stat`, plus `forge/.claims/` and `.preview/`
   (internal working files; delete or `.gitignore` them). The old name *egopenicons* in history is harmless.
2. **[you] Push** `main`. Repository settings:
   - Description: *"500 free icons in 20 styles (incl. 3D luxe, Bauhaus, skeuomorphic, anime, gothic, coquette and plush), with animations and live icons, for websites, apps, slides and docs. React, Vue, Svelte, Angular, Solid, web component, MCP."*
   - Website `https://withicons.com`. Topics: `icons svg icon-library react vue svelte angular solidjs web-components mcp design`.
   - Social preview: an OG image (1280x640) from `site/og/`.
   - Features: Issues ✓, Discussions ✓ (categories: Q&A, Ideas, Show and tell), Wiki ✗, Projects optional.
3. **Security** (Settings, then Code security): Private vulnerability reporting ✓, Dependabot alerts ✓, Dependabot
   security updates ✓, Secret scanning + push protection ✓, CodeQL default setup ✓ (free for public repos).
4. **Rulesets** (Settings, then Rules):
   - `main`: require a pull request, 1 approval, **review from Code Owners**, dismiss stale approvals, required status
     checks **`Build, lint icons, test packages`** and **`Lint CloudFormation`** (from `ci.yml`), block force pushes and
     deletion, require linear history. Admin bypass is allowed for emergencies.
   - Tags `v*`: only maintainers can create, update or delete them (a tag push publishes to npm).
5. **Environments** (Settings, then Environments):
   - `production`: deployment branch `main` only; variable `AWS_DEPLOY_ROLE_ARN` = stack output `DeployRoleArn`
     (optional `WITHICONS_STACK`).
   - `npm`: deployment tags `v*` only; optional required reviewer (you) so every release needs one click.
6. **Labels**: `icon request`, `alias`, `search`, `bug`, `style`, `good first issue`, `help wanted`, `mcp`, `site`.
7. Files already in the repo: `LICENSE` (MIT, "with icons contributors"), `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`,
   `SECURITY.md`, `.github/CODEOWNERS` (replace `@SoumyaSwaraj` if that is not your GitHub handle),
   `.github/ISSUE_TEMPLATE/` (icon request, alias suggestion, bug), `AGENTS.md`, `skills/with-icons/`.
8. **Name squatting (free, 5 minutes)**: also create the GitHub org `withicons` (empty, profile README linking to
   the real repo) and reserve `@withicons` on X, Bluesky, Product Hunt, LinkedIn page, Reddit user.

## 3. Versioning and changelog

- **Lockstep SemVer.** All packages share one version, stamped by `forge/build.mjs` from the root `package.json`.
- **0.x rules** (before 1.0):
  - `0.MINOR` bump means anything that can break someone: an icon renamed or removed, an alias that becomes ambiguous,
    prop/attribute/export changes, visible geometry changes to a whole style.
  - `0.x.PATCH` bump means additive or fixes: new icons, new aliases, drawing fixes to single icons, docs.
  - A renamed icon keeps its old name as an alias for at least one minor version.
- **1.0** once names, props, the 20 styles and the motion classes have been stable for about two minors with no breaking reports.
- Prereleases (`0.3.0-beta.1`) publish under the `next` dist-tag automatically.
- `CHANGELOG.md` (Keep a Changelog format): every user-facing PR adds a line under *Unreleased*. GitHub
  Release notes are generated from PR titles by `release.yml`.
- **Release** (after the first manual publish):
  ```bash
  # bump "withiconsVersion" in the root package.json (e.g. "0.3.0") - every package gets this version
  node forge/build.mjs && node forge/tools/check.mjs
  # move CHANGELOG "Unreleased" to "## 0.3.0 - YYYY-MM-DD", open a PR, merge
  git tag v0.3.0 && git push origin v0.3.0      # release.yml publishes + creates the GitHub Release
  ```
  For a dry run, open Actions, then *Release to npm*, then *Run workflow* with `dry_run` checked.

## 4. First npm release checklist (0.2.0)

`v0.1.0` (300 icons x 7 styles) is already tagged and released on GitHub, but nothing is on npm yet. The tree now has
500 icons x 20 styles, motion, palettes and live icons, so the first npm publish is **0.2.0**: bump `withiconsVersion` in the root
`package.json`, run `node forge/build.mjs`, move CHANGELOG "Unreleased" to `## 0.2.0 - YYYY-MM-DD`, commit, then publish
by hand (section 1.5). `scripts/publish.mjs` refuses to publish a version whose tag sits on another commit.

- [ ] Root `package.json` `withiconsVersion` is `0.2.0` and every `packages/*/package.json` says so (`node scripts/publish.mjs --dry-run`
      prints no `already tagged` warning).
- [ ] `npm view` confirms every name is free (section 1).
- [ ] No `egopenicons` / `eg-` leftovers: `git grep -n -i "egopenicons\|@egopenicons\|<eg-icon"` returns nothing outside history.
- [ ] Each package README shows the right install line, import path and props, and links to withicons.com.
- [ ] `node scripts/publish.mjs --dry-run`: tarball contents are sane and sizes match the README tables.
- [ ] Smoke test in fresh apps: Vite React, Vite Vue, SvelteKit, Angular CLI, SolidStart, and plain HTML with the web
      component from jsDelivr (`dist/cdn.js`: the network panel shows only one `icons/<style>/<name>.js` per icon shown)
      plus the icon classes loader (`@withicons/classes/dist/with-loader.js`: only `dist/<style>/<name>.css` per icon), and
      live icons from `@withicons/dynamic/dist/cdn/lite.js` (one `cdn/gens/<name>.js` per live icon). Check TypeScript types, tree-shaking (one icon gives a tiny bundle), and SSR.
- [ ] `npx -y @withicons/mcp` starts and lists tools in an MCP client (seven, including `animate_icon` and `list_palettes`). `npx withicons search trash`
      and `npx withicons animate bell --trigger hover` work.
- [ ] `@withicons/motion`: `motion.css` + `icons/<name>.css` from jsDelivr (and `icons.css` in a bundled app) animate a React icon, a `<with-icon>` and an `<i class="with">`;
      `prefers-reduced-motion` turns them off; a swap toggles with `.is-on`.
- [ ] Palette styles: an `<img>` of `core/dist/svg/kawaii/heart.svg` shows its colours; `with-loader.js` (and `with-kawaii.css`) show them CSS-only;
      `--with-kawaii-*` variables re-theme a React icon.
- [ ] Per-icon palettes: `import { applyPalette } from '@withicons/core/palettes/palette-map.js'` works on Node 18 and 20
      (palette-map ships as `.mjs` + `.cjs`, so the `package` icon's `dist/palettes/package.json` data file can't change its module type),
      and `npx withicons get pizza --style retro --palette pepperoni` recolours every part.
- [ ] Package READMEs: drop the "Not published to npm yet / launching soon" notes (`packages/cli`, `mcp`, `motion`; they ship to npm).
- [ ] After publishing: jsDelivr URLs resolve (`https://cdn.jsdelivr.net/npm/@withicons/web` serves `dist/cdn.js`;
      `https://cdn.jsdelivr.net/npm/@withicons/classes` serves `dist/with-loader.js`;
      also `.../classes/dist/with-line.css`, `.../motion/dist/icons/bell.css`, `.../dynamic/dist/cdn/lite.js`).
      Purge if needed: `https://purge.jsdelivr.net/npm/@withicons/web/dist/cdn.js`.
- [ ] Site: "launching soon" labels next to install commands are removed (site owners), GitHub links go live.
- [ ] Trusted Publishing configured for every package (section 1.6), tokens revoked.
- [ ] Tag `v0.2.0` on the published commit (`git tag v0.2.0 <sha> && git push origin v0.2.0`). The workflow skips
      already-published versions and only creates the GitHub Release.

## 5. AWS account setup

1. **[you] Account**: create an AWS account for Evergrow/with icons (a dedicated account keeps the bill and blast radius
   separate). Root user: strong password plus MFA (passkey or security key). **Never create root access keys.**
2. **[you] Billing**: Billing, then Billing preferences: enable *Free Tier usage alerts* and *Invoice by email*; activate IAM
   access to billing; open Cost Explorer once (it enables itself in 24 h). Indian accounts (AISPL) need GST details and
   an Indian card; expect 18% GST on the bill.
3. **[you] Identity**: enable **IAM Identity Center** in us-east-1, create your user with MFA and the `AdministratorAccess`
   permission set. Locally: `aws configure sso` (profile `withicons`), then `aws sso login --profile withicons`.
4. **Quota check**: brand-new accounts sometimes have a Lambda concurrency limit of 10, which makes reserving 10 impossible.
   Check *Service Quotas, then AWS Lambda, then Concurrent executions*. If it is 10, request 1,000 (free, usually
   approved within a day) or deploy with `LambdaReservedConcurrency=0` first.

## 6. Deploy the infrastructure

All commands use `--region us-east-1` (CloudFront certificates and WAF must live there). Add `--profile withicons`.

```bash
# 6.1 DNS zone ($0.50/month). Skip if the domain is registered with Route 53 Domains (zone exists already).
aws cloudformation deploy --region us-east-1 --stack-name withicons-dns --template-file infra/dns.yaml
aws cloudformation describe-stacks --region us-east-1 --stack-name withicons-dns \
  --query "Stacks[0].Outputs" --output table          # HostedZoneId + NameServers
```

**6.2 [you] DNS cut-over at the registrar**: replace the domain's name servers with the 4 `NameServers`.
There is no live site yet, so there is no downtime to manage. If the domain ever hosts mail, copy the MX/TXT records into
the new zone **before** switching (`infra/dns.yaml` adds a null SPF + DMARC `p=reject` + CAA for Amazon only; remove the
first two if you add a mail provider). Wait until `nslookup -type=NS withicons.com 8.8.8.8` shows the AWS servers
(minutes to a few hours).

Keeping DNS at another registrar instead: deploy 6.3 with `HostedZoneId=""`, then add the two ACM validation
CNAMEs shown in the ACM console (the stack waits for them), `www` CNAME to the `DistributionDomainName` output, and the apex
as ALIAS/ANAME/CNAME-flattening to the same name. Many registrars cannot do apex aliases, which is why Route 53 is recommended.

```bash
# 6.3 Site, API, deploy role, budget. Takes 5-15 min (certificate validation + distribution).
SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
aws cloudformation deploy --region us-east-1 --stack-name withicons-site --template-file infra/site.yaml \
  --capabilities CAPABILITY_NAMED_IAM \
  --parameter-overrides HostedZoneId=<Z...> AlertEmail=<you@domain> OriginVerifySecret=$SECRET
#   if the account already has a GitHub OIDC provider: GitHubOidcProviderArn=arn:aws:iam::<acct>:oidc-provider/token.actions.githubusercontent.com
#   later updates: `aws cloudformation deploy` keeps the previous value of every parameter you do not override
#   (including the NoEcho OriginVerifySecret), so pass only what changes, e.g. --parameter-overrides EnableWaf=true
```

**[you]** Confirm the SNS subscription email ("AWS Notification - Subscription Confirmation") or alarms go nowhere.

```bash
# 6.4 First deploy from your machine
node scripts/deploy.mjs --dry-run          # shows the upload plan per file class and the Lambda zip
node scripts/deploy.mjs                    # build, upload, Lambda code, invalidate
```

**6.5** Copy the `DeployRoleArn` output to GitHub, then Environments, then `production`, then variable `AWS_DEPLOY_ROLE_ARN`. From now on
every push to `main` that touches the site deploys itself (`deploy-site.yml`).

**6.6 Verify**

```bash
curl -sI https://withicons.com/ | grep -iE "HTTP/|strict-transport|content-security|x-cache"
curl -sI https://www.withicons.com/icons.html | grep -i location     # -> https://withicons.com/icons.html (301)
curl -sI https://withicons.com/guides | grep -i location             # -> /guides/ (301), then /guides/ serves index.html
curl -s  -o /dev/null -w "%{http_code}\n" https://withicons.com/nope  # 404 (serves /404.html)
curl -s  "https://withicons.com/api/search?q=bin" | head -c 300       # JSON; repeat and see x-cache: Hit from cloudfront
curl -s  -o /dev/null -w "%{http_code}\n" "$(aws cloudformation describe-stacks --stack-name withicons-site \
  --query "Stacks[0].Outputs[?OutputKey=='ApiFunctionUrl'].OutputValue" --output text)mcp"   # 401: direct access blocked
npx @modelcontextprotocol/inspector     # connect to https://withicons.com/mcp (Streamable HTTP), list tools, run a search
```

Also check https://securityheaders.com, https://www.ssllabs.com/ssltest/ and https://http3check.net.
After 2-4 weeks of clean HTTPS, redeploy with `HstsPreload=true` and submit at https://hstspreload.org.

**Operations**: kill switch for the API is
`aws lambda put-function-concurrency --function-name withicons-site-api --reserved-concurrent-executions 0`
(undo: `delete-function-concurrency`, then redeploy the stack). Rollback of a bad site deploy: revert the commit on
`main`; S3 keeps 30 days of old versions if you need a single file back.

**API cold starts** (agents time out on a slow first search; details and costs in `docs/COSTS.md` section 6): the
template defaults to `LambdaMemoryMb=1024`, `KeepWarm=true` (EventBridge ping every 5 minutes) and `ApiOriginShield=true`,
and caches `/api/search` for a day with one cache entry per query. A stack created earlier keeps its old memory value
(`aws cloudformation deploy` reuses previous parameter values), so pass it once, after the Lambda code that answers the
`{"source":"withicons.warm"}` ping is deployed:

```bash
aws cloudformation deploy --region us-east-1 --profile withicons --stack-name withicons-site --template-file infra/site.yaml \
  --capabilities CAPABILITY_NAMED_IAM --parameter-overrides LambdaMemoryMb=1024
node scripts/deploy.mjs --warm-only                     # fill the edge cache now (150 queries, under the WAF limit)
curl -s -o /dev/null -w "%{time_total}\n" "https://withicons.com/api/search?q=dollar+sign"   # x-cache: Hit, well under 1 s
```

Every real `scripts/deploy.mjs` run ends with the same warm (`--skip-warm` turns it off): it invalidates `/api/*` when
the Lambda code changed, waits for the invalidation, then requests the top 150 `/api/search?q=` queries (curated words +
icon names). The WAF counts those against the runner's IP (limit 200 per 5 minutes), so the warm is capped at 180.

**Notes on the design** (details in `infra/site.yaml` comments and `docs/COSTS.md`):
- `/mcp` and `/api/*` share the site's distribution and certificate (no CORS for the site's own calls, one hostname
  to document, no extra cert/zone/distribution). An `api.withicons.com` split only pays off if the API ever moves
  off CloudFront.
- The Lambda Function URL is `AuthType NONE` guarded by a secret origin header (`infra/lambda/index.mjs`) instead
  of CloudFront OAC: OAC for Lambda requires every POST to carry a SHA-256 of its body (`x-amz-content-sha256`),
  which generic MCP clients never send.
- The CSP allows `'unsafe-inline'` scripts because the pages contain inline bootstraps; `node scripts/deploy.mjs
  --print-csp` produces a hash-based policy to pass as `ContentSecurityPolicy` once the site stabilises.

## 7. Search engines

1. **Google Search Console** [you]: add a **Domain property** `withicons.com`, verify with the TXT record it shows
   (add it to the Route 53 zone: console, or a `AWS::Route53::RecordSet` in `infra/dns.yaml`). Submit
   `https://withicons.com/sitemap.xml`. Use URL inspection on `/`, `/icons.html` and a few `/icons/<name>.html` pages.
2. **Bing Webmaster Tools** [you]: sign in, then *Import from Google Search Console* (fastest), then submit the sitemap. This also
   feeds DuckDuckGo, Yahoo and ChatGPT search.
3. **IndexNow** (Bing, Yandex, Seznam, Naver): generate a key (`node -e "console.log(crypto.randomUUID().replace(/-/g,''))"`),
   ask the site owner to add `site/<key>.txt` containing the key, deploy, then after each release ping:
   ```bash
   curl -s -X POST https://api.indexnow.org/indexnow -H "content-type: application/json" -d '{
     "host":"withicons.com","key":"<key>","keyLocation":"https://withicons.com/<key>.txt",
     "urlList":["https://withicons.com/","https://withicons.com/icons.html","https://withicons.com/llms.txt"]}'
   ```
4. Validate structured data on a few icon pages with https://search.google.com/test/rich-results and OG previews with
   https://www.opengraph.xyz.
5. AI discoverability: `llms.txt`, `llms-full.txt`, `icons.json` and `skill/SKILL.md` are public and CORS-enabled. Make sure
   `robots.txt` does not block GPTBot/ClaudeBot/PerplexityBot unless you decide to.

## 8. Announcement checklist

Prepare once: a 20-30 s screen recording (logo morph, search "throw away" finds `trash`, switch styles, copy into
Figma/PowerPoint, `npx -y @withicons/mcp` in Claude/Cursor), 5 screenshots (1270x760 for Product Hunt), a 1-paragraph
pitch, and "why another icon set" (one skeleton, 7 renderers, aliases for humans and agents, MCP + skill).

| when | where | notes |
|---|---|---|
| T-7 | Product Hunt "upcoming" page, hunter lined up | launch 12:01 AM PT, Tue-Thu; maker comment ready |
| T-3 | **Iconify** | open a PR to `iconify/icon-sets` with the line + solid sets: icones.js.org, Figma/Iconify plugins and every Iconify user find you |
| T-1 | MCP directories | **official MCP Registry** (`mcp-publisher publish`, namespace `io.github.withevergrow/withicons` or DNS-verified `com.withicons/*`), Smithery, Glama, PulseMCP, mcp.so, mcpservers.org, `punkpeye/awesome-mcp-servers` PR |
| T-1 | agent skill/rules directories | Claude skills lists (e.g. awesome-claude-skills PRs), cursor.directory (MCP + rules from `.cursor/rules/with-icons.mdc`), Cline MCP marketplace, Windsurf/Continue hubs |
| T0 | Product Hunt | reply to every comment all day |
| T0 | **Show HN** | "Show HN: with icons - 500 icons drawn once, rendered in 20 styles by code, with animations". Post 8-10 AM ET, link the site (not the repo), first comment explains the forge, stay for questions |
| T0 | X, Bluesky, Mastodon, LinkedIn | video first; thread: problem, the 20 styles (kawaii, pixel, glass, 3D luxe, Bauhaus, skeuo, anime, gothic, coquette, plush...), live icons (a calendar that shows today), hover and swap animations, aliases ("bin" finds trash), AI agents (MCP + skill), MIT |
| T0..T+7 | Reddit | r/webdev (Showoff Saturday only), r/web_design, r/SideProject, r/opensource, r/reactjs, r/vuejs, r/sveltejs, r/angular, r/solidjs, r/UI_Design, r/ClaudeAI, r/cursor. Read each sub's self-promo rules, one post per sub, spaced out |
| T+1 | newsletters (submit) | JavaScript Weekly, Frontend Focus, React Status, Node Weekly, Bytes, TLDR Web Dev, Sidebar.io, Smashing, CSS Weekly, Console.dev, Changelog News, Designer News |
| T+3 | awesome lists (PRs) | awesome-react-components, awesome-vue, awesome-svelte, awesome-angular, awesome-solid-js, awesome-web-components, awesome-design-systems, awesome-svg, awesome-opensource-design |
| T+7 | write-up | blog post or dev.to: "How we generate 10,000 icons from 500 skeletons" (Hacker News second chance, Lobsters) |

## 9. Post-launch metrics (review weekly for the first 8 weeks)

| metric | source | early target |
|---|---|---|
| npm weekly downloads per package | `https://api.npmjs.org/downloads/point/last-week/@withicons/react`, npm-stat.com | 1k/week by week 4 |
| jsDelivr hits (CDN users, SVG files) | `https://data.jsdelivr.com/v1/stats/packages/npm/@withicons/web` | trending up |
| GitHub stars, forks, icon requests, external PRs | repo Insights | 500 stars in month 1; requests triaged within a week |
| site visitors, top pages, referrers | CloudFront console: *Reports & analytics* (free, no cookies) | 20k users/month |
| search impressions and clicks, queries | Google Search Console, Bing Webmaster | icon pages indexed within 4 weeks |
| MCP/API usage and **zero-result queries** | Lambda logs (CloudWatch Logs Insights) | feed zero-result words into aliases |
| AWS cost | Budgets emails, Cost Explorer | < $5/month (see docs/COSTS.md) |
| Directory listings live | checklist above | all within 2 weeks |

Turn the top zero-result search terms and icon requests into the next minor release every 2-4 weeks. A steady
release cadence is itself a launch channel (release notes, "new icons" posts).
