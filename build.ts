/**
 * build.ts — theme builder: design-tokens.ts -> themes/*.json
 * Run: ts-node build.ts   (or npm run build:theme)
 */
import { writeFileSync, mkdirSync } from "fs";
import { buildPalette, Variant } from "./design-tokens";

type TmScope = { name?: string; scope: string | string[]; settings: { foreground?: string; fontStyle?: string } };

/** Append a 2-digit alpha suffix to a 6-digit hex. Guards against 8-digit inputs. */
function withAlpha(hex: string, alpha: string): string {
  if (hex.length !== 7) throw new Error(`withAlpha expects #rrggbb, got ${hex}`);
  return hex + alpha;
}

function workbenchColors(pal: ReturnType<typeof buildPalette>) {
  const { base, accents, brand, terminal } = pal;
  return {
    // --- Editor core ---
    "editor.background": base.bg,
    "editor.foreground": base.text,
    "editorLineNumber.foreground": base.textDisabled,
    "editorLineNumber.activeForeground": base.text,
    "editor.selectionBackground": withAlpha(accents.yellow, "33"),
    "editor.inactiveSelectionBackground": withAlpha(base.surfaceAlt, "aa"),
    "editor.lineHighlightBackground": withAlpha(base.surfaceAlt, "55"),
    "editor.findMatchBackground": withAlpha(accents.yellow, "59"),
    "editor.findMatchHighlightBackground": withAlpha(accents.yellow, "2e"),
    "editor.wordHighlightBackground": withAlpha(base.surfaceAlt, "99"),
    "editor.wordHighlightStrongBackground": withAlpha(accents.gold, "2e"),
    "editorCursor.foreground": brand.accent,
    "editorWhitespace.foreground": base.textDisabled,
    "editorIndentGuide.background1": base.surfaceAlt,
    "editorIndentGuide.activeBackground1": base.border,
    "editorBracketMatch.background": withAlpha(accents.yellow, "26"),
    "editorBracketMatch.border": withAlpha(accents.yellow, "66"),
    "focusBorder": brand.accent,

    // --- Activity bar ---
    "activityBar.background": base.surface,
    "activityBar.foreground": base.text,
    "activityBar.inactiveForeground": base.textDisabled,
    "activityBar.activeBorder": brand.accent,
    "activityBarBadge.background": brand.accent,
    "activityBarBadge.foreground": brand.onAccent,

    // --- Side bar / lists / trees ---
    "sideBar.background": base.surface,
    "sideBar.foreground": base.textMuted,
    "sideBar.border": base.border,
    "sideBarTitle.foreground": base.text,
    "sideBarSectionHeader.background": base.surface,
    "sideBarSectionHeader.foreground": base.textMuted,
    "list.activeSelectionBackground": base.surfaceAlt,
    "list.activeSelectionForeground": base.text,
    "list.inactiveSelectionBackground": withAlpha(base.surfaceAlt, "99"),
    "list.hoverBackground": withAlpha(base.surfaceAlt, "66"),
    "list.focusOutline": brand.accent,
    "list.highlightForeground": accents.yellow,
    "tree.indentGuidesStroke": base.border,

    // --- Status bar ---
    "statusBar.background": base.surface,
    "statusBar.foreground": base.textMuted,
    "statusBar.border": base.border,
    "statusBar.debuggingBackground": accents.gold,
    "statusBar.debuggingForeground": brand.onAccent,
    "statusBar.noFolderBackground": base.surface,
    "statusBarItem.remoteBackground": brand.accent,
    "statusBarItem.remoteForeground": brand.onAccent,
    "statusBarItem.prominentBackground": base.surfaceAlt,

    // --- Title bar / tabs / editor groups ---
    "titleBar.activeBackground": base.surface,
    "titleBar.activeForeground": base.text,
    "titleBar.inactiveBackground": base.surface,
    "titleBar.inactiveForeground": base.textDisabled,
    "tab.activeBackground": base.bg,
    "tab.activeForeground": base.text,
    "tab.activeBorderTop": brand.accent,
    "tab.inactiveBackground": base.surface,
    "tab.inactiveForeground": base.textMuted,
    "tab.hoverBackground": base.surfaceAlt,
    "editorGroupHeader.tabsBackground": base.surface,
    "editorGroup.border": base.border,

    // --- Buttons / inputs / dropdowns (brand moment: yellow button, dark text) ---
    "button.background": brand.accent,
    "button.foreground": brand.onAccent,
    "button.hoverBackground": accents.gold,
    "button.secondaryBackground": base.surfaceAlt,
    "button.secondaryForeground": base.text,
    "input.background": base.surface,
    "input.foreground": base.text,
    "input.border": base.border,
    "input.placeholderForeground": base.textDisabled,
    "inputOption.activeBorder": brand.accent,
    "dropdown.background": base.surface,
    "dropdown.foreground": base.text,
    "dropdown.border": base.border,
    "checkbox.background": base.surface,
    "checkbox.border": base.border,

    // --- Badges / progress ---
    "badge.background": brand.accent,
    "badge.foreground": brand.onAccent,
    "progressBar.background": brand.accent,

    // --- Panels / widgets / peek / notifications ---
    "panel.border": base.border,
    "panel.background": base.surface,
    "widget.border": base.border,
    "editorWidget.background": base.surface,
    "editorWidget.border": base.border,
    "editorSuggestWidget.background": base.surface,
    "editorSuggestWidget.selectedBackground": base.surfaceAlt,
    "editorSuggestWidget.highlightForeground": accents.yellow,
    "editorHoverWidget.background": base.surface,
    "editorHoverWidget.border": base.border,
    "peekView.border": brand.accent,
    "peekViewEditor.background": base.surface,
    "peekViewResult.background": base.surface,
    "peekViewTitle.background": base.surfaceAlt,
    "notifications.background": base.surface,
    "notifications.foreground": base.text,
    "notifications.border": base.border,
    "notificationLink.foreground": accents.blue,

    // --- Scrollbar / minimap ---
    "scrollbarSlider.background": withAlpha(base.textDisabled, "33"),
    "scrollbarSlider.hoverBackground": withAlpha(base.textDisabled, "55"),
    "scrollbarSlider.activeBackground": withAlpha(base.textDisabled, "77"),
    "minimap.selectionHighlight": withAlpha(accents.yellow, "66"),
    "minimap.findMatchHighlight": accents.yellow,

    // --- Terminal (full 16-color ANSI set) ---
    "terminal.background": base.bg,
    "terminal.foreground": base.text,
    "terminalCursor.foreground": brand.accent,
    "terminal.ansiBlack": terminal.black,
    "terminal.ansiBrightBlack": terminal.brightBlack,
    "terminal.ansiRed": terminal.red,
    "terminal.ansiBrightRed": terminal.brightRed,
    "terminal.ansiGreen": terminal.green,
    "terminal.ansiBrightGreen": terminal.brightGreen,
    "terminal.ansiYellow": terminal.yellow,
    "terminal.ansiBrightYellow": terminal.brightYellow,
    "terminal.ansiBlue": terminal.blue,
    "terminal.ansiBrightBlue": terminal.brightBlue,
    "terminal.ansiMagenta": terminal.magenta,
    "terminal.ansiBrightMagenta": terminal.brightMagenta,
    "terminal.ansiCyan": terminal.cyan,
    "terminal.ansiBrightCyan": terminal.brightCyan,
    "terminal.ansiWhite": terminal.white,
    "terminal.ansiBrightWhite": terminal.brightWhite,

    // --- Git decorations ---
    "gitDecoration.modifiedResourceForeground": accents.gold,
    "gitDecoration.addedResourceForeground": accents.green,
    "gitDecoration.deletedResourceForeground": accents.red,
    "gitDecoration.untrackedResourceForeground": accents.green,
    "gitDecoration.ignoredResourceForeground": base.textDisabled,
    "gitDecoration.conflictingResourceForeground": accents.orange,

    // --- Diff editor ---
    "diffEditor.insertedTextBackground": withAlpha(accents.green, "22"),
    "diffEditor.removedTextBackground": withAlpha(accents.red, "22"),
    "diffEditor.insertedLineBackground": withAlpha(accents.green, "15"),
    "diffEditor.removedLineBackground": withAlpha(accents.red, "15"),

    // --- Diagnostics ---
    "editorError.foreground": accents.red,
    "editorWarning.foreground": accents.gold,
    "editorInfo.foreground": accents.blue,
    "problemsErrorIcon.foreground": accents.red,
    "problemsWarningIcon.foreground": accents.gold,
    "problemsInfoIcon.foreground": accents.blue,
  };
}

