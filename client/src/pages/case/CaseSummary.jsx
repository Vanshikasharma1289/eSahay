import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CaseSummary.css";

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
        <header className="case-summary__header">
          <p className="eyebrow">02. AI CASE SUMMARY</p>

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
        <div className="case-summary__loading">
          <span className="case-summary__loading-dot" />
          <p role="status" aria-live="polite">
            Reading your case...
          </p>
        </div>
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

  const hasRights =
    Array.isArray(applicableRights) &&
    applicableRights.length > 0;

  const hasActionSteps =
    Array.isArray(actionSteps) &&
    actionSteps.length > 0;

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

      {/* HEADER */}
      <header className="case-summary__header">

        <div>
          <p className="eyebrow">
            02. AI CASE SUMMARY
          </p>

          <h1>
            Here&apos;s what
            <br />
            we understood.
          </h1>

          <p className="case-summary__intro">
            We&apos;ve analysed what you told us and
            organised the important details below.
            Review them before continuing.
          </p>
        </div>

        <div className="case-summary__confidence">
          <span className="case-summary__confidence-dot" />
          <span>AI ANALYSIS COMPLETE</span>
        </div>

      </header>


      {/* CASE IDENTITY */}
      <section className="case-summary__identity">

        <div className="case-summary__identity-main">

          <span className="section-label">
            YOUR CASE
          </span>

          <h2>
            {title || "Your Legal Case"}
          </h2>

          <span className="case-summary__category">
            {category || "Other"}
          </span>

        </div>

        <div className="case-summary__identity-mark">
          02
        </div>

      </section>


      {/* DETAILS GRID */}
      <section className="case-summary__details">

        <div className="section-heading">
          <span className="section-label">
            CASE DETAILS
          </span>

          <h2>
            The important parts.
          </h2>
        </div>

        <div className="case-summary__details-grid">

          <div className="summary-detail">
            <span>YOUR NAME</span>
            <strong>
              {extractedDetails.name || "Citizen"}
            </strong>
          </div>

          <div className="summary-detail">
            <span>CASE / NOTICE NUMBER</span>
            <strong>
              {extractedDetails.caseNumber || "N/A"}
            </strong>
          </div>

          <div className="summary-detail">
            <span>NOTICE DATE</span>
            <strong>
              {extractedDetails.noticeDate || "Not mentioned"}
            </strong>
          </div>

          <div className="summary-detail summary-detail--wide">
            <span>KEY ISSUE</span>

            <p>
              {extractedDetails.keyIssue ||
                "No specific issue could be extracted."}
            </p>
          </div>

        </div>

      </section>


      {/* AI INTERPRETATION */}
      <section className="case-summary__interpretation">

        <div className="case-summary__interpretation-number">
          01
        </div>

        <div>
          <span className="section-label">
            WHAT WE UNDERSTOOD
          </span>

          <h2>
            Your situation,
            <br />
            in simple terms.
          </h2>

          <p>
            {extractedDetails.keyIssue ||
              "The AI could not identify a specific issue from the information provided."}
          </p>
        </div>

      </section>


      {/* RIGHTS PREVIEW */}
      <section className="case-summary__rights">

        <div className="section-heading">

          <div>
            <span className="section-label">
              LEGAL RIGHTS
            </span>

            <h2>
              What may protect you.
            </h2>
          </div>

          <span className="count-badge">
            {String(applicableRights.length).padStart(2, "0")}
          </span>

        </div>

        {hasRights ? (
          <div className="case-summary__rights-list">

            {applicableRights
              .slice(0, 3)
              .map((item, index) => (
                <article
                  key={index}
                  className="summary-right"
                >

                  <span className="summary-right__number">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <div>
                    <h3>
                      {item.right ||
                        "Legal right identified"}
                    </h3>

                    <p className="summary-right__law">
                      {item.lawSource ||
                        "Source not specified"}
                    </p>

                    <p>
                      {item.citationSummary ||
                        "No additional explanation was provided."}
                    </p>
                  </div>

                  <span className="summary-right__arrow">
                    →
                  </span>

                </article>
              ))}

          </div>
        ) : (
          <div className="case-summary__empty">
            <p>
              No specific legal rights were identified
              for this case.
            </p>
          </div>
        )}

        {applicableRights.length > 3 && (
          <p className="case-summary__more">
            + {applicableRights.length - 3} more
            legal provision
            {applicableRights.length - 3 > 1
              ? "s"
              : ""}{" "}
            will be shown next.
          </p>
        )}

      </section>


      {/* AUTHORITY + ACTION */}
      <section className="case-summary__next">

        {/* AUTHORITY */}
        <div className="next-card">

          <span className="section-label">
            RECOMMENDED AUTHORITY
          </span>

          {hasAuthority ? (
            <>
              <h2>
                {designatedAuthority.department ||
                  "Recommended Authority"}
              </h2>

              <div className="next-card__row">
                <span>OFFICE</span>
                <p>
                  {designatedAuthority.officeAddress ||
                    "Not available"}
                </p>
              </div>

              <div className="next-card__row">
                <span>SUBMISSION</span>
                <p>
                  {designatedAuthority.submissionMode ||
                    "Not available"}
                </p>
              </div>

              <div className="next-card__row">
                <span>TIMELINE</span>
                <p>
                  {designatedAuthority.timelineDays
                    ? `${designatedAuthority.timelineDays} days`
                    : "Not specified"}
                </p>
              </div>
            </>
          ) : (
            <p>
              We could not identify a specific authority
              from the information provided.
            </p>
          )}

        </div>


        {/* ACTION PLAN */}
        <div className="next-card">

          <span className="section-label">
            NEXT STEPS
          </span>

          <h2>
            What happens next.
          </h2>

          {hasActionSteps ? (
            <ol className="case-summary__action-list">

              {actionSteps
                .slice(0, 3)
                .map((step, index) => (
                  <li key={index}>

                    <span>
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <p>
                      {step || `Action ${index + 1}`}
                    </p>

                  </li>
                ))}

            </ol>
          ) : (
            <p>
              No specific action steps were generated
              for this case.
            </p>
          )}

        </div>

      </section>


      {/* DOCUMENT PREVIEW */}
      <section className="case-summary__document">

        <div className="section-heading">

          <div>
            <span className="section-label">
              DOCUMENT
            </span>

            <h2>
              Your draft is ready.
            </h2>
          </div>

          <span className="document-badge">
            AI GENERATED
          </span>

        </div>

        {draftDocument ? (
          <div className="document-preview">

            <div className="document-preview__top">
              <span>eSahay</span>
              <span>LEGAL DOCUMENT</span>
            </div>

            <pre>
              {draftDocument}
            </pre>

          </div>
        ) : (
          <div className="case-summary__empty">
            <p>
              No draft document was generated.
              You can create one later.
            </p>
          </div>
        )}

      </section>


      {/* FINAL CONFIRMATION */}
      <section className="case-summary__confirmation">

        <div>

          <span className="section-label">
            BEFORE YOU CONTINUE
          </span>

          <h2>
            Does this look right?
          </h2>

          <p>
            Review the information above. eSahay will
            use this understanding to identify your
            rights and the authority you should approach.
          </p>

        </div>

        <div className="case-summary__confirmation-actions">

          <button
            type="button"
            className="ui-secondary"
            onClick={() => navigate("/case/intake")}
          >
            ← Edit Case
          </button>

          <button
            type="button"
            onClick={handleContinue}
          >
            Looks Good, Continue →
          </button>

        </div>

      </section>

    </main>
  );
}

export default CaseSummary;