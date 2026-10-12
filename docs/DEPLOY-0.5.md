# Deploying 0.5.0: MCP evaluation fixes, 750 icons, demos

A one-off runbook for releasing branch `teddy-bear-liquid-chrome`. The general process is in [LAUNCH.md](LAUNCH.md).
There are three independent channels, and each one goes live separately:

| channel | what ships | how it goes live |
|---|---|---|
| Site + API | site/ (including site/demos/), hosted MCP/search Lambda | merge to `main` → `.github/workflows/deploy-site.yml` |
| Infra | WAF rate limit 200 → 1000, CSP allows jsDelivr (demos) | manual `aws cloudformation deploy` |
| npm | all `@withicons/*` packages + `withicons` CLI | tag `v0.5.0` → `.github/workflows/release.yml` |

Recommended order: **1 → 2 → 3 → 4 → 5 → 6**. The infra update (step 4) goes before or straight after the site merge
(step 5). Without it the demo pages show only their plain emoji version on withicons.com.

---

## 0. Pre-flight state (checked 11 Oct 2026)

- `npm test --workspaces --if-present`: 1374 pass, 0 fail.
- `node forge/tools/check.mjs`: no hard errors; only "no fills" warnings on line-only glyphs.
- `node scripts/skill-sync.mjs --check`: up to date.
- `node scripts/deploy.mjs --dry-run`: the Lambda smoke test passes on every route, PNG render takes 422 ms, the zip is 23 MB
  (limit 45 MB), and cold import takes about 8 s locally. That local time counts antivirus scans, but keep it in mind
  against the 15 s Lambda timeout.
- The branch merges cleanly into `main`, which has 4 README-only commits since the branch point.

## 1. Tidy the working tree

```bash
git status --short
```

Expect these items:

- **Your in-progress Angular work** (`forge/lib/emit-angular.mjs`, `packages/angular/package.json`,
  `packages/angular/test/package.test.mjs`, `scripts/package-budget.mjs`): either commit it as its own commit or
  stash it. `@withicons/angular` sits at 51,113 of its 52,000-file budget with this work.
- **Demos**: `demos/` (sources: data, tools, docs), `site/demos/` (published pages, `_img/` with about 28 MB of
  self-hosted photos, `_kit/`, `_thumbs/`), `site/css/demos.css`.
- **Footer "Demos" link and the 734 → 750 count refresh** across site pages, `site/DESIGN.md`,
  `forge/tools/site-pages/lib.mjs`, `forge/tools/site-seo.mjs`.
- `infra/site.yaml` (CSP), `docs/DEPLOY-0.5.md` (this file).

Commit the demo work separately so it's easy to revert:

```bash
git add demos site/demos site/css/demos.css site/DESIGN.md forge/tools/site-pages/lib.mjs forge/tools/site-seo.mjs infra/site.yaml docs/DEPLOY-0.5.md
```

```bash
git add -u site
```

```bash
git commit -m "Demos on the site: hub, 17 noindex demo pages, self-hosted photos, footer link, CSP allows jsDelivr"
```

## 2. Rebuild and re-verify locally

```bash
node forge/build.mjs
```

```bash
node demos/_tools/build-hub.mjs
```

```bash
node demos/_tools/localize-photos.mjs --check
```

```bash
npm test --workspaces --if-present
```

```bash
node scripts/skill-sync.mjs --check
```

```bash
git status --short
```

The last command must show nothing new. If the build changed generated files, commit them.

Then look at it in a browser:

```bash
node forge/tools/serve.mjs
```

Open http://localhost:4321/demos/index.html. Check:
- [ ] the site header and footer show, in light and dark mode
- [ ] the "Animated demos" section shows (Reunion Dinner, Whisker & Wag)
- [ ] a demo page opens, shows its "Demo: … fictional" note, photos load, and the style bar switches styles
- [ ] the footer "Demos" link works from a deep page, e.g. /icons/home.html

## 3. Push the branch and open a PR

```bash
git push -u origin teddy-bear-liquid-chrome
```

```bash
gh pr create --base main --title "0.5.0: MCP agent-eval fixes, 16 icons, demos" --fill
```

Use **squash merge**: the 39 commits include a teddy-bear icon that was added and then removed, and the branch name is
misleading.

## 4. Infra update (CloudFormation): rate limit and CSP

`deploy-site.yml` never touches the stack, so these two template changes need a manual deploy:

- `WafRateLimitPer5Min` 200 → 1000 (requests per IP per 5 minutes).
- CSP default: `https://cdn.jsdelivr.net` is added to `script-src`, `style-src` and `connect-src`. The demo kit loads
  `@withicons/web`, `dynamic`, `motion` and `search` from jsDelivr.

First check whether the live stack overrides the CSP parameter. If it does, the new default is ignored:

