import { AnalysisData, ProjectConfig } from "@/types";

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

const safeAvg = (values: Array<number | null | undefined>) => {
  const usable = values.filter((value): value is number => typeof value === "number" && Number.isFinite(value));
  return usable.length ? usable.reduce((total, value) => total + value, 0) / usable.length : undefined;
};

const toKm = (meters?: number | null, fallbackKm = 8) => {
  if (typeof meters !== "number" || Number.isNaN(meters)) {
    return fallbackKm;
  }
  return meters / 1000;
};

export interface ScoreOutput {
  solar: number;
  wind: number;
  recommendation: string;
}

export function calculateScores(analysis?: AnalysisData | null, config?: ProjectConfig): ScoreOutput {
  if (!analysis) {
    return {
      solar: 0,
      wind: 0,
      recommendation: "Keine Analysedaten verfügbar. Bitte Standort erneut prüfen.",
    };
  }

  // --- Solar ---------------------------------------------------------------
  const sunshineHours = safeAvg([
    analysis.sunshineDuration?.past?.mean,
    analysis.sunshineDuration?.future?.mean,
  ]) ?? 0;
  const cloudCoverage = safeAvg([
    analysis.cloudCoverage?.past?.mean,
    analysis.cloudCoverage?.future?.mean,
  ]) ?? 50;
  const precipitationSum = safeAvg([
    analysis.precipitation?.past?.sum,
    analysis.precipitation?.future?.sum,
  ]) ?? 0;

  const solarResource = clamp(((sunshineHours - 600) / (2100 - 600)) * 100, 0, 100);
  const cloudImpact = clamp((cloudCoverage - 30) * 0.6, 0, 35);
  const rainImpact = clamp((precipitationSum / 12) * 8, 0, 20);

  const solarSitingPenalty =
    (analysis.protectedArea?.inProtectedArea ? 20 : 0) +
    (analysis.forest?.inForest ? 16 : 0) +
    (analysis.building?.inPopulatedArea ? 6 : 0);

  const solarInfraPenalty = clamp(
    (toKm(analysis.distanceToNearestPowerline, 5) - 1) * 3.5 +
    (toKm(analysis.distanceToNearestDistributionCenter, 10) - 3) * 2.5,
    0,
    28,
  );

  const solar = Math.round(
    clamp(solarResource - cloudImpact - rainImpact - solarSitingPenalty - solarInfraPenalty, 0, 100),
  );

  // --- Wind ----------------------------------------------------------------
  const hubHeight = typeof config?.hubHeight === "number" && config.hubHeight > 0 ? config.hubHeight : 80;
  const windMean = safeAvg([
    analysis.windSpeed?.past?.mean,
    analysis.windSpeed?.future?.mean,
  ]) ?? 0;
  const windMax = safeAvg([
    analysis.windSpeed?.past?.max,
    analysis.windSpeed?.future?.max,
  ]) ?? 0;

  const shearAdjusted = windMean * Math.pow(hubHeight / 10, 0.14);
  const windResource = clamp(((shearAdjusted - 3.2) / (11.8 - 3.2)) * 100, 0, 100);
  const gustImpact = windMax > 27 ? clamp((windMax - 27) * 1.6, 0, 18) : 0;

  const windSitingPenalty =
    (analysis.protectedArea?.inProtectedArea ? 22 : 0) +
    (analysis.forest?.inForest ? 10 : 0) +
    (analysis.building?.inPopulatedArea ? 14 : 0);

  const windInfraPenalty = clamp(
    (toKm(analysis.distanceToNearestPowerline, 6) - 2) * 4 +
    (toKm(analysis.distanceToNearestDistributionCenter, 12) - 4) * 3.5,
    0,
    32,
  );

  const wind = Math.round(
    clamp(windResource - gustImpact - windSitingPenalty - windInfraPenalty, 0, 100),
  );

  // --- Recommendation ------------------------------------------------------
  const hasStrongSolar = solar >= 72;
  const hasStrongWind = wind >= 72;
  const hasViableTech = solar >= 55 || wind >= 55;

  let recommendation: string;
  if (hasStrongSolar && hasStrongWind) {
    recommendation = "Sehr gutes Potenzial für kombinierten Wind- und Solarpark.";
  } else if (hasStrongSolar) {
    recommendation = "Solarprojekt priorisieren – sehr gute Einstrahlung.";
  } else if (hasStrongWind) {
    recommendation = "Windprojekt priorisieren – stabile Windressourcen.";
  } else if (hasViableTech) {
    recommendation = "Gemischtes Bild – detaillierte Machbarkeitsstudie empfohlen.";
  } else {
    recommendation = "Aktuell geringe Eignung – Standort oder Parameter prüfen.";
  }

  return { solar, wind, recommendation };
}
