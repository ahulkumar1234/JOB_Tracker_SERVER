const extractFiltersFallback = (message = "") => {
  const msg = message.toLowerCase();

  const filters = {
    what: "",
    where: "",
    skills: [],
    datePosted: "anytime",
    jobType: "all",
    workMode: "all",
    clear: false,
  };

  // clear
  if (msg.includes("clear") || msg.includes("reset")) {
    filters.clear = true;
    return { filters, reply: "Cleared all filters ✅" };
  }

  // skills
  if (msg.includes("react")) filters.skills.push("React");
  if (msg.includes("node")) filters.skills.push("Node.js");
  if (msg.includes("mongodb")) filters.skills.push("MongoDB");
  if (msg.includes("express")) filters.skills.push("Express");
  if (msg.includes("tailwind")) filters.skills.push("Tailwind");
  if (msg.includes("next")) filters.skills.push("Next.js");

  // work mode
  if (msg.includes("remote")) filters.workMode = "remote";
  if (msg.includes("hybrid")) filters.workMode = "hybrid";
  if (msg.includes("onsite") || msg.includes("on-site") || msg.includes("office"))
    filters.workMode = "onsite";

  // job type
  if (msg.includes("intern")) filters.jobType = "internship";
  if (msg.includes("part time") || msg.includes("part-time"))
    filters.jobType = "part-time";
  if (msg.includes("full time") || msg.includes("full-time"))
    filters.jobType = "full-time";

  // location detection (simple)
  const cities = ["kolkata", "bangalore", "delhi", "mumbai", "pune", "hyderabad"];
  for (let city of cities) {
    if (msg.includes(city)) {
      filters.where = city;
      break;
    }
  }

  // role/title
  if (msg.includes("frontend")) filters.what = "frontend developer";
  if (msg.includes("backend")) filters.what = "backend developer";
  if (msg.includes("mern")) filters.what = "mern developer";
  if (msg.includes("developer") && !filters.what) filters.what = "developer";

  // reply message
  const applied = [];
  if (filters.what) applied.push(filters.what);
  if (filters.where) applied.push(filters.where);
  if (filters.skills.length) applied.push(filters.skills.join(", "));
  if (filters.workMode !== "all") applied.push(filters.workMode);
  if (filters.jobType !== "all") applied.push(filters.jobType);

  return {
    filters,
    reply:
      applied.length > 0
        ? `Applied filters: ${applied.join(" + ")} ✅`
        : "Applied filters ✅",
  };
};

module.exports = { extractFiltersFallback };
