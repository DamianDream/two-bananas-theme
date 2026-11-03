/**
 * contrast-check.ts — WCAG 2.1 CI gate.
 * Exits 1 if body text, comments, or brand-moment pairings miss their threshold.
 * Uses colord().contrast() — the WCAG 2.0/2.1 relative-luminance algorithm.
 * Algorithm source: https://www.npmjs.com/package/colord (a11y plugin)
 */
import { readFileSync } from "fs";
import { colord, extend } from "colord";
import a11yPlugin from "colord/plugins/a11y";
extend([a11yPlugin]);

type Rule = { path: string; fgKey: string; bgKey: string; minRatio: number; label: string };

const THEMES = [
  "themes/dark-color-theme.json",
  "themes/soft-color-theme.json",
  "themes/hc-color-theme.json",
];

/** Strip an optional 2-digit alpha suffix — contrast is checked on the base color. */
function solid(hex: string): string {
  return hex.length === 9 ? hex.slice(0, 7) : hex;
}

const rules: Rule[] = [
  { path: THEMES[0], fgKey: "editor.foreground", bgKey: "editor.background", minRatio: 4.5, label: "Dark: body text" },
  { path: THEMES[1], fgKey: "editor.foreground", bgKey: "editor.background", minRatio: 4.5, label: "Soft: body text" },
  { path: THEMES[2], fgKey: "editor.foreground", bgKey: "editor.background", minRatio: 7, label: "HC: body text (AAA)" },
];

// Brand moments must stay legible in every variant.
for (const path of THEMES) {
  rules.push(
    { path, fgKey: "button.foreground", bgKey: "button.background", minRatio: 4.5, label: `${path} button` },
    { path, fgKey: "badge.foreground", bgKey: "badge.background", minRatio: 4.5, label: `${path} badge` },
    { path, fgKey: "statusBar.foreground", bgKey: "statusBar.background", minRatio: 4.5, label: `${path} status bar` },
  );
}

let failed = false;

for (const rule of rules) {
  const theme = JSON.parse(readFileSync(rule.path, "utf-8"));
  const fg = solid(theme.colors[rule.fgKey]);
  const bg = solid(theme.colors[rule.bgKey]);
  const ratio = colord(fg).contrast(bg);
  const ok = ratio >= rule.minRatio;
  console.log(`${ok ? "✅" : "❌"} ${rule.label}: ${ratio.toFixed(2)}:1 (need ≥ ${rule.minRatio}:1) [${fg} on ${bg}]`);
  if (!ok) failed = true;
}

// Comments get a dedicated check per theme: readable comments are a stated
// differentiator of this theme family (≥ 4.5:1, full WCAG AA).
for (const path of THEMES) {
  const theme = JSON.parse(readFileSync(path, "utf-8"));
  const bg = solid(theme.colors["editor.background"]);
  const commentRule = theme.tokenColors.find((r: any) =>
    (Array.isArray(r.scope) ? r.scope : [r.scope]).includes("comment")
  );
  if (commentRule?.settings?.foreground) {
    const ratio = colord(commentRule.settings.foreground).contrast(bg);
    const ok = ratio >= 4.5;
    console.log(`${ok ? "✅" : "❌"} ${path} comments: ${ratio.toFixed(2)}:1`);
    if (!ok) failed = true;
  }
}

// Terminal ANSI colors (except black, which is background-level by design)
// must clear the 3:1 graphics threshold against the terminal background.
for (const path of THEMES) {
  const theme = JSON.parse(readFileSync(path, "utf-8"));
  const bg = solid(theme.colors["terminal.background"]);
  let ansiOk = true;
  for (const [key, value] of Object.entries(theme.colors) as [string, string][]) {
    if (!key.startsWith("terminal.ansi") || key === "terminal.ansiBlack") continue;
    const ratio = colord(solid(value)).contrast(bg);
    if (ratio < 3) {
      console.log(`❌ ${path} ${key}: ${ratio.toFixed(2)}:1 (need ≥ 3:1)`);
      ansiOk = false;
      failed = true;
    }
  }
  if (ansiOk) console.log(`✅ ${path} terminal ANSI set ≥ 3:1 (excluding ansiBlack)`);
}

if (failed) {
  console.error("\n🚫 WCAG contrast check failed — fix palette before release.");
  process.exit(1);
} else {
  console.log("\n🎉 All contrast checks passed.");
}
