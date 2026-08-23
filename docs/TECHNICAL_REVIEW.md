# Technical Review and Improvement Plan

## Implemented Improvements

- Moved shared list behavior into `src/list-utils.js`.
- Fixed alphabetic list rollover (`z.` to `aa.` and `AZ.` to `BA.`).
- Validated Roman numerals and used neighboring items to resolve ambiguous markers.
- Removed an extra blank line when exiting an empty list item.
- Honored space and tab indentation preferences.
- Renumbered subsequent numeric list items on the same nesting level.
- Organized custom words by display color rather than semantic category.
- Removed the missing `#keywords` grammar include.
- Added `npm test` coverage for list behavior.

## Recommended Next Steps

| Priority | Improvement | Reason |
| --- | --- | --- |
| High | Add VS Code Extension Host tests. | Covers actual cursor positions, selections, and command interaction. |
| Medium | Add real VS Code snippets if required. | Current list automation is not a registered snippets contribution. |
| Medium | Move color-word lists to a simple editable configuration file. | Allows adding words without editing regular expressions. |
| Low | Add a command to renumber an existing selected list. | Current renumbering runs while inserting a new numeric item. |
| Low | Support multiple cursors and selections. | Current commands operate on the active cursor. |

## Performance Boundary

The extension searches upward for a previous list item only after `Enter` or
`Shift+Tab`. This linear lookup is simple and appropriate for ordinary text notes;
caching would add complexity without a practical benefit.
