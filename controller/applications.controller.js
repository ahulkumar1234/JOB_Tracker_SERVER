const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "..", "data", "applications.json");

// Helper functions
const readApplications = () => {
  try {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, "[]");
      return [];
    }

    const data = fs.readFileSync(filePath, "utf-8");

    if (!data.trim()) return [];

    return JSON.parse(data);
  } catch (err) {
    // fallback
    return [];
  }
};

const writeApplications = (apps) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(apps, null, 2));
  } catch (err) {
    console.log("WRITE ERROR:", err.message);
    return reply.code(500).send({ success: false, message: "Server error" });
  }
};

// GET all applications
const getApplications = async (request, reply) => {
  try {
    const apps = readApplications();
    return reply.send({ success: true, applications: apps });
  } catch (error) {
    return reply.code(500).send({ success: false, message: "Server error" });
  }
};

// POST add application
const addApplication = async (request, reply) => {
  try {
    const { jobId, title, company, location, applyUrl } = request.body;

    if (!jobId || !title || !company) {
      return reply.code(400).send({
        success: false,
        message: "jobId, title, company are required",
      });
    }

    const apps = readApplications();

    // Prevent duplicate apply
    const alreadyApplied = apps.find((a) => String(a.jobId) === String(jobId));
    if (alreadyApplied) {
      return reply.code(409).send({
        success: false,
        message: "Already applied for this job",
      });
    }

    const newApp = {
      id: Date.now(), // unique id
      jobId,
      title,
      company,
      location: location || "Not specified",
      applyUrl: applyUrl || "",
      status: "Applied",
      appliedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    apps.unshift(newApp);
    writeApplications(apps);

    return reply.code(201).send({
      success: true,
      message: "Application saved",
      application: newApp,
    });
  } catch (error) {
    return reply.code(500).send({ success: false, message: "Server error" });
  }
};

// PATCH update status
const updateStatus = async (request, reply) => {
  try {
    const { id } = request.params;
    const { status } = request.body;

    if (!status) {
      return reply.code(400).send({
        success: false,
        message: "status is required",
      });
    }

    const apps = readApplications();

    const index = apps.findIndex((a) => String(a.id) === String(id));
    if (index === -1) {
      return reply.code(404).send({
        success: false,
        message: "Application not found",
      });
    }

    apps[index].status = status;
    apps[index].updatedAt = new Date().toISOString();

    writeApplications(apps);

    return reply.send({
      success: true,
      message: "Status updated",
      application: apps[index],
    });
  } catch (error) {
    return reply.code(500).send({ success: false, message: "Server error" });
  }
};

// DELETE application
const deleteApplication = async (request, reply) => {
  try {
    const { id } = request.params;

    const apps = readApplications();
    const before = apps.length;

    const filtered = apps.filter((a) => String(a.id) !== String(id));

    if (filtered.length === before) {
      return reply.code(404).send({
        success: false,
        message: "Application not found",
      });
    }

    writeApplications(filtered);

    return reply.send({
      success: true,
      message: "Application removed",
    });
  } catch (error) {
    return reply.code(500).send({ success: false, message: "Server error" });
  }
};

module.exports = {
  getApplications,
  addApplication,
  updateStatus,
  deleteApplication,
};
