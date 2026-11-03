"""
Two Bananas Palette Analyzer & Contrast Verifier.
Demonstrating Python syntax highlighting: keywords, decorators, self, types, and numbers.
"""

from dataclasses import dataclass
from functools import lru_cache
from typing import Optional, List, Dict
import math

BRAND_YELLOW: str = "#FED141"
BRAND_BLACK: str = "#1F1F21"
TARGET_RATIO: float = 7.0  # WCAG AAA


@dataclass(frozen=True)
class ColorToken:
    name: str
    hex_code: str
    contrast_ratio: float
    is_brand_accent: bool = False

    @property
    def is_accessible(self) -> bool:
        """Verified WCAG 2.1 AAA accessibility check."""
        return self.contrast_ratio >= TARGET_RATIO


class PaletteEvaluator:
    def __init__(self, background_hex: str = BRAND_BLACK) -> None:
        self.background_hex = background_hex
        self._cache: Dict[str, float] = {}

    @lru_cache(maxsize=128)
    def compute_relative_luminance(self, hex_val: str) -> float:
        # Normalize sRGB channels
        clean_hex = hex_val.lstrip("#")
        rgb = tuple(int(clean_hex[i : i + 2], 16) / 255.0 for i in (0, 2, 4))
        
        corrected = [
            c / 12.92 if c <= 0.03928 else math.pow((c + 0.055) / 1.055, 2.4)
            for c in rgb
        ]
        return 0.2126 * corrected[0] + 0.7152 * corrected[1] + 0.0722 * corrected[2]

    def evaluate_contrast(self, foreground: str) -> float:
        l1 = self.compute_relative_luminance(foreground)
        l2 = self.compute_relative_luminance(self.background_hex)
        lighter, darker = max(l1, l2), min(l1, l2)
        return (lighter + 0.05) / (darker + 0.05)


if __name__ == "__main__":
    evaluator = PaletteEvaluator()
    ratio = evaluator.evaluate_contrast(BRAND_YELLOW)
    print(f"🍌 Brand Yellow ratio vs Black: {ratio:.2f}:1")
