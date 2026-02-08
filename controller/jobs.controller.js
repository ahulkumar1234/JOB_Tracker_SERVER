const axios = require("axios");
const envVariables = require("../config/envVariables");

const isWithinDays = (createdDate, days) => {
  if (!createdDate) return true;

  const created = new Date(createdDate);
  const now = new Date();
  const diffDays = (now - created) / (1000 * 60 * 60 * 24);

  return diffDays <= days;
};

const detectJobType = (text = "") => {
  const t = text.toLowerCase();

  if (t.includes("intern")) return "Internship";
  if (t.includes("part time") || t.includes("part-time")) return "Part-time";
  if (t.includes("contract")) return "Contract";

  return "Full-time";
};

const detectWorkMode = (text = "") => {
  const t = text.toLowerCase();

  if (t.includes("remote")) return "Remote";
  if (t.includes("hybrid")) return "Hybrid";
  if (t.includes("on-site") || t.includes("onsite")) return "On-site";

  return "not-specified";
};

// GET /api/v1/jobs
const getJobs = async (request, reply) => {
  try {
    let {
      what = "developer",
      where = "india",
      page = 1,

      skills = "",
      datePosted = "anytime",
      jobType = "all",
      workMode = "all",
    } = request.query;

    const app_id = envVariables.ADZUNA_APP_ID;
    const app_key = envVariables.ADZUNA_APP_KEY;

    if (!app_id || !app_key) {
      return reply.code(400).send({
        success: false,
        message: "Adzuna API keys missing in .env",
      });
    }

   
    if (skills) {
      const skillText = skills.split(",").join(" ");
      what = `${what} ${skillText}`;
    }

    const url = `https://api.adzuna.com/v1/api/jobs/in/search/${page}?app_id=${app_id}&app_key=${app_key}&results_per_page=10&what=${encodeURIComponent(
      what
    )}&where=${encodeURIComponent(where)}`;

    const response = await axios.get(url);

    // STEP 1: map jobs + derived fields
    let jobs = response.data.results.map((job) => {
      const description = job.description || "";
      const fullText = `${job.title || ""} ${description}`;

      return {
        id: job.id,
        title: job.title,
        company: job.company?.display_name || "Unknown",
        location: job.location?.display_name || "Unknown",
        description,
        applyUrl: job.redirect_url,
        posted: job.created,

        matchScore: 0,

        // derived
        jobType: detectJobType(fullText),
        workMode: detectWorkMode(fullText),
      };
    });

    // STEP 2: Date filter
    if (datePosted !== "anytime") {
      if (datePosted === "24h") jobs = jobs.filter((j) => isWithinDays(j.posted, 1));
      if (datePosted === "week") jobs = jobs.filter((j) => isWithinDays(j.posted, 7));
      if (datePosted === "month") jobs = jobs.filter((j) => isWithinDays(j.posted, 30));
    }

    // STEP 3: JobType filter
    if (jobType !== "all") {
      jobs = jobs.filter((j) => j.jobType.toLowerCase() === jobType.toLowerCase());
    }

    // STEP 4: WorkMode filter
    if (workMode !== "all") {
      const wm = workMode === "onsite" ? "on-site" : workMode.toLowerCase();
      jobs = jobs.filter((j) => j.workMode.toLowerCase() === wm);
    }

    return reply.code(200).send({
      success: true,
      total: jobs.length,
      jobs,
      appliedFilters: { what, where, skills, datePosted, jobType, workMode },
    });
  } catch (error) {
    return reply.code(500).send({
      success: false,
      message: "Failed to fetch jobs from Adzuna",
      error: error.message,
    });
  }
};

// GET /api/v1/jobs/:id
const getJobById = async (request, reply) => {
  try {
    const { id } = request.params;

    const app_id = envVariables.ADZUNA_APP_ID;
    const app_key = envVariables.ADZUNA_APP_KEY;

    if (!app_id || !app_key) {
      return reply.code(400).send({
        success: false,
        message: "Adzuna API keys missing in .env",
      });
    }

    const url = `https://api.adzuna.com/v1/api/jobs/in/${id}?app_id=${app_id}&app_key=${app_key}`;

    const response = await axios.get(url);
    const job = response.data;

    const formattedJob = {
      id: job.id,
      title: job.title,
      company: job.company?.display_name || "Unknown",
      location: job.location?.display_name || "Unknown",
      description: job.description,
      applyUrl: job.redirect_url,
      posted: job.created,
      matchScore: 0,
      jobType: "Full-time",
      workMode: "Not specified",
    };

    return reply.send({
      success: true,
      job: formattedJob,
    });
  } catch (error) {
    return reply.code(500).send({
      success: false,
      message: "Failed to fetch job details",
      error: error.message,
    });
  }
};

module.exports = { getJobs, getJobById };
