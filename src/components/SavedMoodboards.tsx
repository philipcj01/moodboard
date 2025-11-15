import React, { useState, useEffect } from "react";
import {
  Trash2,
  Calendar,
  Eye,
  Search,
  FolderOpen,
  Palette,
} from "lucide-react";
import type { Moodboard, MoodboardStorage } from "../utils";

interface SavedMoodboardsProps {
  storage: MoodboardStorage;
  onSelect: (moodboard: Moodboard) => void;
}

export default function SavedMoodboards({
  storage,
  onSelect,
}: SavedMoodboardsProps) {
  const [savedMoodboards, setSavedMoodboards] = useState<Moodboard[]>([]);
  const [selectedMoodboard, setSelectedMoodboard] = useState<string | null>(
    null
  );

  useEffect(() => {
    loadMoodboards();
  }, []);

  const loadMoodboards = () => {
    const moodboards = storage.getMoodboards();
    // Sort by creation date, newest first
    moodboards.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    setSavedMoodboards(moodboards);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this moodboard?")) {
      storage.deleteMoodboard(id);
      loadMoodboards();
      if (selectedMoodboard === id) {
        setSelectedMoodboard(null);
      }
    }
  };

  const handleView = (moodboard: Moodboard, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedMoodboard(moodboard.id);
    onSelect(moodboard);
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;

    return date.toLocaleDateString();
  };

  if (savedMoodboards.length === 0) {
    return (
      <div className="saved-moodboards empty">
        <div className="empty-state">
          <Palette className="empty-icon" />
          <h2>No Saved Moodboards</h2>
          <p>Generate your first AI moodboard to see it here!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="saved-moodboards">
      <div className="saved-header">
        <h2>Your Saved Moodboards</h2>
        <p>
          {savedMoodboards.length} moodboard
          {savedMoodboards.length !== 1 ? "s" : ""} saved
        </p>
      </div>

      <div className="moodboards-grid">
        {savedMoodboards.map((moodboard) => (
          <div
            key={moodboard.id}
            className={`moodboard-card ${
              selectedMoodboard === moodboard.id ? "selected" : ""
            }`}
            onClick={() => handleView(moodboard, {} as React.MouseEvent)}
          >
            <div className="card-header">
              <h3 className="card-title" title={moodboard.prompt}>
                "{moodboard.prompt}"
              </h3>
              <button
                onClick={(e) => handleDelete(moodboard.id, e)}
                className="delete-button"
                title="Delete moodboard"
              >
                <Trash2 className="delete-icon" />
              </button>
            </div>

            <div className="card-preview">
              <div className="preview-images">
                {moodboard.images.slice(0, 4).map((image, index) => (
                  <div key={image.id} className="preview-image">
                    <img
                      src={image.url}
                      alt={`Preview ${index + 1}`}
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>

              <div className="preview-palette">
                {moodboard.palette.palette.slice(0, 6).map((color, index) => (
                  <div
                    key={index}
                    className="preview-color"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>

            <div className="card-footer">
              <div className="card-meta">
                <span className="meta-item">
                  <Calendar className="meta-icon" />
                  {formatDate(moodboard.createdAt)}
                </span>
                <span className="meta-item">
                  {moodboard.keywords.slice(0, 3).join(", ")}
                </span>
              </div>

              <button
                onClick={(e) => handleView(moodboard, e)}
                className="view-button"
              >
                <Eye className="view-icon" />
                View
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
