import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
      console.error(
        "Failed to read action plan:",
        error
      );

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
        <header>
          <p>05. ACTION & DEADLINE</p>

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
        <p role="status" aria-live="polite">
          Preparing your action plan...
        </p>
      </main>
    );
  }

  return (
    <main className="action-plan">
      <header>
        <p>05. ACTION & DEADLINE</p>

        <h1>Know what to do next.</h1>

        <p>
          A practical action plan based on the details and
          legal context of your case.
        </p>
      </header>

      <section>
        {actionSteps.length > 0 ? (
          actionSteps.map((step, index) => (
            <article key={index}>
              <span>
                STEP {String(index + 1).padStart(2, "0")}
              </span>

              <h2>
                {step || `Action ${index + 1}`}
              </h2>
            </article>
          ))
        ) : (
          <div role="status">
            <h2>No action steps were generated.</h2>

            <p>
              We couldn't create a specific action plan from
              the information available for this case.
            </p>

            <p>
              You can still continue to the document stage
              and review the available information.
            </p>
          </div>
        )}
      </section>

      <footer>
        <button onClick={() => navigate("/case/authority")}>
          ← Back to Authority
        </button>

        <button onClick={() => navigate("/case/document")}>
          Continue to Document →
        </button>
      </footer>
    </main>
  );
}

export default ActionPlan;