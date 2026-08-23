import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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

  const handleNeedsAction = () => {
    updateCaseStatus("action-needed");
  };

  if (error) {
    return (
      <main className="case-tracking">
        <header>
          <p>07. CASE TRACKING</p>

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
      <main className="case-tracking">
        <p role="status" aria-live="polite">
          Loading your case...
        </p>
      </main>
    );
  }

  const caseTitle =
    caseData.title || "Your Legal Case";

  const category =
    caseData.category || "General";

  const authority =
    caseData.designatedAuthority?.department ||
    "the recommended authority";

  const submissionMode =
    caseData.designatedAuthority?.submissionMode ||
    "the recommended submission method";

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
        return "Further Action Required";

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
        title: "Intake",
        description:
          "Your problem was submitted.",
        status: "Completed",
      },
      {
        number: "02",
        title: "Review",
        description:
          "Your case was analysed by eSahay.",
        status: "Completed",
      },
      {
        number: "03",
        title: "Action Plan",
        description:
          "Your rights, authority and next steps were identified.",
        status: "Completed",
      },
      {
        number: "04",
        title: "Document",
        description:
          "Your case-specific document is ready.",
        status: "Completed",
      },
    ];

    if (caseStatus === "ready") {
      return [
        ...baseSteps,
        {
          number: "05",
          title: "Submission",
          description:
            `Submit your case to ${authority}.`,
          status: "Next",
        },
        {
          number: "06",
          title: "Authority Review",
          description:
            "Await the authority's response.",
          status: "Pending",
        },
        {
          number: "07",
          title: "Resolution",
          description:
            "The outcome will be determined after the authority responds.",
          status: "Pending",
        },
      ];
    }

    if (caseStatus === "submitted") {
      return [
        ...baseSteps,
        {
          number: "05",
          title: "Submission",
          description:
            "Your case has been submitted.",
          status: "Completed",
        },
        {
          number: "06",
          title: "Authority Review",
          description:
            "Your case is waiting for review.",
          status: "Next",
        },
        {
          number: "07",
          title: "Resolution",
          description:
            "Await the authority's response.",
          status: "Pending",
        },
      ];
    }

    if (caseStatus === "review") {
      return [
        ...baseSteps,
        {
          number: "05",
          title: "Submission",
          description:
            "Your case has been submitted.",
          status: "Completed",
        },
        {
          number: "06",
          title: "Authority Review",
          description:
            "The authority is reviewing your case.",
          status: "Current",
        },
        {
          number: "07",
          title: "Resolution",
          description:
            "Your case will move toward resolution after a response.",
          status: "Pending",
        },
      ];
    }

    if (caseStatus === "response-received") {
      return [
        ...baseSteps,
        {
          number: "05",
          title: "Submission",
          description:
            "Your case was submitted.",
          status: "Completed",
        },
        {
          number: "06",
          title: "Authority Review",
          description:
            "A response has been received from the authority.",
          status: "Completed",
        },
        {
          number: "07",
          title: "Follow-up",
          description:
            "Review the authority's response and determine the next step.",
          status: "Current",
        },
      ];
    }

    if (caseStatus === "action-needed") {
      return [
        ...baseSteps,
        {
          number: "05",
          title: "Submission",
          description:
            "Your case was submitted.",
          status: "Completed",
        },
        {
          number: "06",
          title: "Authority Review",
          description:
            "The authority's response requires further action.",
          status: "Completed",
        },
        {
          number: "07",
          title: "Further Action",
          description:
            "eSahay can help you determine the next escalation step.",
          status: "Current",
        },
      ];
    }

    if (caseStatus === "resolved") {
      return [
        ...baseSteps,
        {
          number: "05",
          title: "Submission",
          description:
            "Your case was submitted.",
          status: "Completed",
        },
        {
          number: "06",
          title: "Authority Review",
          description:
            "The authority reviewed your case.",
          status: "Completed",
        },
        {
          number: "07",
          title: "Resolution",
          description:
            "The citizen confirmed that the issue was resolved.",
          status: "Completed",
        },
      ];
    }

    return baseSteps;
  };

  const steps = getSteps();

  return (
    <main className="case-tracking">
      <header>
        <p>07. CASE TRACKING</p>

        <h1>Track your case at every stage.</h1>

        <p>
          Stay updated on what has been completed, what comes next,
          and where your case currently stands.
        </p>
      </header>

      {/* CASE OVERVIEW */}
      <section>
        <div>
          <span>CASE TITLE</span>

          <h2>{caseTitle}</h2>
        </div>

        <div>
          <span>CATEGORY</span>

          <p>{category}</p>
        </div>

        <div>
          <span>CASE STATUS</span>

          <p>{getCurrentStage()}</p>
        </div>
      </section>

      {/* CASE JOURNEY */}
      <section>
        {steps.map((step) => (
          <article key={step.number}>
            <span>{step.number}</span>

            <div>
              <h3>{step.title}</h3>

              <p>{step.description}</p>
            </div>

            <strong>{step.status}</strong>
          </article>
        ))}
      </section>

      {/* CURRENT ACTION */}
      <section>
        <span>CURRENT ACTION</span>

        {caseStatus === "ready" && (
          <>
            <h2>Ready to submit your case.</h2>

            <p>
              Your document is prepared. Submit it to{" "}
              <strong>{authority}</strong> using{" "}
              <strong>{submissionMode}</strong>.
            </p>

            <button
              onClick={() =>
                navigate("/case/document")
              }
            >
              View Document
            </button>

            <button onClick={handleSubmitCase}>
              I've Submitted This Case
            </button>
          </>
        )}

        {caseStatus === "submitted" && (
          <>
            <h2>Your case has been submitted.</h2>

            <p>
              Your case is now awaiting review by{" "}
              <strong>{authority}</strong>.
            </p>

            <button onClick={handleMarkUnderReview}>
              Mark as Under Review
            </button>
          </>
        )}

        {caseStatus === "review" && (
          <>
            <h2>Your case is under review.</h2>

            <p>
              Are you still waiting for a response, or has the
              authority responded?
            </p>

            <button onClick={handleResponseReceived}>
              I Received a Response
            </button>

            <p>
              If you haven't received a response yet, you can
              leave this case in the current review stage.
            </p>
          </>
        )}

        {caseStatus === "response-received" && (
          <>
            <h2>Authority response received.</h2>

            <p>
              Let's understand the response and determine
              whether your issue has actually been resolved.
            </p>

            <button
              onClick={() =>
                navigate("/case/follow-up")
              }
            >
              Analyse Response →
            </button>
          </>
        )}

        {caseStatus === "action-needed" && (
          <>
            <h2>Further action may be required.</h2>

            <p>
              The authority's response did not fully resolve
              your case. eSahay can help identify the next
              escalation route.
            </p>

            <button
              onClick={() =>
                navigate("/case/follow-up")
              }
            >
              Continue with Follow-up →
            </button>
          </>
        )}

        {caseStatus === "resolved" && (
          <>
            <h2>Your case has been resolved. ✓</h2>

            <p>
              The issue has been marked as resolved based on
              the citizen's confirmation.
            </p>

            <button
              onClick={() =>
                navigate("/dashboard")
              }
            >
              Return to Dashboard →
            </button>
          </>
        )}
      </section>

      {/* LATEST UPDATE */}
      <section>
        <span>LATEST UPDATE</span>

        {caseStatus === "ready" && (
          <p>
            Your case has been analysed successfully and your
            document is ready for submission.
          </p>
        )}

        {caseStatus === "submitted" && (
          <p>
            You marked this case as submitted to{" "}
            {authority}.
          </p>
        )}

        {caseStatus === "review" && (
          <p>
            Your case is currently under review by{" "}
            {authority}. If you receive a response, return
            here to continue.
          </p>
        )}

        {caseStatus === "response-received" && (
          <p>
            A response has been received from{" "}
            {authority}. Analyse it to determine what should
            happen next.
          </p>
        )}

        {caseStatus === "action-needed" && (
          <p>
            Further action may be required. Continue to the
            follow-up flow for an escalation recommendation.
          </p>
        )}

        {caseStatus === "resolved" && (
          <p>
            This case has been marked as resolved based on
            the citizen's confirmation.
          </p>
        )}
      </section>

      {/* NAVIGATION */}
      <footer>
        <button
          onClick={() =>
            navigate("/case/document")
          }
        >
          ← Back to Document
        </button>

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