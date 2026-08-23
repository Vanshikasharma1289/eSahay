import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ActionPlan.css";

function ActionPlan() {
  const navigate = useNavigate();

  const [actionSteps, setActionSteps] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const storedData = sessionStorage.getItem("esahay_ai_result");

    if (!storedData) {
      setError(
        "Your case information is no longer available. Please start your case again."
      );
      return;
    }

    try {
      const parsedData = JSON.parse(storedData);

      if (!parsedData || typeof parsedData !== "object") {
        throw new Error("Invalid case data");
      }

      setActionSteps(
        Array.isArray(parsedData.actionSteps)
          ? parsedData.actionSteps
          : []
      );
    } catch (error) {
      console.error("Failed to read action plan:", error);

      setError(
        "We couldn't load the action plan for this case."
      );
    }
  }, []);

  const handleStartAgain = () => {
    sessionStorage.removeItem("esahay_ai_result");
    navigate("/case/intake");
  };

  if (error) {
    return (
      <main className="action-plan">
        <header className="action-plan__header">
          <p className="eyebrow">05. ACTION & DEADLINE</p>

          <h1>We couldn't load your case.</h1>

          <p>{error}</p>
        </header>

        <button onClick={handleStartAgain}>
          Start Again →
        </button>
      </main>
    );
  }

  if (actionSteps === null) {
    return (
      <main className="action-plan">
        <div className="action-plan__loading">
          <span />
          <p role="status" aria-live="polite">
            Preparing your action plan...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="action-plan">

      {/* HEADER */}
      <header className="action-plan__header">

        <div>
          <p className="eyebrow">
            05. ACTION & DEADLINE
          </p>

          <h1>
            Know what
            <br />
            to do next.
          </h1>

          <p>
            Your case has been converted into a practical
            sequence of actions. Follow these steps in order
            to move your case forward.
          </p>
        </div>

        <div className="action-plan__step-count">
          <strong>
            {String(actionSteps.length).padStart(2, "0")}
          </strong>

          <span>
            ACTIONS
            <br />
            TO TAKE
          </span>
        </div>

      </header>


      {/* STATUS BANNER */}
      <section className="action-plan__status">

        <div className="action-plan__status-icon">
          ✓
        </div>

        <div>
          <span className="section-label">
            YOUR ACTION PLAN
          </span>

          <h2>
            One step at a time.
          </h2>

          <p>
            Start with Step 01 and work through the plan.
            Keep copies of everything you submit or receive.
          </p>
        </div>

        <div className="action-plan__status-badge">
          READY
        </div>

      </section>


      {/* STEPS */}
      <section className="action-plan__steps">

        <div className="action-plan__steps-header">

          <div>
            <span className="section-label">
              RECOMMENDED ACTIONS
            </span>

            <h2>
              Your roadmap.
            </h2>
          </div>

          <span className="action-plan__steps-count">
            {actionSteps.length}{" "}
            {actionSteps.length === 1
              ? "STEP"
              : "STEPS"}
          </span>

        </div>


        {actionSteps.length > 0 ? (
          <div className="action-plan__timeline">

            {actionSteps.map((step, index) => (
              <article
                key={index}
                className={`action-step ${
                  index === 0
                    ? "action-step--current"
                    : ""
                }`}
              >

                <div className="action-step__marker">
                  {String(index + 1).padStart(2, "0")}
                </div>

                <div className="action-step__line" />

                <div className="action-step__content">

                  <div className="action-step__top">

                    <span>
                      STEP {String(index + 1).padStart(2, "0")}
                    </span>

                    {index === 0 && (
                      <small>
                        START HERE
                      </small>
                    )}

                  </div>

                  <h3>
                    {step || `Action ${index + 1}`}
                  </h3>

                  <p>
                    Complete this step before moving
                    to the next stage of your case.
                  </p>

                </div>

              </article>
            ))}

          </div>
        ) : (
          <div className="action-plan__empty">

            <div className="action-plan__empty-icon">
              —
            </div>

            <div>
              <h3>
                No action steps were generated.
              </h3>

              <p>
                We couldn't create a specific action plan
                from the information available for this case.
                You can still continue to the document stage.
              </p>
            </div>

          </div>
        )}

      </section>


      {/* PRACTICAL TIPS */}
      <section className="action-plan__tips">

        <div className="action-plan__tips-heading">

          <span className="section-label">
            BEFORE YOU ACT
          </span>

          <h2>
            Keep these
            <br />
            things in mind.
          </h2>

        </div>

        <div className="action-plan__tips-list">

          <article>
            <span>01</span>

            <div>
              <h3>Keep evidence</h3>

              <p>
                Save bills, notices, receipts, screenshots,
                acknowledgement numbers and other documents.
              </p>
            </div>
          </article>

          <article>
            <span>02</span>

            <div>
              <h3>Keep a record</h3>

              <p>
                Note submission dates, reference numbers
                and any communication with the authority.
              </p>
            </div>
          </article>

          <article>
            <span>03</span>

            <div>
              <h3>Watch the timeline</h3>

              <p>
                If the authority does not respond within
                the applicable period, check whether an
                escalation or appeal is available.
              </p>
            </div>
          </article>

        </div>

      </section>


      {/* FOOTER */}
      <footer className="action-plan__footer">

        <button
          type="button"
          className="ui-secondary"
          onClick={() => navigate("/case/authority")}
        >
          ← Back to Authority
        </button>


        <div className="action-plan__progress">

          <span>04</span>

          <div>
            <i />
            <i />
            <i />
            <i className="active" />
            <i />
          </div>

          <span>05</span>

        </div>


        <button
          type="button"
          onClick={() => navigate("/case/document")}
        >
          Continue to Document →
        </button>

      </footer>

    </main>
  );
}

export default ActionPlan;