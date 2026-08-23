# Repository Guidelines

## Project Structure & Module Organization

This repository is a VS Code extension for enhanced plain-text editing.

- `package.json` registers the `text-work` language, commands, keybindings, and
  token colors.
- `syntaxes/text-work.tmLanguage.json` contains syntax-highlighting rules.
  Keep manually maintained words in the `colorWords` groups by display color.
- `src/extension.js` connects VS Code commands to editor behavior.
- `src/list-utils.js` contains pure list parsing, continuation, and renumbering
  logic; prefer adding list behavior here rather than duplicating it in commands.
- `test/list-utils.test.js` contains Node's built-in test cases.
- `text.txt` is the comprehensive manual highlighting test file; `test.txt`
  is an older compact sample.
- `fonts/`, `imgs/`, and `.github/workflows/` hold packaged assets and CI.

## Build, Test, and Development Commands

- `npm test` — runs the Node test suite with `node --test`.
- `vsce package` — builds `text-work-<version>.vsix` in the repository root.
- `code --install-extension text-work-<version>.vsix --force` — installs a local
  build for manual testing; reload the VS Code window afterward.

Before packaging, confirm the version in `package.json`, `package-lock.json`,
and `CHANGELOG.md` agree.

## Coding Style & Naming Conventions

Use JavaScript with two-space indentation, semicolons, `const` by default, and
small focused functions. Code comments must be in English. Name command handlers
with verbs, for example `handleEnter`; name pure helpers by their result, for
example `nextMarker`.

Use readable grammar group names such as `greenWords` and token scopes such as
`text-work.green-words`. Put narrow matching rules before broad ones. Preserve
apostrophes inside words when changing single-quote rules.

## Language Policy

All repository-facing content must be written in English: source code, code
comments, documentation, commit messages, pull-request descriptions, changelog
entries, and GitHub Release notes. Ukrainian is acceptable only in chat
communication with the repository owner.

## Testing Guidelines

Add or update a test in `test/list-utils.test.js` for every list-logic change.
Use descriptive names such as `renumbers subsequent numeric siblings`. Run
`npm test`, validate JSON files, and manually inspect `text.txt` in VS Code for
highlighting changes, including quotes, URLs, tags, lists, and passwords.

## Commits, Pull Requests, and Releases

Use concise imperative commit subjects, for example `Fix list renumbering` or
`Release text work 0.0.15`. Develop on `dev` and open a PR into `main`.
Include a clear summary, validation performed, and screenshots for visual syntax
changes when useful.

Update `CHANGELOG.md` for user-visible changes. The publish workflow creates the
release after merging to `main`; ensure its GitHub Release body uses the matching
changelog section rather than only commit messages.
