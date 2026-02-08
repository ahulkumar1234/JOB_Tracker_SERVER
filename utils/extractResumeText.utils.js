const fs = require("fs");

const extractResumeText = async (pdfPath) => {
  const buffer = fs.readFileSync(pdfPath);


  const pdfParse = require("pdf-parse");

  const data = await pdfParse(buffer);

  return data.text || "";
};

module.exports = extractResumeText;
