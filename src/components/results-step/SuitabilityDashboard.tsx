"use client";
import React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import { customThemeVars } from "@/theme";
import { AnalysisData, Location, ProjectConfig } from "@/types";
import WindSpeedCard, { WindSpeedCardProps } from "@/components/results-step/dashboard-cards/WindSpeedCard";
import TemperatureCard, { TemperatureCardProps } from "@/components/results-step/dashboard-cards/TemperatureCard";
import SunshineCard, { SunshineCardProps } from "@/components/results-step/dashboard-cards/SunshineCard";
import DistancesCard from "@/components/results-step/dashboard-cards/DistancesCard";
import MapCard from "@/components/results-step/dashboard-cards/MapCard";
import AllowanceRisksCard from "@/components/results-step/dashboard-cards/AllowanceRisksCard";
import RainCard, { RainCardProps } from "@/components/results-step/dashboard-cards/RainCard";
import ScoresCard from "@/components/results-step/dashboard-cards/ScoresCard";
import { calculateScores } from "@/actions/calculateScores";

const avg = (...vals: Array<number | undefined>) => {
  const filtered = vals.filter((v): v is number => typeof v === "number" && !Number.isNaN(v));
  return filtered.length ? filtered.reduce((sum, v) => sum + v, 0) / filtered.length : undefined;
};

const minOf = (...vals: Array<number | undefined>) => {
  const filtered = vals.filter((v): v is number => typeof v === "number" && !Number.isNaN(v));
  return filtered.length ? Math.min(...filtered) : undefined;
};

const maxOf = (...vals: Array<number | undefined>) => {
  const filtered = vals.filter((v): v is number => typeof v === "number" && !Number.isNaN(v));
  return filtered.length ? Math.max(...filtered) : undefined;
};

export interface SuitabilityDashboardProps {
  result: AnalysisData | null;
  location: Location | null;
  config?: ProjectConfig | null;
  resetStepper?: () => void;
}

