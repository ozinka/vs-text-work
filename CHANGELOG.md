# Change Log

All notable changes to the "text-work" extension will be documented in this file.

## Unreleased

### Changed
- Updated GitHub Actions and the build runtime to Node.js 24.

## [0.0.15] – Automatic list renumbering

### Added
- Inserted numeric list items now renumber subsequent items on the same level.

## [0.0.14] – QA and UAT color update

### Changed
- Moved QA and UAT to the violet word group.

## [0.0.13] – Simpler color-word rules and list improvements

### Changed
- Reorganized manually maintained highlighting words into clear color groups.
- Improved single-quote handling so apostrophes inside words do not break quoted text.
- Simplified and hardened automatic list continuation, indentation, and outdent behavior.

### Added
- Added automated tests for list logic.

## [0.0.12] – Add support for browser mode.

### Added
- Add support for browser mode.
- Refactoring highlight rules.

## [0.0.10] – Auto-bullet Fixes

### Fixed
- **Auto-bullet Priority**: Resolved an issue where pressing `Enter` would not create a new bullet point if autocompletion or Copilot suggestions were visible. Now, `Enter` always prioritizes bullet creation in list contexts.
- **Bullet Cycling**: Fixed the cycling behavior when indenting/outdenting bullets.
    - `Tab`: now cycles `1.` → `a.` → `i.` → `1.` correctly (improving logical flow).
    - `Shift+Tab`: now cycles in reverse order.
    - Addressed an issue where cycling would get stuck or behave incorrectly on Roman numerals like `i.`.

## [0.0.7] – Keywords, Password Masking, and Release Automation

### Added
- **Syntax Highlighting**:
    - Added highlighting for **weekdays** (e.g., Monday, Tuesday).
    - Added highlighting for **month names** (e.g., January, February).
    - **Password Masking**: Special highlighting to mask passwords when using specific keywords.
- **CI/CD Automation**:
    - Introduced **Dev Release** pipeline: Automatically creates pre-releases for every commit to the `Dev` branch.
    - Updated **Publish** pipeline: Now creates official GitHub Releases (with VSIX assets) alongside Marketplace publication when pushing to `main`.

## [0.0.3] – CI Pipeline Fix

### Fixed
- Fixed CI pipeline failure by ensuring `package-lock.json` is correctly tracked and updated.
- Updated CI workflow to use Node.js 20 to resolve `vsce` compatibility issues.

## [0.0.2] – Font masking support and project cleanup

### Added
- Support for the custom masking font (`PasswordMask`), enabling hiding text behind asterisks using special tags.
- Font file structure added under the `fonts/` directory (not included in the VSIX).

### Changed
- Improved project organization: separated folders for `fonts/`, `syntaxes/`, and `.github/workflows`.

### Removed
- Unnecessary repository artifacts cleaned (e.g., `.DS_Store`, old VSIX files).
