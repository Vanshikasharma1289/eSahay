import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AuthorityRouter.css";

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

      if (!authorityData || typeof authorityData !== "object") {
        setAuthority(null);
      } else {
        setAuthority(authorityData);
      }
    } catch (error) {
      console.error("Failed to read authority data:", error);

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
        <div className="authority-loading">
          <span />
          <p role="status" aria-live="polite">
            Finding the right authority for your case...
          </p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="authority-router">
        <header className="authority-header">
          <p className="eyebrow">04. AUTHORITY ROUTER</p>

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

      {/* HEADER */}
      <header className="authority-header">

        <div>
          <p className="eyebrow">
            04. AUTHORITY ROUTER
          </p>

          <h1>
            Know where to
            <br />
            take your case.
          </h1>

          <p>
            Based on your case, eSahay has identified the
            authority and submission route most relevant
            to your situation.
          </p>
        </div>

        <div className="authority-header__mark">
          <span>04</span>
          <small>FIND<br />AUTHORITY</small>
        </div>

      </header>


      {authority ? (
        <>
          {/* MAIN AUTHORITY */}
          <section className="authority-main">

            <div className="authority-main__top">

              <div>
                <span className="section-label">
                  RECOMMENDED AUTHORITY
                </span>

                <h2>
                  {authority.department ||
                    "Authority not specified"}
                </h2>
              </div>

              <div className="authority-main__verified">
                <span />
                RECOMMENDED ROUTE
              </div>

            </div>


            <div className="authority-main__details">

              <div className="authority-detail">
                <span>01 / OFFICE</span>

                <h3>
                  {authority.officeAddress ||
                    "Office details not available"}
                </h3>

                <p>
                  The office or department most relevant
                  to your case.
                </p>
              </div>


              <div className="authority-detail">
                <span>02 / SUBMISSION</span>

                <h3>
                  {authority.submissionMode ||
                    "Submission method not specified"}
                </h3>

                <p>
                  Recommended method for submitting
                  your complaint or application.
                </p>
              </div>


              <div className="authority-detail">
                <span>03 / EXPECTED RESPONSE</span>

                <h3>
                  {authority.timelineDays
                    ? `${authority.timelineDays} days`
                    : "Timeline not specified"}
                </h3>

                <p>
                  Indicative response timeline based
                  on the information available.
                </p>
              </div>

            </div>

          </section>


          {/* HOW IT WORKS */}
          <section className="authority-process">

            <div className="authority-process__heading">

              <span className="section-label">
                YOUR NEXT MOVE
              </span>

              <h2>
                Getting there
                <br />
                is the easy part.
              </h2>

            </div>


            <div className="authority-process__steps">

              <article>
                <span>01</span>

                <div>
                  <h3>Prepare</h3>

                  <p>
                    Review your case details and
                    generated document before submission.
                  </p>
                </div>
              </article>


              <article>
                <span>02</span>

                <div>
                  <h3>Submit</h3>

                  <p>
                    Send your complaint or application
                    using the recommended submission route.
                  </p>
                </div>
              </article>


              <article>
                <span>03</span>

                <div>
                  <h3>Follow up</h3>

                  <p>
                    Keep your acknowledgement and track
                    the authority&apos;s response.
                  </p>
                </div>
              </article>

            </div>

          </section>


          {/* IMPORTANT NOTE */}
          <section className="authority-note">

            <span className="authority-note__icon">
              i
            </span>

            <div>
              <strong>
                Before you submit
              </strong>

              <p>
                Authority information and response timelines
                may vary depending on your location and case.
                Verify the final submission details with the
                official authority before filing.
              </p>
            </div>

          </section>

        </>
      ) : (

        /* EMPTY STATE */
        <section className="authority-empty">

          <div className="authority-empty__mark">
            ?
          </div>

          <div>
            <span className="section-label">
              AUTHORITY ROUTE
            </span>

            <h2>
              No specific authority identified.
            </h2>

            <p>
              We couldn't determine a specific authority from
              the information available for this case.
            </p>

            <p>
              You can still continue to your action plan
              and review the recommended next steps.
            </p>
          </div>

        </section>

      )}


      {/* FOOTER */}
      <footer className="authority-footer">

        <button
          type="button"
          className="ui-secondary"
          onClick={() => navigate("/case/rights")}
        >
          ← Back to Rights
        </button>


        <div className="authority-progress">

          <span>03</span>

          <div>
            <i />
            <i />
            <i className="active" />
            <i />
            <i />
          </div>

          <span>05</span>

        </div>


        <button
          type="button"
          onClick={() => navigate("/case/action")}
        >
          Continue to Action Plan →
        </button>

      </footer>

    </main>
  );
}

export default AuthorityRouter;