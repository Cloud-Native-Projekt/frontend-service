"use server";

import { AnalysisRequest, AnalysisResult } from "@/types";

export async function analyzeProject(payload: AnalysisRequest): Promise<AnalysisResult> {
  try {
    // Example call to an (assumed) API route. Adjust path / headers as needed.
    const res = await fetch(`${process.env.API_BASE_URL ?? ""}/api/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // Avoid leaking server env if not needed; only send required data.
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`API responded ${res.status}`);
    }

    const data = await res.json();
    return {
      score: typeof data.score === "number" ? data.score : 0,
      details: data.details ?? data,
      generatedAt: new Date().toISOString(),
    };
  } catch (e) {
    // Fallback mock result for now
    return {
      score: Math.round(Math.random() * 100),
      details: {
        note: "Fallback mock result (API unavailable)",
        input: payload,
        error: (e as Error).message,
      },
      generatedAt: new Date().toISOString(),
    };
  }
}