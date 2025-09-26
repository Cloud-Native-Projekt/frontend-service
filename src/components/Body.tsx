"use client";
import React from "react";
import { Alert, Box, Stepper, Step, StepLabel } from "@mui/material";
import { customThemeVars } from "@/theme";
import { LocationStep } from "./location-step/LocationStep";
import { ResultsStep } from "./results-step/ResultsStep";
import { useProjectConfig } from "@/hooks/useProjectConfig";
import { analyzeCoordinates } from "@/actions/analyzeCoordinates";
import { AnalysisData, Location, ProjectConfig } from "@/types";

const steps = ["Standort wählen", "Ergebnisse ansehen"];

export default function Body() {
  const [activeStep, setActiveStep] = React.useState(0);
  const [location, setLocation] = React.useState<Location | null>(null);
  const { searchRadiusKm, hubHeight, setSearchRadiusKm, setHubHeight, toConfig } = useProjectConfig();
  const [analysisResult, setAnalysisResult] = React.useState<AnalysisData | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [lastConfig, setLastConfig] = React.useState<ProjectConfig | null>(null);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const runAnalysis = React.useCallback(async () => {
    if (!location) return;
    setErrorMessage(null);
    setLoading(true);
    const config = toConfig();
    setLastConfig(config);
    try {
      const result = await analyzeCoordinates({ location, config });
      setAnalysisResult(result);
      setErrorMessage(null);
      setActiveStep(1);
    }
    catch (error) {
      console.error("Error during analysis:", error);
      setAnalysisResult(null);
      setErrorMessage("Leider ist ein Fehler aufgetreten. Bitte versuchen Sie es in Kürze erneut.");
    }
    finally {
      setLoading(false);
    }
  }, [location, toConfig]);

  const resetToSelection = React.useCallback(() => {
    setActiveStep(0);
    console.log("Resetting location and result");
    setLocation(null);
    setAnalysisResult(null);
    setLoading(false);
    setLastConfig(null);
    setErrorMessage(null);
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

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMessage}
        </Alert>
      )}

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
          config={lastConfig}
          onResetStepper={resetToSelection}
        />
      )}
    </Box>
  );
}