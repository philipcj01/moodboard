import React, { useState } from "react";
import { Key, AlertTriangle, CheckCircle, ExternalLink } from "lucide-react";

interface ConfigurationPanelProps {
  onConfigured: () => void;
}

export default function ConfigurationPanel({
  onConfigured,
}: ConfigurationPanelProps) {
  const [accessKeyId, setAccessKeyId] = useState("");
  const [secretAccessKey, setSecretAccessKey] = useState("");
  const [region, setRegion] = useState("us-east-1");
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsValidating(true);

    if (!accessKeyId.trim() || !secretAccessKey.trim()) {
      setError("Please fill in all required fields");
      setIsValidating(false);
      return;
    }

    // Update environment variables (this is a simulation - in production you'd handle this differently)
    try {
      // Store credentials in sessionStorage for this session
      sessionStorage.setItem("VITE_AWS_ACCESS_KEY_ID", accessKeyId);
      sessionStorage.setItem("VITE_AWS_SECRET_ACCESS_KEY", secretAccessKey);
      sessionStorage.setItem("VITE_AWS_REGION", region);

      // Update import.meta.env for immediate use
      (window as any).__vite_env = {
        ...((window as any).__vite_env || {}),
        VITE_AWS_ACCESS_KEY_ID: accessKeyId,
        VITE_AWS_SECRET_ACCESS_KEY: secretAccessKey,
        VITE_AWS_REGION: region,
      };

      // Patch import.meta.env
      Object.defineProperty(import.meta, "env", {
        value: {
          ...import.meta.env,
          VITE_AWS_ACCESS_KEY_ID: accessKeyId,
          VITE_AWS_SECRET_ACCESS_KEY: secretAccessKey,
          VITE_AWS_REGION: region,
        },
        writable: true,
      });

      setTimeout(() => {
        setIsValidating(false);
        onConfigured();
      }, 1000);
    } catch (err) {
      setError("Failed to configure AWS credentials");
      setIsValidating(false);
    }
  };

  return (
    <div className="config-panel">
      <div className="config-container">
        <div className="config-header">
          <Key className="config-icon" />
          <h1>AWS Bedrock Configuration</h1>
          <p>
            Configure your AWS credentials to start generating AI moodboards
          </p>
        </div>

        <div className="config-warning">
          <AlertTriangle className="warning-icon" />
          <div>
            <strong>Prerequisites:</strong>
            <ul>
              <li>AWS account with Bedrock access</li>
              <li>
                Access to Titan Image Generator or Stable Diffusion models
              </li>
              <li>IAM user with bedrock:InvokeModel permissions</li>
            </ul>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="config-form">
          <div className="form-group">
            <label htmlFor="accessKeyId">AWS Access Key ID *</label>
            <input
              id="accessKeyId"
              type="text"
              value={accessKeyId}
              onChange={(e) => setAccessKeyId(e.target.value)}
              placeholder="AKIAIOSFODNN7EXAMPLE"
              className="config-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="secretAccessKey">AWS Secret Access Key *</label>
            <input
              id="secretAccessKey"
              type="password"
              value={secretAccessKey}
              onChange={(e) => setSecretAccessKey(e.target.value)}
              placeholder="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
              className="config-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="region">AWS Region</label>
            <select
              id="region"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="config-select"
            >
              <option value="us-east-1">US East (N. Virginia)</option>
              <option value="us-west-2">US West (Oregon)</option>
              <option value="eu-west-1">Europe (Ireland)</option>
              <option value="ap-southeast-1">Asia Pacific (Singapore)</option>
            </select>
          </div>

          {error && (
            <div className="config-error">
              <AlertTriangle className="error-icon" />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isValidating}
            className="config-submit"
          >
            {isValidating ? (
              <>
                <div className="spinner" />
                Configuring...
              </>
            ) : (
              <>
                <CheckCircle className="submit-icon" />
                Configure & Continue
              </>
            )}
          </button>
        </form>

        <div className="config-help">
          <h3>Need Help?</h3>
          <div className="help-links">
            <a
              href="https://docs.aws.amazon.com/bedrock/latest/userguide/getting-started.html"
              target="_blank"
              rel="noopener noreferrer"
              className="help-link"
            >
              <ExternalLink className="link-icon" />
              AWS Bedrock Setup Guide
            </a>
            <a
              href="https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html"
              target="_blank"
              rel="noopener noreferrer"
              className="help-link"
            >
              <ExternalLink className="link-icon" />
              Creating Access Keys
            </a>
          </div>
        </div>

        <div className="config-security">
          <p>
            <strong>Security Note:</strong> Your credentials are stored locally
            in your browser session and are never sent to any third-party
            servers. They're only used to communicate directly with AWS Bedrock
            APIs.
          </p>
        </div>
      </div>
    </div>
  );
}
