import api from "../../services/api";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function CaseFollowUp() {
  const navigate = useNavigate();

  const [caseData, setCaseData] = useState(null);
  const [responseText, setResponseText] = useState("");
  const [analysis, setAnalysis] = useState(null);

  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);

  const [error, setError] = useState("");
  const [inputError, setInputError] = useState("");

  useEffect(() => {
    const storedData =
      sessionStorage.getItem("esahay_ai_result");

    if (!storedData) {
      setError(
        "Your case information is no longer available. Please start your case again."
      );
      setLoading(false);
      return;
    }

    try {
      const parsedData = JSON.parse(storedData);

      if (!parsedData || typeof parsedData !== "object") {
        throw new Error("Invalid case data");
      }

      setCaseData(parsedData);
    } catch (error) {
      console.error(
        "Failed to read case data:",
        error
      );

      setError(
        "We couldn't load the case information."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const handleAnalyseResponse = async () => {
    const text = responseText.trim();

    if (!text) {
      setInputError(
        "Please enter the response received from the authority."
      );
      return;
    }

    setInputError("");
    setError("");
    setAnalyzing(true);
    setAnalysis(null);

    try {
      /*
       * Send the authority response to the backend.
       *
       * The backend can later use Gemini/AI to analyse
       * whether the original issue was resolved and
       * what the citizen should do next.
       */

      const response = await api.post(
        "/ai/analyze-response",
        {
          authorityResponse: text,
          originalCase: caseData,
        }
      );

      const result = response.data?.data;

      if (!result) {
        throw new Error(
          "No analysis was returned."
        );
      }

      setAnalysis(result);

      sessionStorage.setItem(
        "esahay_case_response",
        JSON.stringify({
          response: text,
          analysis: result,
        })
      );
    } catch (error) {
      console.error(
        "Response analysis failed:",
        error
      );

      setError(
        error.response?.data?.message ||
          "We couldn't analyse the authority's response right now. Please try again."
      );
    } finally {
      setAnalyzing(false);
    }
  };

  const handleResolved = () => {
    sessionStorage.setItem(
      "esahay_case_status",
      "resolved"
    );

    navigate("/case/track");
  };

  const handleFurtherAction = () => {
    sessionStorage.setItem(
      "esahay_case_status",
      "action-needed"
    );

    navigate("/case/track");
  };

  const handleStartAgain = () => {
    sessionStorage.removeItem(
      "esahay_ai_result"
    );

    sessionStorage.removeItem(
      "esahay_case_status"
    );

    sessionStorage.removeItem(
      "esahay_case_response"
    );

    navigate("/case/intake");
  };

  if (loading) {
    return (
      <main className="case-follow-up">
        <p role="status" aria-live="polite">
          Loading your case...
        </p>
      </main>
    );
  }

  if (error && !caseData) {
    return (
      <main className="case-follow-up">
        <header>
          <p>08. CASE FOLLOW-UP</p>

          <h1>
            We couldn't load your case.
          </h1>

          <p>{error}</p>
        </header>

        <button onClick={handleStartAgain}>
          Start Again →
        </button>
      </main>
    );
  }

  const caseTitle =
    caseData?.title ||
    "Your Legal Case";

  const authority =
    caseData?.designatedAuthority
      ?.department ||
    "the recommended authority";

  return (
    <main className="case-follow-up">
      <header>
        <p>08. CASE FOLLOW-UP</p>

        <h1>
          What did the authority say?
        </h1>

        <p>
          Help eSahay understand the response you
          received so we can identify what should
          happen next.
        </p>
      </header>

      {/* CASE CONTEXT */}
      <section>
        <span>YOUR CASE</span>

        <h2>{caseTitle}</h2>

        <p>
          Response received from:{" "}
          <strong>{authority}</strong>
        </p>
      </section>

      {/* RESPONSE INPUT */}
      {!analysis && (
        <section>
          <label htmlFor="authority-response">
            AUTHORITY RESPONSE
          </label>

          <p>
            Paste the message, letter, email, or
            decision you received from the authority.
          </p>

          <textarea
            id="authority-response"
            value={responseText}
            onChange={(e) => {
              setResponseText(e.target.value);
              setInputError("");
              setError("");
            }}
            placeholder="Paste the authority's response here..."
            rows={12}
            disabled={analyzing}
          />

          {inputError && (
            <p role="alert">
              {inputError}
            </p>
          )}

          {error && (
            <p role="alert">
              {error}
            </p>
          )}

          <button
            onClick={handleAnalyseResponse}
            disabled={analyzing}
          >
            {analyzing
              ? "Analysing Response..."
              : "Analyse Response →"}
          </button>
        </section>
      )}

      {/* AI ANALYSIS */}
      {analysis && (
        <section>
          <span>AI RESPONSE ANALYSIS</span>

          <h2>
            {analysis.outcome ||
              "Response analysed"}
          </h2>

          <div>
            <span>WHAT WE UNDERSTOOD</span>

            <p>
              {analysis.summary ||
                analysis.explanation ||
                "The response has been analysed."}
            </p>
          </div>

          <div>
            <span>RECOMMENDED NEXT STEP</span>

            <p>
              {analysis.nextStep ||
                "Review the response and determine the appropriate next action."}
            </p>
          </div>

          {analysis.escalationAuthority && (
            <div>
              <span>RECOMMENDED ESCALATION</span>

              <p>
                {analysis.escalationAuthority}
              </p>
            </div>
          )}

          <div>
            <span>WHAT WOULD YOU LIKE TO DO?</span>

            <button onClick={handleResolved}>
              My Issue Is Resolved ✓
            </button>

            <button onClick={handleFurtherAction}>
              I Need Further Action →
            </button>
          </div>
        </section>
      )}

      {/* NAVIGATION */}
      <footer>
        <button
          onClick={() =>
            navigate("/case/track")
          }
        >
          ← Back to Case Tracking
        </button>

        <button
          onClick={() =>
            navigate("/dashboard")
          }
        >
          Dashboard →
        </button>
      </footer>
    </main>
  );
}

export default CaseFollowUp;