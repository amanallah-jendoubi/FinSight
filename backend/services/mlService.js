const axios = require ('axios');


const ML_SERVICE_URL = process.env.ML_SERVICE_URL || "http://localhost:8000";

async function predictCategoriesBatch(descriptions) {
  const response = await axios.post(
    `${ML_SERVICE_URL}/predict-category-batch`,
    { descriptions }
  );
  return response.data;
}

module.exports = { predictCategoriesBatch};
