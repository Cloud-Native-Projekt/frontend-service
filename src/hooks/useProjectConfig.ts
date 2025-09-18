"use client";
import React from "react";
import { ProjectConfig } from "@/types";

export function useProjectConfig(initial?: Partial<ProjectConfig>) {
  const [searchRadiusKm, setSearchRadiusKm] = React.useState<number>(initial?.searchRadiusKm ?? 1);
  const [hubHeight, setHubHeight] = React.useState<number>(initial?.hubHeight ?? 120);

  return {
    searchRadiusKm,
    hubHeight,
    setSearchRadiusKm,
    setHubHeight,
    toConfig(): ProjectConfig {
      return { searchRadiusKm, hubHeight };
    },
    reset() {
      setSearchRadiusKm(1);
      setHubHeight(120);
    }
  };
}