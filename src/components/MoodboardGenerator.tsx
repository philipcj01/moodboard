import React, { useState } from "react";
import { Wand2, Loader2 } from "lucide-react";

interface MoodboardGeneratorProps {
  onGenerate: (prompt: string) => void;
  isLoading: boolean;
}

const EXAMPLE_PROMPTS = [
  "cozy cyberpunk café",
  "ethereal forest sanctuary",
  "minimalist zen garden",
  "vibrant neon cityscape",
  "rustic bohemian living room",
  "dreamy pastel clouds",
  "industrial loft workspace",
  "tropical sunset paradise",
];

export default function MoodboardGenerator({
  onGenerate,
  isLoading,
}: MoodboardGeneratorProps) {
  const [prompt, setPrompt] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isLoading) {
      onGenerate(prompt.trim());
    }
  };

  const handleExampleClick = (example: string) => {
    setPrompt(example);
  };

  return (
    <div className="generator-container">
      <div className="generator-header">
        <h1 className="generator-title">Create Your AI Moodboard</h1>
        <p className="generator-subtitle">
          Describe a vibe, mood, or aesthetic and watch AI bring it to life
        </p>
      </div>

      <form onSubmit={handleSubmit} className="generator-form">
        <div className="input-group">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your vibe... (e.g., 'cozy cyberpunk café with neon lights and warm coffee')"
            className="prompt-input"
            rows={3}
            maxLength={200}
            disabled={isLoading}
          />
          <div className="input-footer">
            <span className="char-count">{prompt.length}/200</span>
            <button
              type="submit"
              disabled={!prompt.trim() || isLoading}
              className="generate-button"
            >
              {isLoading ? (
                <>
                  <Loader2 className="button-icon animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="button-icon" />
                  Generate Moodboard
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      <div className="examples-section">
        <h3 className="examples-title">Try these vibes:</h3>
        <div className="examples-grid">
          {EXAMPLE_PROMPTS.map((example, index) => (
            <button
              key={index}
              onClick={() => handleExampleClick(example)}
              className="example-chip"
              disabled={isLoading}
            >
              {example}
            </button>
          ))}
        </div>
      </div>

      {isLoading && (
        <div className="loading-state">
          <div className="loading-animation">
            <div className="loading-dots">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
          <p className="loading-text">Crafting your aesthetic vision...</p>
          <p className="loading-subtext">This may take 30-60 seconds</p>
        </div>
      )}
    </div>
  );
}
