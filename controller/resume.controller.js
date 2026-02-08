const fs = require("fs");
const path = require("path");

const RESUME_DB_PATH = path.join(__dirname, "../data/resumes.json");
const UPLOAD_DIR = path.join(__dirname, "../uploads");

const ensureStorage = () => {
  if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  if (!fs.existsSync(RESUME_DB_PATH)) fs.writeFileSync(RESUME_DB_PATH, "[]");
};

const readResumes = () => {
  ensureStorage();
  const raw = fs.readFileSync(RESUME_DB_PATH, "utf-8");
  return JSON.parse(raw || "[]");
};

const saveResumes = (data) => {
  ensureStorage();
  fs.writeFileSync(RESUME_DB_PATH, JSON.stringify(data, null, 2));
};

// ✅ GET /api/v1/resume
const getAllResumes = async (request, reply) => {
  try {
    const resumes = readResumes();
    return reply.send({
      success: true,
      total: resumes.length,
      resumes,
    });
  } catch (error) {
    return reply.code(500).send({
      success: false,
      message: "Failed to fetch resumes",
    });
  }
};

// ✅ POST /api/v1/resume/upload (ONLY ONE RESUME)
const uploadResume = async (request, reply) => {
  try {
    ensureStorage();

    const data = await request.file();

    if (!data) {
      return reply.code(400).send({
        success: false,
        message: "Resume file is required!",
      });
    }

    // only pdf allowed
    if (data.mimetype !== "application/pdf") {
      return reply.code(400).send({
        success: false,
        message: "Only PDF resume allowed!",
      });
    }

    const resumes = readResumes();

    // ✅ if old resume exists -> delete old file
    if (resumes.length > 0) {
      const oldResume = resumes[0];

      const oldPath = path.join(UPLOAD_DIR, oldResume.filename);

      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath); // delete old file
      }
    }

    // save new file
    const filename = `${Date.now()}-${data.filename}`;
    const filepath = path.join(UPLOAD_DIR, filename);

    await fs.promises.writeFile(filepath, await data.toBuffer());

    const baseUrl = "https://job-tracker-server-ln8r.onrender.com";

    // ✅ create new resume record
    const newResume = {
      id: Date.now(),
      originalName: data.filename,
      filename,
      mimetype: data.mimetype,
      uploadedAt: new Date().toISOString(),
      fileUrl: `${baseUrl}/uploads/${filename}`,
    };

    // ✅ only store one resume
    saveResumes([newResume]);

    return reply.code(201).send({
      success: true,
      message: "Resume uploaded successfully (updated)!",
      resume: newResume,
    });
  } catch (error) {
    return reply.code(500).send({
      success: false,
      message: "Resume upload failed",
      error: error.message,
    });
  }
};

module.exports = { uploadResume, getAllResumes };
