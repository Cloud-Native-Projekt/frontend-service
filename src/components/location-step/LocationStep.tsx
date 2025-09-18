"use client";
import React from "react";
import { Stack } from "@mui/material";
import { customThemeVars } from "@/theme";
import { MapPanel } from "./map/MapPanel";
import { RadiusCard } from "./side-cards/RadiusCard";
import { TurbineParamsCard } from "./side-cards/TurbineParamsCard";
import { SummaryCard } from "./side-cards/SummaryCard";
import { Location } from "@/types";

interface Props {
  location: Location | null;
  setLocation: (loc: Location | null) => void;
  radius: number;
  setRadius: (v: number) => void;
  hubHeight: number;
  setHubHeight: (v: number) => void;
  onAnalyze: () => void;
  loading: boolean;
}

export function LocationStep({
  location,
  setLocation,
  radius,
  setRadius,
  hubHeight,
  setHubHeight,
  onAnalyze,
  loading
}: Props) {
  return (
    <Stack
      direction={{ xs: "column", md: "row" }}
      spacing={{ xs: customThemeVars.body.innerMargin.mobile, sm: customThemeVars.body.innerMargin.desktop }}
      sx={{ flex: 1, minHeight: 0 }}
    >
      <MapPanel onLocationChange={setLocation} />
      <Stack
        direction="column"
        spacing={{ xs: customThemeVars.body.innerMargin.mobile, sm: customThemeVars.body.innerMargin.desktop }}
        sx={{
          width: { xs: "100%", md: "20%" },
          height: { xs: "70%", md: "auto" },
          minWidth: 300,
          minHeight: { xs: 300, md: 0 },
          flexShrink: 0,
          display: "flex",
        }}
      >
        <RadiusCard value={radius} onChange={setRadius} />
        <TurbineParamsCard hubHeight={hubHeight} onChange={setHubHeight} />
        <SummaryCard
          location={location}
          radius={radius}
          hubHeight={hubHeight}
          onAnalyze={onAnalyze}
          disabled={!location}
          loading={loading}
        />
      </Stack>
    </Stack>
  );
}