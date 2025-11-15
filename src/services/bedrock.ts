import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";

export interface BedrockConfig {
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
  sessionToken?: string;
}

export interface GeneratedImage {
  id: string;
  url: string;
  base64: string;
}

export class BedrockImageService {
  private client: BedrockRuntimeClient;

  constructor(config: BedrockConfig) {
    this.client = new BedrockRuntimeClient({
      region: config.region,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
        sessionToken: config.sessionToken,
      },
    });
  }

  async generateImages(
    prompt: string,
    count: number = 4
  ): Promise<GeneratedImage[]> {
    const images: GeneratedImage[] = [];

    for (let i = 0; i < count; i++) {
      try {
        const enhancedPrompt = this.enhancePrompt(prompt);
        const image = await this.generateSingleImage(enhancedPrompt, i);
        if (image) {
          images.push(image);
        }
      } catch (error) {
        console.error(`Failed to generate image ${i + 1}:`, error);
      }
    }

    return images;
  }

  private async generateSingleImage(
    prompt: string,
    index: number
  ): Promise<GeneratedImage | null> {
    try {
      // Using Amazon Titan Image Generator
      const payload = {
        taskType: "TEXT_IMAGE",
        textToImageParams: {
          text: prompt,
          negativeText: "blurry, low quality, distorted, watermark",
        },
        imageGenerationConfig: {
          numberOfImages: 1,
          height: 512,
          width: 512,
          cfgScale: 8,
          seed: Math.floor(Math.random() * 1000000) + index,
        },
      };

      const command = new InvokeModelCommand({
        modelId: "amazon.titan-image-generator-v1",
        body: JSON.stringify(payload),
        contentType: "application/json",
        accept: "application/json",
      });

      const response = await this.client.send(command);
      const responseBody = JSON.parse(new TextDecoder().decode(response.body));

      if (responseBody.images && responseBody.images[0]) {
        const base64Image = responseBody.images[0];
        const url = `data:image/png;base64,${base64Image}`;

        return {
          id: `image-${index}-${Date.now()}`,
          url,
          base64: base64Image,
        };
      }
    } catch (error) {
      console.error("Bedrock API error:", error);

      // Fallback to Stability AI if Titan fails
      try {
        return await this.generateWithStabilityAI(prompt, index);
      } catch (fallbackError) {
        console.error("Stability AI fallback failed:", fallbackError);
        return null;
      }
    }

    return null;
  }

  private async generateWithStabilityAI(
    prompt: string,
    index: number
  ): Promise<GeneratedImage | null> {
    const payload = {
      text_prompts: [
        {
          text: prompt,
          weight: 1,
        },
        {
          text: "blurry, low quality, distorted, watermark",
          weight: -1,
        },
      ],
      cfg_scale: 7,
      height: 512,
      width: 512,
      samples: 1,
      steps: 20,
      seed: Math.floor(Math.random() * 1000000) + index,
    };

    const command = new InvokeModelCommand({
      modelId: "stability.stable-diffusion-xl-v1",
      body: JSON.stringify(payload),
      contentType: "application/json",
      accept: "application/json",
    });

    const response = await this.client.send(command);
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));

    if (responseBody.artifacts && responseBody.artifacts[0]) {
      const base64Image = responseBody.artifacts[0].base64;
      const url = `data:image/png;base64,${base64Image}`;

      return {
        id: `image-${index}-${Date.now()}`,
        url,
        base64: base64Image,
      };
    }

    return null;
  }

  private enhancePrompt(prompt: string): string {
    const styles = [
      "aesthetic",
      "artistic",
      "high quality",
      "detailed",
      "professional photography",
      "cinematic lighting",
    ];

    const randomStyle = styles[Math.floor(Math.random() * styles.length)];
    return `${prompt}, ${randomStyle}, 4k resolution`;
  }

  static isConfigured(): boolean {
    const accessKeyId =
      import.meta.env.VITE_AWS_ACCESS_KEY_ID ||
      sessionStorage.getItem("VITE_AWS_ACCESS_KEY_ID");
    const secretAccessKey =
      import.meta.env.VITE_AWS_SECRET_ACCESS_KEY ||
      sessionStorage.getItem("VITE_AWS_SECRET_ACCESS_KEY");
    const region =
      import.meta.env.VITE_AWS_REGION ||
      sessionStorage.getItem("VITE_AWS_REGION");

    return !!(accessKeyId && secretAccessKey && region);
  }

  static getConfig(): BedrockConfig | null {
    const accessKeyId =
      import.meta.env.VITE_AWS_ACCESS_KEY_ID ||
      sessionStorage.getItem("VITE_AWS_ACCESS_KEY_ID");
    const secretAccessKey =
      import.meta.env.VITE_AWS_SECRET_ACCESS_KEY ||
      sessionStorage.getItem("VITE_AWS_SECRET_ACCESS_KEY");
    const region =
      import.meta.env.VITE_AWS_REGION ||
      sessionStorage.getItem("VITE_AWS_REGION");
    const sessionToken =
      import.meta.env.VITE_AWS_SESSION_TOKEN ||
      sessionStorage.getItem("VITE_AWS_SESSION_TOKEN");

    if (!accessKeyId || !secretAccessKey || !region) {
      return null;
    }

    return {
      accessKeyId,
      secretAccessKey,
      region,
      sessionToken: sessionToken || undefined,
    };
  }
}
