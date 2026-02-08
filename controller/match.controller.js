const path = require("path");
const fs = require("fs");

const extractResumeText = require("../utils/extractResumeText.utils");
const { getMatchScore } = require("../services/matchScore.service");

const RESUME_DB_PATH = path.join(__dirname, "../data/resumes.json");
const UPLOAD_DIR = path.join(__dirname, "../uploads");

const readResumes = () => {
  if (!fs.existsSync(RESUME_DB_PATH)) return [];
  const raw = fs.readFileSync(RESUME_DB_PATH, "utf-8");
  return JSON.parse(raw || "[]");
};

const getMatchScoreController = async (request, reply) => {
  try {
    const { jobTitle, jobDescription } = request.body;

    if (!jobTitle || !jobDescription) {
      return reply.code(400).send({
        success: false,
        message: "jobTitle and jobDescription required",
      });
    }

    const resumes = readResumes();
    if (resumes.length === 0) {
      return reply.code(400).send({
        success: false,
        message: "No resume uploaded yet!",
      });
    }

    const resume = resumes[0];
    const resumePath = path.join(UPLOAD_DIR, resume.filename);

    const resumeText = await extractResumeText(resumePath);

    const aiResult = await getMatchScore({
      resumeText,
      jobTitle,
      jobDescription,
    });

    return reply.send({
      success: true,
      match: aiResult,
    });
  } catch (error) {
    return reply.code(500).send({
      success: false,
      message: "Match score failed",
      error: error.message,
    });
  }
};

module.exports = { getMatchScoreController };
