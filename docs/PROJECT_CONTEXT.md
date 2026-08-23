# Text Work Project Context

## Purpose

Text Work is a VS Code extension for ordinary `.txt` notes. It does not aim to
define a programming language. Instead, it makes free-form work notes easier to
scan by highlighting useful information such as numbers, quoted text,
abbreviations, links, tags, lists, and personally meaningful words.

## Maintenance Principle

Keep highlighting rules easy to edit without requiring TextMate grammar expertise.
Use plain terms:

- **rule group**: a small block such as `numbers` or `tags`;
- **highlight words**: the words listed inside a rule;
- **color**: the display color assigned to a matching word.

Technical grammar terms such as `scope` are implementation details, not a reason
to rename understandable groups.

## Current Features

- Numbers, currency values, UUIDs, emails, URLs, abbreviations, tags, labels, and
  punctuation.
- Double- and single-quoted text that preserves apostrophes inside words.
- Bullet, numeric, alphabetic, and Roman-numeral lists.
- List continuation, indent/outdent, and renumbering of subsequent numeric
  siblings after an inserted item.
- Date/time dividers with `Alt+Enter` and `Shift+Alt+Enter`.
- Password masking for a word before `@pass` when the PasswordMask font is
  installed.

Custom words are organized by display color in the `colorWords` block. For
example, `prod` and `done` are green, `dev` is yellow, and `qa` and `uat` are
violet.

## File Map

| Path | Purpose |
| --- | --- |
| `package.json` | VS Code manifest, commands, keybindings, and token colors. |
| `syntaxes/text-work.tmLanguage.json` | Highlighting rules and color-word lists. |
| `src/extension.js` | VS Code command handlers. |
| `src/list-utils.js` | Pure list behavior and renumbering logic. |
| `text.txt` | Comprehensive manual test file. |
| `test/list-utils.test.js` | Automated list tests. |

## Adding a Custom Word

Open `syntaxes/text-work.tmLanguage.json`, find the desired color group in
`colorWords`, and append the word to its `match` list. Choose the group only by
the color you want to see; do not create a semantic category unless it improves
editing clarity. Keep narrower rules before broad rules because earlier grammar
patterns take precedence.

## Known Boundaries

There are currently no registered VS Code snippets. The extension provides list
automation and date/time commands instead. Labels are recognized as text before
`:` at the start of a line; there is no separate heading rule.
