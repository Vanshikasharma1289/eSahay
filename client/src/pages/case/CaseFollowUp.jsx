import api from "../../services/api";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CaseFollowUp.css";

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

      // Restore previously saved authority response + analysis
      const savedResponse =
        sessionStorage.getItem("esahay_case_response");

      if (savedResponse) {
        try {
          const parsedResponse =
            JSON.parse(savedResponse);

          if (parsedResponse.response) {
            setResponseText(parsedResponse.response);
          }

          if (parsedResponse.analysis) {
            setAnalysis(parsedResponse.analysis);
          }
        } catch (responseError) {
          console.error(
            "Failed to restore saved response:",
            responseError
          );
        }
      }
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

      // Keep tracking state synchronized
      sessionStorage.setItem(
        "esahay_case_status",
        "response-received"
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

  const handleEditResponse = () => {
    setAnalysis(null);
    setError("");
    setInputError("");
  };

  if (loading) {
    return (
      <main className="case-follow-up">
        <div className="followup-loading">
          <span />
          <p
            role="status"
            aria-live="polite"
          >
            Loading your case...
          </p>
        </div>
      </main>
    );
  }

  if (error && !caseData) {
    return (
      <main className="case-follow-up">
        <section className="followup-error">

          <span className="followup-error__icon">
            !
          </span>

          <p className="eyebrow">
            08. CASE FOLLOW-UP
          </p>

          <h1>
            We couldn't load your case.
          </h1>

          <p>{error}</p>

          <button onClick={handleStartAgain}>
            Start Again →
          </button>

        </section>
      </main>
    );
  }

  const caseTitle =
    caseData?.title ||
    "Your Legal Case";

  const authority =
    caseData?.designatedAuthority?.department ||
    "the recommended authority";

  return (
    <main className="case-follow-up">

      {/* HEADER */}

      <header className="followup-header">

        <div>

          <p className="eyebrow">
            08. CASE FOLLOW-UP
          </p>

          <h1>
            What did the
            <br />
            authority say?
          </h1>

          <p>
            Share the response you received and eSahay
            will help you understand what it means and
            what you should do next.
          </p>

        </div>

        <div className="followup-header__mark">

          <span>08</span>

          <small>
            RESPONSE
            <br />
            REVIEW
          </small>

        </div>

      </header>


      {/* CASE CONTEXT */}

      <section className="followup-context">

        <div>

          <span>YOUR CASE</span>

          <h2>
            {caseTitle}
          </h2>

        </div>

        <div>

          <span>RESPONSE FROM</span>

          <p>
            {authority}
          </p>

        </div>

        <div>

          <span>CASE STATUS</span>

          <p className="followup-status">
            Response Received
          </p>

        </div>

      </section>


      {/* RESPONSE INPUT */}

      {!analysis && (
        <section className="response-workspace">

          <div className="response-workspace__heading">

            <div>

              <span className="section-label">
                AUTHORITY RESPONSE
              </span>

              <h2>
                Paste what you received.
              </h2>

              <p>
                This can be a letter, email, SMS,
                notice, decision, or any other response
                from the authority.
              </p>

            </div>

            <span className="response-step">
              01 / 02
            </span>

          </div>


          <div className="response-editor">

            <div className="response-editor__top">

              <span>
                AUTHORITY RESPONSE
              </span>

              <span>
                {responseText.length} characters
              </span>

            </div>

            <textarea
              id="authority-response"
              value={responseText}
              onChange={(e) => {
                setResponseText(e.target.value);
                setInputError("");
                setError("");
              }}
              placeholder={
                "Paste the authority's response here...\n\nExample:\nYour complaint has been reviewed. The disputed amount will be adjusted in the next billing cycle..."
              }
              rows={14}
              disabled={analyzing}
              aria-describedby="response-help"
            />

          </div>


          <p
            id="response-help"
            className="response-help"
          >
            eSahay will analyse the response and suggest
            the most appropriate next step.
          </p>


          {inputError && (
            <div
              className="followup-alert"
              role="alert"
            >
              {inputError}
            </div>
          )}

          {error && (
            <div
              className="followup-alert"
              role="alert"
            >
              {error}
            </div>
          )}


          <div className="response-actions">

            <div>

              <span className="privacy-note">
                SAFETY REMINDER
              </span>

              <p>
                Don't include passwords, OTPs, or sensitive
                account credentials.
              </p>

            </div>

            <button
              onClick={handleAnalyseResponse}
              disabled={analyzing}
            >
              {analyzing
                ? "Analysing Response..."
                : "Analyse Response →"}
            </button>

          </div>

        </section>
      )}


      {/* AI ANALYSIS */}

      {analysis && (
        <section className="response-analysis">

          <div className="analysis-heading">

            <div>

              <span className="section-label">
                AI RESPONSE ANALYSIS
              </span>

              <h2>
                Here's what we understood.
              </h2>

            </div>

            <span className="response-step">
              02 / 02
            </span>

          </div>


          {/* OUTCOME */}

          <div className="analysis-outcome">

            <span>
              OUTCOME
            </span>

            <h3>
              {analysis.outcome ||
                "Response analysed"}
            </h3>

          </div>


          {/* ANALYSIS DETAILS */}

          <div className="analysis-grid">

            <article>

              <span>
                WHAT WE UNDERSTOOD
              </span>

              <p>
                {analysis.summary ||
                  analysis.explanation ||
                  "The response has been analysed."}
              </p>

            </article>


            <article>

              <span>
                RECOMMENDED NEXT STEP
              </span>

              <p>
                {analysis.nextStep ||
                  "Review the response and determine the appropriate next action."}
              </p>

            </article>


            {analysis.escalationAuthority && (
              <article>

                <span>
                  RECOMMENDED ESCALATION
                </span>

                <p>
                  {analysis.escalationAuthority}
                </p>

              </article>
            )}

          </div>


          {/* DECISION */}

          <div className="analysis-decision">

            <div>

              <span className="section-label">
                YOUR DECISION
              </span>

              <h2>
                What would you like to do?
              </h2>

              <p>
                Choose the option that best matches
                what happened after the authority's
                response.
              </p>

            </div>


            <div className="decision-buttons">

              <button
                className="decision-resolved"
                onClick={handleResolved}
              >

                <span>
                  ✓
                </span>

                <div>

                  <strong>
                    My issue is resolved
                  </strong>

                  <small>
                    Close this case
                  </small>

                </div>

              </button>


              <button
                className="decision-action"
                onClick={handleFurtherAction}
              >

                <span>
                  →
                </span>

                <div>

                  <strong>
                    I need further action
                  </strong>

                  <small>
                    Continue with escalation
                  </small>

                </div>

              </button>

            </div>

          </div>


          {/* EDIT RESPONSE */}

          <button
            type="button"
            className="edit-response-button"
            onClick={handleEditResponse}
          >
            ← Edit Authority Response
          </button>

        </section>
      )}


      {/* FOOTER */}

      <footer className="followup-footer">

        <button
          className="ui-secondary"
          onClick={() =>
            navigate("/case/track")
          }
        >
          ← Back to Case Tracking
        </button>


        <div className="followup-progress">

          <span>
            07
          </span>

          <div>

            <i className="done" />

            <i className="active" />

          </div>

          <span>
            08
          </span>

        </div>


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