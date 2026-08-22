import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function DocumentGenerator() {
  const navigate = useNavigate();

  const [documentText, setDocumentText] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const storedData = sessionStorage.getItem("esahay_ai_result");

    if (!storedData) {
      navigate("/case/intake");
      return;
    }

    try {
      const parsedData = JSON.parse(storedData);

      setDocumentText(parsedData.draftDocument || "");
    } catch (error) {
      console.error("Failed to read draft document:", error);
      navigate("/case/intake");
    }
  }, [navigate]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(documentText);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy document:", error);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([documentText], {
      type: "text/plain",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = "eSahay-Document.txt";

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  return (
    <main className="document-generator">
      <header>
        <p>06. DOCUMENT GENERATOR</p>

        <h1>Your document is ready.</h1>

        <p>
          Review the AI-generated draft, make any necessary
          changes, and use it for your formal submission.
        </p>
      </header>

      <section>
        <div>
          <span>EDITABLE DRAFT</span>

          <textarea
            value={documentText}
            onChange={(e) => setDocumentText(e.target.value)}
            rows={25}
          />
        </div>

        <div>
          <button onClick={handleCopy}>
            {copied ? "Copied!" : "Copy Document"}
          </button>

          <button onClick={handleDownload}>
            Download Document
          </button>
        </div>
      </section>

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