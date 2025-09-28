export interface Location {
  lat: number;
  lng: number;
}

export interface ProjectConfig {
  searchRadiusKm: number;
  hubHeight: number;
}

export interface AnalysisRequest {
  location: Location;
  config: ProjectConfig;
}

interface PastFutureStats {
  min: number;
  mean: number;
  max: number;
}

interface PastFutureMean {
  mean: number;
}

interface PastFuturePrecipitation {
  sum: number; // total precipitation over the period (e.g., in mm per week)
  hours: number; // total hours with precipitation over the period (e.g., in hours per week)
}

export interface AnalysisData {
  temperature: {
    past: PastFutureStats;
    future: PastFutureStats;
  } | null;
  windSpeed: {
    past: PastFutureStats;
    future: PastFutureStats;
  } | null;
  sunshineDuration: {
    past: PastFutureMean;
    future: PastFutureMean;
  } | null;
  cloudCoverage: {
    past: PastFutureMean;
    future: PastFutureMean;
  } | null;
  precipitation: {
    past: PastFuturePrecipitation;
    future: PastFuturePrecipitation;
  } | null;

  distanceToNearestDistributionCenter: number | null;
  distanceToNearestPowerline: number | null;

  protectedArea: {
    inProtectedArea: boolean;
    designation?: string; // optional additional information
  } | null;

  forest: {
    inForest: boolean;
    type?: string; // optional additional information
  } | null;

  building: {
    inPopulatedArea: boolean;
  } | null;
}