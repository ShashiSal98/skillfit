# Setup Guide for SkillFit

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Puter.js** (Optional for initial testing)
   
   The app currently uses localStorage as a fallback. To use Puter.js:
   
   - Sign up at [developer.puter.com](https://developer.puter.com)
   - Create a new app and get your App ID
   - Update `src/lib/puter.ts` with your Puter.js SDK configuration:
   
   ```typescript
   import { PuterSDK } from '@puter-js/sdk';
   
   // Replace the placeholder implementation with:
   const sdk = new PuterSDK({ 
     appID: 'your-app-id-here' 
   });
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Open Browser**
   Navigate to `http://localhost:5173`

## Features Overview

### 1. Authentication
- Click "Sign In with Puter.js" to authenticate
- In development mode, this uses a mock authentication

### 2. Upload Resume
- Click "Upload Resume" in navigation
- Select a PDF file (max 10MB)
- Optionally add a job description for targeted analysis
- Get instant AI-powered feedback

### 3. View Analysis
- See ATS scores and overall scores
- Review section-by-section breakdown
- Check keyword analysis
- Get improvement suggestions

### 4. Match Jobs
- Add job descriptions with requirements
- Match your resume against jobs
- See compatibility scores
- Identify matched and missing skills

## Development Notes

### PDF Processing
- Uses pdfjs-dist for PDF text extraction
- Requires PDFs with extractable text (not scanned images)
- Worker is loaded from CDN for simplicity

### AI Analysis
- Currently uses browser-based analysis algorithms
- Can be enhanced with Puter.js AI services or WebLLM
- Analyzes resume structure, keywords, and content quality

### Data Storage
- In development: Uses localStorage as fallback
- With Puter.js: Data stored securely in Puter.js cloud storage
- All data remains private and user-owned

## Troubleshooting

### PDF Upload Fails
- Ensure PDF contains extractable text (not just images)
- Check file size is under 10MB
- Verify PDF is not corrupted

### Analysis Not Working
- Check browser console for errors
- Ensure PDF text extraction succeeded
- Verify all dependencies are installed

### Puter.js Integration Issues
- Verify your App ID is correct
- Check Puter.js documentation for latest SDK usage
- Ensure you have proper authentication setup

## Next Steps

- Integrate real Puter.js SDK for production
- Add more advanced AI analysis features
- Implement resume templates
- Add export functionality for analyzed resumes
- Enhance job matching algorithms



