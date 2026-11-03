/**
 * design-tokens.ts
 * Single Source of Truth for every Two Bananas theme variant.
 * Primitives -> Semantic roles -> (in build.ts) VS Code Theme JSON.
 *
 * Brand canon: Brand Yellow #FED141 on Brand Black #1F1F21.
 */
import { colord, extend } from "colord";
import a11yPlugin from "colord/plugins/a11y";
import mixPlugin from "colord/plugins/mix";
extend([a11yPlugin, mixPlugin]);

export type Variant = "dark" | "soft" | "hc";

/** 1. PRIMITIVES — raw colors, no semantic meaning.
 *  All contrast ratios below are vs #1F1F21 (editor background). */
const primitives = {
  banana: {
    bg0: "#1f1f21", // Brand Black — editor background
    bg1: "#1a1a1c", // chrome: sidebar / activity bar / status bar / title bar / panel
    bg2: "#2a2a2e", // line highlight, hover, inactive selection
    bg3: "#3a393d", // borders, separators
    fg0: "#e8e6e3", // body text, warm neutral (13.2:1)
    fg1: "#a8a29c", // secondary text / comments (6.5:1)
    fg2: "#6e6a64", // disabled / line numbers / placeholders
    accentYellow: "#fed141", // Brand Yellow (11.3:1) — cursor, focus, badges, functions
    accentGold: "#f0b429", //   constants, numbers, readonly (8.8:1)
    accentOrange: "#f2994a", // tags, regex, modified (7.4:1)
    accentGreen: "#a5cc6b", //  strings (9.0:1)
    accentTeal: "#4ec9b0", //   types, classes, interfaces (8.1:1)
    accentBlue: "#6cb6ff", //   properties, links, info (7.7:1)
    accentPurple: "#c39be8", // keywords, operators (7.2:1)
    accentRed: "#f97583", //    errors, invalid, deleted (6.2:1)
  },
} as const;

/** Brand constants — referenced directly for on-accent pairings (buttons, badges). */
export const brand = {
  accent: "#fed141",
  onAccent: "#1f1f21",
} as const;

/** Full 16-color ANSI set for the integrated terminal.
 *  Fixed hexes (not derived) for deterministic output. */
const terminalAnsi = {
  black: "#1f1f21",
  brightBlack: "#7a756e",
  red: "#f97583",
  brightRed: "#ff8a95",
  green: "#a5cc6b",
  brightGreen: "#b8e07e",
  yellow: "#fed141",
  brightYellow: "#ffe084",
  blue: "#6cb6ff",
  brightBlue: "#8cc8ff",
  magenta: "#c39be8",
  brightMagenta: "#d9b8f5",
  cyan: "#4ec9b0",
  brightCyan: "#6fe0ca",
  white: "#e8e6e3",
  brightWhite: "#ffffff",
} as const;

/** 2. Soft/Muted variant via color math. Warm anchor so Soft keeps the warm cast. */
function toSoft(hex: string, towards = "#2b2a27", amount = 0.18) {
  return colord(hex).mix(towards, amount).toHex();
}

/** 3. High Contrast variant (boost contrast to the required ratio). */
function toHighContrast(fg: string, bg: string, minRatio = 7): string {
  let c = colord(fg);
  // Move away from the background: lighten on dark backgrounds, darken on light ones.
  const bgIsDark = colord(bg).isDark();
  let guard = 0;
  while (c.contrast(bg) < minRatio && guard < 40) {
    c = bgIsDark ? colord(c.lighten(0.03).toHex()) : colord(c.darken(0.03).toHex());
    guard++;
  }
  return c.toHex();
}

/** 4. SEMANTIC ROLES — reusable names the builder refers to. */
export function buildPalette(variant: Variant) {
  const p = primitives.banana;
  const base = variant === "soft"
    ? {
        bg: toSoft(p.bg0), surface: toSoft(p.bg1), surfaceAlt: toSoft(p.bg2),
        border: toSoft(p.bg3), text: toSoft(p.fg0, "#2b2a27", 0.08), textMuted: toSoft(p.fg1),
        textDisabled: p.fg2,
      }
    : { bg: p.bg0, surface: p.bg1, surfaceAlt: p.bg2, border: p.bg3, text: p.fg0, textMuted: p.fg1, textDisabled: p.fg2 };

  const accents: Record<"yellow" | "gold" | "orange" | "green" | "teal" | "blue" | "purple" | "red", string> = {
    yellow: p.accentYellow, gold: p.accentGold, orange: p.accentOrange,
    green: p.accentGreen, teal: p.accentTeal, blue: p.accentBlue,
    purple: p.accentPurple, red: p.accentRed,
  };

  const terminal: Record<string, string> = { ...terminalAnsi };

  if (variant === "hc") {
    base.text = toHighContrast(base.text, base.bg, 7);
    base.textMuted = toHighContrast(base.textMuted, base.bg, 4.5);
    (Object.keys(accents) as (keyof typeof accents)[]).forEach((k) => {
      accents[k] = toHighContrast(accents[k], base.bg, 4.5);
    });
    // Terminal foreground colors get the same treatment; backgrounds stay untouched.
    for (const k of Object.keys(terminal)) {
      if (k === "black") continue; // ANSI black is a background-level color by design
      terminal[k] = toHighContrast(terminal[k], base.bg, 4.5);
    }
  }

  return { base, accents, brand, terminal, comment: base.textMuted, invisible: base.textDisabled };
}
