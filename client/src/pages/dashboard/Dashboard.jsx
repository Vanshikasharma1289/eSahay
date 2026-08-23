import "./Dashboard.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [caseData, setCaseData] = useState(null);
  const [caseStatus, setCaseStatus] = useState(null);

  useEffect(() => {
    const loadCase = () => {
      const storedData =
        sessionStorage.getItem("esahay_ai_result");

      if (!storedData) {
        setCaseData(null);
        setCaseStatus(null);
        return;
      }

      try {
        const parsedData = JSON.parse(storedData);

        if (parsedData && typeof parsedData === "object") {
          setCaseData(parsedData);
        }

        const savedStatus =
          sessionStorage.getItem("esahay_case_status");

        setCaseStatus(savedStatus || "ready");
      } catch (error) {
        console.error(
          "Failed to read dashboard case data:",
          error
        );

        sessionStorage.removeItem("esahay_ai_result");
        sessionStorage.removeItem("esahay_case_status");

        setCaseData(null);
        setCaseStatus(null);
      }
    };

    loadCase();

    // Refresh dashboard state when user returns to this page
    window.addEventListener("focus", loadCase);

    return () => {
      window.removeEventListener("focus", loadCase);
    };
  }, []);

  const handleStartNewCase = () => {
    sessionStorage.removeItem("esahay_ai_result");
    sessionStorage.removeItem("esahay_case_status");
    sessionStorage.removeItem("esahay_case_response");

    navigate("/case/intake");
  };

  const handleViewCase = () => {
    navigate("/case/track");
  };

  const caseTitle =
    caseData?.title || "Your current case";

  const category =
    caseData?.category || "General";

  const authority =
    caseData?.designatedAuthority?.department ||
    "Recommended authority";

  const hasCase = Boolean(caseData);

  /*
   * Convert internal status values into
   * citizen-friendly labels.
   */
  const getStatusLabel = () => {
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
        return "Resolved ✓";

      default:
        return "Action Plan Ready";
    }
  };

  /*
   * Tell the citizen what they should
   * do at the current stage.
   */
  const getNextAction = () => {
    switch (caseStatus) {
      case "ready":
        return "Submit your prepared document.";

      case "submitted":
        return "Await review from the authority.";

      case "review":
        return "Wait for the authority's response.";

      case "response-received":
        return "Analyse the authority's response.";

      case "action-needed":
        return "Review the recommended next step.";

      case "resolved":
        return "Your case journey is complete.";

      default:
        return "Review your case.";
    }
  };

  /*
   * Journey status helper
   */
  const isCompleted = (stage) => {
    if (caseStatus === "resolved") {
      return true;
    }

    if (stage === "understand") {
      return true;
    }

    if (stage === "rights") {
      return true;
    }

    if (stage === "authority") {
      return true;
    }

    if (stage === "action") {
      return [
        "submitted",
        "review",
        "response-received",
        "action-needed",
        "resolved",
      ].includes(caseStatus);
    }

    if (stage === "resolve") {
      return caseStatus === "resolved";
    }

    return false;
  };

  return (
    <main className="dashboard">

      {/* HEADER */}
      <header>
        <p>DASHBOARD</p>

        <h1>
          Welcome to eSahay
          {user?.name ? `, ${user.name}` : ""}
        </h1>

        <p>
          Understand your case, know your next step, and
          keep everything in one place.
        </p>
      </header>

      {/* ACTIVE CASE / EMPTY STATE */}
      {hasCase ? (
        <section>

          {/* CASE */}
          <div>
            <span>ACTIVE CASE</span>

            <h2>{caseTitle}</h2>

            <p>{category}</p>
          </div>

          {/* STATUS */}
          <div>
            <span>CASE STATUS</span>

            <p>{getStatusLabel()}</p>

            <p>{getNextAction()}</p>
          </div>

          {/* AUTHORITY */}
          <div>
            <span>RECOMMENDED AUTHORITY</span>

            <p>{authority}</p>
          </div>

          {/* CASE ACTION */}
          <div>
            <button onClick={handleViewCase}>
              {caseStatus === "resolved"
                ? "View Case →"
                : "Resume Case →"}
            </button>
          </div>

        </section>
      ) : (

        <section>
          <span>NO ACTIVE CASE</span>

          <h2>
            Start with what happened.
          </h2>

          <p>
            Tell eSahay about your problem and we'll help
            you understand your rights, find the right
            authority, and figure out what to do next.
          </p>

          <button onClick={handleStartNewCase}>
            Start a New Case →
          </button>
        </section>

      )}

      {/* QUICK ACTIONS */}
      <section>

        <h2>
          What would you like to do?
        </h2>

        <div>

          <button onClick={handleStartNewCase}>
            Start New Case
          </button>

          {hasCase && (
            <button onClick={handleViewCase}>
              {caseStatus === "resolved"
                ? "View Current Case"
                : "Continue Current Case"}
            </button>
          )}

          <button
            onClick={() =>
              navigate("/assistant")
            }
          >
            Ask eSahay
          </button>

        </div>

      </section>

      {/* CASE JOURNEY */}
      {hasCase && (

        <section>

          <span>YOUR JOURNEY</span>

          {/* STEP 01 */}
          <div>
            <span>01</span>

            <strong>
              Understand
            </strong>

            <small>
              {isCompleted("understand")
                ? "Completed"
                : "Pending"}
            </small>
          </div>

          {/* STEP 02 */}
          <div>
            <span>02</span>

            <strong>
              Know your rights
            </strong>

            <small>
              {isCompleted("rights")
                ? "Completed"
                : "Pending"}
            </small>
          </div>

          {/* STEP 03 */}
          <div>
            <span>03</span>

            <strong>
              Find authority
            </strong>

            <small>
              {isCompleted("authority")
                ? "Completed"
                : "Pending"}
            </small>
          </div>

          {/* STEP 04 */}
          <div>
            <span>04</span>

            <strong>
              Take action
            </strong>

            <small>
              {isCompleted("action")
                ? "Completed"
                : "Ready"}
            </small>
          </div>

          {/* STEP 05 */}
          <div>
            <span>05</span>

            <strong>
              Resolve
            </strong>

            <small>
              {isCompleted("resolve")
                ? "Completed ✓"
                : "Pending"}
            </small>
          </div>

        </section>

      )}

    </main>
  );
}

export default Dashboard;