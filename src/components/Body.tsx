"use client";
import React from "react";
import { Box, Stepper, Step, StepLabel } from "@mui/material";
import { customThemeVars } from "@/theme";
import { LocationStep } from "./location-step/LocationStep";
import { ResultsStep } from "./results-step/ResultsStep";
import { useProjectConfig } from "@/hooks/useProjectConfig";
import { analyzeProject } from "@/actions/analyzeProject";
import { AnalysisResult, Location } from "@/types";

const steps = ["Select location", "View results"];

export default function Body() {
  const [activeStep, setActiveStep] = React.useState(0);
  const [location, setLocation] = React.useState<Location | null>(null);
  const { searchRadiusKm, hubHeight, setSearchRadiusKm, setHubHeight, reset: resetConfig, toConfig } = useProjectConfig();
  const [analysisResult, setAnalysisResult] = React.useState<AnalysisResult | null>(null);
  const [loading, setLoading] = React.useState(false);

  const runAnalysis = React.useCallback(async () => {
    if (!location) return;
    setLoading(true);
    const result = await analyzeProject({
      location,
      config: toConfig(),
    });
    setAnalysisResult(result);
    setLoading(false);
    setActiveStep(1);
  }, [location, toConfig]);

  const handleReset = () => {
    setActiveStep(0);
    setLocation(null);
    setAnalysisResult(null);
    resetConfig();
  };

  const recalc = async () => {
    if (!location) return;
    setLoading(true);
    const result = await analyzeProject({ location, config: toConfig() });
    setAnalysisResult(result);
    setLoading(false);
  };

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
        minHeight: 0,
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
          onReset={handleReset}
          onRecalculate={recalc}
          recalculating={loading}
        />
      )}
    </Box>
  );
}