const SuitabilityDashboard: React.FC<SuitabilityDashboardProps> = ({ result, location, config, resetStepper }) => {
  if (!result) {
    return (
      <Box
        sx={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 320,
          typography: "body1",
          color: "text.secondary",
        }}
      >
        Keine Auswertung verfügbar. Bitte wählen Sie einen Standort und starten Sie die Analyse erneut.
      </Box>
    );
  }

  const safeData = (result ?? {}) as Partial<AnalysisData>;

  const rawWind = safeData.windSpeed ?? null;
  const rawTemperature = safeData.temperature ?? null;
  const rawSunshine = safeData.sunshineDuration ?? null;
  const rawClouds = safeData.cloudCoverage ?? null;
  const rawPrecipitation = safeData.precipitation ?? null;
  const rawProtected = safeData.protectedArea ?? null;
  const rawBuilding = safeData.building ?? null;

  const missingSections = [
    !rawWind || (!rawWind.past && !rawWind.future) ? "Winddaten" : null,
    !rawTemperature || (!rawTemperature.past && !rawTemperature.future) ? "Temperatur" : null,
    !rawSunshine || (!rawSunshine.past && !rawSunshine.future) ? "Sonnenschein" : null,
    !rawClouds || (!rawClouds.past && !rawClouds.future) ? "Bewölkung" : null,
    !rawPrecipitation || (!rawPrecipitation.past && !rawPrecipitation.future) ? "Niederschlag" : null,
  ].filter(Boolean) as string[];

  const windPast: WindSpeedCardProps["past"] = rawWind?.past ?? {};
  const windFuture: WindSpeedCardProps["future"] = rawWind?.future ?? {};

  const temperaturePast: TemperatureCardProps["past"] = rawTemperature?.past ?? {};
  const temperatureFuture: TemperatureCardProps["future"] = rawTemperature?.future ?? {};

  const sunshineCardData: SunshineCardProps["sunshine"] = rawSunshine
    ? { past: rawSunshine.past ?? {}, future: rawSunshine.future ?? {} }
    : null;
  const cloudsCardData: SunshineCardProps["clouds"] = rawClouds
    ? { past: rawClouds.past ?? {}, future: rawClouds.future ?? {} }
    : null;

  const sunshinePastHours = typeof sunshineCardData?.past?.mean === "number" ? sunshineCardData.past.mean : undefined;
  const sunshineFutureHours = typeof sunshineCardData?.future?.mean === "number" ? sunshineCardData.future.mean : undefined;
  const cloudPast = typeof cloudsCardData?.past?.mean === "number" ? cloudsCardData.past.mean : undefined;
  const cloudFuture = typeof cloudsCardData?.future?.mean === "number" ? cloudsCardData.future.mean : undefined;

  const precipitationPast = rawPrecipitation?.past ?? null;
  const precipitationFuture = rawPrecipitation?.future ?? null;
  const precipitationPastSum = typeof precipitationPast?.sum === "number" ? precipitationPast.sum : undefined;
  const precipitationFutureSum = typeof precipitationFuture?.sum === "number" ? precipitationFuture.sum : undefined;
  const precipitationPastHours = typeof precipitationPast?.hours === "number" ? precipitationPast.hours : undefined;
  const precipitationFutureHours = typeof precipitationFuture?.hours === "number" ? precipitationFuture.hours : undefined;

  const rainPastData: RainCardProps["past"] = {
    weekSum: typeof precipitationPastSum === "number" ? precipitationPastSum : Number.NaN,
    hoursPerWeek: precipitationPastHours,
  };
  const rainFutureData: RainCardProps["future"] = {
    weekSum: typeof precipitationFutureSum === "number" ? precipitationFutureSum : Number.NaN,
    hoursPerWeek: precipitationFutureHours,
  };

  const distancePowerLine = typeof safeData.distanceToNearestPowerline === "number"
    ? safeData.distanceToNearestPowerline
    : undefined;
  const distanceDistribution = typeof safeData.distanceToNearestDistributionCenter === "number"
    ? safeData.distanceToNearestDistributionCenter
    : undefined;

  const buildingsWithin2km = typeof rawBuilding?.inPopulatedArea === "boolean"
    ? rawBuilding.inPopulatedArea
    : undefined;
  const envZones = rawProtected && rawProtected.inProtectedArea
    ? [{ type: rawProtected.designation ?? "Schutzgebiet" }]
    : undefined;

  const radiusKm = config?.searchRadiusKm;
  const { solar: solarScore, wind: windScore, recommendation } = calculateScores(result, config ?? undefined);

  const assessmentData = {
    buildings: { within2km: buildingsWithin2km, searchRadiusKm: radiusKm },
    envZones,
    distances: {
      powerlineKm: distancePowerLine != null ? distancePowerLine / 1000 : undefined,
      substationKm: distanceDistribution != null ? distanceDistribution / 1000 : undefined,
    },
    temperature: {
      avgC: avg(temperaturePast.mean, temperatureFuture.mean),
      minC: minOf(temperaturePast.min, temperatureFuture.min),
      maxC: maxOf(temperaturePast.max, temperatureFuture.max),
    },
    sunshine: {
      hoursPerDay: avg(sunshinePastHours, sunshineFutureHours),
      cloudCoveragePercent: avg(cloudPast, cloudFuture),
    },
    wind: {
      avgMetersPerSecond: avg(windPast.mean, windFuture.mean),
      gustMetersPerSecond: maxOf(windPast.max, windFuture.max),
      hubHeightMeters: config?.hubHeight,
    },
    precipitation: {
      mmPerDay: avg(
        precipitationPastSum != null ? precipitationPastSum / 7 : undefined,
        precipitationFutureSum != null ? precipitationFutureSum / 7 : undefined,
      ),
      hoursPerDay: avg(
        precipitationPastHours != null ? precipitationPastHours / 7 : undefined,
        precipitationFutureHours != null ? precipitationFutureHours / 7 : undefined,
      ),
    },
  } as const;

  return (
    <Stack spacing={2} sx={{ width: "100%" }}>
      {missingSections.length > 0 && (
        <Alert severity="warning" variant="outlined">
          Analysedaten unvollständig ({missingSections.join(", ")} fehlen). Verfügbare Werte werden angezeigt.
        </Alert>
      )}
      <Box
        sx={{
          width: "100%",
          maxHeight: { md: "90vh", xs: "none", sm: "none" },
          display: "grid",
          gap: {
            xs: customThemeVars.grid.gap.mobile,
            sm: customThemeVars.grid.gap.mobile,
            md: customThemeVars.grid.gap.desktop,
          },
          gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(4, 1fr)" },
          gridTemplateRows: { md: "repeat(4, minmax(270px, 1fr))" },
          height: "100%",
          maxWidth: "100vw",
        }}
      >
        <Box sx={{ gridColumn: { xs: "1", sm: "1 / -1", md: "1 / span 2" }, gridRow: { md: "1" } }}>
          <WindSpeedCard past={windPast} future={windFuture} />
        </Box>

        <Box sx={{ gridColumn: { xs: "1", sm: "1 / -1", md: "3 / span 2" }, gridRow: { md: "1" } }}>
          <TemperatureCard past={temperaturePast} future={temperatureFuture} />
        </Box>

        <Box sx={{ gridColumn: { xs: "1", sm: "1 / -1", md: "1 / span 2" }, gridRow: { md: "2" } }}>
          <SunshineCard
            sunshine={sunshineCardData}
            clouds={cloudsCardData}
          />
        </Box>

        <Box sx={{ gridColumn: { xs: "1", sm: "1 / -1", md: "3 / span 2" }, gridRow: { md: "2" } }}>
          <DistancesCard powerLineMeters={distancePowerLine} distributionMeters={distanceDistribution} />
        </Box>

        <Box sx={{ gridColumn: { xs: "1", sm: "1 / -1", md: "1 / span 2" }, gridRow: { md: "3 / span 2" }, minHeight: 350 }}>
          <MapCard location={location} radiusKm={radiusKm} />
        </Box>

        <Box sx={{ gridColumn: { xs: "1", sm: "1 / -1", md: "3" }, gridRow: { md: "3 / span 2" } }}>
          <AllowanceRisksCard data={assessmentData} recommendation={recommendation} />
        </Box>

        <Box sx={{ gridColumn: { xs: "1", sm: "1 / -1", md: "4" }, gridRow: { md: "3" } }}>
          <RainCard
            past={rainPastData}
            future={rainFutureData}
          />
        </Box>

        <Box sx={{ gridColumn: { xs: "1", sm: "1 / -1", md: "4" }, gridRow: { md: "4" } }}>
          <ScoresCard
            solar={solarScore}
            wind={windScore}
            onResetStepper={resetStepper}
          />
        </Box>
      </Box>
    </Stack>
  );
};

export default SuitabilityDashboard;
