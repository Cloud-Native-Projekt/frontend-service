"use client";
import React from "react";
import { Box, Snackbar, Alert } from "@mui/material";
import dynamic from "next/dynamic";
import { Location } from "@/types";

const Map = dynamic(() => import("@/components/location-step/map/Map"), { ssr: false });

interface Props {
  onLocationChange: (loc: Location | null) => void;
}

export function MapPanel({ onLocationChange }: Props) {
  const [invalidClick, setInvalidClick] = React.useState<Location | null>(null);

  return (
    <Box sx={{ flex: 1, minWidth: 0, display: "flex" }}>
      <Map
        onChange={onLocationChange}
        fillParent
        onInvalidAttempt={(lat, lng) => setInvalidClick({ lat, lng })}
      />
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
    </Box>
  );
}