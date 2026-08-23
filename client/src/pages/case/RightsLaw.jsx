import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function RightsLaw() {
  const navigate = useNavigate();

  const [rights, setRights] = useState(null);
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

      setRights(
        Array.isArray(parsedData.applicableRights)
          ? parsedData.applicableRights
          : []
      );
    } catch (error) {
      console.error("Failed to read rights data:", error);

      setError(
        "We couldn't load the legal information for this case."
      );
    }
  }, []);

  const handleStartAgain = () => {
    sessionStorage.removeItem("esahay_ai_result");
    navigate("/case/intake");
  };

  if (error) {
    return (
      <main className="rights-law">
        <header>
          <p>03. RIGHTS & LAW</p>

          <h1>We couldn't load your case.</h1>

          <p>{error}</p>
        </header>

        <button onClick={handleStartAgain}>
          Start Again →
        </button>
      </main>
    );
  }

  if (rights === null) {
    return (
      <main className="rights-law">
        <p role="status" aria-live="polite">
          Loading your legal information...
        </p>
      </main>
    );
  }

  return (
    <main className="rights-law">
      <header>
        <p>03. RIGHTS & LAW</p>

        <h1>Know what protects you.</h1>

        <p>
          These are the legal rights and provisions identified
          for your case.
        </p>
      </header>

      <section>
        {rights.length > 0 ? (
          rights.map((item, index) => (
            <article key={index}>
              <span>
                RIGHT {String(index + 1).padStart(2, "0")}
              </span>

              <h2>
                {item.right || "Legal right identified"}
              </h2>

              <p>
                <strong>
                  {item.lawSource || "Legal source not specified"}
                </strong>
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
              No specific legal rights were identified for this
              case.
            </p>

            <small>
              You can still continue to the recommended authority
              and action plan.
            </small>
          </div>
        )}
      </section>

      <footer>
        <button onClick={() => navigate("/case/summary")}>
          ← Back to Summary
        </button>

        <button onClick={() => navigate("/case/authority")}>
          Continue to Authority →
        </button>
      </footer>
    </main>
  );
}

export default RightsLaw;