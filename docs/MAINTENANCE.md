# Text Work Maintenance Guide

## Highlighting Checks

Open `text.txt` in VS Code using the `text-work` language mode. When changing a
rule, test its word in lower, upper, and mixed case where the rule is
case-insensitive. Verify that nearby numbers, quotes, URLs, tags, and list
markers are not accidentally recolored.

## List Checks

Test the following:

- `Enter` after `*`, `-`, `•`, `1.`, `a.`, and `i.`;
- `Enter` on an empty list item;
- inserting an item inside a numeric list, which must renumber later siblings on
  the same level;
- `Tab` and `Shift+Tab` on nested items;
- alphabetic rollover from `z.` to `aa.`;
- date/time dividers with `Alt+Enter` and `Shift+Alt+Enter`.

Run `npm test` for automated coverage of list parsing, continuation, cycling, and
renumbering.

## Build and Release

The version in `package.json` and `package-lock.json` must match. Record
user-visible changes in English in `CHANGELOG.md`, then build with:

```bash
vsce package
```

The `dev` branch creates prereleases. Merging into `main` publishes to the Visual
Studio Marketplace and creates a GitHub Release. The GitHub Release body must use
the matching English changelog section, not a raw commit list.

Use `$github-release-publish` for the complete PR, merge, release verification,
and release-notes workflow.

## Legacy Helpers

`scripts/update-extension.sh` and `scripts/commands.txt` contain outdated package
identifiers or versions. Do not use them without comparing them to
`package.json` and the generated VSIX filename.
