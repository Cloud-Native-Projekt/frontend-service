"use client";
import React from 'react';
import Box from '@mui/material/Box';
import { customThemeVars } from '@/theme';
import { AnalysisResult, Location } from '@/types';
import WindSpeedCard from '@/components/results-step/dashboard-cards/WindSpeedCard';
import TemperatureCard from '@/components/results-step/dashboard-cards/TemperatureCard';
import SunshineCard from '@/components/results-step/dashboard-cards/SunshineCard';
import DistancesCard from '@/components/results-step/dashboard-cards/DistancesCard';
import MapCard from '@/components/results-step/dashboard-cards/MapCard';
import AllowanceRisksCard from '@/components/results-step/dashboard-cards/AllowanceRisksCard';
import RainCard from '@/components/results-step/dashboard-cards/RainCard';
import ScoresCard from '@/components/results-step/dashboard-cards/ScoresCard';
import { calculateScores } from '@/actions/calculateScores';

// Types used for parsing details
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

export interface SuitabilityDashboardProps {
  result: AnalysisResult | null;
  location: Location | null;
  resetStepper?: () => void;
}

const SuitabilityDashboard: React.FC<SuitabilityDashboardProps> = ({ result, location, resetStepper }) => {
  // Helpers
  const toKm = (m: number) => m / 1000;
  const getNum = (obj: Record<string, unknown>, keys: string[]): number | undefined => {
    for (const k of keys) {
      const val = obj?.[k];
      if (typeof val === 'number' && !Number.isNaN(val)) return val;
    }
    return undefined;
  };
  const getBool = (obj: UnknownRecord, keys: string[]): boolean | undefined => {
    for (const k of keys) {
      const val = obj[k];
      if (typeof val === 'boolean') return val;
    }
    return undefined;
  };
  const getArr = <T = unknown>(obj: UnknownRecord, keys: string[]): T[] | undefined => {
    for (const k of keys) {
      const val = obj[k];
      if (Array.isArray(val)) return val as T[];
    }
    return undefined;
  };

  const details: UnknownRecord = (result?.details ?? {}) as UnknownRecord;
  type AnalysisInput = { config?: { searchRadiusKm?: number } };
  const input = (details as { input?: unknown }).input as AnalysisInput | undefined;
  const radiusKm: number | undefined = input?.config?.searchRadiusKm;

  // Geo parsing
  const geoRaw: UnknownRecord = ((details as { geo?: unknown }).geo ?? {}) as UnknownRecord;
  const geo: GeoSummary = {
    nearestPowerLineMeters: getNum(geoRaw, ['nearestPowerLineMeters', 'power_line_distance_m', 'distancePowerLine', 'nearest_power_line_m']),
    nearestDistributionCenterMeters: getNum(geoRaw, ['nearestDistributionCenterMeters', 'distribution_center_distance_m', 'distanceDistributionCenter', 'nearest_distribution_center_m']),
    buildingsPresent: getBool(geoRaw, ['buildingsPresent', 'hasBuildings', 'buildings']),
    buildingsMaxDistanceMeters: getNum(geoRaw, ['buildingsMaxDistanceMeters', 'nearestBuildingMeters', 'building_distance_m']),
    protectedPresent: getBool(geoRaw, ['protectedPresent', 'hasProtectedArea', 'protected']),
    protectedTypes: (getArr<string>(geoRaw, ['protectedTypes', 'protectedAreaTypes']) as string[] | undefined) ?? [],
  };

  // Weather parsing
  const weatherRaw: unknown = (details as { weather?: unknown }).weather ?? {};
  const weatherPair: WeatherPair = (() => {
    if (!weatherRaw) return {};
    const wr = weatherRaw as UnknownRecord;
    if ('past' in wr || 'future' in wr) return { past: wr.past as WeatherSummary, future: wr.future as WeatherSummary };
    if ('lastYear' in wr || 'nextYear' in wr) return { past: wr.lastYear as WeatherSummary, future: wr.nextYear as WeatherSummary };
    if (Array.isArray(weatherRaw) && (weatherRaw as unknown[]).length) {
      const arr = weatherRaw as unknown[];
      return { past: arr[0] as WeatherSummary, future: (arr[1] as WeatherSummary) ?? (arr[0] as WeatherSummary) };
    }
    return { past: weatherRaw as WeatherSummary, future: weatherRaw as WeatherSummary };
  })();

  const past = weatherPair.past ?? {};
  const future = weatherPair.future ?? {};

  // Scores via centralized action
  const config = (input?.config ?? {}) as { searchRadiusKm?: number; hubHeight?: number };
  const { solar: solarScore, wind: windScore, recommendation } = calculateScores(details, config as any);

  // Build assessment data for AllowanceRisksCard
  const avg = (...vals: Array<number | undefined>) => {
    const a = vals.filter((v): v is number => typeof v === 'number' && !Number.isNaN(v));
    return a.length ? a.reduce((s, v) => s + v, 0) / a.length : undefined;
  };
  const minOf = (...vals: Array<number | undefined>) => {
    const a = vals.filter((v): v is number => typeof v === 'number' && !Number.isNaN(v));
    return a.length ? Math.min(...a) : undefined;
  };
  const maxOf = (...vals: Array<number | undefined>) => {
    const a = vals.filter((v): v is number => typeof v === 'number' && !Number.isNaN(v));
    return a.length ? Math.max(...a) : undefined;
  };

  const buildingsWithin2km = (() => {
    if (geo.buildingsPresent === false) return false;
    if (geo.buildingsPresent === true) {
      if (typeof geo.buildingsMaxDistanceMeters === 'number') return geo.buildingsMaxDistanceMeters <= 2000;
      return undefined; // present but unknown distance
    }
    return undefined; // unknown
  })();

  const envZones = (() => {
    if (geo.protectedPresent === true) {
      const types = (geo.protectedTypes ?? []);
      return (types.length ? types : ['Schutzgebiet']).map((t) => ({ type: t }));
    }
    if (geo.protectedPresent === false) return [];
    return undefined;
  })();

  const assessmentData = {
    trees: undefined,
    buildings: { within2km: buildingsWithin2km, searchRadiusKm: radiusKm },
    envZones,
    distances: {
      powerlineKm: geo.nearestPowerLineMeters == null ? undefined : toKm(geo.nearestPowerLineMeters),
      substationKm: geo.nearestDistributionCenterMeters == null ? undefined : toKm(geo.nearestDistributionCenterMeters),
    },
    temperature: {
      avgC: avg(past.temperature_2m_mean, future.temperature_2m_mean),
      minC: minOf(past.temperature_2m_min, future.temperature_2m_min),
      maxC: maxOf(past.temperature_2m_max, future.temperature_2m_max),
    },
    sunshine: {
      hoursPerDay: undefined,
      cloudCoveragePercent: avg(past.cloud_cover_mean, future.cloud_cover_mean),
    },
    wind: {
      avgMetersPerSecond: avg(past.wind_speed_10m_mean, future.wind_speed_10m_mean),
      gustMetersPerSecond: maxOf(past.wind_speed_10m_max, future.wind_speed_10m_max),
      hubHeightMeters: undefined,
    },
    precipitation: {
      mmPerDay: avg(
        typeof past.precipitation_sum === 'number' ? past.precipitation_sum / 7 : undefined,
        typeof future.precipitation_sum === 'number' ? future.precipitation_sum / 7 : undefined,
      ),
      hoursPerDay: avg(
        typeof past.precipitation_hours === 'number' ? past.precipitation_hours / 7 : undefined,
        typeof future.precipitation_hours === 'number' ? future.precipitation_hours / 7 : undefined,
      ),
    },
  } as const;

  // const theme = useTheme();
  // Layout: 4x4 tiles (equal). At md+ use absolute tile placement; below md, stack.
  return (
    <Box
      sx={{
        width: '100%',
        maxHeight: { md: '90vh', xs: 'none', sm: 'none' },
        display: 'grid',
        gap: { xs: customThemeVars.grid.gap.mobile, sm: customThemeVars.grid.gap.mobile, md: customThemeVars.grid.gap.desktop },
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
        gridTemplateRows: { md: 'repeat(4, minmax(270px, 1fr))' },
        height: '100%',
        maxWidth: '100vw',
      }}
    >
      {/* Tile 1-2: Windspeed */}
      <Box sx={{ gridColumn: { xs: '1', sm: '1 / -1', md: '1 / span 2' }, gridRow: { md: '1' } }}>
        <WindSpeedCard
          past={{ min: past.wind_speed_10m_min, max: past.wind_speed_10m_max, mean: past.wind_speed_10m_mean }}
          future={{ min: future.wind_speed_10m_min, max: future.wind_speed_10m_max, mean: future.wind_speed_10m_mean }}
        />
      </Box>

      {/* Tile 3-4: Temperature */}
      <Box sx={{ gridColumn: { xs: '1', sm: '1 / -1', md: '3 / span 2' }, gridRow: { md: '1' } }}>
        <TemperatureCard
          past={{ min: past.temperature_2m_min, max: past.temperature_2m_max, mean: past.temperature_2m_mean }}
          future={{ min: future.temperature_2m_min, max: future.temperature_2m_max, mean: future.temperature_2m_mean }}
        />
      </Box>

      {/* Tile 5-6: Sunshine */}
      <Box sx={{ gridColumn: { xs: '1', sm: '1 / -1', md: '1 / span 2' }, gridRow: { md: '2' } }}>
        <SunshineCard
          past={{ sunshine: past.sunshine_duration, cloud: past.cloud_cover_mean }}
          future={{ sunshine: future.sunshine_duration, cloud: future.cloud_cover_mean }}
        />
      </Box>

      {/* Tile 7-8: Distances */}
      <Box sx={{ gridColumn: { xs: '1', sm: '1 / -1', md: '3 / span 2' }, gridRow: { md: '2' } }}>
        <DistancesCard
          powerLineMeters={geo.nearestPowerLineMeters}
          distributionMeters={geo.nearestDistributionCenterMeters}
        />
      </Box>

      {/* Tiles 9,10,13,14: Map */}
      <Box sx={{ gridColumn: { xs: '1', sm: '1 / -1', md: '1 / span 2' }, gridRow: { md: '3 / span 2' }, minHeight: 350 }}>
        <MapCard location={location} radiusKm={radiusKm} />
      </Box>

      {/* Tiles 11,15: Auflagen & Risiken */}
      <Box sx={{ gridColumn: { xs: '1', sm: '1 / -1', md: '3' }, gridRow: { md: '3 / span 2' } }}>
        <AllowanceRisksCard data={assessmentData} />
      </Box>

      {/* Tile 12: Extra relevant (precipitation) */}
      <Box sx={{ gridColumn: { xs: '1', sm: '1 / -1', md: '4' }, gridRow: { md: '3' } }}>
        <RainCard
          past={{ precipitation_sum: past.precipitation_sum, precipitation_hours: past.precipitation_hours }}
          future={{ precipitation_sum: future.precipitation_sum, precipitation_hours: future.precipitation_hours }}
        />
      </Box>

      {/* Tile 16: Scores */}
      <Box sx={{ gridColumn: { xs: '1', sm: '1 / -1', md: '4' }, gridRow: { md: '4' } }}>
        <ScoresCard solar={solarScore} wind={windScore} recommendation={recommendation} onResetStepper={resetStepper} />
      </Box>
    </Box>
  );
};

export default SuitabilityDashboard;
