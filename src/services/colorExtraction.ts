import ColorThief from "colorthief";

export interface ColorPalette {
  dominant: string;
  palette: string[];
  rgb: Array<[number, number, number]>;
}

export class ColorExtractionService {
  private colorThief: ColorThief;

  constructor() {
    this.colorThief = new ColorThief();
  }

  async extractColorsFromImage(imageUrl: string): Promise<ColorPalette> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";

      img.onload = () => {
        try {
          // Get dominant color
          const dominantRgb = this.colorThief.getColor(img);
          const dominant = this.rgbToHex(dominantRgb);

          // Get color palette (6 colors)
          const paletteRgb = this.colorThief.getPalette(img, 6);
          const palette = paletteRgb.map((rgb) => this.rgbToHex(rgb));

          resolve({
            dominant,
            palette,
            rgb: [dominantRgb, ...paletteRgb],
          });
        } catch (error) {
          reject(error);
        }
      };

      img.onerror = () => {
        reject(new Error("Failed to load image for color extraction"));
      };

      img.src = imageUrl;
    });
  }

  async extractPaletteFromImages(imageUrls: string[]): Promise<ColorPalette> {
    const allColors: Array<[number, number, number]> = [];

    for (const url of imageUrls) {
      try {
        const colors = await this.extractColorsFromImage(url);
        allColors.push(...colors.rgb);
      } catch (error) {
        console.warn("Failed to extract colors from image:", url, error);
      }
    }

    // Combine and deduplicate colors
    const uniqueColors = this.deduplicateColors(allColors);
    const palette = uniqueColors.slice(0, 8).map((rgb) => this.rgbToHex(rgb));
    const dominant = palette[0] || "#000000";

    return {
      dominant,
      palette,
      rgb: uniqueColors.slice(0, 8),
    };
  }

  private rgbToHex([r, g, b]: [number, number, number]): string {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  }

  private deduplicateColors(
    colors: Array<[number, number, number]>
  ): Array<[number, number, number]> {
    const unique = new Map<string, [number, number, number]>();

    for (const color of colors) {
      const key = this.rgbToHex(color);
      if (!unique.has(key)) {
        unique.set(key, color);
      }
    }

    return Array.from(unique.values());
  }

  static getContrastColor(hexColor: string): string {
    // Remove # if present
    const hex = hexColor.replace("#", "");

    // Convert to RGB
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);

    // Calculate luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    return luminance > 0.5 ? "#000000" : "#ffffff";
  }
}
