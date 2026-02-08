const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");
const { z } = require("zod");
const envVariables = require("../config/envVariables");

const matchSchema = z.object({
  score: z.number().min(0).max(100),
  missingSkills: z.array(z.string()),
  summary: z.string(),
});

const extractJson = (text) => {
  if (!text) return null;

  let cleaned = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  const match = cleaned.match(/\{[\s\S]*\}/);
  if (!match) return null;

  try {
    return JSON.parse(match[0]);
  } catch (err) {
    return null;
  }
};

const getMatchScore = async ({ resumeText, jobTitle, jobDescription }) => {
  try {
    const model = new ChatGoogleGenerativeAI({
      model: "gemini-2.5-flash",
      temperature: 0.2,
      apiKey: envVariables.GEMINI_API,
    });

    const prompt = `
You are an ATS resume-job matching system.

Resume Text:
${resumeText}

Job Title:
${jobTitle}

Job Description:
${jobDescription}

IMPORTANT:
Return ONLY valid JSON. No markdown. No explanation.

Format:
{
  "score": 0-100,
  "missingSkills": ["skill1","skill2"],
  "summary": "1-2 lines"
}
`;

    const result = await model.invoke(prompt);

    const json = extractJson(result.content);

    if (!json) {
      return {
        score: 50,
        missingSkills: ["Could not parse AI output"],
        summary: "AI response was not valid JSON.",
      };
    }

    const validated = matchSchema.safeParse(json);

    if (!validated.success) {
      return {
        score: 50,
        missingSkills: ["Invalid AI JSON format"],
        summary: "AI returned invalid structure.",
      };
    }

    return validated.data;
  } catch (error) {
    console.log("MATCH SCORE ERROR =>", error.message);

    return {
      score: 50,
      missingSkills: ["Gemini API Error / Quota exceeded"],
      summary: "AI service failed. Showing fallback score.",
    };
  }
};

module.exports = { getMatchScore };
