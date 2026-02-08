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

### 1️⃣ Clone Repo
```
git clone <your-repo-url>
cd job-tracker/server
```
### 2️⃣ Install Dependencies

```
npm install
```
### Create ```.env```
#### Create a ```.env``` file in ```/server```
```
PORT=8000

ADZUNA_APP_ID=your_adzuna_app_id
ADZUNA_APP_KEY=your_adzuna_app_key

GEMINI_API_KEY=your_gemini_api_key
```
### ▶️ Run Backend
```
npm run dev
```
#### Backend will run at:
```
http://localhost:8000
```
### http://localhost:8000
```
server/
 ├── src/
 │    ├── server.js
 │
 │    ├── routes/
 │    │    ├── Jobs.routes.js
 │    │    ├── applications.routes.js
 │    │    ├── Resume.routes.js
 │    │    ├── assistant.routes.js
 │    │    ├── match.routes.js
 │
 │    ├── controller/
 │    │    ├── jobs.controller.js
 │    │    ├── applications.controller.js
 │    │    ├── resume.controller.js
 │    │    ├── assistant.controller.js
 │    │    ├── match.controller.js
 │
 │    ├── services/
 │    │    ├── matchScore.service.js
 │    │    ├── assistant.service.js
 │
 │    ├── utils/
 │    │    ├── extractResumeText.utils.js
 │
 ├── uploads/
 ├── data/
 │    ├── applications.json
 │    ├── resumes.json
 ├── package.json
 ├── README.md
```

## 🔗 API Endpoints

### ✅ Jobs

- GET /api/v1/jobs
-Query params:
- what
- where
- page
- skills
- datePosted
- jobType
- workMod

#### Example:

```
GET /api/v1/jobs?what=react&where=india&page=1&skills=node,mongodb&jobType=full-time&workMode=remote

```

### ✅ Job Details

- ```GET /api/v1/jobs/:id```

### ✅ Applications

- ```GET /api/v1/applications```
- ```POST /api/v1/applications```
- ```PATCH /api/v1/applications/:id/status```
- ```DELETE /api/v1/applications/:id```

### ✅ Resume

- ```GET /api/v1/resume```
- ```POST /api/v1/resume/upload```

#### Resume file saved at:
```
http://localhost:8000/uploads/<filename>
```

### ✅ Match Score (AI)

- ```POST /api/v1/match-score```

Body:
```json
{
  "jobTitle": "MERN Developer",
  "jobDescription": "..."
}
```

### ✅ AI Assistant

- ```POST /api/v1/assistant```

#### Body:
```json
{
  "message": "Remote React jobs in Bangalore"
}
```
## ⚠️ Important Notes
### 1️⃣ Gemini Quota Issue

#### If you see:
```
- 429 Too Many Requests
- Quota exceeded
```
#### Then Gemini API free tier quota is finished.

#### Solution:

- Enable billing
- Or reduce requests
- Or add caching in backend


## 2️⃣ CORS Fix (DELETE issue)

#### Make sure Fastify CORS allows methods:
```json

fastify.register(cors, {
  origin: "*",
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"]
});

```
## 👤 Author

### Rahul Kumar
- 📧 Email: rahulkumar8340527941@gmail.com

- 🔗 LinkedIn: https://www.linkedin.com/in/rahul-kumar-3990b618b

- 💻 GitHub: https://github.com/ahulkumar1234

## ⭐ Future Improvements

- MongoDB integration
- Authentication (Login/Register)
- Saved jobs feature
- AI caching (match score stored per job)
- Better resume parsing (OCR support)
- Deployment (Render / Railway / Vercel)