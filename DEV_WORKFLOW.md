# BrandPulse Development Workflow

## Branches

| Branch | Purpose | Deploy URL |
|--------|---------|------------|
| `main` | Production — always deployable | https://brandpulse.app |
| `feature/<name>` | Individual features — branched from `main` | Auto-preview URL from Netlify |

## Feature Workflow

```
1. Create feature branch from main
   git checkout main
   git pull
   git checkout -b feature/my-feature

2. Build the feature
   - Work on feature/my-feature
   - Commit and push
   - Netlify creates a preview deploy

3. Review
   - Open the preview URL
   - Test the feature
   - Iterate if needed
   - Run `npm run build` before opening a PR

4. Merge to main
   git checkout main
   git pull
   git merge feature/my-feature
   git push
   - Netlify auto-deploys to production

5. Clean up
   git branch -d feature/my-feature
```

## Rollback

If something breaks in production:

**Option A — Netlify UI (fastest):**
1. Go to Netlify → Deploys
2. Find the last working deploy
3. Click "Publish deploy"

**Option B — Git revert:**
```
git log --oneline           # find the bad commit
git revert <commit-sha>     # revert it
git push                    # auto-deploys revert
```

## Deploy Verification

After merging to main, check deploy status with:
```
netlify api listSiteDeploys -d '{"site_id": "SITE_ID", "per_page": 3}'
```

Look for:
- Latest deploy has `state: "ready"`
- It matches the commit SHA that was just pushed
- Production site loads correctly in both dark and light themes

## Branch Naming

- Features: `feature/short-kebab-name` (e.g., `feature/calendar-view`)
- Bug fixes: `fix/short-kebab-name` (e.g., `fix/sidebar-overflow`)
- Experiments: `experiment/short-kebab-name` (e.g., `experiment/ai-chat`)
- Content cleanup: `cleanup/short-kebab-name` (e.g., `cleanup/brand-references`)

## Specs

Before building a feature, create a spec in `.trae/specs/<feature-name>/` with:
- `spec.md` — what we're building and why
- `tasks.md` — implementation breakdown
- `checklist.md` — verification checklist

Use `/spec` command in TRAE to start a new spec. Review and approve before building.

## Brand Cleanup Workflow — Legacy codebase references

Any remaining code references to the legacy codebase name are migration-only items. Do **not** add new legacy naming strings. If you encounter a leftover:

1. Replace text references with "BrandPulse" (product) or a fictional customer brand per the content cleanup spec (Lumina Wellness, Velocity Athletics, Nexora, AUREA Studio).
2. Replace Figma logo images with public SVG brand assets.
3. Run `npm run build` + verify no regressions.
4. Add a note in the PR description.
