# 🍌🍌 Two Bananas — VS Code Theme

**Banana Yellow `#FED141` on Brand Black `#1F1F21`.** A professionally engineered dark
theme family with mathematically derived variants, semantic highlighting, and a CI gate
that refuses to ship unreadable colors.

> Most marketplace themes render comments barely legible in bright rooms. Two Bananas
> guarantees **comments ≥ 4.5:1 (WCAG AA)** in every variant — enforced by an automated
> contrast check that runs before every release.

## Variants

| Variant | `uiTheme` | Background | For |
|---|---|---|---|
| **Two Bananas Dark** | `vs-dark` | `#1F1F21` | Everyday work |
| **Two Bananas Soft Dark** | `vs-dark` | warm-muted | Long evening sessions |
| **Two Bananas High Contrast** | `hc-black` | `#1F1F21` | AAA body text (≥ 7:1) |

<!-- Screenshots must use absolute URLs — relative paths break on the web marketplace. -->
![Two Bananas Dark](https://raw.githubusercontent.com/dbatalshikov/two-bananas-theme/main/images/screenshot-dark.png)
![Two Bananas Soft Dark](https://raw.githubusercontent.com/dbatalshikov/two-bananas-theme/main/images/screenshot-soft.png)
![Two Bananas High Contrast](https://raw.githubusercontent.com/dbatalshikov/two-bananas-theme/main/images/screenshot-hc.png)

## Palette

All ratios measured against the `#1F1F21` editor background.

| Role | Hex | Contrast |
|---|---|---|
| Brand Yellow — cursor, focus, badges, buttons, functions | `#FED141` | 11.3:1 |
| Body text (warm neutral) | `#E8E6E3` | 13.2:1 |
| Comments / secondary | `#A8A29C` | 6.5:1 |
| Gold — constants, numbers, readonly | `#F0B429` | 8.8:1 |
| Orange — tags, regex | `#F2994A` | 7.4:1 |
| Green — strings | `#A5CC6B` | 9.0:1 |
| Teal — types, classes, interfaces | `#4EC9B0` | 8.1:1 |
| Blue — properties, links, info | `#6CB6FF` | 7.7:1 |
| Purple — keywords, operators | `#C39BE8` | 7.2:1 |
| Red — errors, invalid, deleted | `#F97583` | 6.2:1 |

Yellow is deliberately reserved for **two syntax roles** (functions/methods and
decorators) plus UI brand moments — so it stays recognizable instead of becoming noise.
Red appears only where something is wrong (errors, invalid code, deletions).

## Install

**VS Code:** Extensions → search "Two Bananas" → Install, or
`ext install dbatalshikov.two-bananas-theme`.

**Cursor / VSCodium / Gitpod / Theia:** available on
[Open VSX](https://open-vsx.org/extension/dbatalshikov/two-bananas-theme).

Then: `⌘K ⌘T` → pick a Two Bananas variant.

## Recommended fonts

[JetBrains Mono](https://www.jetbrains.com/lp/mono/) ·
[Fira Code](https://github.com/tonsky/FiraCode) ·
[Berkeley Mono](https://usgraphics.com/products/berkeley-mono)

## Development

```bash
npm install
npm test            # build themes/*.json from design tokens + run the WCAG gate
npm run build:icon  # regenerate images/icon.png (128×128) from scripts/make-icon.ts
npx vsce package    # produce the .vsix
```

Everything is token-driven: edit `design-tokens.ts`, never the generated JSON.
Releases are cut by pushing a `v*.*.*` tag — CI builds, gates contrast, packages,
and publishes to both the Visual Studio Marketplace and Open VSX.

> First-time Open VSX publish requires creating the `dbatalshikov` namespace on
> open-vsx.org and signing the Eclipse Publisher Agreement.

## License

[MIT](LICENSE) © 2026 Dmitrii Batalshikov
