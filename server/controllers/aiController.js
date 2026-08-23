const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.resolve(__dirname, "../.env") });

// Helper: Dynamically find active model with gemini-3.6-flash prioritized
const getAvailableModelName = async (apiKey) => {
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`,
    );
    const data = await res.json();

    if (data.models && data.models.length > 0) {
      const generativeModels = data.models.filter(
        (m) =>
          m.supportedGenerationMethods &&
          m.supportedGenerationMethods.includes("generateContent"),
      );

      // 1. First priority: gemini-3.6-flash requested by API
      const modernFlash = generativeModels.find((m) =>
        m.name.includes("gemini-3.6-flash"),
      );
      if (modernFlash) return modernFlash.name;

      // 2. Second priority: any other active Flash model
      const anyFlash = generativeModels.find((m) =>
        m.name.toLowerCase().includes("flash"),
      );
      if (anyFlash) return anyFlash.name;

      // 3. Fallback to first available generative model
      if (generativeModels.length > 0) return generativeModels[0].name;
    }
  } catch (err) {
    console.warn(
      "[AI Model Discovery] Falling back to default model:",
      err.message,
    );
  }
  return "models/gemini-3.6-flash";
};

// @route   POST /api/ai/analyze
// @access  Private (Protected by JWT)
const analyzeLegalIssue = async (req, res) => {
  try {
    const { problemText, language = "en" } = req.body;

    if (!problemText || problemText.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide details or notice text to analyze.",
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        success: false,
        message: "GEMINI_API_KEY is not configured in server .env",
      });
    }

    // 1. Discover or select model
    const modelResource = await getAvailableModelName(apiKey);
    const cleanModelName = modelResource.startsWith("models/")
      ? modelResource
      : `models/${modelResource}`;
    console.log(`[eSahay AI Engine] Calling active model: ${cleanModelName}`);

    const promptText = `
You are the core intelligence engine of "eSahay", an AI-powered civic legal action platform in India.
Analyze this citizen grievance under applicable Indian laws:
"""
${problemText}
"""

The citizen's preferred output language is: "${language === "hi" ? "Hindi" : "English"}".

Output a strictly valid JSON object matching this schema:
{
  "title": "Short descriptive title of the grievance/case (Max 8 words)",
  "category": "RTI" | "Consumer Dispute" | "Tenant Rights" | "Electricity/Utility" | "Other",
  "extractedDetails": {
    "name": "Extracted citizen/recipient name if mentioned, otherwise 'Citizen'",
    "caseNumber": "Extracted account number, bill number, notice number, or 'N/A'",
    "noticeDate": "Extracted date if mentioned, otherwise null",
    "keyIssue": "1-2 sentence crisp factual summary of the violation or dispute"
  },
  "applicableRights": [
    {
      "right": "Specific legal right in plain language (e.g. Mandatory 15-Day Prior Notice Before Disconnection)",
      "lawSource": "Exact Indian Law clause (e.g. Section 56(1), Electricity Act, 2003)",
      "citationSummary": "Brief 1-sentence legal reason why this clause applies here"
    }
  ],
  "designatedAuthority": {
    "department": "Exact authority to address (e.g. Executive Engineer / Public Information Officer / District Consumer Forum)",
    "officeAddress": "Designated local division or office type",
    "submissionMode": "Online Portal / Registered Post with A.D. / In-Person Submission",
    "timelineDays": 30
  },
  "actionSteps": [
    "Step 1: Specific immediate action",
    "Step 2: Filing/Submission action",
    "Step 3: Escalation/Appeal step if no response within statutory timeline"
  ],
  "draftDocument": "A complete, professionally formatted formal letter/RTI application/legal notice ready to send. Include [Date], [Sender Name], [To Address], [Subject Line], clear factual paragraphs citing the specific Indian Acts, and a strict demand/relief clause with a timeline. Write the full text in ${language === "hi" ? "Hindi" : "English"}."
}

Return ONLY the raw JSON object.
`;

    // 2. Call the API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/${cleanModelName}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: promptText }] }],
        }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("[Gemini API Raw Error Response]:", data);
      return res.status(response.status).json({
        success: false,
        message: "Google Gemini API returned an error",
        error: data.error?.message || "Unknown error",
      });
    }

    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) {
      return res.status(500).json({
        success: false,
        message: "Model returned an empty response.",
      });
    }

    // 3. Clean markdown fences and parse JSON
    let cleaned = rawText.trim();
    if (cleaned.startsWith("```json")) {
      cleaned = cleaned
        .replace(/^```json/, "")
        .replace(/```$/, "")
        .trim();
    } else if (cleaned.startsWith("```")) {
      cleaned = cleaned.replace(/^```/, "").replace(/```$/, "").trim();
    }

    const parsedData = JSON.parse(cleaned);

    return res.status(200).json({
      success: true,
      data: parsedData,
    });
  } catch (error) {
    console.error("[AI Controller Crash]:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to process legal issue with AI",
      error: error.message,
    });
  }
};

