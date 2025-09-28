"use server";

import { AnalysisData } from "@/types";
import { readErrorResponse } from "@/actions/httpUtils";

type WeatherCoordinates = {
  lat: number;
  lng: number;
};

type WeeklyWeatherRecord = {
  temperature_2m_mean: number;
  temperature_2m_max: number;
  temperature_2m_min: number;
  wind_speed_10m_mean: number;
  wind_speed_10m_max: number;
  wind_speed_10m_min: number;
  sunshine_duration: number;
  cloud_cover_mean: number;
  precipitation_sum: number;
  precipitation_hours: number;
};

type WeeklyRange = {
  start: string;
  end: string;
};

type WeatherAggregate = Pick<AnalysisData, "temperature" | "windSpeed" | "sunshineDuration" | "cloudCoverage" | "precipitation">;

function requireWeatherBaseUrl(): string {
  const url = process.env.WEATHER_SERVICE_URL;
  if (!url) {
    throw new Error("WEATHER_SERVICE_URL environment variable is not set");
  }
  return url;
}

async function fetchWeeklyWeather(range: WeeklyRange, coords: WeatherCoordinates, metrics = "all"): Promise<WeeklyWeatherRecord> {
  const baseUrl = requireWeatherBaseUrl();
  const { lat, lng } = coords;
  const path = `weekly/${encodeURIComponent(range.start)}:${encodeURIComponent(range.end)}/${encodeURIComponent(lat)}/${encodeURIComponent(lng)}/${encodeURIComponent(metrics)}`;
  const url = new URL(path, baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`);
  console.log("Fetching weather data from:", url.toString());
  const response = await fetch(url, { method: "GET", cache: "no-store" });
  console.log("Weather service response status:", response.status);
  if (!response.ok) {
    const message = await readErrorResponse(response);
    throw new Error(`Weather service request (${path}) failed (${response.status}): ${message}`);
  }

  const data = await response.json();
  if (data.means && typeof data.means === "object") {
    return data.means as WeeklyWeatherRecord;
  }
  throw new Error("Weather service response is missing expected data: " + JSON.stringify(data));
}

function startOfIsoWeek(date: Date): Date {
  const result = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const day = result.getUTCDay();
  const diff = day === 0 ? -6 : 1 - day;
  result.setUTCDate(result.getUTCDate() + diff);
  return result;
}

function addIsoWeeks(date: Date, weeks: number): Date {
  const result = new Date(date);
  result.setUTCDate(result.getUTCDate() + weeks * 7);
  return result;
}

function formatIsoWeek(date: Date): string {
  const weekStart = startOfIsoWeek(date);
  const thursday = new Date(weekStart);
  thursday.setUTCDate(weekStart.getUTCDate() + 3);
  const year = thursday.getUTCFullYear();

  const firstThursday = new Date(Date.UTC(year, 0, 4));
  const firstWeekStart = startOfIsoWeek(firstThursday);
  const diffMs = weekStart.getTime() - firstWeekStart.getTime();
  const week = Math.floor(diffMs / (7 * 24 * 60 * 60 * 1000)) + 1;

  return `${year}-${String(week).padStart(2, "0")}`;
}

function getCalenderWeekRange(intoFuture: boolean, reference = new Date()): WeeklyRange {
  const direction = intoFuture ? 1 : -1;
  const currentWeekStart = startOfIsoWeek(reference);
  const targetEnd = addIsoWeeks(currentWeekStart, direction * 51);
  return {
    start: formatIsoWeek(currentWeekStart),
    end: formatIsoWeek(targetEnd),
  };
}

export async function fetchWeeklyPast(coords: WeatherCoordinates, reference = new Date()): Promise<WeeklyWeatherRecord> {
  const range = getCalenderWeekRange(false, reference);
  const swappedRange = { start: range.end, end: range.start };
  return fetchWeeklyWeather(swappedRange, coords);
}

export async function fetchWeeklyFuture(coords: WeatherCoordinates, reference = new Date()): Promise<WeeklyWeatherRecord> {
  const range = getCalenderWeekRange(true, reference);
  return fetchWeeklyWeather(range, coords);
}

export async function fetchWeatherAggregate(coords: WeatherCoordinates, reference = new Date()): Promise<WeatherAggregate> {
  const [pastRecord, futureRecord] = await Promise.all([
    fetchWeeklyPast(coords, reference),
    fetchWeeklyFuture(coords, reference),
  ]);

  return {
    temperature: {
      past: {
        min: pastRecord?.temperature_2m_min,
        mean: pastRecord?.temperature_2m_mean,
        max: pastRecord?.temperature_2m_max,
      },
      future: {
        min: futureRecord?.temperature_2m_min,
        mean: futureRecord?.temperature_2m_mean,
        max: futureRecord?.temperature_2m_max,
      },
    },
    windSpeed: {
      past: {
        min: pastRecord?.wind_speed_10m_min,
        mean: pastRecord?.wind_speed_10m_mean,
        max: pastRecord?.wind_speed_10m_max,
      },
      future: {
        min: futureRecord?.wind_speed_10m_min,
        mean: futureRecord?.wind_speed_10m_mean,
        max: futureRecord?.wind_speed_10m_max,
      },
    },
    sunshineDuration: {
      past: { mean: pastRecord?.sunshine_duration },
      future: { mean: futureRecord?.sunshine_duration },
    },
    cloudCoverage: {
      past: {
        mean: pastRecord?.cloud_cover_mean,
      },
      future: {
        mean: futureRecord?.cloud_cover_mean,
      },
    },
    precipitation: {
      past: {
        sum: pastRecord?.precipitation_sum,
        hours: pastRecord?.precipitation_hours,
      },
      future: {
        sum: futureRecord?.precipitation_sum,
        hours: futureRecord?.precipitation_hours,
      },
    },
  };
}
