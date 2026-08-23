import { useState } from "react";
import { useNavigate } from "react-router-dom";
import caseService from "../../services/caseService";
import "./SmartIntake.css";

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

    if (error) {
      setError("");
    }
  };

  const handleExampleClick = (text) => {
    setDescription(text);
    setError("");
    setTouched(false);
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
    <main className="smart-intake">

      {/* PAGE HEADER */}
      <header className="smart-intake__header">
        <div>
          <p className="eyebrow">
            01. SMART INTAKE
          </p>

          <h1>
            Let&apos;s understand
            <br />
            your issue.
          </h1>

          <p className="smart-intake__intro">
            Answer a few questions and we&apos;ll
            handle the rest.
          </p>
        </div>
      </header>

      {/* MAIN WORKSPACE */}
      <section className="smart-intake__workspace">

        {/* LEFT JOURNEY */}
        <aside className="smart-intake__steps">

          <div className="smart-intake__steps-list">

            <div className="intake-step intake-step--active">
              <span className="intake-step__number">
                01
              </span>

              <div>
                <strong>
                  Tell us your issue
                </strong>

                <small>
                  What happened?
                </small>
              </div>

              <span className="intake-step__arrow">
                →
              </span>
            </div>

            <div className="intake-step">
              <span className="intake-step__number">
                02
              </span>

              <div>
                <strong>
                  About the case
                </strong>

                <small>
                  Review the details
                </small>
              </div>
            </div>

            <div className="intake-step">
              <span className="intake-step__number">
                03
              </span>

              <div>
                <strong>
                  People involved
                </strong>

                <small>
                  Parties and names
                </small>
              </div>
            </div>

            <div className="intake-step">
              <span className="intake-step__number">
                04
              </span>

              <div>
                <strong>
                  Documents
                </strong>

                <small>
                  Supporting evidence
                </small>
              </div>
            </div>

            <div className="intake-step">
              <span className="intake-step__number">
                05
              </span>

              <div>
                <strong>
                  Review & submit
                </strong>

                <small>
                  Final confirmation
                </small>
              </div>
            </div>

          </div>

          <div className="smart-intake__privacy">
            <span className="smart-intake__privacy-icon">
              ◇
            </span>

            <div>
              <strong>
                Your information is private.
              </strong>

              <p>
                We use your information only
                to understand your case.
              </p>
            </div>
          </div>

        </aside>


        {/* RIGHT FORM CARD */}
        <div className="smart-intake__card">

          <form
            onSubmit={handleSubmit}
            noValidate
          >

            <div className="smart-intake__card-top">

              <span className="smart-intake__card-label">
                STEP 01
              </span>

              <h2>
                What is your legal
                <br />
                issue about?
              </h2>

              <p>
                Explain what happened in your
                own words. No legal terminology
                is required.
              </p>

            </div>


            {/* TEXTAREA */}
            <div className="smart-intake__field">

              <label htmlFor="problem-description">
                YOUR PROBLEM
              </label>

              <div className="smart-intake__textarea-wrap">

                <textarea
                  id="problem-description"
                  value={description}
                  onChange={handleDescriptionChange}
                  onBlur={() => setTouched(true)}
                  placeholder="Type your issue in your own words..."
                  rows={7}
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

                <span className="smart-intake__voice-hint">
                  ♫
                </span>

              </div>

              <div className="smart-intake__textarea-meta">

                <span id="intake-help">
                  Include dates, notices, bills,
                  people involved or other important details.
                </span>

                <span>
                  {description.length}/5000
                </span>

              </div>

            </div>


            {/* EXAMPLES */}
            <div className="smart-intake__examples">

              <span>
                Examples
              </span>

              <div>

                <button
                  type="button"
                  onClick={() =>
                    handleExampleClick(
                      "I have not received my salary for 3 months."
                    )
                  }
                >
                  I have not received my salary for 3 months.
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleExampleClick(
                      "My electricity bill is much higher than usual."
                    )
                  }
                >
                  My electricity bill is much higher than usual.
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleExampleClick(
                      "My landlord is not returning my security deposit."
                    )
                  }
                >
                  My landlord is not returning my security deposit.
                </button>

              </div>

            </div>


            {/* LANGUAGE */}
            <div className="smart-intake__language">

              <label htmlFor="language">
                PREFERRED LANGUAGE
              </label>

              <select
                id="language"
                value={language}
                onChange={(e) =>
                  setLanguage(e.target.value)
                }
                disabled={loading}
              >
                <option value="en">
                  English
                </option>

                <option value="hi">
                  हिन्दी
                </option>
              </select>

            </div>


            {/* ERROR */}
            {(validationMessage || error) && (
              <div
                id="intake-error"
                className="smart-intake__error"
                role="alert"
                aria-live="polite"
              >
                {error || validationMessage}
              </div>
            )}


            {/* CONTINUE */}
            <div className="smart-intake__submit">

              <button
                type="submit"
                disabled={loading}
                className="smart-intake__continue"
              >
                <span>
                  {loading
                    ? "Understanding your case..."
                    : "Continue"}
                </span>

                {!loading && (
                  <span>
                    →
                  </span>
                )}
              </button>

              {loading && (
                <p
                  className="smart-intake__loading"
                  role="status"
                  aria-live="polite"
                >
                  This may take a few seconds.
                  Please don&apos;t close this page.
                </p>
              )}

            </div>

          </form>

        </div>

      </section>

      {/* BOTTOM NOTE */}
      <footer className="smart-intake__footer">

        <span>
          eSahay · Your information is secure
        </span>

        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          className="ui-secondary"
        >
          ← Back to Dashboard
        </button>

      </footer>

    </main>
  );
}

export default SmartIntake;