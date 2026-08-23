import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./DocumentGenerator.css";

function DocumentGenerator() {
  const navigate = useNavigate();

  const [documentText, setDocumentText] = useState(null);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState("");
  const [downloadError, setDownloadError] = useState("");
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

      setDocumentText(
        typeof parsedData.draftDocument === "string"
          ? parsedData.draftDocument
          : ""
      );
    } catch (error) {
      console.error("Failed to read draft document:", error);

      setError(
        "We couldn't load the document for this case."
      );
    }
  }, []);

  const handleStartAgain = () => {
    sessionStorage.removeItem("esahay_ai_result");
    navigate("/case/intake");
  };

  const handleCopy = async () => {
    if (!documentText?.trim()) {
      setCopyError("There is no document to copy.");
      return;
    }

    setCopyError("");
    setDownloadError("");

    try {
      await navigator.clipboard.writeText(documentText);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy document:", error);

      setCopyError(
        "We couldn't copy the document. Please select and copy the text manually."
      );
    }
  };

  const handleDownload = () => {
    if (!documentText?.trim()) {
      setDownloadError("There is no document to download.");
      return;
    }

    setDownloadError("");
    setCopyError("");

    try {
      const blob = new Blob([documentText], {
        type: "text/plain;charset=utf-8",
      });

      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;
      link.download = "eSahay-Document.txt";

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download document:", error);

      setDownloadError(
        "We couldn't download the document. Please try again."
      );
    }
  };

  if (error) {
    return (
      <main className="document-generator">
        <header className="document-header">
          <p className="eyebrow">06. DOCUMENT GENERATOR</p>

          <h1>We couldn't load your document.</h1>

          <p>{error}</p>
        </header>

        <button onClick={handleStartAgain}>
          Start Again →
        </button>
      </main>
    );
  }

  if (documentText === null) {
    return (
      <main className="document-generator">
        <div className="document-loading">
          <span />
          <p role="status" aria-live="polite">
            Preparing your document...
          </p>
        </div>
      </main>
    );
  }

  const hasDocument = documentText.trim().length > 0;

  const wordCount = documentText.trim()
    ? documentText.trim().split(/\s+/).length
    : 0;

  return (
    <main className="document-generator">

      {/* HEADER */}

      <header className="document-header">

        <div>
          <p className="eyebrow">
            06. DOCUMENT GENERATOR
          </p>

          <h1>
            {hasDocument
              ? "Your document is ready."
              : "Your document needs more information."}
          </h1>

          <p>
            {hasDocument
              ? "Review the AI-generated draft, make any necessary changes, and prepare it for formal submission."
              : "We couldn't generate a complete draft from the information available for this case."}
          </p>
        </div>

        <div className="document-header__mark">
          <span>06</span>
          <small>
            DRAFT
            <br />
            DOCUMENT
          </small>
        </div>

      </header>


      {hasDocument ? (
        <>

          {/* EDITOR */}

          <section className="document-workspace">

            <div className="document-toolbar">

              <div className="document-toolbar__left">

                <span className="document-status">
                  <i />
                  AI GENERATED DRAFT
                </span>

                <span className="document-toolbar__divider" />

                <span>
                  EDITABLE
                </span>

              </div>

              <div className="document-toolbar__right">

                <span>
                  {wordCount} words
                </span>

              </div>

            </div>


            <div className="document-paper">

              <div className="document-paper__header">

                <span>
                  eSAHAY
                </span>

                <span>
                  CITIZEN ACTION DOCUMENT
                </span>

              </div>

              <textarea
                value={documentText}
                onChange={(e) => {
                  setDocumentText(e.target.value);
                  setCopyError("");
                  setDownloadError("");
                }}
                aria-label="Editable legal document"
                spellCheck="true"
              />

              <div className="document-paper__footer">

                <span>
                  Prepared with eSahay
                </span>

                <span>
                  REVIEW BEFORE SUBMISSION
                </span>

              </div>

            </div>


            {/* ACTION BAR */}

            <div className="document-actions">

              <div>
                <span className="section-label">
                  DOCUMENT ACTIONS
                </span>

                <p>
                  Edit the draft if needed, then copy or
                  download it for submission.
                </p>
              </div>

              <div className="document-actions__buttons">

                <button
                  type="button"
                  className="document-copy"
                  onClick={handleCopy}
                >
                  {copied
                    ? "✓ Copied"
                    : "Copy Document"}
                </button>

                <button
                  type="button"
                  onClick={handleDownload}
                >
                  Download Document ↓
                </button>

              </div>

            </div>


            {(copyError || downloadError) && (
              <div
                className="document-error"
                role="alert"
              >
                {copyError || downloadError}
              </div>
            )}

          </section>


          {/* IMPORTANT */}

          <section className="document-note">

            <span className="document-note__icon">
              i
            </span>

            <div>
              <strong>
                Important: review before submitting
              </strong>

              <p>
                This document is an AI-generated draft.
                Verify names, dates, reference numbers,
                addresses and legal details before sending
                it to an authority.
              </p>
            </div>

          </section>

        </>
      ) : (

        /* EMPTY STATE */

        <section className="document-empty">

          <div className="document-empty__icon">
            —
          </div>

          <div>
            <span className="section-label">
              DOCUMENT STATUS
            </span>

            <h2>
              No complete draft available.
            </h2>

            <p>
              We couldn't generate a complete document from
              the information currently available for this
              case.
            </p>

            <p>
              You can still continue to case tracking and
              provide more information later.
            </p>
          </div>

        </section>

      )}


      {/* FOOTER */}

      <footer className="document-footer">

        <button
          type="button"
          className="ui-secondary"
          onClick={() => navigate("/case/action")}
        >
          ← Back to Action Plan
        </button>


        <div className="document-progress">

          <span>05</span>

          <div>
            <i />
            <i />
            <i />
            <i />
            <i className="active" />
          </div>

          <span>07</span>

        </div>


        <button
          type="button"
          onClick={() => navigate("/case/track")}
        >
          Continue to Case Tracking →
        </button>

      </footer>

    </main>
  );
}

export default DocumentGenerator;