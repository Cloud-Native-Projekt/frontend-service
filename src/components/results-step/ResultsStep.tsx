"use client";
import React from "react";
import { AnalysisResult, Location } from "@/types";
import SuitabilityDashboard from "@/components/results-step/SuitabilityDashboard";

interface Props {
  result: AnalysisResult | null;
  location: Location | null;
  onReset: () => void;
  onRecalculate?: () => void;
  recalculating?: boolean;
}

export function ResultsStep(props: Props) {
  return (
    <SuitabilityDashboard
      result={props.result}
      location={props.location}
      onReset={props.onReset}
      onRecalculate={props.onRecalculate}
      recalculating={props.recalculating}
    />
  );
}