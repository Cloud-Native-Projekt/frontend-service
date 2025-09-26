"use client";
import React from "react";
import { Box, Stepper, Step, StepLabel } from "@mui/material";
import { customThemeVars } from "@/theme";
import { LocationStep } from "./location-step/LocationStep";
import { ResultsStep } from "./results-step/ResultsStep";
import { useProjectConfig } from "@/hooks/useProjectConfig";
import { analyzeCoordinates } from "@/actions/analyzeCoordinates";
import { AnalysisData, Location } from "@/types";

const steps = ["Standort wählen", "Ergebnisse ansehen"];

export default function Body() {
  const [activeStep, setActiveStep] = React.useState(0);
  const [location, setLocation] = React.useState<Location | null>(null);
  const { searchRadiusKm, hubHeight, setSearchRadiusKm, setHubHeight, toConfig } = useProjectConfig();
  const [analysisResult, setAnalysisResult] = React.useState<AnalysisData | null>(null);
  const [loading, setLoading] = React.useState(false);

  const runAnalysis = React.useCallback(async () => {
    if (!location) return;
    setLoading(true);
    const result = await analyzeCoordinates({
      location,
      config: toConfig(),
    });
    setAnalysisResult(result);
    setLoading(false);
    setActiveStep(1);
  }, [location, toConfig]);

  const resetToSelection = React.useCallback(() => {
    setActiveStep(0);
    console.log("Resetting location and result");
    setLocation(null);
    setAnalysisResult(null);
    setLoading(false);
  }, []);

  return (
    <Box
      sx={{
        margin: { xs: customThemeVars.body.margin.mobile, sm: customThemeVars.body.margin.desktop },
        padding: {
          xs: `0 ${customThemeVars.body.padding.mobile}`,
          sm: `0 ${customThemeVars.body.padding.desktop}`,
        },
        flex: 1,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Stepper
        activeStep={activeStep}
        sx={{
          background: "transparent",
          padding: 0,
          mb: 3,
          "& .MuiStepLabel-label": { fontWeight: 600, color: "text.primary" },
        }}
      >
        {steps.map((label) => (
          <Step key={label}><StepLabel>{label}</StepLabel></Step>
        ))}
      </Stepper>

      {activeStep === 0 && (
        <LocationStep
          location={location}
          setLocation={setLocation}
          radius={searchRadiusKm}
          setRadius={setSearchRadiusKm}
          hubHeight={hubHeight}
          setHubHeight={setHubHeight}
          onAnalyze={runAnalysis}
          loading={loading}
        />
      )}

      {activeStep === 1 && (
        <ResultsStep
          result={analysisResult}
          location={location}
          onResetStepper={resetToSelection}
        />
      )}
    </Box>
  );
}