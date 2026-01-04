import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request: Request) {
  try {
    const { code, language } = await request.json();

    if (!code || !language) {
      return NextResponse.json(
        {
          canAnalyze: false,
          refusalReason: "Code and language are required",
          timeComplexity: "",
          spaceComplexity: "",
          explanation: "",
        },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        {
          canAnalyze: false,
          refusalReason: "GEMINI_API_KEY is not configured",
          timeComplexity: "",
          spaceComplexity: "",
          explanation: "",
        },
        { status: 500 }
      );
    }

    if (!process.env.GEMINI_MODEL) {
      return NextResponse.json(
        {
          canAnalyze: false,
          refusalReason: "GEMINI_MODEL is not configured",
          timeComplexity: "",
          spaceComplexity: "",
          explanation: "",
        },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: process.env.GEMINI_MODEL,
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 2000,
      },
    });

    const basePrompt = `
You are an expert algorithm complexity analyzer for interview preparation.

Analyze the following ${language} code and determine its time and space complexity.

CODE:
${code}

STRICT RULES:
1. explanation MUST be a single plain-text string (no objects, no arrays).
2. Do NOT use markdown or code blocks.
3. Do NOT include commentary outside JSON.
4. Only refuse if the code is completely invalid or empty.
5. Use standard Big-O notation.

Return ONLY a valid JSON object with this EXACT structure and types:

{
  "timeComplexity": "O(...)",
  "spaceComplexity": "O(...)",
  "explanation": "single plain-text explanation",
  "optimizations": "plain-text suggestions or null",
  "canAnalyze": true,
  "refusalReason": null
}
`;

    const tryParse = (raw: string) => {
      let clean = raw.trim();

      clean = clean.replace(/```json/gi, "");
      clean = clean.replace(/```/g, "");

      const match = clean.match(/\{[\s\S]*\}/);
      if (match) clean = match[0];

      return JSON.parse(clean);
    };

    let analysis: any;

    try {
      const result = await model.generateContent(basePrompt);
      const text = result.response.text();
      console.log("Gemini raw:", text.slice(0, 1500));
      analysis = tryParse(text);
    } catch (err) {
      console.warn("Initial parse failed, retrying with strict prompt...");

      const retryPrompt = `
Your previous response was invalid.

Re-analyze the following ${language} code and return ONLY valid JSON.

CODE:
${code}

REQUIREMENTS:
- explanation MUST be a single plain-text string
- No markdown
- No nested objects
- No arrays
- Follow this structure EXACTLY:

{
  "timeComplexity": "O(...)",
  "spaceComplexity": "O(...)",
  "explanation": "plain text only",
  "optimizations": "plain text or null",
  "canAnalyze": true,
  "refusalReason": null
}
`;

      try {
        const retryResult = await model.generateContent(retryPrompt);
        const retryText = retryResult.response.text();
        console.log("Gemini retry raw:", retryText.slice(0, 1500));
        analysis = tryParse(retryText);
      } catch (retryErr: any) {
        return NextResponse.json(
          {
            canAnalyze: false,
            refusalReason: "AI returned invalid JSON after retry",
            timeComplexity: "",
            spaceComplexity: "",
            explanation: "",
          },
          { status: 200 }
        );
      }
    }

    // 🔒 HARD VALIDATION
    if (
      !analysis ||
      typeof analysis.timeComplexity !== "string" ||
      typeof analysis.spaceComplexity !== "string" ||
      typeof analysis.explanation !== "string"
    ) {
      console.error("Invalid analysis structure:", analysis);
      return NextResponse.json(
        {
          canAnalyze: false,
          refusalReason: "AI produced invalid analysis structure",
          timeComplexity: "",
          spaceComplexity: "",
          explanation: "",
        },
        { status: 200 }
      );
    }

    // Normalize optimizations defensively
    if (
      analysis.optimizations &&
      typeof analysis.optimizations !== "string"
    ) {
      analysis.optimizations = JSON.stringify(analysis.optimizations);
    }

    analysis.canAnalyze = true;
    analysis.refusalReason = null;

    return NextResponse.json(analysis);
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json(
      {
        canAnalyze: false,
        refusalReason: "Unexpected server error",
        timeComplexity: "",
        spaceComplexity: "",
        explanation: "",
      },
      { status: 200 }
    );
  }
}
