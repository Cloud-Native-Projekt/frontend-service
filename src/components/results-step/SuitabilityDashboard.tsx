"use client";
import React from "react";
import Box from "@mui/material/Box";
import { customThemeVars } from "@/theme";
import { AnalysisData, Location, ProjectConfig } from "@/types";
import WindSpeedCard from "@/components/results-step/dashboard-cards/WindSpeedCard";
import TemperatureCard from "@/components/results-step/dashboard-cards/TemperatureCard";
import SunshineCard from "@/components/results-step/dashboard-cards/SunshineCard";
import DistancesCard from "@/components/results-step/dashboard-cards/DistancesCard";
import MapCard from "@/components/results-step/dashboard-cards/MapCard";
import AllowanceRisksCard from "@/components/results-step/dashboard-cards/AllowanceRisksCard";
import RainCard from "@/components/results-step/dashboard-cards/RainCard";
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

  const radiusKm = config?.searchRadiusKm;
  const { solar: solarScore, wind: windScore, recommendation } = calculateScores(result, config ?? undefined);

  const sunshinePastHours = result.sunshineDuration.past.mean;
  const sunshineFutureHours = result.sunshineDuration.future.mean;
  const cloudPast = result.cloudCoverage.past.mean;
  const cloudFuture = result.cloudCoverage.future.mean;

  const precipitationPast = result.precipitation.past.sum;
  const precipitationFuture = result.precipitation.future.sum;

  const temperaturePast = result.temperature.past;
  const temperatureFuture = result.temperature.future;
  const windPast = result.windSpeed.past;
  const windFuture = result.windSpeed.future;

  const distancePowerLine = result.distanceToNearestPowerline;
  const distanceDistribution = result.distanceToNearestDistributionCenter;

  const buildingsWithin2km = result.building.inPopulatedArea;
  const envZones = result.protectedArea.inProtectedArea
    ? [{ type: result.protectedArea.designation ?? "Schutzgebiet" }]
    : undefined;

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
        typeof precipitationPast === "number" ? precipitationPast / 7 : undefined,
        typeof precipitationFuture === "number" ? precipitationFuture / 7 : undefined,
      ),
      hoursPerDay: undefined,
    },
  } as const;

  return (
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
          sunshine={{ past: result.sunshineDuration.past, future: result.sunshineDuration.future }}
          clouds={{ past: result.cloudCoverage.past, future: result.cloudCoverage.future }}
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
          past={{ weekSum: result.precipitation.past.sum }}
          future={{ weekSum: result.precipitation.future.sum }}
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
  );
};

export default SuitabilityDashboard;
