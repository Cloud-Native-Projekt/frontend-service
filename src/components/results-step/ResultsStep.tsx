"use client";
import React from "react";
import { AnalysisData, Location } from "@/types";
import SuitabilityDashboard from "@/components/results-step/SuitabilityDashboard";

interface Props {
  result: AnalysisData | null;
  location: Location | null;
  onResetStepper?: () => void;
}

export function ResultsStep(props: Props) {
  return (
    <SuitabilityDashboard
      result={props.result}
      location={props.location}
      resetStepper={props.onResetStepper}
    />
  );
}