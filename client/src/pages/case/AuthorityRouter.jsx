import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AuthorityRouter() {
  const navigate = useNavigate();

  const [authority, setAuthority] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const storedData = sessionStorage.getItem("esahay_ai_result");

    if (!storedData) {
      setError(
        "Your case information is no longer available. Please start your case again."
      );
      setLoading(false);
      return;
    }

    try {
      const parsedData = JSON.parse(storedData);

      if (!parsedData || typeof parsedData !== "object") {
        throw new Error("Invalid case data");
      }

      const authorityData = parsedData.designatedAuthority;

      if (
        !authorityData ||
        typeof authorityData !== "object"
      ) {
        setAuthority(null);
      } else {
        setAuthority(authorityData);
      }
    } catch (error) {
      console.error(
        "Failed to read authority data:",
        error
      );

      setError(
        "We couldn't load the authority information for this case."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const handleStartAgain = () => {
    sessionStorage.removeItem("esahay_ai_result");
    navigate("/case/intake");
  };

  if (loading) {
    return (
      <main className="authority-router">
        <p role="status" aria-live="polite">
          Finding the right authority for your case...
        </p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="authority-router">
        <header>
          <p>04. AUTHORITY ROUTER</p>

          <h1>We couldn't load your case.</h1>

          <p>{error}</p>
        </header>

        <button onClick={handleStartAgain}>
          Start Again →
        </button>
      </main>
    );
  }

  return (
    <main className="authority-router">
      <header>
        <p>04. AUTHORITY ROUTER</p>

        <h1>Know where to take your case.</h1>

        <p>
          Based on your case, eSahay has identified the authority
          and submission route most relevant to your situation.
        </p>
      </header>

      {authority ? (
        <section>
          <div>
            <span>RECOMMENDED AUTHORITY</span>

            <h2>
              {authority.department ||
                "Authority not specified"}
            </h2>
          </div>

          <div>
            <span>OFFICE</span>

            <p>
              {authority.officeAddress ||
                "Office details not available"}
            </p>
          </div>

          <div>
            <span>HOW TO SUBMIT</span>

            <p>
              {authority.submissionMode ||
                "Submission method not specified"}
            </p>
          </div>

          <div>
            <span>EXPECTED RESPONSE</span>

            <p>
              {authority.timelineDays
                ? `${authority.timelineDays} days`
                : "Timeline not specified"}
            </p>
          </div>
        </section>
      ) : (
        <section>
          <div role="status">
            <h2>No specific authority identified.</h2>

            <p>
              We couldn't determine a specific authority from
              the information available for this case.
            </p>

            <p>
              You can still continue to your action plan and
              review the recommended next steps.
            </p>
          </div>
        </section>
      )}

      <footer>
        <button onClick={() => navigate("/case/rights")}>
          ← Back to Rights
        </button>

        <button onClick={() => navigate("/case/action")}>
          Continue to Action Plan →
        </button>
      </footer>
    </main>
  );
}

export default AuthorityRouter;