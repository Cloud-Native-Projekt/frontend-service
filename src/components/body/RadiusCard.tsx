"use client";
import React from "react";
import { Card, Typography, Box, Slider, FormLabel } from "@mui/material";

interface Props {
  value: number;
  onChange: (v: number) => void;
}

export function RadiusCard({ value, onChange }: Props) {
  return (
    <Card variant="elevation" sx={{ display: "flex", flex: 1, flexDirection: "column", gap: 2 }}>
      <Typography variant="h5" fontWeight={600}>Suchradius</Typography>
      <Typography variant="body2" color="text.secondary">
        Lege fest, in welchem Umkreis (m) um die gewählte Position analysiert werden soll.
      </Typography>
      <Box>
        <FormLabel sx={{ mb: 1, display: "block" }}>Aktueller Radius: {value} km</FormLabel>
        <Slider
          value={value}
          min={1}
          step={1}
          max={5}
          valueLabelDisplay="auto"
          onChange={(_, v) => onChange(v as number)}
        />
      </Box>
    </Card>
  );
}