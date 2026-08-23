import api from "../../services/api";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

function VoiceAssistant() {
  const navigate = useNavigate();

  const [language, setLanguage] = useState("en-IN");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  const [listening, setListening] = useState(false);
  const [sending, setSending] = useState(false);

  const [voiceError, setVoiceError] = useState("");
  const [inputError, setInputError] = useState("");

  const recognitionRef = useRef(null);

  const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

  useEffect(() => {
    setVoiceError("");
    setInputError("");

    if (!SpeechRecognition) {
      setVoiceError(
        "Voice input isn't supported in this browser. You can still type your question below."
      );
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = language;

    recognition.onstart = () => {
      setListening(true);
      setVoiceError("");
    };

    recognition.onresult = (event) => {
      const transcript =
        event.results?.[0]?.[0]?.transcript || "";

      if (transcript.trim()) {
        setInput(transcript);
        setInputError("");
      }

      setListening(false);
    };

    recognition.onerror = (event) => {
      console.error(
        "Speech recognition error:",
        event.error
      );

      setListening(false);

      switch (event.error) {
        case "not-allowed":
        case "service-not-allowed":
          setVoiceError(
            "Microphone access was denied. Please allow microphone permission or type your question instead."
          );
          break;

        case "no-speech":
          setVoiceError(
            "We didn't hear anything. Please try speaking again."
          );
          break;

        case "audio-capture":
          setVoiceError(
            "We couldn't access your microphone. Please check your microphone and try again."
          );
          break;

        case "network":
          setVoiceError(
            "Voice recognition needs a network connection. Please try again."
          );
          break;

        default:
          setVoiceError(
            "Voice input couldn't be started. Please try again or type your question."
          );
      }
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      try {
        recognition.stop();
      } catch {
        // Recognition may already be stopped.
      }

      recognitionRef.current = null;
    };
  }, [language, SpeechRecognition]);

  const startListening = () => {
    if (!SpeechRecognition) {
      setVoiceError(
        "Voice input isn't supported in this browser. Please type your question instead."
      );
      return;
    }

    if (sending) {
      return;
    }

    setVoiceError("");
    setInputError("");

    try {
      if (recognitionRef.current) {
        recognitionRef.current.start();
      }
    } catch (error) {
      console.error(
        "Failed to start voice recognition:",
        error
      );

      setListening(false);

      setVoiceError(
        "Voice input couldn't be started. Please try again."
      );
    }
  };

  const stopListening = () => {
    if (!recognitionRef.current) {
      return;
    }

    try {
      recognitionRef.current.stop();
    } catch (error) {
      console.error(
        "Failed to stop voice recognition:",
        error
      );
    }

    setListening(false);
  };

  const handleLanguageChange = (event) => {
    if (listening) {
      stopListening();
    }

    setLanguage(event.target.value);
    setVoiceError("");
  };

  const handleInputChange = (event) => {
    setInput(event.target.value);

    if (inputError) {
      setInputError("");
    }
  };

  const handleSend = async () => {
    const userText = input.trim();

    if (!userText) {
      setInputError(
        "Please type or speak a question before sending."
      );
      return;
    }

    if (sending) {
      return;
    }

    if (listening) {
      stopListening();
    }

    setInputError("");
    setVoiceError("");
    setSending(true);

    setMessages((previous) => [
      ...previous,
      {
        role: "user",
        text: userText,
      },
    ]);

    setInput("");

    try {
      const response = await api.post("/ai/chat", {
        message: userText,
        language: language === "hi-IN" ? "hi" : "en",
      });

      const reply = response.data?.reply;

      if (!reply) {
        throw new Error("Assistant returned an empty response.");
      }

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          text: reply,
        },
      ]);
    } catch (error) {
      console.error("Assistant error:", error);

      let errorMessage =
        "We couldn't process your question right now. Please try again.";

      if (error.response?.status === 401) {
        errorMessage =
          "Your session has expired. Please log in again.";
      } else if (error.response?.status >= 500) {
        errorMessage =
          "The assistant is temporarily unavailable. Please try again in a moment.";
      }

      setMessages((previous) => [
        ...previous,
        {
          role: "error",
          text: errorMessage,
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  const handleRetry = () => {
    const lastUserMessage = [...messages]
      .reverse()
      .find((message) => message.role === "user");

    if (!lastUserMessage) {
      return;
    }

    setInput(lastUserMessage.text);
    setInputError("");
  };

  return (
    <main className="voice-assistant">
      <header>
        <p>08. VOICE & LANGUAGE ASSISTANT</p>

        <h1>Ask eSahay anything.</h1>

        <p>
          Explain your problem naturally in your preferred
          language and get guidance in simple terms.
        </p>
      </header>

      <section>
        {/* LANGUAGE */}
        <div>
          <label htmlFor="language">
            LANGUAGE
          </label>

          <select
            id="language"
            value={language}
            onChange={handleLanguageChange}
            disabled={sending}
          >
            <option value="en-IN">
              English
            </option>

            <option value="hi-IN">
              हिन्दी
            </option>
          </select>
        </div>

        {/* CONVERSATION */}
        <div>
          {messages.length === 0 ? (
            <p>
              Start by describing your problem.
            </p>
          ) : (
            messages.map((message, index) => (
              <article
                key={index}
                className={message.role}
              >
                <span>
                  {message.role === "user"
                    ? "YOU"
                    : message.role === "error"
                    ? "ERROR"
                    : "eSAHAY"}
                </span>

                <p>{message.text}</p>

                {message.role === "error" && (
                  <button
                    type="button"
                    onClick={handleRetry}
                    disabled={sending}
                  >
                    Try Again
                  </button>
                )}
              </article>
            ))
          )}

          {sending && (
            <article
              className="assistant"
              role="status"
              aria-live="polite"
            >
              <span>eSAHAY</span>

              <p>
                Understanding your question...
              </p>
            </article>
          )}
        </div>

        {/* INPUT */}
        <div>
          <textarea
            value={input}
            onChange={handleInputChange}
            placeholder={
              language === "hi-IN"
                ? "अपना सवाल लिखें..."
                : "Type your question..."
            }
            rows={4}
            disabled={sending}
            aria-invalid={Boolean(inputError)}
            aria-describedby={
              inputError ? "assistant-input-error" : undefined
            }
          />

          {inputError && (
            <p
              id="assistant-input-error"
              role="alert"
            >
              {inputError}
            </p>
          )}

          {voiceError && (
            <p role="alert">
              {voiceError}
            </p>
          )}

          <button
            type="button"
            onClick={
              listening
                ? stopListening
                : startListening
            }
            disabled={sending}
          >
            {listening
              ? "Stop Listening"
              : "🎙 Start Voice"}
          </button>

          <button
            type="button"
            onClick={handleSend}
            disabled={sending}
          >
            {sending ? "Thinking..." : "Send"}
          </button>
        </div>
      </section>

      <footer>
        <button
          onClick={() => navigate("/dashboard")}
        >
          ← Back to Dashboard
        </button>
      </footer>
    </main>
  );
}

export default VoiceAssistant;