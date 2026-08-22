import api from "./api";

const analyzeCase = async (problemText, language = "en") => {
  const response = await api.post("/ai/analyze", {
    problemText,
    language,
  });

  return response.data;
};

export default {
  analyzeCase,
};