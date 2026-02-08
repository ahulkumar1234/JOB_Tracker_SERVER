const { getJobs, getJobById } = require("../controller/jobs.controller");

async function jobsRoutes(fastify, options) {
  fastify.get("/", getJobs);
  fastify.get("/:id", getJobById);
}

module.exports = jobsRoutes;
