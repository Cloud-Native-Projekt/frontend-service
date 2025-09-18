"use client";
import React from "react";
import { Box, Typography, Button, Card, Divider, Stack } from "@mui/material";
import SuitabilityDashboard from "@/components/SuitabilityDashboard";
import { AnalysisResult, Location } from "@/types";

interface Props {
  result: AnalysisResult | null;
  location: Location | null;
  onReset: () => void;
  onRecalculate?: () => void;
  recalculating?: boolean;
}

export function ResultsStep({ result, location, onReset, onRecalculate, recalculating }: Props) {
  return (
    <Box sx={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column", gap: 3 }}>
      <Card sx={{ p: 2, display: "flex", flexDirection: "column", gap: 1 }}>
        <Typography variant="h6" fontWeight={600}>Analyse-Ergebnis</Typography>
        {location && (
          <Typography variant="body2" color="text.secondary">
            Position: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
          </Typography>
        )}
        {result ? (
          <Typography variant="body2">
            Score: {result.score} · Zeit: {new Date(result.generatedAt).toLocaleTimeString()}
          </Typography>
        ) : (
          <Typography variant="body2" color="text.secondary">
            Kein Ergebnis geladen.
          </Typography>
        )}
        <Divider sx={{ my: 1 }} />
        <Stack direction="row" spacing={1}>
          <Button variant="contained" onClick={onReset}>Neuer Versuch</Button>
          {onRecalculate && (
            <Button
              variant="outlined"
              onClick={onRecalculate}
              disabled={recalculating}
            >
              {recalculating ? "Aktualisiere..." : "Neu berechnen"}
            </Button>
          )}
        </Stack>
      </Card>

      <SuitabilityDashboard />
    </Box>
  );
}