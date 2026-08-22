import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AuthorityRouter() {
  const navigate = useNavigate();
  const [authority, setAuthority] = useState(null);

  useEffect(() => {
    const storedData = sessionStorage.getItem("esahay_ai_result");

    if (!storedData) {
      navigate("/case/intake");
      return;
    }

    try {
      const parsedData = JSON.parse(storedData);
      setAuthority(parsedData.designatedAuthority || null);
    } catch (error) {
      console.error("Failed to read authority data:", error);
      navigate("/case/intake");
    }
  }, [navigate]);

  if (!authority) {
    return <div>Loading authority information...</div>;
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

      <section>
        <div>
          <span>RECOMMENDED AUTHORITY</span>
          <h2>{authority.department || "Not available"}</h2>
        </div>

        <div>
          <span>OFFICE</span>
          <p>{authority.officeAddress || "Not available"}</p>
        </div>

        <div>
          <span>HOW TO SUBMIT</span>
          <p>{authority.submissionMode || "Not available"}</p>
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