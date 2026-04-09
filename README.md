# Huabei Demo Deployment Guide

## Deploy to Vercel

1. **Push to GitHub**: Export this project to your GitHub repository.
2. **Import to Vercel**: Create a new project in Vercel and import your repository.
3. **Environment Variables**:
   - Add `GEMINI_API_KEY` in Vercel's project settings.
   - You can get your key from [Google AI Studio](https://aistudio.google.com/app/apikey).
4. **Build Settings**:
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. **Deploy**: Click deploy and your app will be live!

## Local Development

```bash
npm install
npm run dev
```
