"use server";

import { AnalysisRequest, AnalysisData } from "@/types";
import { fetchGeoAggregate } from "./geoService";
import { fetchWeatherAggregate } from "./weatherService";

function normalizeDistance(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export async function analyzeCoordinates(payload: AnalysisRequest): Promise<AnalysisData> {
  const { location, config } = payload;

  const radiusMeters = Math.max(1000, Math.min(5000, Math.round(config.searchRadiusKm * 1000)));

  const [geo, weather] = await Promise.all([
    fetchGeoAggregate({ lat: location.lat, lng: location.lng, radiusMeters }),
    fetchWeatherAggregate({ lat: location.lat, lng: location.lng }),
  ]);
  console.log("Geo data:", geo);
  console.log("Weather data:", weather);

  return {
    temperature: weather.temperature,
    windSpeed: weather.windSpeed,
    sunshineDuration: weather.sunshineDuration,
    cloudCoverage: weather.cloudCoverage,
    precipitation: weather.precipitation,
    distanceToNearestDistributionCenter: normalizeDistance(geo.distanceToNearestDistributionCenter),
    distanceToNearestPowerline: normalizeDistance(geo.distanceToNearestPowerline),
    protectedArea: geo.protectedArea,
    forest: geo.forest,
    building: geo.building,
  };
}