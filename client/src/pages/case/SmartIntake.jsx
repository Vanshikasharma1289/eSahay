import { useState } from "react";
import { useNavigate } from "react-router-dom";
import caseService from "../../services/caseService";

function SmartIntake() {
  const navigate = useNavigate();

  const [description, setDescription] = useState("");
  const [language, setLanguage] = useState("en");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [touched, setTouched] = useState(false);

  const MIN_LENGTH = 20;

  const getValidationError = () => {
    const text = description.trim();

    if (!text) {
      return "Please describe your problem first.";
    }

    if (text.length < MIN_LENGTH) {
      return `Please provide a little more detail (at least ${MIN_LENGTH} characters).`;
    }

    return "";
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);

    // Clear the error as soon as the user starts correcting it.
    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setTouched(true);

    const validationError = getValidationError();

    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    setLoading(true);

    try {
      const data = await caseService.analyzeCase(
        description.trim(),
        language
      );

      if (!data?.success || !data?.data) {
        setError(
          data?.message ||
            "We couldn't understand your case. Please try again."
        );
        return;
      }

      sessionStorage.setItem(
        "esahay_ai_result",
        JSON.stringify(data.data)
      );

      navigate("/case/summary");
    } catch (error) {
      console.error("[Smart Intake Error]:", error);

      if (error.response?.status === 401) {
        setError(
          "Your session has expired. Please log in again."
        );
        return;
      }

      if (error.response?.status >= 500) {
        setError(
          "Our AI service is temporarily unavailable. Please try again in a moment."
        );
        return;
      }

      setError(
        error.response?.data?.message ||
          "Something went wrong while analyzing your case. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const validationMessage =
    touched && !loading ? getValidationError() : "";

  return (
    <main>
      <header>
        <p>01. SMART INTAKE</p>

        <h1>Tell us what happened.</h1>

        <p>
          Describe your problem in your own words. You don't need
          legal terminology.
        </p>
      </header>

      <form onSubmit={handleSubmit} noValidate>
        <div>
          <label htmlFor="problem-description">
            DESCRIBE YOUR PROBLEM
          </label>

          <textarea
            id="problem-description"
            value={description}
            onChange={handleDescriptionChange}
            onBlur={() => setTouched(true)}
            placeholder="For example: My electricity bill is almost three times higher than usual..."
            rows={8}
            maxLength={5000}
            disabled={loading}
            aria-invalid={Boolean(
              validationMessage || error
            )}
            aria-describedby={
              validationMessage || error
                ? "intake-error"
                : "intake-help"
            }
          />

          <div>
            <span id="intake-help">
              Include important details such as dates,
              notices, bills, people involved, or what happened.
            </span>

            <span>
              {description.length}/5000
            </span>
          </div>
        </div>

        <div>
          <label htmlFor="language">
            PREFERRED LANGUAGE
          </label>

          <select
            id="language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            disabled={loading}
          >
            <option value="en">English</option>
            <option value="hi">हिन्दी</option>
          </select>
        </div>

        {(validationMessage || error) && (
          <div
            id="intake-error"
            role="alert"
            aria-live="polite"
          >
            {error || validationMessage}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Understanding your case..."
            : "Continue"}
        </button>

        {loading && (
          <p role="status" aria-live="polite">
            This may take a few seconds. Please don't close
            this page.
          </p>
        )}
      </form>
    </main>
  );
}

export default SmartIntake;