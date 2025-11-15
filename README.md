# 🎨 AI Moodboard Generator

A stunning React + Vite application that generates beautiful moodboards using AWS Bedrock's AI image generation capabilities. Create aesthetic visual inspiration boards with automatically extracted color palettes and AI-generated keywords.

![AI Moodboard Generator](https://img.shields.io/badge/AI-Moodboard%20Generator-purple?style=for-the-badge&logo=react)

## ✨ Features

- **🤖 AI-Powered Image Generation**: Generate 4 unique images using AWS Bedrock (Titan Image Generator & Stability AI)
- **🎨 Automatic Color Extraction**: Extract beautiful color palettes from generated images
- **🏷️ Smart Keyword Generation**: AI-generated aesthetic keywords based on your prompt
- **💾 Local Storage**: Save moodboards locally in your browser
- **📱 Responsive Design**: Beautiful, modern UI that works on all devices
- **⬇️ Download & Share**: Export moodboards as JSON or share via native sharing
- **🔒 Secure**: Credentials stored locally, never sent to third parties

## 🚀 Live Demo

Try different vibes like:
- "cozy cyberpunk café"
- "ethereal forest sanctuary" 
- "minimalist zen garden"
- "vibrant neon cityscape"

## 📋 Prerequisites

**⚠️ Important: You must have your own AWS account to use this application.**

### AWS Requirements:
1. **AWS Account** with Bedrock access
2. **IAM User** with the following permissions:
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": [
           "bedrock:InvokeModel"
         ],
         "Resource": [
           "arn:aws:bedrock:*::foundation-model/amazon.titan-image-generator-v1",
           "arn:aws:bedrock:*::foundation-model/stability.stable-diffusion-xl-v1"
         ]
       }
     ]
   }
   ```
3. **Model Access**: Enable access to these models in AWS Bedrock console:
   - Amazon Titan Image Generator V1
   - Stability AI SDXL 1.0 (fallback)

### Supported AWS Regions:
- `us-east-1` (N. Virginia) - Recommended
- `us-west-2` (Oregon)  
- `eu-west-1` (Ireland)
- `ap-southeast-1` (Singapore)

## 🛠️ Installation & Setup

### 1. Clone & Install
```bash
git clone <repository-url>
cd moodboard
npm install
```

### 2. Configure AWS Credentials

Create a `.env` file in the root directory:
```bash
# Copy from .env.example
cp .env.example .env
```

Edit `.env` with your AWS credentials:
```env
VITE_AWS_ACCESS_KEY_ID=your_access_key_here
VITE_AWS_SECRET_ACCESS_KEY=your_secret_key_here
VITE_AWS_REGION=us-east-1
```

### 3. Start Development Server
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## 🔧 Configuration Guide

### Getting AWS Credentials

1. **Sign in to AWS Console**
2. **Go to IAM → Users → Create User**
3. **Attach the Bedrock policy** (see Prerequisites)
4. **Create Access Keys** in Security Credentials tab
5. **Copy Access Key ID and Secret Access Key**

### Enabling Bedrock Models

1. **Go to AWS Bedrock Console**
2. **Navigate to Model Access**
3. **Request access to:**
   - Amazon Titan Image Generator V1
   - Stability AI SDXL 1.0
4. **Wait for approval** (usually instant)

## 🎯 Usage

### Generate a Moodboard
1. Enter a vibe description (e.g., "dreamy pastel clouds")
2. Click "Generate Moodboard" 
3. Wait 30-60 seconds for AI generation
4. Explore your generated images, colors, and keywords!

### Save & Manage
- Moodboards auto-save to local storage
- View all saved moodboards in the "Saved Boards" tab
- Delete unwanted moodboards
- Download as JSON files

### Share Your Creations
- Use the Share button for native sharing
- Copy moodboard details to clipboard
- Download for external use

## 🏗️ Architecture

### Tech Stack
- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Custom CSS with modern design
- **AI**: AWS Bedrock (Titan + Stability AI)
- **Color Extraction**: ColorThief library
- **Icons**: Lucide React
- **Storage**: Browser localStorage

### Key Components
- `MoodboardGenerator`: Input and generation UI
- `MoodboardDisplay`: Results visualization  
- `SavedMoodboards`: Storage management
- `ConfigurationPanel`: AWS setup
- `BedrockImageService`: AI image generation
- `ColorExtractionService`: Palette extraction

## 🎨 Features in Detail

### AI Image Generation
- Uses Amazon Titan Image Generator as primary model
- Falls back to Stability AI SDXL for reliability
- Generates 4 unique 512x512 images per prompt
- Enhanced prompts for better aesthetic results

### Color Palette Extraction  
- Extracts dominant colors from all generated images
- Combines and deduplicates color palettes
- Click any color to copy hex code to clipboard
- Smart contrast detection for readable text

### Aesthetic Keywords
- AI-generated keywords based on prompt analysis
- Color-based keywords (warm, cool, pastel, etc.)
- Mood and style detection
- Texture and theme identification

## 🔒 Security & Privacy

- **Local Storage Only**: All data stays in your browser
- **Direct AWS Communication**: No third-party servers involved
- **Credential Safety**: Keys never logged or transmitted externally
- **Session-Based**: Credentials cleared when browser closes

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy Options
- **Vercel**: Connect GitHub repo for auto-deploy
- **Netlify**: Drag & drop build folder
- **AWS S3 + CloudFront**: Host on AWS infrastructure
- **GitHub Pages**: Enable in repository settings

### Environment Variables for Production
Set these in your hosting platform:
```
VITE_AWS_ACCESS_KEY_ID=your_key
VITE_AWS_SECRET_ACCESS_KEY=your_secret  
VITE_AWS_REGION=us-east-1
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## ⚠️ Important Notes

- **AWS Costs**: Bedrock usage incurs charges (~$0.008-0.040 per image)
- **Rate Limits**: AWS has API rate limits; avoid rapid-fire generation
- **Model Availability**: Ensure models are available in your chosen region
- **Browser Compatibility**: Modern browsers required for full functionality

## 🐛 Troubleshooting

### Common Issues

**"AWS Bedrock credentials not configured"**
- Check your `.env` file has correct credentials
- Verify credentials work in AWS CLI: `aws bedrock list-foundation-models`

**"Failed to generate images"**  
- Ensure Bedrock models are enabled in AWS console
- Check AWS region supports your chosen models
- Verify IAM permissions include `bedrock:InvokeModel`

**Images not loading**
- Check browser console for CORS errors
- Ensure images are valid base64 data
- Try refreshing the page

### Getting Help

- Check AWS Bedrock documentation
- Verify IAM permissions
- Test credentials with AWS CLI
- Check browser developer console for errors

## 🌟 Inspiration

This project demonstrates the power of combining modern web technologies with AI capabilities. Perfect for:
- Designers seeking inspiration
- Content creators building visual brands  
- Anyone exploring AI-generated art
- Learning modern React + AWS integration

---

**Made with 💜 using React, AWS Bedrock, and lots of aesthetic vibes**