/** Classic TextMate scopes — required as fallback for languages without an LSP
 *  (Shell, YAML, TOML, INI, Dockerfile, CSS…). */
function tokenColors(pal: ReturnType<typeof buildPalette>): TmScope[] {
  const { accents, comment, base } = pal;
  return [
    { name: "Comment", scope: ["comment", "punctuation.definition.comment"], settings: { foreground: comment, fontStyle: "italic" } },
    { name: "String", scope: ["string", "string.quoted"], settings: { foreground: accents.green } },
    { name: "Number/Boolean/Constant", scope: ["constant.numeric", "constant.language", "constant.character"], settings: { foreground: accents.gold } },
    { name: "Keyword/Control flow", scope: ["keyword", "keyword.control", "storage.type", "storage.modifier"], settings: { foreground: accents.purple } },
    { name: "Function/Method call", scope: ["entity.name.function", "support.function"], settings: { foreground: accents.yellow } },
    { name: "Class/Type name (fallback)", scope: ["entity.name.type", "entity.name.class", "support.type"], settings: { foreground: accents.teal } },
    { name: "Variable", scope: ["variable", "variable.other"], settings: { foreground: base.text } },
    { name: "Property/Attribute", scope: ["variable.other.property", "entity.other.attribute-name"], settings: { foreground: accents.blue } },
    { name: "Punctuation", scope: ["punctuation", "punctuation.separator", "punctuation.terminator"], settings: { foreground: base.textMuted } },
    { name: "Operator", scope: ["keyword.operator"], settings: { foreground: accents.purple } },
    { name: "Tag (HTML/JSX/Vue)", scope: ["entity.name.tag"], settings: { foreground: accents.orange } },
    { name: "Markup heading (Markdown)", scope: ["markup.heading"], settings: { foreground: accents.yellow, fontStyle: "bold" } },
    { name: "Regex", scope: ["string.regexp"], settings: { foreground: accents.orange } },
    { name: "Invalid", scope: ["invalid", "invalid.illegal"], settings: { foreground: accents.red } },
  ];
}

