import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function CaseTracking() {
  const navigate = useNavigate();

  const [caseData, setCaseData] = useState(null);

  useEffect(() => {
    const storedData = sessionStorage.getItem("esahay_ai_result");

    if (!storedData) {
      navigate("/case/intake");
      return;
    }

    try {
      const parsedData = JSON.parse(storedData);
      setCaseData(parsedData);
    } catch (error) {
      console.error("Failed to read case data:", error);
      navigate("/case/intake");
    }
  }, [navigate]);

  if (!caseData) {
    return <div>Loading case...</div>;
  }

  const steps = [
    {
      number: "01",
      title: "Intake",
      description: "Your problem was submitted.",
      status: "Completed",
    },
    {
      number: "02",
      title: "Review",
      description: "Your case was analysed by eSahay.",
      status: "Completed",
    },
    {
      number: "03",
      title: "Filed",
      description: "Your recommended action is ready.",
      status: "Completed",
    },
    {
      number: "04",
      title: "Authority",
      description: "Submit your case to the recommended authority.",
      status: "Upcoming",
    },
    {
      number: "05",
      title: "Resolution",
      description: "Await the authority's response.",
      status: "Pending",
    },
  ];

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

      <section>
        <div>
          <span>CASE TITLE</span>
          <h2>{caseData.title || "Your Legal Case"}</h2>
        </div>

        <div>
          <span>CATEGORY</span>
          <p>{caseData.category || "General"}</p>
        </div>

        <div>
          <span>CASE STATUS</span>
          <p>Action Plan Ready</p>
        </div>
      </section>

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

      <section>
        <span>LATEST UPDATE</span>

        <p>
          Your case has been analysed successfully. Review the
          recommended authority and action plan before submitting
          your documents.
        </p>
      </section>

      <footer>
        <button onClick={() => navigate("/case/document")}>
          ← Back to Document
        </button>

        <button onClick={() => navigate("/dashboard")}>
          Return to Dashboard →
        </button>
      </footer>
    </main>
  );
}

export default CaseTracking;