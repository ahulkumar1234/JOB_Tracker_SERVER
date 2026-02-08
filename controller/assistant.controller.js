const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");
const { extractFiltersFallback } = require("../utils/assistantFallback");
const envVariables = require("../config/envVariables");

const assistantController = async (request, reply) => {
    try {
        const { message } = request.body;

        if (!message) {
            return reply.code(400).send({
                success: false,
                message: "message required",
            });
        }

        try {
            // Gemini call
            const model = new ChatGoogleGenerativeAI({
                model: "gemini-2.5-flash",
                temperature: 0,
                apiKey: envVariables.GEMINI_API,
            });

            const prompt = `
You are an AI job assistant.
Convert user request into JSON filters.

Allowed JSON:
{
  "what": "",
  "where": "",
  "skills": [],
  "datePosted": "anytime|24h|week|month",
  "jobType": "all|full-time|part-time|contract|internship",
  "workMode": "all|remote|hybrid|onsite",
  "clear": false
}

Return ONLY JSON.
User message: ${message}
`;

            const result = await model.invoke(prompt);

            let parsed = null;
            try {
                parsed = JSON.parse(result.content);
            } catch (e) {
                // fallback
                const fb = extractFiltersFallback(message);
                return reply.send({
                    success: true,
                    filters: fb.filters,
                    reply: fb.reply,
                });
            }

            return reply.send({
                success: true,
                filters: parsed,
                reply: "Applied filters using AI",
            });
        } catch (aiError) {
            // Gemini quota / 429 fallback
            const fb = extractFiltersFallback(message);

            return reply.send({
                success: true,
                filters: fb.filters,
                reply: fb.reply + " (fallback mode)",
            });
        }
    } catch (err) {
        return reply.code(500).send({
            success: false,
            message: "Assistant failed",
            error: err.message,
        });
    }
};

module.exports = { assistantController };
