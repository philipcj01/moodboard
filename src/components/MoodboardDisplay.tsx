import { useState } from "react";
import { Download, Share2, Palette, Tag, Calendar, Copy } from "lucide-react";
import type { Moodboard } from "../utils";
import { downloadMoodboard, shareMoodboard } from "../utils";
import { ColorExtractionService } from "../services/colorExtraction";

interface MoodboardDisplayProps {
  moodboard: Moodboard;
  onSave?: (moodboard: Moodboard) => void;
}

export default function MoodboardDisplay({ moodboard }: MoodboardDisplayProps) {
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  const handleColorCopy = async (color: string) => {
    try {
      await navigator.clipboard.writeText(color);
      setCopiedColor(color);
      setTimeout(() => setCopiedColor(null), 2000);
    } catch (error) {
      console.error("Failed to copy color:", error);
    }
  };

  const handleShare = async () => {
    const shareText = shareMoodboard(moodboard);

    if (navigator.share) {
      try {
        await navigator.share({
          title: "AI Generated Moodboard",
          text: shareText,
        });
      } catch (error) {
        // Fallback to clipboard
        await navigator.clipboard.writeText(shareText);
        alert("Moodboard details copied to clipboard!");
      }
    } else {
      await navigator.clipboard.writeText(shareText);
      alert("Moodboard details copied to clipboard!");
    }
  };

  const handleDownload = () => {
    downloadMoodboard(moodboard);
  };

  return (
    <div className="moodboard-display">
      <div className="moodboard-header">
        <div className="moodboard-info">
          <h2 className="moodboard-prompt">"{moodboard.prompt}"</h2>
          <p className="moodboard-date">
            Generated on {moodboard.createdAt.toLocaleDateString()}
          </p>
        </div>

        <div className="moodboard-actions">
          <button onClick={handleShare} className="action-button share">
            <Share2 className="action-icon" />
            Share
          </button>
          <button onClick={handleDownload} className="action-button download">
            <Download className="action-icon" />
            Download
          </button>
        </div>
      </div>

      <div className="moodboard-content">
        <div className="images-section">
          <h3 className="section-title">
            <Palette className="section-icon" />
            Visual Inspiration
          </h3>
          <div className="images-grid">
            {moodboard.images.map((image, index) => (
              <div key={image.id} className="image-card">
                <img
                  src={image.url}
                  alt={`Generated image ${index + 1} for ${moodboard.prompt}`}
                  className="moodboard-image"
                  loading="lazy"
                />
                <div className="image-overlay">
                  <button
                    onClick={() => window.open(image.url, "_blank")}
                    className="image-action"
                  >
                    View Full
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="details-section">
          <div className="palette-section">
            <h3 className="section-title">Color Palette</h3>
            <div className="color-palette">
              {moodboard.palette.palette.map((color, index) => (
                <div key={index} className="color-swatch-container">
                  <button
                    className="color-swatch"
                    style={{ backgroundColor: color }}
                    onClick={() => handleColorCopy(color)}
                    title={`Click to copy ${color}`}
                  >
                    {copiedColor === color && (
                      <div className="copy-indicator">
                        <Copy className="copy-icon" />
                      </div>
                    )}
                  </button>
                  <span
                    className="color-code"
                    style={{
                      color: ColorExtractionService.getContrastColor(color),
                    }}
                  >
                    {color}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="keywords-section">
            <h3 className="section-title">Aesthetic Keywords</h3>
            <div className="keywords-grid">
              {moodboard.keywords.map((keyword, index) => (
                <span key={index} className="keyword-tag">
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="moodboard-footer">
        <div
          className="dominant-color-preview"
          style={{ backgroundColor: moodboard.palette.dominant }}
        >
          <span
            style={{
              color: ColorExtractionService.getContrastColor(
                moodboard.palette.dominant
              ),
            }}
          >
            Dominant: {moodboard.palette.dominant}
          </span>
        </div>

        <div className="stats">
          <span>{moodboard.images.length} images</span>
          <span>•</span>
          <span>{moodboard.palette.palette.length} colors</span>
          <span>•</span>
          <span>{moodboard.keywords.length} keywords</span>
        </div>
      </div>
    </div>
  );
}
