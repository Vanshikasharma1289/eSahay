import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function CaseSummary() {
  const navigate = useNavigate();

  const [caseData, setCaseData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const storedData = sessionStorage.getItem("esahay_ai_result");

    if (!storedData) {
      setError(
        "We couldn't find your case information. Please start your case again."
      );
      return;
    }

    try {
      const parsedData = JSON.parse(storedData);

      if (!parsedData || typeof parsedData !== "object") {
        throw new Error("Invalid case data");
      }

      setCaseData(parsedData);
    } catch (error) {
      console.error("Failed to read AI case data:", error);

      sessionStorage.removeItem("esahay_ai_result");

      setError(
        "Your case information could not be loaded. Please start again."
      );
    }
  }, []);

  const handleStartAgain = () => {
    sessionStorage.removeItem("esahay_ai_result");
    navigate("/case/intake");
  };

  if (error) {
    return (
      <main className="case-summary">
        <header>
          <p>02. AI CASE SUMMARY</p>

          <h1>We couldn't load your case.</h1>

          <p>{error}</p>
        </header>

        <button onClick={handleStartAgain}>
          Start Again →
        </button>
      </main>
    );
  }

  if (!caseData) {
    return (
      <main className="case-summary">
        <p role="status" aria-live="polite">
          Loading your case summary...
        </p>
      </main>
    );
  }

  const {
    title,
    category,
    extractedDetails = {},
    applicableRights = [],
    designatedAuthority = {},
    actionSteps = [],
    draftDocument,
  } = caseData;

  const hasRights = Array.isArray(applicableRights)
    && applicableRights.length > 0;

  const hasActionSteps = Array.isArray(actionSteps)
    && actionSteps.length > 0;

  const hasAuthority =
    designatedAuthority &&
    (
      designatedAuthority.department ||
      designatedAuthority.officeAddress ||
      designatedAuthority.submissionMode
    );

  const handleContinue = () => {
    navigate("/case/rights");
  };

  return (
    <main className="case-summary">

      <header>
        <p>02. AI CASE SUMMARY</p>

        <h1>Here’s what we understood.</h1>

        <p>
          Review the details identified from your problem before
          continuing.
        </p>
      </header>

      {/* CASE OVERVIEW */}
      <section>
        <h2>Case Summary</h2>

        <div>
          <strong>Case Title</strong>
          <p>{title || "Not available"}</p>
        </div>

        <div>
          <strong>Category</strong>
          <p>{category || "Other"}</p>
        </div>

        <div>
          <strong>Your Name</strong>
          <p>{extractedDetails.name || "Citizen"}</p>
        </div>

        <div>
          <strong>Case / Notice Number</strong>
          <p>{extractedDetails.caseNumber || "N/A"}</p>
        </div>

        <div>
          <strong>Notice Date</strong>
          <p>{extractedDetails.noticeDate || "Not mentioned"}</p>
        </div>

        <div>
          <strong>Key Issue</strong>
          <p>
            {extractedDetails.keyIssue ||
              "No specific issue could be extracted."}
          </p>
        </div>
      </section>

      {/* APPLICABLE RIGHTS */}
      <section>
        <h2>Applicable Rights</h2>

        {hasRights ? (
          applicableRights.map((item, index) => (
            <article key={index}>
              <span>RIGHT {String(index + 1).padStart(2, "0")}</span>

              <h3>
                {item.right || "Legal right identified"}
              </h3>

              <p>
                <strong>Law:</strong>{" "}
                {item.lawSource || "Source not specified"}
              </p>

              <p>
                {item.citationSummary ||
                  "No additional explanation was provided."}
              </p>
            </article>
          ))
        ) : (
          <div role="status">
            <p>
              No specific rights were identified for this case.
            </p>

            <small>
              You can continue to review the recommended authority
              and next steps.
            </small>
          </div>
        )}
      </section>

      {/* AUTHORITY */}
      <section>
        <h2>Recommended Authority</h2>

        {hasAuthority ? (
          <>
            <p>
              <strong>Department:</strong>{" "}
              {designatedAuthority.department ||
                "Not available"}
            </p>

            <p>
              <strong>Office:</strong>{" "}
              {designatedAuthority.officeAddress ||
                "Not available"}
            </p>

            <p>
              <strong>Submission:</strong>{" "}
              {designatedAuthority.submissionMode ||
                "Not available"}
            </p>

            <p>
              <strong>Expected Timeline:</strong>{" "}
              {designatedAuthority.timelineDays
                ? `${designatedAuthority.timelineDays} days`
                : "Not specified"}
            </p>
          </>
        ) : (
          <p>
            We could not identify a specific authority from the
            information provided.
          </p>
        )}
      </section>

      {/* ACTION STEPS */}
      <section>
        <h2>What you should do next</h2>

        {hasActionSteps ? (
          <ol>
            {actionSteps.map((step, index) => (
              <li key={index}>
                {step || `Action ${index + 1}`}
              </li>
            ))}
          </ol>
        ) : (
          <p>
            No specific action steps were generated for this case.
          </p>
        )}
      </section>

      {/* DRAFT DOCUMENT */}
      <section>
        <h2>Draft Document</h2>

        {draftDocument ? (
          <pre>{draftDocument}</pre>
        ) : (
          <p>
            No draft document was generated. You can continue
            without it and create one later.
          </p>
        )}
      </section>

      {/* ACTIONS */}
      <footer>
        <button onClick={() => navigate("/case/intake")}>
          ← Back
        </button>

        <button onClick={handleContinue}>
          Looks Good, Continue →
        </button>
      </footer>

    </main>
  );
}

export default CaseSummary;