```bash
aws cloudformation describe-stacks --region us-east-1 --profile withicons --stack-name withicons-site --query "Stacks[0].Parameters[?ParameterKey=='ContentSecurityPolicy' || ParameterKey=='WafRateLimitPer5Min']"
```

- If `ContentSecurityPolicy` is shown with a custom value, pass the new string from `infra/site.yaml` explicitly as well
  (`ContentSecurityPolicy="..."`).
- Otherwise deploy with only the rate limit override:

```bash
aws cloudformation deploy --region us-east-1 --profile withicons --stack-name withicons-site --template-file infra/site.yaml --capabilities CAPABILITY_NAMED_IAM --parameter-overrides WafRateLimitPer5Min=1000
```

Preview first if you prefer: add `--no-execute-changeset`, then review the change set in the console. The change set should
only touch the response-headers policy and the WAF rule. If it wants to replace the distribution or the bucket, stop.

Verify:

```bash
curl -sI https://withicons.com/ | grep -i content-security-policy
```

The output should include `cdn.jsdelivr.net`. CloudFront propagation takes a few minutes.

## 5. Merge to main (site and API deploy)

Merge the PR on GitHub (squash). This starts **Deploy withicons.com**:
1. builds packages and site, runs skill-sync
2. uploads changed files to S3 with per-class Cache-Control. The demo photos are new, so expect about 330 extra uploads.
3. updates the API Lambda (23 MB zip) and runs its smoke test
4. invalidates only changed paths and warms the cache

Watch it:

```bash
gh run watch
```

Verify live:

```bash
curl -s "https://withicons.com/api/search?q=sheep"
```

The output should include `"noExactMatch":true`.

```bash
curl -sI https://withicons.com/demos/index.html
```

That should return 200.

```bash
curl -s https://withicons.com/sitemap.xml | grep -c demos/
```

That should return 1: only the hub is listed.

```bash
curl -s https://withicons.com/demos/rosas-bakery.html | grep -o '<meta name="robots"[^>]*>'
```

That should return `noindex, follow`.

In a browser:
- [ ] a demo page on withicons.com switches to Upgraded and Full, with no CSP errors in DevTools
- [ ] an MCP client (e.g. the MCP inspector at https://withicons.com/mcp) gets a PNG back from `export_icon` with `format: "png"`

If the first API calls are slow, look at Lambda cold-start duration in CloudWatch, because about 8 s were measured locally.
If cold starts near the 15 s timeout, raise `LambdaMemoryMb` in the stack.

## 6. npm release 0.5.0

Packages only change for users after this step. The hosted MCP is already live from step 5.

1. Create a release branch from the updated `main`:

```bash
git checkout main
```

```bash
git pull
```

```bash
git checkout -b release-0.5.0
```

2. Set `"withiconsVersion": "0.5.0"` in the root `package.json`.
3. In `CHANGELOG.md`, rename `## Unreleased` to `## 0.5.0 - <date>` and add a new empty `## Unreleased` above it.
4. Rebuild and dry-run the pack:

```bash
node forge/build.mjs
```

```bash
node scripts/publish.mjs --dry-run
```

This must pass with every package listed, `@withicons/motion` included, and no "already tagged" warning.
5. Commit, open a PR and merge it. Then tag the merge commit on `main`:

```bash
git tag v0.5.0
```

```bash
git push origin v0.5.0
```

`release.yml` publishes all packages in lockstep with provenance.
6. Verify:

```bash
npm view @withicons/core version
```

```bash
npx withicons@0.5.0 --version
```

jsDelivr picks up the new version within minutes. The demo kit pins its own versions in `demo-kit.js` (`V.web`,
`V.dynamic`). If you want the demos on 0.5.0, update those, then redeploy the site.

## 7. Search engines (optional, after go-live)

- Google Search Console: resubmit `https://withicons.com/sitemap.xml` and request indexing for `/demos/index.html`.
- Bing Webmaster Tools: same.
- The demo pages are noindex and are not in robots.txt on purpose, so crawlers can still read the noindex. Don't add them
  there.

## Rollback

| what | how |
|---|---|
| site + API | `git revert <squash commit>` on main and push. The workflow redeploys the previous site and Lambda. |
| infra | rerun step 4 with `WafRateLimitPer5Min=200`. For the CSP, revert `infra/site.yaml` and deploy, or pass the old CSP string. |
| npm | you can't unpublish after 72 h. `npm deprecate @withicons/<pkg>@0.5.0 "<reason>"` and ship 0.5.1. |

## Known open items (not blockers)

- MCP eval findings #4, #6 and #8 are only partly done (see [MCP-AGENT-EVAL.md](MCP-AGENT-EVAL.md)). The hosted server
  still returns a CLI command for gif, apng and animated pptx.
- `site/404.html` has a short footer without the Demos link (D1's page).
- About 28 MB of demo photos are original CDN JPEGs (no re-encoding). Re-encoding them with `sharp` to WebP would roughly
  halve that.
- `@withicons/angular` has room for about 26 more icons before its file budget.
