const fastify = require("fastify")({ logger: true });
require("dotenv").config();
const applicationsRoutes = require("./routes/applications.routes");
const multipart = require("@fastify/multipart");
const path = require("path");
const fastifyStatic = require("@fastify/static");
const cors = require("@fastify/cors");



// Routes
const jobsRoutes = require("./routes/jobs.routes");
const resumeRoutes = require("./routes/resume.routes");
const matchRoutes = require("./routes/match.routes");
const assistantRoutes = require("./routes/assistant.routes");

//for uploading resume
fastify.register(multipart);
// CORS
fastify.register(cors, {
    origin: ['*'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
});

fastify.register(fastifyStatic, {
    root: path.join(__dirname, "uploads"),
    prefix: "/uploads/",
});


// Register routes
fastify.register(jobsRoutes, { prefix: "/api/v1/jobs" });
fastify.register(resumeRoutes, { prefix: "/api/v1/resume" });
fastify.register(applicationsRoutes, { prefix: "/api/v1/applications" });
fastify.register(matchRoutes, { prefix: "/api/v1/match-score" });
fastify.register(assistantRoutes, { prefix: "/api/v1/assistant" });



// Start server
const start = async () => {
    try {
        const PORT = process.env.PORT || 5000;
        await fastify.listen({ port: PORT });
        console.log(`Server is running on port ${PORT}`);
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

start();