const chatWithAssistant = async (req, res) => {
  try {
    const { message, language = "en" } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide a message.",
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        success: false,
        message: "GEMINI_API_KEY is not configured.",
      });
    }

    const responseLanguage = language === "hi" ? "Hindi" : "English";

    const promptText = `
You are eSahay, an AI-powered civic legal assistance
assistant for citizens in India.

The user is asking:
"""
${message}
"""

Respond in ${responseLanguage}.

Rules:
- Use simple, easy-to-understand language.
- Help the citizen understand their situation.
- Give practical next steps when appropriate.
- Do not invent laws, sections, authorities, deadlines, or facts.
- If the question requires case-specific legal verification,
  clearly say that the information should be verified with
  the appropriate official authority.
- Do not claim to be a lawyer.
- Keep the response concise and conversational.

Return ONLY the response text.
`;

    const modelResource = await getAvailableModelName(apiKey);

    const cleanModelName = modelResource.startsWith("models/")
      ? modelResource
      : `models/${modelResource}`;

    console.log(`[eSahay Assistant] Calling model: ${cleanModelName}`);

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/${cleanModelName}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: promptText,
                },
              ],
            },
          ],
        }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("[Gemini Assistant Error]:", data);

      return res.status(response.status).json({
        success: false,
        message: "Gemini API returned an error.",
        error: data.error?.message || "Unknown error",
      });
    }

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!reply) {
      return res.status(500).json({
        success: false,
        message: "Assistant returned an empty response.",
      });
    }

    return res.status(200).json({
      success: true,
      reply: reply.trim(),
      language,
    });
  } catch (error) {
    console.error("[eSahay Assistant Crash]:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to process assistant request.",
      error: error.message,
    });
  }
};


const analyzeAuthorityResponse = async (req, res) => {
  try {
    const {
      authorityResponse,
      originalCase,
    } = req.body;

    if (
      !authorityResponse ||
      authorityResponse.trim().length === 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide the response received from the authority.",
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        success: false,
        message:
          "GEMINI_API_KEY is not configured.",
      });
    }

    const modelResource =
      await getAvailableModelName(apiKey);

    const cleanModelName =
      modelResource.startsWith("models/")
        ? modelResource
        : `models/${modelResource}`;

    console.log(
      `[eSahay Follow-up AI] Calling model: ${cleanModelName}`
    );

    const promptText = `
You are the follow-up intelligence engine of eSahay,
an AI-powered civic legal assistance platform in India.

The citizen originally submitted this case:

CASE:
${JSON.stringify(originalCase || {}, null, 2)}

The citizen has now received this response from the
authority:

AUTHORITY RESPONSE:
"""
${authorityResponse}
"""

Analyse whether the authority's response appears to
address the citizen's original issue.

Do NOT invent facts, laws, deadlines, authorities,
or outcomes.

Return ONLY a valid JSON object using this schema:

{
  "outcome": "Resolved" | "Partially Resolved" | "Not Resolved" | "Unclear",
  "summary": "Simple 2-3 sentence explanation of what the authority response means.",
  "nextStep": "The most practical next step for the citizen.",
  "escalationAuthority": "Recommended next authority or escalation route, or null if no escalation is needed.",
  "reason": "Short explanation supporting the outcome."
}

Rules:
- Compare the authority response with the original case.
- Do not assume that silence means resolution.
- If the response does not clearly resolve the original issue,
  prefer "Not Resolved" or "Unclear".
- If the authority has partially addressed the issue,
  use "Partially Resolved".
- If the authority clearly addressed the original issue,
  use "Resolved".
- Keep the language simple and citizen-friendly.
- Do not claim that eSahay or the AI has legally decided
  the case.
`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/${cleanModelName}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: promptText,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error(
        "[Gemini Follow-up Error]:",
        data
      );

      return res.status(response.status).json({
        success: false,
        message:
          "Gemini API returned an error.",
        error:
          data.error?.message ||
          "Unknown error",
      });
    }

    const rawText =
      data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      return res.status(500).json({
        success: false,
        message:
          "Follow-up AI returned an empty response.",
      });
    }

    let cleaned = rawText.trim();

    if (cleaned.startsWith("```json")) {
      cleaned = cleaned
        .replace(/^```json/, "")
        .replace(/```$/, "")
        .trim();
    } else if (cleaned.startsWith("```")) {
      cleaned = cleaned
        .replace(/^```/, "")
        .replace(/```$/, "")
        .trim();
    }

    const parsedData = JSON.parse(cleaned);

    return res.status(200).json({
      success: true,
      data: parsedData,
    });
  } catch (error) {
    console.error(
      "[eSahay Follow-up AI Crash]:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to analyse the authority response.",
      error: error.message,
    });
  }
};

module.exports = {
  analyzeLegalIssue,
  chatWithAssistant,
  analyzeAuthorityResponse,
};