# cdn

`public/` is the site. There is no build, no image, and no server here.

## What it holds

| path | what |
|---|---|
| `exchange/icon-svg`, `exchange/icon-png` | 100 token marks, 513×513, keyed by symbol. What the old lux.exchange fetched. |
| `exchange/tokens-lux/tokens.json` | 57 entries — chainId, address, `logoURI` — the address→mark table. Every `cdn.lux.network` URI in it resolves inside this tree. |
| `bridge/currencies/{lux,zoo}` | 203 marks, a strict superset of `exchange/icon-svg` and byte-identical on every overlap. |
| `bridge/networks` | 113 chain marks, `<chain>_<network>.png`. |
| `img`, `commerce`, `video`, `pdf`, `icon` | brand artwork and product media. |
| `dwallet`, `xwallet` | assets shipped clients fetch by hardcoded URL. |

`exchange/icon-svg/lux.svg` and `icon-png/lux.png` are the brand mark — a white
downward triangle on black. Not the purple two-triangle placeholder; that one is
not in this repo.

## How the hosts serve it

`hanzoai/ingress` reads `s3://hanzo-sites/lux/lux-cdn` directly through a
`staticFiles` middleware, declared in `luxfi/universe` at
`deploy/lux-cdn/lux-cdn.yaml`. One rule matches both `cdn.lux.cloud` and
`cdn.lux.network`. There is no Deployment, because a static host is not a pod.
Cloudflare fronts both names; both A records already point at the tunnel.

`spaMode` is off, and that is the load-bearing choice. On, every missing path
would answer 200 with `index.html` — an HTML document where a PNG was asked for,
cached by everything downstream and noticed by nobody. Off, a missing mark is a
404, which is the only thing that lets a caller report it missing instead of
drawing it.

Cache-Control is the ingress default: `max-age=86400` for files,
`no-cache` for HTML, with an ETag from the object store. Nothing here sets it —
the serving path composes it, and a second copy would drift.

## Publishing

`.github/workflows/site.yml` on push to `main`: checkout, then
`hanzoai/ci/.github/actions/site@v1` with `slug: lux-cdn`. By hand, from the
operator session:

    HANZO_DEPLOY_TOKEN=$(hanzo auth token) CURL_HOME=<dir with .curlrc: header = "X-Org-Id: lux"> \
      /Users/z/work/hanzo/ci/bin/site lux-cdn public

The slug is the address. The prefix is derived server-side as `<org>/<slug>`, so
a hanzo-org token publishes to `hanzo/lux-cdn`, which nothing serves.

The slug is `lux-cdn` and not `cdn` because `cdn` is on cloud's reserved-label
list (`apps/sites/reserved.go`) with api, admin, gateway and the brand terms —
nobody may publish a site at `cdn.<apex>` and shadow real infrastructure. Asking
for it answers `400 slug is a reserved subdomain`.

**A publish is a rollout.** The plane writes into the prefix the edge is already
serving, so every object is live the moment S3 accepts it, and the completion's
`keys` manifest is what cloud reconciles the prefix against — a file the checkout
stopped carrying is deleted from the host.

## What was removed, and why

A Next 14 app (`src/`, `next.config.js`, `package.json`, a 446 KB lockfile,
`Dockerfile`) whose entire output was `public/` copied verbatim plus one document
reading "LUX cdn — coming soon". `output: 'export'` made `next build` an
expensive `cp -r`; @hanzo/ui, Tailwind, mobx, splinetool and firebaseui were
carried to render three lines of text. Two serving paths went with it:
`.github/workflows/deploy.yml` published the same bytes to GitHub Pages, and
`docker.yml` built `ghcr.io/luxfi/cdn` onto `hanzoai/static`. The Sites plane is
the one way; the others were a second and a third.

`public/index.html` is the one page that stayed, hand-written. It is not
decoration: `bin/site` downloads the site root after the flip and fails the
publish if it does not answer, so the root must be a file.

The old cluster declaration is gone too — `k8s/lux-k8s/cdn/cdn.yaml` in
`luxfi/universe` served these hosts from an in-cluster S3 bucket on DOKS, and
that account is suspended.

## Conventions

Names come from first principles. No compound words where one word says it.

`/v1/` only, on `api.*`. Never an `/api/` path segment, never a `v2`.

Secrets live in Hanzo KMS. Identity is Hanzo IAM.

Patch versions move forward one at a time. A published version is never
overwritten and never floats.
