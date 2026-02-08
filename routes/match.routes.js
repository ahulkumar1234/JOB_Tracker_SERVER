const { getMatchScoreController } = require("../controller/match.controller");

async function matchRoutes(fastify, options) {
  fastify.post("/", getMatchScoreController);
}

module.exports = matchRoutes;
