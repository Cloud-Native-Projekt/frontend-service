"use client";
import React from "react";
import { Card, Typography, Button, CircularProgress, Box } from "@mui/material";
import { Location } from "@/types";

interface Props {
  location: Location | null;
  radius: number;
  hubHeight: number;
  onAnalyze: () => void;
  disabled: boolean;
  loading: boolean;
}

export function SummaryCard({ location, radius, hubHeight, onAnalyze, disabled, loading }: Props) {
  return (
    <Card variant="elevation" sx={{ display: "flex", flex: 1, flexDirection: "column", gap: 1.5 }}>
      <Typography variant="h5" fontWeight={600}>Zusammenfassung</Typography>
      <Typography variant="body2" color="text.secondary">
        {location
          ? `Ausgewählte Position: ${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`
          : "Keine Position gewählt."}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Radius: {radius} km · Hubhöhe: {hubHeight} m
      </Typography>
      <div style={{ flexGrow: 1 }} />
      <Button
        onClick={onAnalyze}
        disabled={disabled || loading}
        fullWidth
        variant="contained"
        size="large"
      >
        {loading ?
          <Box>
            Analyse läuft  <CircularProgress size={14} />
          </Box> : "Weiter"}
      </Button>
    </Card>
  );
}