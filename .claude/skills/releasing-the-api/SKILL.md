---
name: releasing-the-api
description: Use when cutting a release for heart-api — choosing the version, creating and pushing a version tag, or publishing GitHub release notes.
---

# Releasing the API

## Overview

heart-api is a deployed **application** — no other repo imports it and it is not published to npm.
So tags are bare `vX.Y.Z` with no module prefix, and every tag is lightweight.

The version of record is the `version` field in `package.json`:

```json
"version": "1.5.4",
```

That is the only place a version is written. There is no hardcoded constant to go stale —
`src/controller/StatusController.ts` reports it dynamically:

```ts
const statusMessage = {
	status: 'API up and running',
	version: process.env.npm_package_version,
}
```

`npm_package_version` is injected by yarn at script launch, so `/api/v1/status` serves whatever
`package.json` shipped in the deployed build. The `package.json` string has no `v` prefix; the tag
does.

Things that are easy to get wrong here:

- **Tagging does not deploy.** Pushing a tag only re-runs the test workflow. Deployment is a
  separate, manual `yarn deploy:prod` — an rsync of `dist/` to the EC2 box — and it reads no git tag.

## Pre-flight

The default branch is `release`. Run from an up-to-date checkout of it.

```bash
grep -n '"version"' package.json
PREV=$(git tag --list 'v*' --sort=-v:refname | head -1)
git log --oneline "$PREV"..HEAD
git diff --stat "$PREV"..HEAD
yarn test
yarn lint
```

**The `package.json` version is the source of truth — read it first.** If it already names an
unreleased version (says `1.5.4` while the newest tag is `v1.5.3`), that is the version to cut.
Match it and skip the bump table.

**If the version still equals `$PREV`** — the bump has not been committed — **stop. Do not tag.**
Report which version it should become and let the user make that edit, commit it, and push.
`Updated version` is the established subject for that commit. Tagging ahead of the bump publishes a
build whose `/api/v1/status` reports the previous version. Don't make that edit yourself as part of
cutting a release.

`yarn test` and `yarn lint` must both pass before tagging. The Unit Test & Code Quality workflow
runs on `tags: v**`, so a failure becomes a permanent red check on an already-published tag.

Three things about that gate:

- `yarn test` runs under `env-cmd -e test` and needs `.env-cmdrc.json` plus `certs/jwt.key` and
  `certs/jwt.pub`, which are read at module load. Both are gitignored, so a fresh checkout without
  them fails on import rather than on an assertion.
- It can fail on coverage alone. `config/.nycrc.json` sets `check-coverage: true`, so a new
  untested file breaks the run even when every assertion passes — read that file for the current
  thresholds rather than assuming them.
- **Never run `yarn gh:test` locally.** It overwrites `.env-cmdrc.json` from `$HEART_API_TEST_ENV`
  and runs `sudo yarn test`. It exists for CI only.

## Choosing the version

Only needed when the version hasn't already been decided. Semver here describes the **HTTP API
surface** — the `/api/v1` namespace — not TypeScript identifiers.

The commit log can't decide the bump for you. History is almost entirely Renovate squash commits
(`Update dependency X to vY (#NNNN)`), and the human commits are terse and unprefixed, so this is a
judgment call about the endpoints rather than something derivable from messages.

| Bump | When |
| --- | --- |
| Patch | Dependency bumps, docs, config, internal refactors, bug fixes — no change to any request or response shape |
| Minor | New endpoint, new optional response field, opt-in behavior — backward compatible for existing clients |
| Major | Breaking change to an existing endpoint's contract. Prefer adding an `/api/v2` namespace alongside `/api/v1` over breaking v1 in place |

## Release notes

**Title:** `vX.Y.Z`, or `vX.Y.Z: Short Theme` when the release has a headline —
`v1.5.0: TS 5 > 6 Migration`, `v1.4.16: Mongoose v9 update`. Bare tag name is right for routine
releases. Don't revive the `: Dependency Updates` suffix; it was dropped after `v1.4.15`.

