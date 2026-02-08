const dotenv = require('dotenv');
dotenv.config();

const envVariables = {
    PORT: process.env.PORT,
    ADZUNA_APP_KEY: process.env.ADZUNA_API,
    ADZUNA_APP_ID: process.env.ADZUNA_ID,
    GEMINI_API: process.env.GEMINI_API
}



module.exports = envVariables;