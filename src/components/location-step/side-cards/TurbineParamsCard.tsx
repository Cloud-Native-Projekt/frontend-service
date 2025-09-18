"use client";
import React from "react";
import { Card, Typography, FormControl, FormLabel, Select, MenuItem } from "@mui/material";

interface Props {
  hubHeight: number;
  onChange: (v: number) => void;
}

export function TurbineParamsCard({ hubHeight, onChange }: Props) {
  return (
    <Card variant="elevation" sx={{ display: "flex", flex: 1, flexDirection: "column", gap: 2 }}>
      <Typography variant="h5" fontWeight={600}>Turbinenparameter</Typography>
      <Typography variant="body2" color="text.secondary">
        Wähle eine geplante Hubhöhe. Diese beeinflusst die Windprofil-Einschätzung.
      </Typography>
      <FormControl size="small">
        <FormLabel sx={{ mb: 0.5 }}>Hubhöhe (m)</FormLabel>
        <Select value={hubHeight} onChange={(e) => onChange(Number(e.target.value))}>
          {[80, 100, 120, 140, 160].map(h => (
            <MenuItem key={h} value={h}>{h} m</MenuItem>
          ))}
        </Select>
      </FormControl>
    </Card>
  );
}