import { ProjectConfig } from "@/types";

type UnknownRecord = Record<string, unknown>;

type WeatherSummary = Partial<{
  temperature_2m_mean: number;
  temperature_2m_max: number;
  temperature_2m_min: number;
  cloud_cover_mean: number;
  wind_speed_10m_mean: number;
  wind_speed_10m_min: number;
  wind_speed_10m_max: number;
  sunshine_duration: number;
  precipitation_sum: number;
  precipitation_hours: number;
}>;

type WeatherPair = { past?: WeatherSummary; future?: WeatherSummary };

type GeoSummary = Partial<{
  nearestPowerLineMeters: number;
  nearestDistributionCenterMeters: number;
  buildingsPresent: boolean;
  buildingsMaxDistanceMeters: number;
  protectedPresent: boolean;
  protectedTypes: string[];
}>;

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

function getNum(obj: UnknownRecord, keys: string[]): number | undefined {
  for (const k of keys) {
    const val = (obj as UnknownRecord)?.[k];
    if (typeof val === "number" && !Number.isNaN(val)) return val;
  }
  return undefined;
}

function getBool(obj: UnknownRecord, keys: string[]): boolean | undefined {
  for (const k of keys) {
    const val = (obj as UnknownRecord)?.[k];
    if (typeof val === "boolean") return val;
  }
  return undefined;
}

function getArr<T = unknown>(obj: UnknownRecord, keys: string[]): T[] | undefined {
  for (const k of keys) {
    const val = (obj as UnknownRecord)?.[k];
    if (Array.isArray(val)) return val as T[];
  }
  return undefined;
}

function parseWeather(details?: UnknownRecord): WeatherPair {
  const raw = (details as { weather?: unknown })?.weather ?? {};
  if (!raw) return {};
  const wr = raw as UnknownRecord;
  if ("past" in wr || "future" in wr) return { past: wr.past as WeatherSummary, future: wr.future as WeatherSummary };
  if ("lastYear" in wr || "nextYear" in wr) return { past: wr.lastYear as WeatherSummary, future: wr.nextYear as WeatherSummary } as WeatherPair;
  if (Array.isArray(raw) && (raw as unknown[]).length) {
    const arr = raw as unknown[];
    return { past: arr[0] as WeatherSummary, future: (arr[1] as WeatherSummary) ?? (arr[0] as WeatherSummary) };
  }
  return { past: raw as WeatherSummary, future: raw as WeatherSummary };
}

function parseGeo(details?: UnknownRecord): GeoSummary {
  const geoRaw: UnknownRecord = ((details as { geo?: unknown })?.geo ?? {}) as UnknownRecord;
  return {
    nearestPowerLineMeters: getNum(geoRaw, ["nearestPowerLineMeters", "power_line_distance_m", "distancePowerLine", "nearest_power_line_m"]),
    nearestDistributionCenterMeters: getNum(geoRaw, ["nearestDistributionCenterMeters", "distribution_center_distance_m", "distanceDistributionCenter", "nearest_distribution_center_m"]),
    buildingsPresent: getBool(geoRaw, ["buildingsPresent", "hasBuildings", "buildings"]),
    buildingsMaxDistanceMeters: getNum(geoRaw, ["buildingsMaxDistanceMeters", "nearestBuildingMeters", "building_distance_m"]),
    protectedPresent: getBool(geoRaw, ["protectedPresent", "hasProtectedArea", "protected"]),
    protectedTypes: (getArr<string>(geoRaw, ["protectedTypes", "protectedAreaTypes"]) as string[] | undefined) ?? [],
  };
}

function avg(...vals: Array<number | undefined>) {
  const a = vals.filter((v): v is number => typeof v === "number" && !Number.isNaN(v));
  return a.length ? a.reduce((s, v) => s + v, 0) / a.length : undefined;
}

export interface ScoreOutput {
  solar: number; // 0-100
  wind: number; // 0-100
  recommendation: string;
}

