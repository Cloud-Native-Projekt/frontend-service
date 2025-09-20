"use server";

import { AnalysisRequest, AnalysisResult } from "@/types";

type GeoResponse = unknown;
type WeatherResponse = unknown;

export async function analyzeCoordinates(payload: AnalysisRequest): Promise<AnalysisResult> {
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
    const { location, config } = payload;
    const radiusMeters = Math.max(1000, Math.min(5000, Math.round(config.searchRadiusKm * 1000)));
    const lat = location.lat;
    const lng = location.lng;

    const todayStr = new Date().toISOString().slice(0, 10);
    const [geoRes, weatherRes] = await Promise.all([
      fetch(`${GEO_URL}/geo/power?lat=${lat}&lng=${lng}&radius=${radiusMeters}`, { method: "GET", cache: "no-store" }),
      fetch(`${WEATHER_URL}/daily/${todayStr}/${lat}/${lng}/all`, { method: "GET", cache: "no-store" }),
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
      details: { geo, weather, input: payload },
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