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

export interface AnalysisResult {
  score: number;
  details: Record<string, unknown>;
  generatedAt: string;
}

export interface GeoResponse {
  test: string;
}

export interface WeatherResponse {
  tes: string;
}