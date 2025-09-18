"use client";

import { customThemeVars } from "@/theme";
import React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Card from "@mui/material/Card";
import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import dynamic from 'next/dynamic';
// Leaflet map must be client-only; dynamic import disables SSR evaluation of leaflet internals.
const Map = dynamic(() => import('@/components/Map'), { ssr: false });
import SuitabilityDashboard from "@/components/SuitabilityDashboard";

const steps = ["Select location", "View results"];

export default function Body() {
  const [activeStep, setActiveStep] = React.useState(0);
  const [location, setLocation] = React.useState<{ lat: number; lng: number } | null>(null);
  const [invalidClick, setInvalidClick] = React.useState<{ lat: number; lng: number } | null>(null);

  // Suchradius + konfigurierbares Maximum
  const [searchRadiusKm, setSearchRadiusKm] = React.useState<number>(20);

  // Weitere sinnvolle Auswahl: Turbinen-Hubhöhe (wirkt später auf Ertragsmodell)
  const [hubHeight, setHubHeight] = React.useState<number>(120);

  const handleNext = () => {
    if (activeStep === 0 && !location) return;
    setActiveStep((prev) => prev + 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    setLocation(null);
  };

  return (
    <Box
      sx={{
        margin: { xs: customThemeVars.body.margin.mobile, sm: customThemeVars.body.margin.desktop },
        padding: { xs: customThemeVars.body.padding.mobile, sm: customThemeVars.body.padding.desktop },
        paddingTop: 0,
        paddingBotttom: 0,
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
          "& .MuiStepLabel-label": {
            fontWeight: 600,
            color: "text.primary",
          },
        }}
      >
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {activeStep === 0 && (
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={{ xs: customThemeVars.body.innerMargin.mobile, sm: customThemeVars.body.innerMargin.desktop }}
          sx={{ flex: 1, minHeight: 0 }}
        >
          <Box sx={{ flex: 1, minWidth: 0, display: "flex" }}>
            <Map
              onChange={setLocation}
              fillParent
              onInvalidAttempt={(lat, lng) => setInvalidClick({ lat, lng })}
            />
          </Box>

          {/* Seitenleiste mit drei MD3-Karten */}
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
            <Card
              variant="elevation"
              sx={{
                display: "flex",
                flex: 1,
                flexDirection: "column",
                gap: 2,
              }}
            >
              <Typography variant="h5" fontWeight={600}>
                Suchradius
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Lege fest, in welchem Umkreis (m) um die gewählte Position analysiert werden soll.
              </Typography>

              <Box>
                <FormLabel sx={{ mb: 1, display: "block" }}>Aktueller Radius: {searchRadiusKm} km</FormLabel>
                <Slider
                  value={searchRadiusKm}
                  min={10}
                  step={10}
                  max={50000}
                  valueLabelDisplay="auto"
                  onChange={(_, v) => setSearchRadiusKm(v as number)}
                />
              </Box>
            </Card>

            {/* Card 2: Weitere Auswahl (Turbinen-Hubhöhe) */}
            <Card
              variant="elevation"
              sx={{
                display: "flex",
                flex: 1,
                flexDirection: "column",
                gap: 2,
              }}
            >
              <Typography variant="h5" fontWeight={600}>
                Turbinenparameter
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Wähle eine geplante Hubhöhe. Diese beeinflusst die Windprofil-Einschätzung.
              </Typography>

              <FormControl size="small">
                <FormLabel sx={{ mb: 0.5 }}>Hubhöhe (m)</FormLabel>
                <Select
                  value={hubHeight}
                  onChange={(e) => setHubHeight(Number(e.target.value))}
                >
                  {[80, 100, 120, 140, 160].map((h) => (
                    <MenuItem key={h} value={h}>
                      {h} m
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Card>

            {/* Card 3: Weiter / Zusammenfassung */}
            <Card
              variant="elevation"
              sx={{
                display: "flex",
                flex: 1,
                flexDirection: "column",
                gap: 1.5,
              }}
            >
              <Typography variant="h5" fontWeight={600}>
                Zusammenfassung
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {location
                  ? `Ausgewählte Position: ${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`
                  : "Keine Position gewählt."}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Radius: {searchRadiusKm} m · Hubhöhe: {hubHeight} m
              </Typography>

              <Box sx={{ flexGrow: 1 }} />

              <Button
                onClick={handleNext}
                disabled={!location}
                fullWidth
                variant="contained"
                size="large"
              >
                Weiter
              </Button>
            </Card>
          </Stack>

          <Snackbar
            open={!!invalidClick}
            autoHideDuration={3000}
            onClose={() => setInvalidClick(null)}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <Alert
              onClose={() => setInvalidClick(null)}
              severity="warning"
              variant="filled"
              elevation={3}
            >
              Standort muss innerhalb Deutschlands liegen.
            </Alert>
          </Snackbar>
        </Stack>
      )
      }

      {
        activeStep === steps.length - 1 && (
          <Box
            sx={{
              flex: 1,
              minHeight: 0,
              display: "flex",
              flexDirection: "column",
              gap: 3,
            }}
          >
            <SuitabilityDashboard />
          </Box>
        )
      }

      <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
        <Box sx={{ flex: "1 1 auto" }} />
        {activeStep === steps.length - 1 && (
          <Button onClick={handleReset}>Neuer Versuch</Button>
        )}
      </Box>
    </Box >
  );
}