/** Semantic Token Coloring — overrides TextMate wherever the LSP provides exact
 *  semantics (TypeScript, Python, Rust, Go, JSON with schema). */
function semanticTokenColors(pal: ReturnType<typeof buildPalette>) {
  const { accents, base, comment } = pal;
  return {
    enabled: true,
    rules: {
      "namespace": accents.teal,
      "class": accents.teal,
      "interface": { foreground: accents.teal, fontStyle: "italic" },
      "enum": accents.teal,
      "enumMember": accents.gold,
      "type": accents.teal,
      "typeParameter": { foreground: accents.teal, fontStyle: "italic" },
      "struct": accents.teal,
      "function": accents.yellow,
      "function.defaultLibrary": { foreground: accents.yellow, fontStyle: "italic" },
      "method": accents.yellow,
      "decorator": accents.yellow,
      "macro": accents.purple,
      "parameter": { foreground: base.text, fontStyle: "italic" },
      "variable": base.text,
      "variable.readonly": accents.gold,
      "variable.readonly.defaultLibrary": { foreground: accents.gold, fontStyle: "italic" },
      "property": accents.blue,
      "property.readonly": accents.gold,
      "selfParameter": { foreground: accents.red, fontStyle: "italic" },
      "keyword": accents.purple,
      "comment": { foreground: comment, fontStyle: "italic" },
      "string": accents.green,
      "number": accents.gold,
      "*.declaration": { fontStyle: "" },
      "*.readonly": { foreground: accents.gold },
      "*.deprecated": { fontStyle: "strikethrough" },
    },
  };
}

function buildOne(variant: Variant, label: string, uiTheme: "vs-dark" | "hc-black") {
  const pal = buildPalette(variant);
  const theme = {
    name: label,
    type: uiTheme === "hc-black" ? "hcDark" : "dark",
    semanticHighlighting: true,
    colors: workbenchColors(pal),
    tokenColors: tokenColors(pal),
    semanticTokenColors: semanticTokenColors(pal).rules,
  };
  mkdirSync("themes", { recursive: true });
  const file = `themes/${variant}-color-theme.json`;
  writeFileSync(file, JSON.stringify(theme, null, 2));
  console.log(`✔ built ${file}`);
}

buildOne("dark", "Two Bananas Dark", "vs-dark");
buildOne("soft", "Two Bananas Soft Dark", "vs-dark");
buildOne("hc", "Two Bananas High Contrast", "hc-black");
