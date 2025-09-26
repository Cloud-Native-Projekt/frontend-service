"use client";
import React from "react";
import { AnalysisData, Location, ProjectConfig } from "@/types";
import SuitabilityDashboard from "@/components/results-step/SuitabilityDashboard";

interface Props {
  result: AnalysisData | null;
  location: Location | null;
  config?: ProjectConfig | null;
  onResetStepper?: () => void;
}

export function ResultsStep(props: Props) {
  return (
    <SuitabilityDashboard
      result={props.result}
      location={props.location}
      config={props.config}
      resetStepper={props.onResetStepper}
    />
  );
}