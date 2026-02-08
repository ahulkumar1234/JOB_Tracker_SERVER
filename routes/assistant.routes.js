const { assistantController } = require("../controller/assistant.controller");

async function assistantRoutes(fastify, options) {
  fastify.post("/", assistantController);
}

module.exports = assistantRoutes;
