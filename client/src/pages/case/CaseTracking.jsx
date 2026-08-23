import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CaseTracking.css";

function CaseTracking() {
  const navigate = useNavigate();

  const [caseData, setCaseData] = useState(null);
  const [caseStatus, setCaseStatus] = useState("ready");
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

      setCaseData(parsedData);

      const savedStatus =
        sessionStorage.getItem("esahay_case_status");

      if (savedStatus) {
        setCaseStatus(savedStatus);
      }
    } catch (error) {
      console.error("Failed to read case data:", error);

      setError(
        "We couldn't load the tracking information for this case."
      );
    }
  }, []);

  const updateCaseStatus = (newStatus) => {
    sessionStorage.setItem(
      "esahay_case_status",
      newStatus
    );

    setCaseStatus(newStatus);
  };

  const handleStartAgain = () => {
    sessionStorage.removeItem("esahay_ai_result");
    sessionStorage.removeItem("esahay_case_status");

    navigate("/case/intake");
  };

  const handleSubmitCase = () => {
    updateCaseStatus("submitted");
  };

  const handleMarkUnderReview = () => {
    updateCaseStatus("review");
  };

  const handleResponseReceived = () => {
    updateCaseStatus("response-received");
    navigate("/case/follow-up");
  };

  const getCurrentStage = () => {
    switch (caseStatus) {
      case "ready":
        return "Ready to Submit";
      case "submitted":
        return "Submitted";
      case "review":
        return "Under Review";
      case "response-received":
        return "Response Received";
      case "action-needed":
        return "Further Action";
      case "resolved":
        return "Resolved";
      default:
        return "Ready to Submit";
    }
  };

  const getSteps = () => {
    const baseSteps = [
      {
        number: "01",
        title: "Understand",
        description: "Your problem was submitted and understood.",
        status: "Completed",
      },
      {
        number: "02",
        title: "Know your rights",
        description: "Applicable rights and legal provisions were identified.",
        status: "Completed",
      },
      {
        number: "03",
        title: "Find authority",
        description: "The most relevant authority was identified.",
        status: "Completed",
      },
      {
        number: "04",
        title: "Take action",
        description: "Your action plan and document are ready.",
        status: "Completed",
      },
    ];

    if (caseStatus === "ready") {
      return [
        ...baseSteps,
        {
          number: "05",
          title: "Submit",
          description: "Submit your prepared case to the recommended authority.",
          status: "Current",
        },
        {
          number: "06",
          title: "Authority review",
          description: "Wait for the authority to review your case.",
          status: "Pending",
        },
        {
          number: "07",
          title: "Resolution",
          description: "The outcome will be determined after a response.",
          status: "Pending",
        },
      ];
    }

    if (caseStatus === "submitted") {
      return [
        ...baseSteps,
        {
          number: "05",
          title: "Submit",
          description: "You confirmed that the case was submitted.",
          status: "Completed",
        },
        {
          number: "06",
          title: "Authority review",
          description: "Your case is waiting for a response.",
          status: "Current",
        },
        {
          number: "07",
          title: "Resolution",
          description: "The case will move toward resolution after a response.",
          status: "Pending",
        },
      ];
    }

    if (caseStatus === "review") {
      return [
        ...baseSteps,
        {
          number: "05",
          title: "Submit",
          description: "Your case was submitted.",
          status: "Completed",
        },
        {
          number: "06",
          title: "Authority review",
          description: "The authority is currently reviewing your case.",
          status: "Current",
        },
        {
          number: "07",
          title: "Resolution",
          description: "Your case will move toward resolution after a response.",
          status: "Pending",
        },
      ];
    }

    if (caseStatus === "response-received") {
      return [
        ...baseSteps,
        {
          number: "05",
          title: "Submit",
          description: "Your case was submitted.",
          status: "Completed",
        },
        {
          number: "06",
          title: "Authority review",
          description: "A response has been received.",
          status: "Completed",
        },
        {
          number: "07",
          title: "Follow-up",
          description: "Review the response and determine what happens next.",
          status: "Current",
        },
      ];
    }

    if (caseStatus === "action-needed") {
      return [
        ...baseSteps,
        {
          number: "05",
          title: "Submit",
          description: "Your case was submitted.",
          status: "Completed",
        },
        {
          number: "06",
          title: "Authority review",
          description: "The authority responded to your case.",
          status: "Completed",
        },
        {
          number: "07",
          title: "Further action",
          description: "Additional action or escalation may be required.",
          status: "Current",
        },
      ];
    }

    if (caseStatus === "resolved") {
      return [
        ...baseSteps,
        {
          number: "05",
          title: "Submit",
          description: "Your case was submitted.",
          status: "Completed",
        },
        {
          number: "06",
          title: "Authority review",
          description: "The authority reviewed your case.",
          status: "Completed",
        },
        {
          number: "07",
          title: "Resolution",
          description: "You confirmed that the issue was resolved.",
          status: "Completed",
        },
      ];
    }

    return baseSteps;
  };

  const steps = useMemo(
    () => getSteps(),
    [caseStatus]
  );

  const caseTitle =
    caseData?.title || "Your Legal Case";

  const category =
    caseData?.category || "General";

  const authority =
    caseData?.designatedAuthority?.department ||
    "the recommended authority";

  const submissionMode =
    caseData?.designatedAuthority?.submissionMode ||
    "the recommended submission method";

  const currentStage = getCurrentStage();

  if (error) {
    return (
      <main className="case-tracking">
        <section className="tracking-error">
          <span className="tracking-error__icon">!</span>

          <p className="eyebrow">07. CASE TRACKING</p>

          <h1>We couldn't load your case.</h1>

          <p>{error}</p>

          <button onClick={handleStartAgain}>
            Start Again →
          </button>
        </section>
      </main>
    );
  }

  if (!caseData) {
    return (
      <main className="case-tracking">
        <div className="tracking-loading">
          <span />
          <p role="status" aria-live="polite">
            Loading your case...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="case-tracking">

      {/* HEADER */}

      <header className="tracking-header">

        <div>
          <p className="eyebrow">
            07. CASE TRACKING
          </p>

          <h1>
            Track your case
            <br />
            at every stage.
          </h1>

          <p>
            Follow your case from submission to resolution.
            Every stage shows what has happened and what
            you need to do next.
          </p>
        </div>

        <div className="tracking-header__status">
          <span className="status-dot" />

          <div>
            <small>CURRENT STATUS</small>

            <strong>
              {currentStage}
            </strong>
          </div>
        </div>

      </header>


      {/* CASE OVERVIEW */}

      <section className="case-overview">

        <div>
          <span>CASE</span>

          <h2>{caseTitle}</h2>
        </div>

        <div>
          <span>CATEGORY</span>

          <p>{category}</p>
        </div>

        <div>
          <span>AUTHORITY</span>

          <p>{authority}</p>
        </div>

        <div>
          <span>STATUS</span>

          <p>{currentStage}</p>
        </div>

      </section>


      {/* JOURNEY */}

      <section className="tracking-journey">

        <div className="journey-heading">
          <div>
            <span className="section-label">
              YOUR JOURNEY
            </span>

            <h2>
              From problem
              <br />
              to resolution.
            </h2>
          </div>

          <span className="journey-count">
            {steps.filter(
              (step) => step.status === "Completed"
            ).length}
            /
            {steps.length}
            COMPLETE
          </span>
        </div>


        <div className="journey-timeline">

          {steps.map((step, index) => {

            const isCompleted =
              step.status === "Completed";

            const isCurrent =
              step.status === "Current" ||
              step.status === "Next";

            return (
              <article
                key={step.number}
                className={`journey-step ${
                  isCompleted
                    ? "journey-step--completed"
                    : ""
                } ${
                  isCurrent
                    ? "journey-step--current"
                    : ""
                }`}
              >

                <div className="journey-step__number">

                  {isCompleted ? (
                    <span>✓</span>
                  ) : (
                    step.number
                  )}

                </div>

                {index < steps.length - 1 && (
                  <div
                    className={`journey-step__connector ${
                      isCompleted
                        ? "journey-step__connector--completed"
                        : ""
                    }`}
                  />
                )}

                <div className="journey-step__content">

                  <div className="journey-step__meta">

                    <span>
                      STEP {step.number}
                    </span>

                    <strong>
                      {step.status}
                    </strong>

                  </div>

                  <h3>
                    {step.title}
                  </h3>

                  <p>
                    {step.description}
                  </p>

                </div>

              </article>
            );
          })}

        </div>

      </section>


      {/* CURRENT ACTION */}

      <section className="current-action">

        <div className="current-action__heading">

          <span className="section-label">
            CURRENT ACTION
          </span>

          <div className="current-action__indicator">
            <i />
            {currentStage}
          </div>

        </div>


        {caseStatus === "ready" && (
          <div className="action-state">

            <div>
              <h2>
                Ready to submit your case.
              </h2>

              <p>
                Your case document is prepared. Submit it
                to <strong>{authority}</strong> using{" "}
                <strong>{submissionMode}</strong>.
              </p>

              <small>
                eSahay cannot verify the submission itself
                in this MVP. Confirm here after you submit it.
              </small>
            </div>

            <div className="action-state__buttons">

              <button
                className="ui-secondary"
                onClick={() =>
                  navigate("/case/document")
                }
              >
                View Document
              </button>

              <button onClick={handleSubmitCase}>
                I've Submitted This Case →
              </button>

            </div>

          </div>
        )}


        {caseStatus === "submitted" && (
          <div className="action-state">

            <div>
              <h2>
                Your case has been submitted.
              </h2>

              <p>
                You've confirmed submission to{" "}
                <strong>{authority}</strong>.
                The next stage is waiting for the authority's
                response.
              </p>
            </div>

            <div className="action-state__buttons">

              <button
                onClick={handleMarkUnderReview}
              >
                Mark as Under Review →
              </button>

            </div>

          </div>
        )}


        {caseStatus === "review" && (
          <div className="action-state">

            <div>
              <h2>
                Your case is under review.
              </h2>

              <p>
                You're currently waiting for a response from{" "}
                <strong>{authority}</strong>.
              </p>

              <small>
                When you receive a response, come back here
                and continue the case.
              </small>
            </div>

            <div className="action-state__buttons">

              <button
                onClick={handleResponseReceived}
              >
                I Received a Response →
              </button>

            </div>

          </div>
        )}


        {caseStatus === "response-received" && (
          <div className="action-state">

            <div>
              <h2>
                Authority response received.
              </h2>

              <p>
                The response is now ready for review.
                Let's determine whether your issue was
                actually resolved.
              </p>
            </div>

            <div className="action-state__buttons">

              <button
                onClick={() =>
                  navigate("/case/follow-up")
                }
              >
                Analyse Response →
              </button>

            </div>

          </div>
        )}


        {caseStatus === "action-needed" && (
          <div className="action-state">

            <div>
              <h2>
                Further action may be required.
              </h2>

              <p>
                The authority's response did not fully resolve
                the issue. eSahay can help identify the next
                escalation route.
              </p>
            </div>

            <div className="action-state__buttons">

              <button
                onClick={() =>
                  navigate("/case/follow-up")
                }
              >
                Continue Follow-up →
              </button>

            </div>

          </div>
        )}


        {caseStatus === "resolved" && (
          <div className="action-state action-state--resolved">

            <div className="resolved-icon">
              ✓
            </div>

            <div>
              <h2>
                Your case has been resolved.
              </h2>

              <p>
                You confirmed that the issue has been
                resolved. This case is now complete.
              </p>
            </div>

            <button
              onClick={() =>
                navigate("/dashboard")
              }
            >
              Return to Dashboard →
            </button>

          </div>
        )}

      </section>


      {/* LATEST UPDATE */}

      <section className="latest-update">

        <div>
          <span className="section-label">
            LATEST UPDATE
          </span>

          <span className="update-time">
            CURRENT CASE STATE
          </span>
        </div>

        <p>
          {caseStatus === "ready" &&
            `Your case has been analysed successfully. Your document is ready to submit to ${authority}.`}

          {caseStatus === "submitted" &&
            `You confirmed that your case was submitted to ${authority}.`}

          {caseStatus === "review" &&
            `Your case is currently awaiting a response from ${authority}.`}

          {caseStatus === "response-received" &&
            `A response has been received from ${authority}. Review it to determine the next step.`}

          {caseStatus === "action-needed" &&
            "Further action may be required. Continue through the follow-up flow."}

          {caseStatus === "resolved" &&
            "This case has been marked as resolved based on your confirmation."}
        </p>

      </section>


      {/* FOOTER */}

      <footer className="tracking-footer">

        <button
          className="ui-secondary"
          onClick={() =>
            navigate("/case/document")
          }
        >
          ← Back to Document
        </button>

        <div className="tracking-progress">

          <span>01</span>

          <div>
            {steps.map((step) => (
              <i
                key={step.number}
                className={
                  step.status === "Completed"
                    ? "done"
                    : step.status === "Current" ||
                      step.status === "Next"
                    ? "active"
                    : ""
                }
              />
            ))}
          </div>

          <span>07</span>

        </div>

        <button
          onClick={() =>
            navigate("/dashboard")
          }
        >
          Return to Dashboard →
        </button>

      </footer>

    </main>
  );
}

export default CaseTracking;