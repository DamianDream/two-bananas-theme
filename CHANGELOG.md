# Changelog

All notable changes to the **Two Bananas** theme are documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] — 2026-11-03

### Added
- Initial release of the Two Bananas theme family: **Dark**, **Soft Dark**, and **High Contrast**.
- Brand palette: Banana Yellow `#FED141` on Brand Black `#171717`.
- Token-driven build pipeline (`design-tokens.ts` → `build.ts` → `themes/*.json`).
- Two-layer syntax highlighting: semantic tokens (LSP) with TextMate fallback.
- Full 16-color terminal ANSI palette and git decoration colors.
- Automated WCAG 2.1 contrast gate in CI: body text ≥ 4.5:1 (AAA 7:1 in High Contrast),
  comments ≥ 4.5:1, brand pairings (buttons, badges, status bar) ≥ 4.5:1,
  terminal ANSI ≥ 3:1.
- Dual-registry release workflow: Visual Studio Marketplace + Open VSX.
