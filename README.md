# SkillFit - AI-Powered Resume Analyzer & Job Match System
<img width="1891" height="942" alt="Screenshot 2025-12-12 235948" src="https://github.com/user-attachments/assets/e3ef6d64-1f9c-4e09-99b3-9dc1afc22993" />

A modern, scalable, and serverless Resume Analyzer built with Puter.js that helps users upload resumes, evaluate them using AI, match candidates to job descriptions, and receive detailed ATS-style feedback - all directly in the browser with no backend required.

## 🚀 Features

- **Resume Upload & Analysis**: Upload PDF resumes and get instant AI-powered feedback
- **ATS Scoring**: Calculate Applicant Tracking System compatibility scores
- **Job Matching**: Match your resume with job descriptions and get compatibility scores
- **AI-Powered Feedback**: Receive detailed analysis on strengths, weaknesses, and improvement suggestions
- **Privacy First**: All data is stored securely using Puter.js - you maintain full ownership
- **Serverless**: No backend, no servers - everything runs in the browser
- **Modern UI**: Beautiful, responsive interface built with React and Tailwind CSS

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Routing**: React Router
- **PDF Parsing**: pdfjs-dist
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Serverless Platform**: Puter.js

## 📋 Prerequisites

- Node.js 20+
- npm or yarn

## 🏃 Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd skillfit
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## 📖 Usage

### Upload and Analyze Resume

1. Click "Upload Resume" in the navigation
2. Select a PDF resume file
3. Optionally add a job description for targeted analysis
4. Click "Upload & Analyze Resume"
5. View detailed analysis including:
   - ATS Score
   - Overall Score
   - Section-by-section breakdown
   - Strengths and weaknesses
   - Keyword analysis
   - Improvement suggestions

### Match with Jobs

1. Go to "Job Matching" page
2. Add job descriptions by filling in:
   - Job Title
   - Company (optional)
   - Job Description
   - Requirements (one per line)
3. Click "Match Jobs" to see compatibility scores
4. Review match results showing:
   - Match percentage
   - Matched skills
   - Missing skills
   - Detailed analysis

### Manage Your Data

- All resumes and job descriptions are automatically saved
- Use "Clear Data" button in the header to delete all data
- Your data is stored securely and privately via Puter.js

## 🎯 Key Features Explained

### ATS Scoring

The ATS (Applicant Tracking System) score evaluates:
- Contact information presence
- Summary/Objective section
- Work experience documentation
- Skills section completeness
- Education section
- Keyword optimization
- Overall formatting and structure

### AI Analysis

The AI analyzer provides:
- Section-by-section scoring
- Keyword extraction and matching
- Content quality assessment
- Actionable improvement suggestions
- Strength and weakness identification

### Job Matching

The matching algorithm considers:
- Keyword overlap between resume and job description
- Skills alignment
- Requirements matching
- ATS compatibility
- Overall fit score

## 🔒 Privacy & Security

- **No Backend**: All processing happens in your browser
- **Local Storage**: Data is stored using Puter.js's secure storage
- **User Ownership**: You maintain full control and ownership of your data
- **No Tracking**: No analytics or tracking scripts

## 🚧 Development

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Lint Code

```bash
npm run lint
```

## 📝 Notes

- The Puter.js integration is currently using a placeholder implementation. In production, you'll need to:
  - Set up a Puter.js account
  - Configure the Puter.js SDK with your app ID
  - Update the `src/lib/puter.ts` file with actual SDK calls

- PDF parsing requires the PDF file to contain extractable text (not scanned images)

- AI analysis uses browser-based algorithms. For more advanced AI capabilities, you can integrate Puter.js AI services or other browser-compatible AI APIs


## 📄 License

This project is open source and available under the MIT License.

---




