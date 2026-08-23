import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./RightsLaw.css";

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
        <header className="rights-law__header">
          <p className="eyebrow">03. RIGHTS & LAW</p>

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
        <div className="rights-law__loading">
          <span />
          <p role="status" aria-live="polite">
            Reading your legal information...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="rights-law">

      {/* HEADER */}
      <header className="rights-law__header">

        <div>
          <p className="eyebrow">
            03. RIGHTS & LAW
          </p>

          <h1>
            Know what
            <br />
            protects you.
          </h1>

          <p>
            We&apos;ve identified the legal provisions that
            may apply to your situation. Here&apos;s what they
            mean in simple terms.
          </p>
        </div>

        <div className="rights-law__count">
          <strong>
            {String(rights.length).padStart(2, "0")}
          </strong>

          <span>
            PROVISIONS
            <br />
            IDENTIFIED
          </span>
        </div>

      </header>


      {/* INTRO STRIP */}
      <section className="rights-law__intro">

        <div className="rights-law__intro-mark">
          §
        </div>

        <div>
          <span className="rights-law__label">
            YOUR LEGAL POSITION
          </span>

          <h2>
            Understanding your rights
            is the first step.
          </h2>

          <p>
            eSahay has reviewed the information you provided
            and identified provisions that may be relevant.
            Always verify case-specific legal information
            with the appropriate authority.
          </p>
        </div>

      </section>


      {/* RIGHTS */}
      <section className="rights-law__list">

        <div className="rights-law__list-header">

          <div>
            <span className="rights-law__label">
              APPLICABLE PROVISIONS
            </span>

            <h2>
              What protects you.
            </h2>
          </div>

          <span className="rights-law__list-count">
            {rights.length}{" "}
            {rights.length === 1
              ? "RIGHT"
              : "RIGHTS"}
          </span>

        </div>


        {rights.length > 0 ? (
          <div className="rights-law__cards">

            {rights.map((item, index) => (
              <article
                key={index}
                className="right-card"
              >

                <div className="right-card__top">

                  <span className="right-card__number">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <span className="right-card__tag">
                    RIGHT
                  </span>

                </div>


                <div className="right-card__content">

                  <h2>
                    {item.right ||
                      "Legal right identified"}
                  </h2>

                  <div className="right-card__law">

                    <span>
                      LAW / PROVISION
                    </span>

                    <strong>
                      {item.lawSource ||
                        "Legal source not specified"}
                    </strong>

                  </div>

                  <div className="right-card__explanation">

                    <span>
                      WHY THIS MATTERS
                    </span>

                    <p>
                      {item.citationSummary ||
                        "No additional explanation was provided."}
                    </p>

                  </div>

                </div>


                <div className="right-card__arrow">
                  →
                </div>

              </article>
            ))}

          </div>
        ) : (
          <div className="rights-law__empty">

            <div className="rights-law__empty-icon">
              —
            </div>

            <div>
              <h3>
                No specific rights identified.
              </h3>

              <p>
                We couldn't identify a specific legal provision
                from the information provided. You can still
                continue to the recommended authority and action plan.
              </p>
            </div>

          </div>
        )}

      </section>


      {/* DISCLAIMER */}
      <section className="rights-law__note">

        <span className="rights-law__note-mark">
          i
        </span>

        <div>
          <strong>
            A note on legal information
          </strong>

          <p>
            eSahay provides AI-assisted legal information,
            not legal representation. Laws and procedures can
            vary depending on your specific circumstances.
            Verify important details with the relevant
            official authority.
          </p>
        </div>

      </section>


      {/* NAVIGATION */}
      <footer className="rights-law__footer">

        <button
          type="button"
          className="ui-secondary"
          onClick={() => navigate("/case/summary")}
        >
          ← Back to Summary
        </button>

        <div className="rights-law__footer-progress">
          <span>03</span>
          <div>
            <i />
            <i className="active" />
            <i />
            <i />
            <i />
          </div>
          <span>05</span>
        </div>

        <button
          type="button"
          onClick={() => navigate("/case/authority")}
        >
          Continue to Authority →
        </button>

      </footer>

    </main>
  );
}

export default RightsLaw;