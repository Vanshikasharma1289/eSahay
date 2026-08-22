import { useState } from "react";
import { useNavigate } from "react-router-dom";
import caseService from "../../services/caseService";

function SmartIntake() {
  const navigate = useNavigate();

  const [description, setDescription] = useState("");
  const [language, setLanguage] = useState("en");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!description.trim()) {
      setError("Please describe your problem first.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const data = await caseService.analyzeCase(
        description,
        language
      );

      if (data.success) {
        // Temporarily store AI result
        sessionStorage.setItem(
          "esahay_ai_result",
          JSON.stringify(data.data)
        );

        navigate("/case/summary");
      } else {
        setError(data.message || "Unable to analyze your case.");
      }
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Something went wrong while analyzing your case."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <h1>Tell us what happened.</h1>

      <p>
        Describe your problem in your own words. You don't need
        legal terminology.
      </p>

      <form onSubmit={handleSubmit}>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your problem..."
          rows={8}
          disabled={loading}
        />

        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          disabled={loading}
        >
          <option value="en">English</option>
          <option value="hi">हिन्दी</option>
        </select>

        {error && <p>{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Understanding your case..." : "Continue"}
        </button>
      </form>
    </main>
  );
}

export default SmartIntake;