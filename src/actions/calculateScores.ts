import { AnalysisData, ProjectConfig } from "@/types";

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

function finiteOrUndefined(value?: number | null): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

export interface ScoreOutput {
  solar: number; // 0-100
  wind: number; // 0-100
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

  const windPast = analysis.windSpeed?.past;
  const windFuture = analysis.windSpeed?.future;
  const sunPast = analysis.sunshineDuration?.past;
  const sunFuture = analysis.sunshineDuration?.future;
  const cloudPast = analysis.cloudCoverage?.past;
  const cloudFuture = analysis.cloudCoverage?.future;
  const precipPast = analysis.precipitation?.past;
  const precipFuture = analysis.precipitation?.future;

  const hubHeight = typeof config?.hubHeight === "number" && !Number.isNaN(config.hubHeight) ? config.hubHeight : undefined;

  const baseSolar = (sunMean?: number, cloudMean?: number) => {
    const sunshine = sunMean ?? 0;
    const base = clamp(((sunshine - 800) / (2200 - 800)) * 100, 0, 100);
    const clearBoost = cloudMean == null ? 50 : (100 - clamp(cloudMean, 0, 100));
    return 0.7 * base + 0.3 * clearBoost;
  };

  const precipPenaltySolar = (precip?: number) => {
    if (precip == null || Number.isNaN(precip)) return 0;
    const perWeek = precip;
    const perDay = perWeek / 7;
    return clamp((perDay / 20) * 12, 0, 12);
  };

  const solarValues = [
    baseSolar(sunPast?.mean, cloudPast?.mean) - precipPenaltySolar(precipPast?.sum),
    baseSolar(sunFuture?.mean, cloudFuture?.mean) - precipPenaltySolar(precipFuture?.sum),
  ].filter((v) => typeof v === "number" && !Number.isNaN(v));
  let solarRaw = solarValues.length ? solarValues.reduce((a, b) => a + b, 0) / solarValues.length : 0;
  solarRaw = clamp(solarRaw, 0, 100);

  const refHeight = 10;
  const alpha = 0.14;
  const shearAdjust = (v10?: number) => {
    if (typeof v10 !== "number" || Number.isNaN(v10)) return undefined;
    if (!hubHeight || hubHeight <= refHeight) return v10;
    return v10 * Math.pow(hubHeight / refHeight, alpha);
  };
  const windComponent = (stats?: { mean?: number }) => {
    const v10 = stats?.mean ?? 0;
    const vHub = shearAdjust(v10) ?? v10;
    return clamp(((vHub - 3) / (10 - 3)) * 100, 0, 100);
  };
  const windValues = [windComponent(windPast), windComponent(windFuture)];
  let windRaw = windValues.reduce((a, b) => a + b, 0) / windValues.length;

  const inPopulatedArea = analysis.building?.inPopulatedArea;
  if (inPopulatedArea === true) {
    windRaw -= 5;
  }
  windRaw = clamp(windRaw, 0, 100);

  const solar = Math.round(solarRaw);
  const wind = Math.round(windRaw);

  const powerlineMeters = finiteOrUndefined(analysis.distanceToNearestPowerline);
  const substationMeters = finiteOrUndefined(analysis.distanceToNearestDistributionCenter);
  const linesKm = powerlineMeters != null ? powerlineMeters / 1000 : undefined;
  const subKm = substationMeters != null ? substationMeters / 1000 : undefined;

  const infraNote = (() => {
    const farLine = typeof linesKm === "number" && linesKm > 5;
    const farSub = typeof subKm === "number" && subKm > 10;
    if (farLine && farSub) return "Netzanbindung scheint weit entfernt (Leitung >5 km, Umspannwerk >10 km).";
    if (farLine) return "Nächste Stromleitung ist >5 km entfernt; höhere Anschlusskosten wahrscheinlich.";
    if (farSub) return "Nächstes Umspannwerk ist >10 km entfernt; Netzanbindung einplanen.";
    return undefined;
  })();

  const protectedNote = analysis.protectedArea?.inProtectedArea
    ? "Gebiet überschneidet Schutzflächen; Genehmigungsrisiken erwartet."
    : undefined;

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
