import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function ActionPlan() {
  const navigate = useNavigate();
  const [actionSteps, setActionSteps] = useState([]);

  useEffect(() => {
    const storedData = sessionStorage.getItem("esahay_ai_result");

    if (!storedData) {
      navigate("/case/intake");
      return;
    }

    try {
      const parsedData = JSON.parse(storedData);
      setActionSteps(parsedData.actionSteps || []);
    } catch (error) {
      console.error("Failed to read action plan:", error);
      navigate("/case/intake");
    }
  }, [navigate]);

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

              <h2>{step}</h2>
            </article>
          ))
        ) : (
          <p>No action steps were generated for this case.</p>
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