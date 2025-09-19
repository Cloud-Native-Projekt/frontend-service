"use server";

import { AnalysisRequest, AnalysisResult } from "@/types";

type GeoResponse = unknown;
type WeatherResponse = unknown;

export async function analyzeCoordinates(_payload: AnalysisRequest): Promise<AnalysisResult> {
  const GEO_URL = process.env.GEO_SERVICE_URL;
  const WEATHER_URL = process.env.WEATHER_SERVICE_URL;

  if (!GEO_URL || !WEATHER_URL) {
    return {
      score: 0,
      details: {
        error: "Missing GEO_SERVICE_URL or WEATHER_SERVICE_URL",
        env: { hasGeo: !!GEO_URL, hasWeather: !!WEATHER_URL },
      },
      generatedAt: new Date().toISOString(),
    };
  }

  try {
    const [geoRes, weatherRes] = await Promise.all([
      fetch(GEO_URL + "/geo/power?lat=48.8290&lng=9.3126&radius=2000", { method: "GET", cache: "no-store" }),
      fetch(WEATHER_URL + "/daily/2025-09-21/48.8290/9.3126/all", { method: "GET", cache: "no-store" }),
    ]);

    console.log("Geo response:", await geoRes.clone().json());
    console.log("Weather response:", await weatherRes.clone().json());

    if (!geoRes.ok || !weatherRes.ok) {
      throw new Error(`Upstream error: geo=${geoRes.status} weather=${weatherRes.status}`);
    }

    const [geo, weather] = await Promise.all([
      geoRes.json() as Promise<GeoResponse>,
      weatherRes.json() as Promise<WeatherResponse>,
    ]);

    return {
      score: 100,
      details: { geo, weather },
      generatedAt: new Date().toISOString(),
    };
  } catch (e) {
    console.error("Analysis error:", e);
    return {

      score: 0,
      details: { error: (e as Error).message },
      generatedAt: new Date().toISOString(),
    };
  }
}