import React, { useState, useEffect, useMemo } from "react";
import { ThemeProvider, BananaTokens } from "@two-bananas/core";

export interface ThemeMetrics {
  readonly contrastRatio: number;
  readonly luminance: number;
  readonly isAccessible: boolean;
}

/**
 * Two Bananas Design System — Showcase Component
 * Demonstrating semantic LSP highlights and WCAG 2.1 AAA contrast.
 */
export class BananaEngine {
  private static readonly VERSION = "1.0.0";
  private activeTheme: string = "Two Bananas Dark";

  constructor(public readonly author: string) {}

  @memoize()
  public evaluateToken(name: string, hex: string): ThemeMetrics {
    const luminance = this.calculateLuminance(hex);
    const contrastRatio = (luminance + 0.05) / 0.05;

    // High contrast verification gate
    return {
      contrastRatio: Number(contrastRatio.toFixed(2)),
      luminance,
      isAccessible: contrastRatio >= 4.5,
    };
  }

  /** @deprecated Use evaluateToken instead */
  public legacyCheck(hex: string): boolean {
    return hex.startsWith("#");
  }

  private calculateLuminance(hex: string): number {
    const clean = hex.replace("#", "");
    const rgb = parseInt(clean, 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = rgb & 0xff;
    return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  }
}

export const BananaShowcase: React.FC<{ themeId: string }> = ({ themeId }) => {
  const [metrics, setMetrics] = useState<ThemeMetrics | null>(null);
  const engine = useMemo(() => new BananaEngine("DBA"), []);

  useEffect(() => {
    const result = engine.evaluateToken("Brand Yellow", "#FED141");
    setMetrics(result);
  }, [engine, themeId]);

  return (
    <div className="banana-card" data-variant="dark">
      <header className="banana-header">
        <h1>🍌 Two Bananas Theme</h1>
        <span className="badge">WCAG AAA</span>
      </header>
      <section className="metrics-grid">
        <p>Contrast: <strong>{metrics?.contrastRatio ?? "..."}:1</strong></p>
        <button onClick={() => console.log("Theme switched")}>
          Switch Theme
        </button>
      </section>
    </div>
  );
};
