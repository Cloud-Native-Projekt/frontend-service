"use server";

import { AnalysisData } from "@/types";
import { readErrorResponse } from "@/actions/httpUtils";

type GeoCoordinates = {
  lat: number;
  lng: number;
  radiusMeters: number;
};

type GeoHealthResponse = {
  status: string;
  message: string;
};

type GeoPowerResponse = {
  nearest_powerline_distance_m: number;
  nearest_substation_distance_m: number;
};

type GeoProtectionResponse = {
  in_protected_area: boolean;
  designation: string | null;
};

type GeoForestResponse = {
  in_forest: boolean;
  type: string | null;
};

type GeoBuiltupResponse = {
  in_populated_area: boolean;
};

type GeoAggregate = Pick<AnalysisData,
  "distanceToNearestDistributionCenter" |
  "distanceToNearestPowerline" |
  "protectedArea" |
  "forest" |
  "building"
>;

function requireGeoBaseUrl(): string {
  const url = process.env.GEO_SERVICE_URL;
  if (!url) {
    throw new Error("GEO_SERVICE_URL environment variable is not set");
  }
  return url;
}

async function fetchGeoEndpoint<T>(path: string, searchParams?: Record<string, string | number>): Promise<T> {
  const baseUrl = requireGeoBaseUrl();
  const url = new URL(path, baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`);

  if (searchParams) {
    for (const [key, value] of Object.entries(searchParams)) {
      url.searchParams.set(key, String(value));
    }
  }
  console.log("Fetching geo data from:", url.toString());
  const response = await fetch(url, { method: "GET", cache: "no-store" });
  console.log("Geo service response status:", response.status);
  if (!response.ok) {
    const message = await readErrorResponse(response);
    throw new Error(`Geo service request (${path}) failed (${response.status}): ${message}`);
  }

  return response.json() as Promise<T>;
}

export async function fetchGeoHealth(): Promise<GeoHealthResponse> {
  return fetchGeoEndpoint<GeoHealthResponse>("geo/health");
}

export async function fetchGeoPower(params: GeoCoordinates): Promise<GeoPowerResponse> {
  const { lat, lng, radiusMeters } = params;
  return fetchGeoEndpoint<GeoPowerResponse>("geo/power", { lat, lng, radius: radiusMeters });
}

export async function fetchGeoProtection(params: GeoCoordinates): Promise<GeoProtectionResponse> {
  const { lat, lng, radiusMeters } = params;
  return fetchGeoEndpoint<GeoProtectionResponse>("geo/protection", { lat, lng, radius: radiusMeters });
}

export async function fetchGeoForest(params: GeoCoordinates): Promise<GeoForestResponse> {
  const { lat, lng, radiusMeters } = params;
  return fetchGeoEndpoint<GeoForestResponse>("geo/forest", { lat, lng, radius: radiusMeters });
}

export async function fetchGeoBuiltup(params: GeoCoordinates): Promise<GeoBuiltupResponse> {
  const { lat, lng, radiusMeters } = params;
  return fetchGeoEndpoint<GeoBuiltupResponse>("geo/builtup", { lat, lng, radius: radiusMeters });
}

export async function fetchGeoAggregate(params: GeoCoordinates): Promise<GeoAggregate> {
  const [power, protection, forest, builtup] = await Promise.all([
    fetchGeoPower(params),
    fetchGeoProtection(params),
    fetchGeoForest(params),
    fetchGeoBuiltup(params),
  ]);

  return {
    distanceToNearestDistributionCenter: power.nearest_substation_distance_m,
    distanceToNearestPowerline: power.nearest_powerline_distance_m,
    protectedArea: {
      inProtectedArea: protection.in_protected_area,
      designation: protection.designation ?? undefined,
    },
    forest: {
      inForest: forest.in_forest,
      type: forest.type ?? undefined,
    },
    building: { inPopulatedArea: builtup.in_populated_area }
  };
}
