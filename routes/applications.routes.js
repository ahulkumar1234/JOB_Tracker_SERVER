const { getApplications, addApplication, updateStatus, deleteApplication, } = require("../controller/applications.controller");



async function applicationsRoutes(fastify, options) {

    fastify.get("/", getApplications);

    fastify.post("/", addApplication);

    fastify.patch("/:id/status", updateStatus);

    fastify.delete("/:id", deleteApplication);
}

module.exports = applicationsRoutes;
