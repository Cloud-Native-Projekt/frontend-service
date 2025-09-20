"use client";
import React from "react";
import { AnalysisResult, Location } from "@/types";
import SuitabilityDashboard from "@/components/results-step/SuitabilityDashboard";

interface Props {
  result: AnalysisResult | null;
  location: Location | null;
}

export function ResultsStep(props: Props) {
  return (
    <SuitabilityDashboard
      result={props.result}
      location={props.location}
    />
  );
}