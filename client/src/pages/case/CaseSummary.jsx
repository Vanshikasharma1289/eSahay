import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function CaseSummary() {
  const navigate = useNavigate();

  const [caseData, setCaseData] = useState(null);

  useEffect(() => {
    const storedData = sessionStorage.getItem("esahay_ai_result");

    if (!storedData) {
      navigate("/case/intake");
      return;
    }

    try {
      setCaseData(JSON.parse(storedData));
    } catch (error) {
      console.error("Failed to read AI case data:", error);
      navigate("/case/intake");
    }
  }, [navigate]);

  if (!caseData) {
    return <div>Loading case summary...</div>;
  }

  const {
    title,
    category,
    extractedDetails,
    applicableRights,
    designatedAuthority,
    actionSteps,
    draftDocument,
  } = caseData;

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
          <p>{extractedDetails?.name || "Citizen"}</p>
        </div>

        <div>
          <strong>Case / Notice Number</strong>
          <p>{extractedDetails?.caseNumber || "N/A"}</p>
        </div>

        <div>
          <strong>Notice Date</strong>
          <p>{extractedDetails?.noticeDate || "Not mentioned"}</p>
        </div>

        <div>
          <strong>Key Issue</strong>
          <p>
            {extractedDetails?.keyIssue ||
              "No specific issue could be extracted."}
          </p>
        </div>
      </section>

      {/* APPLICABLE RIGHTS */}
      <section>
        <h2>Applicable Rights</h2>

        {applicableRights?.length > 0 ? (
          applicableRights.map((item, index) => (
            <article key={index}>
              <h3>{item.right}</h3>

              <p>
                <strong>Law:</strong> {item.lawSource}
              </p>

              <p>{item.citationSummary}</p>
            </article>
          ))
        ) : (
          <p>No specific rights were identified.</p>
        )}
      </section>

      {/* AUTHORITY */}
      <section>
        <h2>Recommended Authority</h2>

        <p>
          <strong>Department:</strong>{" "}
          {designatedAuthority?.department || "Not available"}
        </p>

        <p>
          <strong>Office:</strong>{" "}
          {designatedAuthority?.officeAddress || "Not available"}
        </p>

        <p>
          <strong>Submission:</strong>{" "}
          {designatedAuthority?.submissionMode || "Not available"}
        </p>

        <p>
          <strong>Expected Timeline:</strong>{" "}
          {designatedAuthority?.timelineDays
            ? `${designatedAuthority.timelineDays} days`
            : "Not specified"}
        </p>
      </section>

      {/* ACTION STEPS */}
      <section>
        <h2>What you should do next</h2>

        {actionSteps?.length > 0 ? (
          <ol>
            {actionSteps.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>
        ) : (
          <p>No action steps were generated.</p>
        )}
      </section>

      {/* DRAFT DOCUMENT */}
      <section>
        <h2>Draft Document</h2>

        <pre>{draftDocument || "No draft document generated."}</pre>
      </section>

      {/* ACTIONS */}
      <footer>
        <button onClick={() => navigate("/case/intake")}>
          ← Back
        </button>

        <button onClick={() => navigate("/case/rights")}>
          Looks Good, Continue →
        </button>
      </footer>

    </main>
  );
}

export default CaseSummary;