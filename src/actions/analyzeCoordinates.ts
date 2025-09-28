"use server";

import { AnalysisRequest, AnalysisData } from "@/types";
import { fetchGeoAggregate } from "./geoService";
import { fetchWeatherAggregate } from "./weatherService";

function normalizeDistance(value: number | null): number {
  return Number.isFinite(value) ? (value as number) : 0;
}

export async function analyzeCoordinates(payload: AnalysisRequest): Promise<AnalysisData> {
  const { location, config } = payload;

  const radiusMeters = Math.max(1000, Math.min(5000, Math.round(config.searchRadiusKm * 1000)));

  let geo: Awaited<ReturnType<typeof fetchGeoAggregate>> | null = null;
  let weather: Awaited<ReturnType<typeof fetchWeatherAggregate>> | null = null;

  try {
    geo = await fetchGeoAggregate({ lat: location.lat, lng: location.lng, radiusMeters });
  } catch (e) {
    console.error("Failed to fetch geo data:", e);
  }

  try {
    weather = await fetchWeatherAggregate({ lat: location.lat, lng: location.lng });
  } catch (e) {
    console.error("Failed to fetch weather data:", e);
  }

  return {
    temperature: weather?.temperature ?? null,
    windSpeed: weather?.windSpeed ?? null,
    sunshineDuration: weather?.sunshineDuration ?? null,
    cloudCoverage: weather?.cloudCoverage ?? null,
    precipitation: weather?.precipitation ?? null,
    distanceToNearestDistributionCenter: geo ? normalizeDistance(geo.distanceToNearestDistributionCenter) : null,
    distanceToNearestPowerline: geo ? normalizeDistance(geo.distanceToNearestPowerline) : null,
    protectedArea: geo?.protectedArea ?? null,
    forest: geo?.forest ?? null,
    building: geo?.building ?? null,
  };
}