**Body**, in this order:

1. `## What's Changed` — one `*` bullet per human change, two-space-indented sub-bullets for
   detail. Omit this heading entirely when the release is nothing but dependency bumps.
2. Blank line, then `### PR's` — the Renovate lines as GitHub writes them
   (`* <title> by @renovate[bot] in <PR url>`), plus a hand-written `*` bullet for any bump that has
   no Renovate PR.
3. Blank line, then
   `**Full Changelog**: https://github.com/project-next/heart-api/compare/<PREV>...<NEW>`

Borrow the Renovate lines and the footer instead of retyping them. This returns the generated body
without creating anything:

```bash
gh api repos/project-next/heart-api/releases/generate-notes \
  -f tag_name=vX.Y.Z -f previous_tag_name="$PREV" --jq .body
```

Take the bot lines and the footer from that output and restructure them. Don't publish it as-is: it
files every Renovate bullet under `## What's Changed` and says nothing about what actually changed.

That generated list is not purely bot lines. A human PR shows up in it too — a release-branch merge
appears as `* v1.5.0 by @rtomyj in <PR url>`. Those don't belong under `### PR's`: summarize the
actual change as a `## What's Changed` bullet, and drop the line entirely when the PR was only a
branch sync and shipped nothing.

Use `*` for bullets, not `-`. Write `notes.md` to a scratch directory, not into the repo.

Blank lines go only before `### PR's` and before the footer — never between two `*` items. A heading
ends a list; a blank line doesn't. GitHub keeps both sides as one list and renders the whole thing
"loose", wrapping every item in a `<p>` with paragraph margins. Check the file before publishing:

```bash
awk '/^[ ]*\* /{i=1; if (g) {print "LOOSE"; exit}; next} /^$/{if (i) g=1; next} {i=g=0}' notes.md
```

No output means the list is tight.

## Sequence

Show the version, the diff, the `yarn test` and `yarn lint` results, and the drafted notes. Get
approval **once**. Then run all three steps without stopping again:

```bash
git tag vX.Y.Z <commit>          # lightweight: no -a, no -m
git push origin vX.Y.Z
gh release create vX.Y.Z --repo project-next/heart-api \
  --title "vX.Y.Z" --notes-file notes.md
```

Push the tag first. `gh release create` attaches to an existing tag but invents one from the
default branch when the tag is missing.

## Why approval comes before the push

The pushed tag is the release marker, and the GitHub Release is what announces the change to the
front ends that consume this API. Approval is the last cheap moment — after the push, a wrong
version is corrected with another release, not an edit.

## Common mistakes

- **`git tag -a`.** Every tag in this repo is lightweight (`git cat-file -t v1.5.3` → `commit`). An
  annotated tag carries a message nobody reads; the notes belong in the GitHub Release.\
- **Tagging before the version bump is committed.** The tag and the version the deployed build
  reports at `/api/v1/status` silently disagree, and nothing catches it until someone hits the
  endpoint.
- **Publishing generated notes wholesale.** That is what `v1.5.3` is: 53 Renovate bullets under
  `## What's Changed`, with no indication of what changed. Generate them to borrow the bot lines and
  the footer, then write the summary by hand.
- **Dropping the Full Changelog footer.** `v1.4.16` has none. It is the last line of every release.
- **Heading the summary `## Changes`.** `v1.4.16` does. The shape to follow is `## What's Changed`
  for human changes and `### PR's` for the bot lines.
- **Leaving Renovate lines under `## What's Changed`.** They belong under `### PR's`, so the human
  changes are readable without scrolling past the bots.
- **Running `yarn gh:test` locally.** It overwrites `.env-cmdrc.json` and runs `sudo yarn test`.
- **A blank line between `*` items.** It turns the entire list loose, so every item gets paragraph
  spacing. Copying a previous release's body is how the blank line spreads — run the `awk` check on
  `notes.md` whatever its origin.
