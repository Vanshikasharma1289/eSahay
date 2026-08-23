import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
      console.error(
        "Failed to read draft document:",
        error
      );

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
      console.error(
        "Failed to copy document:",
        error
      );

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
      console.error(
        "Failed to download document:",
        error
      );

      setDownloadError(
        "We couldn't download the document. Please try again."
      );
    }
  };

  if (error) {
    return (
      <main className="document-generator">
        <header>
          <p>06. DOCUMENT GENERATOR</p>

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
        <p role="status" aria-live="polite">
          Loading your document...
        </p>
      </main>
    );
  }

  const hasDocument = documentText.trim().length > 0;

  return (
    <main className="document-generator">
      <header>
        <p>06. DOCUMENT GENERATOR</p>

        <h1>
          {hasDocument
            ? "Your document is ready."
            : "Your document needs more information."}
        </h1>

        <p>
          {hasDocument
            ? "Review the AI-generated draft, make any necessary changes, and use it for your formal submission."
            : "We couldn't generate a complete draft from the information available for this case."}
        </p>
      </header>

      <section>
        <div>
          <span>EDITABLE DRAFT</span>

          <textarea
            value={documentText}
            onChange={(e) => {
              setDocumentText(e.target.value);
              setCopyError("");
              setDownloadError("");
            }}
            rows={25}
            placeholder="Your generated document will appear here..."
            disabled={!hasDocument}
            aria-label="Editable legal document"
          />

          <p>
            You can edit this draft before copying or downloading it.
          </p>
        </div>

        {hasDocument && (
          <div>
            <button onClick={handleCopy}>
              {copied ? "Copied!" : "Copy Document"}
            </button>

            <button onClick={handleDownload}>
              Download Document
            </button>
          </div>
        )}

        {copyError && (
          <p role="alert">
            {copyError}
          </p>
        )}

        {downloadError && (
          <p role="alert">
            {downloadError}
          </p>
        )}
      </section>

      {!hasDocument && (
        <section role="status">
          <p>
            You can still continue to case tracking. The document
            can be generated again after providing more information.
          </p>
        </section>
      )}

      <footer>
        <button onClick={() => navigate("/case/action")}>
          ← Back to Action Plan
        </button>

        <button onClick={() => navigate("/case/track")}>
          Continue to Case Tracking →
        </button>
      </footer>
    </main>
  );
}

export default DocumentGenerator;