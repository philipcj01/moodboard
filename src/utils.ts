import type { GeneratedImage } from "./services/bedrock";
import type { ColorPalette } from "./services/colorExtraction";

export interface Moodboard {
  id: string;
  prompt: string;
  images: GeneratedImage[];
  palette: ColorPalette;
  keywords: string[];
  createdAt: Date;
}

export interface MoodboardStorage {
  saveMoodboard(moodboard: Moodboard): void;
  getMoodboards(): Moodboard[];
  deleteMoodboard(id: string): void;
  clearAll(): void;
}

export class LocalStorageService implements MoodboardStorage {
  private readonly STORAGE_KEY = "ai-moodboards";

  saveMoodboard(moodboard: Moodboard): void {
    const moodboards = this.getMoodboards();
    const existingIndex = moodboards.findIndex((m) => m.id === moodboard.id);

    if (existingIndex >= 0) {
      moodboards[existingIndex] = moodboard;
    } else {
      moodboards.push(moodboard);
    }

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(moodboards));
  }

  getMoodboards(): Moodboard[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) return [];

      const parsed = JSON.parse(stored);
      return parsed.map((m: any) => ({
        ...m,
        createdAt: new Date(m.createdAt),
      }));
    } catch (error) {
      console.error("Failed to load moodboards from localStorage:", error);
      return [];
    }
  }

  deleteMoodboard(id: string): void {
    const moodboards = this.getMoodboards().filter((m) => m.id !== id);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(moodboards));
  }

  clearAll(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}

export class AestheticKeywordGenerator {
  private static readonly AESTHETIC_KEYWORDS = {
    moods: [
      "dreamy",
      "cozy",
      "ethereal",
      "vibrant",
      "serene",
      "dramatic",
      "whimsical",
      "elegant",
      "rustic",
      "modern",
    ],
    styles: [
      "minimalist",
      "maximalist",
      "vintage",
      "futuristic",
      "bohemian",
      "industrial",
      "organic",
      "geometric",
      "abstract",
      "realistic",
    ],
    themes: [
      "nature",
      "urban",
      "celestial",
      "oceanic",
      "forest",
      "desert",
      "cosmic",
      "architectural",
      "floral",
      "mechanical",
    ],
    colors: [
      "monochromatic",
      "pastel",
      "neon",
      "earth tones",
      "jewel tones",
      "muted",
      "bold",
      "warm",
      "cool",
      "neutral",
    ],
    textures: [
      "smooth",
      "rough",
      "glossy",
      "matte",
      "metallic",
      "organic",
      "crystalline",
      "fabric",
      "paper",
      "stone",
    ],
  };

  static generateKeywords(prompt: string, palette: ColorPalette): string[] {
    const keywords = new Set<string>();
    const lowerPrompt = prompt.toLowerCase();

    // Extract keywords from prompt
    Object.values(this.AESTHETIC_KEYWORDS).forEach((categoryWords) => {
      categoryWords.forEach((word) => {
        if (lowerPrompt.includes(word)) {
          keywords.add(word);
        }
      });
    });

    // Add color-based keywords
    const colorKeywords = this.getColorKeywords(palette);
    colorKeywords.forEach((keyword) => keywords.add(keyword));

    // Add prompt-based keywords
    const promptKeywords = this.extractPromptKeywords(prompt);
    promptKeywords.forEach((keyword) => keywords.add(keyword));

    // Ensure we have at least 5 keywords
    if (keywords.size < 5) {
      const randomKeywords = this.getRandomKeywords(5 - keywords.size);
      randomKeywords.forEach((keyword) => keywords.add(keyword));
    }

    return Array.from(keywords).slice(0, 10);
  }

  private static getColorKeywords(palette: ColorPalette): string[] {
    const keywords: string[] = [];

    // Analyze dominant color
    const dominant = palette.dominant;
    if (this.isWarmColor(dominant)) keywords.push("warm");
    if (this.isCoolColor(dominant)) keywords.push("cool");
    if (this.isDarkColor(dominant)) keywords.push("dark");
    if (this.isLightColor(dominant)) keywords.push("light");

    // Check palette diversity
    if (palette.palette.length > 5) keywords.push("colorful");
    if (this.isMonochromatic(palette)) keywords.push("monochromatic");
    if (this.hasPastelColors(palette)) keywords.push("pastel");

    return keywords;
  }

  private static extractPromptKeywords(prompt: string): string[] {
    const words = prompt.toLowerCase().split(/\s+/);
    return words
      .filter(
        (word) =>
          word.length > 3 &&
          !["with", "and", "the", "for", "from", "that", "this"].includes(word)
      )
      .slice(0, 3);
  }

  private static getRandomKeywords(count: number): string[] {
    const allKeywords = Object.values(this.AESTHETIC_KEYWORDS).flat();
    const shuffled = allKeywords.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }

  private static isWarmColor(hex: string): boolean {
    const rgb = this.hexToRgb(hex);
    return rgb.r > rgb.b && rgb.r + rgb.g > rgb.b * 1.5;
  }

  private static isCoolColor(hex: string): boolean {
    const rgb = this.hexToRgb(hex);
    return rgb.b > rgb.r && rgb.b + rgb.g > rgb.r * 1.5;
  }

  private static isDarkColor(hex: string): boolean {
    const rgb = this.hexToRgb(hex);
    const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
    return luminance < 0.5;
  }

  private static isLightColor(hex: string): boolean {
    return !this.isDarkColor(hex);
  }

  private static isMonochromatic(palette: ColorPalette): boolean {
    // Simple check: if all colors have similar hue
    return palette.palette.length <= 3;
  }

  private static hasPastelColors(palette: ColorPalette): boolean {
    return palette.palette.some((color) => {
      const rgb = this.hexToRgb(color);
      const avg = (rgb.r + rgb.g + rgb.b) / 3;
      return avg > 180; // Light colors
    });
  }

  private static hexToRgb(hex: string): { r: number; g: number; b: number } {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : { r: 0, g: 0, b: 0 };
  }
}

export function downloadMoodboard(moodboard: Moodboard): void {
  const data = {
    prompt: moodboard.prompt,
    images: moodboard.images.map((img) => img.url),
    palette: moodboard.palette.palette,
    keywords: moodboard.keywords,
    createdAt: moodboard.createdAt.toISOString(),
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `moodboard-${moodboard.id}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function shareMoodboard(moodboard: Moodboard): string {
  return (
    `🎨 AI Moodboard: "${moodboard.prompt}"\n\n` +
    `✨ Vibe: ${moodboard.keywords.slice(0, 5).join(", ")}\n` +
    `🎯 Colors: ${moodboard.palette.palette.slice(0, 5).join(", ")}\n\n` +
    `Generated with AI Moodboard Generator`
  );
}
