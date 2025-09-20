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
import ExtraCard from '@/components/results-step/dashboard-cards/ExtraCard';
import ScoresCard from '@/components/results-step/dashboard-cards/ScoresCard';

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
}

const SuitabilityDashboard: React.FC<SuitabilityDashboardProps> = ({ result, location }) => {
  // Helpers
  const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));
  const toKm = (m: number) => m / 1000;
  const fmtKm = (m?: number) => (m == null ? '—' : `${toKm(m).toFixed(2)} km`);
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

  // Scores
  const solarBase = (ws: WeatherSummary) => {
    const sun = ws.sunshine_duration ?? 0;
    const base = clamp(((sun - 800) / (2200 - 800)) * 100, 0, 100);
    const cloud = ws.cloud_cover_mean;
    const clearBoost = cloud == null ? 50 : (100 - clamp(cloud, 0, 100));
    return Math.round(0.7 * base + 0.3 * clearBoost);
  };
  const windBase = (ws: WeatherSummary) => {
    const mean = ws.wind_speed_10m_mean ?? 0;
    const score = clamp(((mean - 3) / (10 - 3)) * 100, 0, 100);
    return Math.round(score);
  };
  const solarScore = Math.round((solarBase(past) + solarBase(future)) / 2);
  const windScore = Math.round((windBase(past) + windBase(future)) / 2);

  // Allowed / risks
  const allowed = geo.protectedPresent === true ? false : true;
  const notes: string[] = [];
  const risks: string[] = [];
  if (geo.nearestPowerLineMeters != null) notes.push(`Nearest power line: ${fmtKm(geo.nearestPowerLineMeters)}`);
  if (geo.nearestDistributionCenterMeters != null) notes.push(`Nearest distribution center: ${fmtKm(geo.nearestDistributionCenterMeters)}`);
  if (geo.buildingsPresent === true) risks.push(`Buildings within area${geo.buildingsMaxDistanceMeters ? ` (closest ${fmtKm(geo.buildingsMaxDistanceMeters)})` : ''}`);
  if (geo.protectedPresent === true) risks.push(`Protected nature area present${geo.protectedTypes && geo.protectedTypes.length ? ` (${geo.protectedTypes.join(', ')})` : ''}`);

  // const theme = useTheme();
  // Layout: 4x4 tiles (equal). At md+ use absolute tile placement; below md, stack.
  return (
    <Box
      sx={{
        width: '100%',
        maxHeight: { md: '90vh', xs: 'none' },
        display: 'grid',
        gap: { xs: customThemeVars.grid.gap.mobile, sm: customThemeVars.grid.gap.mobile, md: customThemeVars.grid.gap.desktop },
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
        gridTemplateRows: { md: 'repeat(4, minmax(0, 1fr))' },
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

      {/* Tiles 11,15: Allowance + Notes/Risks */}
      <Box sx={{ gridColumn: { xs: '1', sm: '1 / -1', md: '3' }, gridRow: { md: '3 / span 2' } }}>
        <AllowanceRisksCard allowed={allowed} notes={notes} risks={risks} />
      </Box>

      {/* Tile 12: Extra relevant (precipitation) */}
      <Box sx={{ gridColumn: { xs: '1', sm: '1 / -1', md: '4' }, gridRow: { md: '3' } }}>
        <ExtraCard
          past={{ precipitation_sum: past.precipitation_sum, precipitation_hours: past.precipitation_hours }}
          future={{ precipitation_sum: future.precipitation_sum, precipitation_hours: future.precipitation_hours }}
        />
      </Box>

      {/* Tile 16: Scores */}
      <Box sx={{ gridColumn: { xs: '1', sm: '1 / -1', md: '4' }, gridRow: { md: '4' } }}>
        <ScoresCard solar={solarScore} wind={windScore} />
      </Box>
    </Box>
  );
};

export default SuitabilityDashboard;
