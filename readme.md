# Job Tracker (Backend)

AI-powered Job Tracking Platform backend built using **Fastify + Node.js**.

This backend:
- Fetches jobs from Adzuna API
- Stores job applications locally (JSON database)
- Uploads & serves resume PDF
- Extracts resume text
- Uses Gemini AI (LangChain) for:
  - Resume vs Job match scoring
  - AI assistant that controls frontend filters

---

## 🚀 Tech Stack

- Node.js
- Fastify
- Adzuna Jobs API
- JSON file storage (`applications.json`, `resumes.json`)
- @fastify/multipart (file upload)
- @fastify/static (serve resume file)
- LangChain
- Gemini API (`@langchain/google-genai`)
- Zod (schema validation)

---

## 📌 Features

### ✅ Jobs API (Adzuna)
- Fetch jobs by:
  - what (title/keyword)
  - where (location)
  - page
  - skills
  - datePosted
  - jobType
  - workMode

### ✅ Job Details API
- Fetch job details using job ID

### ✅ Applications Tracker
- Save job applications
- Prevent duplicate applications
- Update status
- Delete application

### ✅ Resume Upload
- Upload PDF resume
- Only ONE resume stored
- If new resume uploaded → old one deleted + replaced
- Resume file is served publicly from `/uploads/...`

### ✅ Resume Text Extraction
- Extract text from uploaded resume PDF using `pdf-parse`

### ✅ AI Match Score
- Resume text + Job description → AI match result
- Returns:
  - score (0–100)
  - missingSkills
  - summary

### ✅ AI Assistant (Conversational)
User message → AI returns filters like:

Example:
- "Remote React jobs in Bangalore"

Response:
```json
{
  "filters": {
    "skills": ["React"],
    "workMode": "remote",
    "where": "Bangalore"
  },
  "replyMessage": "Applied filters: React + Remote + Bangalore"
}
```
## ⚙️ Setup Instructions
