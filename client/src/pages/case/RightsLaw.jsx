import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function RightsLaw() {
  const navigate = useNavigate();
  const [rights, setRights] = useState([]);

  useEffect(() => {
    const storedData = sessionStorage.getItem("esahay_ai_result");

    if (!storedData) {
      navigate("/case/intake");
      return;
    }

    try {
      const parsedData = JSON.parse(storedData);
      setRights(parsedData.applicableRights || []);
    } catch (error) {
      console.error("Failed to read rights data:", error);
      navigate("/case/intake");
    }
  }, [navigate]);

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
              <span>RIGHT {String(index + 1).padStart(2, "0")}</span>

              <h2>{item.right}</h2>

              <p>
                <strong>{item.lawSource}</strong>
              </p>

              <p>{item.citationSummary}</p>
            </article>
          ))
        ) : (
          <p>
            No specific legal rights were identified for this case.
          </p>
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