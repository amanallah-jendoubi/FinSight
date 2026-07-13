const axios = require('axios');

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || "http://localhost:8001";
const ML_TIMEOUT_MS = 10000;

async function predictCategoriesBatch(transactions) {
  try {
    const response = await axios.post(
      `${ML_SERVICE_URL}/predict-category-batch`,
      { transactions },
      { timeout: ML_TIMEOUT_MS }
    );
    return response.data; // { results: [...] }
  } catch (err) {
    if (err.response) {
      // Le service ML a répondu avec une erreur (ex: 422 payload invalide)
      throw new Error(`ML service error (${err.response.status}): ${JSON.stringify(err.response.data)}`);
    }
    // Pas de réponse du tout — service down, timeout, DNS...
    throw new Error(`ML service unreachable: ${err.message}`);
  }
}

module.exports = { predictCategoriesBatch };
