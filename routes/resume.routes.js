const { uploadResume, getAllResumes } = require("../controller/resume.controller");

async function resumeRoutes(fastify, options) {
  fastify.get("/", getAllResumes);
  fastify.post("/upload", uploadResume);
}

module.exports = resumeRoutes;
