import { useState, useEffect } from "react";
import { Palette, Sparkles, AlertCircle, Github } from "lucide-react";
import { BedrockImageService } from "./services/bedrock";
import { ColorExtractionService } from "./services/colorExtraction";
import type { Moodboard } from "./utils";
import { LocalStorageService, AestheticKeywordGenerator } from "./utils";
import MoodboardGenerator from "./components/MoodboardGenerator";
import MoodboardDisplay from "./components/MoodboardDisplay";
import SavedMoodboards from "./components/SavedMoodboards";
import ConfigurationPanel from "./components/ConfigurationPanel";
import "./App.css";

function App() {
  const [currentMoodboard, setCurrentMoodboard] = useState<Moodboard | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConfigured, setIsConfigured] = useState(false);
  const [activeTab, setActiveTab] = useState<"generate" | "saved">("generate");
  const [storageService] = useState(() => new LocalStorageService());

  useEffect(() => {
    setIsConfigured(BedrockImageService.isConfigured());
  }, []);

  const generateMoodboard = async (prompt: string) => {
    if (!prompt.trim()) {
      setError("Please enter a vibe or mood description");
      return;
    }

    setIsLoading(true);
    setError(null);
    setCurrentMoodboard(null);

    try {
      const config = BedrockImageService.getConfig();
      if (!config) {
        throw new Error("AWS Bedrock credentials not configured");
      }

      const bedrockService = new BedrockImageService(config);
      const colorService = new ColorExtractionService();

      // Generate images
      const images = await bedrockService.generateImages(prompt, 4);

      if (images.length === 0) {
        throw new Error("Failed to generate any images");
      }

      // Extract color palette
      const imageUrls = images.map((img) => img.url);
      const palette = await colorService.extractPaletteFromImages(imageUrls);

      // Generate aesthetic keywords
      const keywords = AestheticKeywordGenerator.generateKeywords(
        prompt,
        palette
      );

      const moodboard: Moodboard = {
        id: `moodboard-${Date.now()}-${Math.random()
          .toString(36)
          .substr(2, 9)}`,
        prompt,
        images,
        palette,
        keywords,
        createdAt: new Date(),
      };

      setCurrentMoodboard(moodboard);

      // Auto-save to local storage
      storageService.saveMoodboard(moodboard);
    } catch (err) {
      console.error("Error generating moodboard:", err);
      setError(
        err instanceof Error ? err.message : "Failed to generate moodboard"
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!isConfigured) {
    return (
      <div className="app">
        <div className="app-header">
          <div className="header-content">
            <div className="logo">
              <Palette className="logo-icon" />
              <span>AI Moodboard Generator</span>
            </div>
          </div>
        </div>

        <div className="main-content">
          <ConfigurationPanel onConfigured={() => setIsConfigured(true)} />
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="app-header">
        <div className="header-content">
          <div className="logo">
            <Palette className="logo-icon" />
            <span>AI Moodboard Generator</span>
          </div>

          <nav className="nav-tabs">
            <button
              className={`nav-tab ${activeTab === "generate" ? "active" : ""}`}
              onClick={() => setActiveTab("generate")}
            >
              Generate
            </button>
            <button
              className={`nav-tab ${activeTab === "saved" ? "active" : ""}`}
              onClick={() => setActiveTab("saved")}
            >
              Saved Boards
            </button>
          </nav>
        </div>
      </div>

      <div className="main-content">
        {error && (
          <div className="error-banner">
            <AlertCircle className="error-icon" />
            <span>{error}</span>
            <button onClick={() => setError(null)} className="error-close">
              ×
            </button>
          </div>
        )}

        {activeTab === "generate" ? (
          <div className="generate-tab">
            <MoodboardGenerator
              onGenerate={generateMoodboard}
              isLoading={isLoading}
            />

            {currentMoodboard && (
              <MoodboardDisplay
                moodboard={currentMoodboard}
                onSave={(moodboard: Moodboard) =>
                  storageService.saveMoodboard(moodboard)
                }
              />
            )}
          </div>
        ) : (
          <SavedMoodboards
            storage={storageService}
            onSelect={setCurrentMoodboard}
          />
        )}
      </div>

      <footer className="app-footer">
        <p>
          Created by Philip Christian Juhl • Generate stunning AI moodboards instantly
        </p>
        <a
          href="https://github.com/philipcj01"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Github className="github-icon" />
          GitHub
        </a>
      </footer>
    </div>
  );
}

export default App;
