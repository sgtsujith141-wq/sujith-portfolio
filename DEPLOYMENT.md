# Deployment

## Current state

- GitHub: `https://github.com/sgtsujith141-wq/sujith-portfolio`, default branch `main`.
- Vercel: project `sujith-portfolio` (team `phantom-6864`) is connected to that
  repository through the Vercel GitHub app. Every push to `main` creates a
  Production deployment; the GitHub API shows `vercel[bot]` deployments on the
  earlier commits.
- Production URL: `https://sujith-portfolio-two.vercel.app`.
- The Vercel CLI token cached on this machine is expired, so deployment is driven
  by the Git integration rather than `vercel deploy`.

## How a release happens

```bash
npm run check            # lint → typecheck → production build
git push origin main     # Vercel builds and promotes automatically
```

Then verify: `gh api repos/sgtsujith141-wq/sujith-portfolio/deployments` shows a
new `Production` deployment whose status becomes `success`, and the site
responds at the production URL with the new `<title>`.

## Environment variables (all optional)

| Variable | Effect |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical origin for metadata, social card and sitemap. Set this to the final domain. |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Overrides the email in `content/profile.ts`. |
| `NEXT_PUBLIC_CONTACT_PHONE` | Shows a phone card in Connect. Unset by default. |
| `NEXT_PUBLIC_RESUME_URL` | Points Resume buttons elsewhere; `off` hides them. Blank serves `/Sujith_C_Resume.pdf`. |

Blank values are treated as unset (hosts often define variables as empty strings).

## Custom domain

Add the domain in Vercel → Project → Domains, then set `NEXT_PUBLIC_SITE_URL`
to it and redeploy so the canonical URL, Open Graph URL and sitemap update.

## Local

```bash
npm install
npm run dev              # http://localhost:3000
npm run build && npm start
```

Node 20.9+ (24 used here). No secrets are required to build or run.