export function calculateScores(details?: Record<string, unknown>, config?: ProjectConfig): ScoreOutput {
  const weather = parseWeather(details ?? {});
  const past = weather.past ?? {};
  const future = weather.future ?? {};
  const geo = parseGeo(details ?? {});

  const hubHeight = typeof config?.hubHeight === "number" && !Number.isNaN(config.hubHeight) ? config.hubHeight : undefined;

  // Solar score components
  const baseSolar = (ws: WeatherSummary) => {
    const sun = ws.sunshine_duration ?? 0;
    const base = clamp(((sun - 800) / (2200 - 800)) * 100, 0, 100);
    const cloud = ws.cloud_cover_mean;
    const clearBoost = cloud == null ? 50 : (100 - clamp(cloud, 0, 100));
    return 0.7 * base + 0.3 * clearBoost; // weighted
  };

  // Light precipitation penalty for solar (more rainy hours reduce score slightly)
  const precipPenaltySolar = (ws: WeatherSummary) => {
    const ph = typeof ws.precipitation_hours === "number" ? ws.precipitation_hours : undefined;
    if (ph == null) return 0;
    return clamp((ph / 20) * 12, 0, 12);
  };

  let solarRaw = (baseSolar(past) + baseSolar(future)) / 2 - (precipPenaltySolar(past) + precipPenaltySolar(future)) / 2;
  solarRaw = clamp(solarRaw, 0, 100);

  // Wind score components
  const refHeight = 10;
  const alpha = 0.14;
  const shearAdjust = (v10?: number) => {
    if (typeof v10 !== "number") return undefined;
    if (!hubHeight || hubHeight <= refHeight) return v10;
    const v = v10 * Math.pow(hubHeight / refHeight, alpha);
    return v;
  };
  const windBase = (ws: WeatherSummary) => {
    const v10 = ws.wind_speed_10m_mean ?? 0;
    const vHub = shearAdjust(v10) ?? v10;
    return clamp(((vHub - 3) / (10 - 3)) * 100, 0, 100);
  };
  let windRaw = (windBase(past) + windBase(future)) / 2;

  const buildingsWithin2km = (() => {
    if (geo.buildingsPresent === false) return false;
    if (geo.buildingsPresent === true) {
      if (typeof geo.buildingsMaxDistanceMeters === "number") return geo.buildingsMaxDistanceMeters <= 2000;
      return undefined;
    }
    return undefined;
  })();
  if (buildingsWithin2km === true) {
    windRaw -= 5;
  }
  windRaw = clamp(windRaw, 0, 100);

  const solar = Math.round(solarRaw);
  const wind = Math.round(windRaw);

  const linesKm = geo.nearestPowerLineMeters != null ? geo.nearestPowerLineMeters / 1000 : undefined;
  const subKm = geo.nearestDistributionCenterMeters != null ? geo.nearestDistributionCenterMeters / 1000 : undefined;
  const infraNote = (() => {
    const farLine = typeof linesKm === "number" && linesKm > 5;
    const farSub = typeof subKm === "number" && subKm > 10;
    if (farLine && farSub) return "Netzanbindung scheint weit entfernt (Leitung >5 km, Umspannwerk >10 km).";
    if (farLine) return "Nächste Stromleitung ist >5 km entfernt; höhere Anschlusskosten wahrscheinlich.";
    if (farSub) return "Nächstes Umspannwerk ist >10 km entfernt; Netzanbindung einplanen.";
    return undefined;
  })();

  const protectedNote = geo.protectedPresent === true ? "Gebiet überschneidet Schutzflächen; Genehmigungsrisiken erwartet." : undefined;

  const buildRec = () => {
    let base: string;
    if (wind >= 70 && solar >= 70) base = "Hervorragend für Wind- und Solarenergie.";
    else if (wind >= 75) base = "Starkes Windpotenzial; Windprojekt empfohlen.";
    else if (solar >= 75) base = "Starkes Solarpotenzial; Solarprojekt empfohlen.";
    else if (wind >= 55 && solar >= 55) base = "Beide Technologien grundsätzlich machbar; weitere Studie sinnvoll.";
    else if (wind > solar) base = "Windpotenzial grenzwertig; detaillierte Bewertung erforderlich.";
    else base = "Solarpotenzial grenzwertig; detaillierte Bewertung erforderlich.";

    const notes = [infraNote, protectedNote].filter(Boolean).join(" ");
    return notes ? `${base} ${notes}` : base;
  };

  return { solar, wind, recommendation: buildRec() };
}
