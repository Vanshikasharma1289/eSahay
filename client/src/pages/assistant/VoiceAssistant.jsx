import api from "../../services/api";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

function VoiceAssistant() {
  const navigate = useNavigate();

  const [language, setLanguage] = useState("en-IN");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [listening, setListening] = useState(false);

  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = language;

    recognition.onstart = () => {
      setListening(true);
    };

    recognition.onresult = (event) => {
      const transcript =
        event.results[0][0].transcript;

      setInput(transcript);
      setListening(false);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  }, [language]);

  const startListening = () => {
  const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert("Speech recognition is not supported in this browser.");
    return;
  }

  const recognition = new SpeechRecognition();

  recognition.lang = language;
  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.onstart = () => {
    console.log("🎙️ Voice recognition started");
    setListening(true);
  };

  recognition.onresult = (event) => {
    console.log("🎤 Speech result:", event);

    const transcript =
      event.results[0][0].transcript;

    console.log("📝 Transcript:", transcript);

    setInput(transcript);
    setListening(false);
  };

  recognition.onerror = (event) => {
    console.error("❌ Speech recognition error:", event.error);
    setListening(false);
  };

  recognition.onend = () => {
    console.log("🛑 Voice recognition ended");
    setListening(false);
  };

  recognition.start();
};

  const handleSend = async () => {
  if (!input.trim()) return;

  const userText = input.trim();

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

    setMessages((previous) => [
      ...previous,
      {
        role: "assistant",
        text: response.data.reply,
      },
    ]);
  } catch (error) {
    console.error("Assistant error:", error);

    setMessages((previous) => [
      ...previous,
      {
        role: "assistant",
        text:
          "Sorry, I couldn't process that right now. Please try again.",
      },
    ]);
  }
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
        <div>
          <label htmlFor="language">
            LANGUAGE
          </label>

          <select
            id="language"
            value={language}
            onChange={(e) =>
              setLanguage(e.target.value)
            }
          >
            <option value="en-IN">
              English
            </option>

            <option value="hi-IN">
              हिन्दी
            </option>
          </select>
        </div>

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
                    : "eSAHAY"}
                </span>

                <p>{message.text}</p>
              </article>
            ))
          )}
        </div>

        <div>
          <textarea
            value={input}
            onChange={(e) =>
              setInput(e.target.value)
            }
            placeholder="Type your question..."
            rows={4}
          />

          <button
            type="button"
            onClick={startListening}
            disabled={listening}
          >
            {listening
              ? "Listening..."
              : "🎙 Start Voice"}
          </button>

          <button
            type="button"
            onClick={handleSend}
          >
            Send
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