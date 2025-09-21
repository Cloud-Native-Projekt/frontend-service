"use client";
import React, { useMemo } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  Stack,
  Typography,
  Box,
  Divider,
} from "@mui/material";
import ElectricalServicesIcon from '@mui/icons-material/ElectricalServices';
import CellTowerIcon from '@mui/icons-material/CellTower';
import { alpha, useTheme } from "@mui/material/styles";

export interface DistancesCardProps {
  powerLineMeters?: number;
  distributionMeters?: number;
}

const formatDistance = (meters?: number) => {
  if (meters == null) return "10+ km"; // missing = >10 km
  const km = meters / 1000;
  if (km >= 10) return "10+ km";
  if (km >= 1) return `${km.toFixed(1)} km`;
  return `${Math.round(meters)} m`;
};

const clampValue = (value: number, low: number, high: number) =>
  Math.max(low, Math.min(high, value));

type Threshold = { toKilometers: number; label: string; color: string };

const Bar: React.FC<{
  icon: React.ReactNode;
  label: string;
  meters?: number;
  thresholds: Threshold[];
  domainMaxKilometers: number;
}> = ({ icon, label, meters, thresholds, domainMaxKilometers }) => {
  const theme = useTheme();
  const km = meters == null ? domainMaxKilometers : meters / 1000;

  // Always clamp to domain
  const valuePercent = (km / domainMaxKilometers) * 99;

  return (
    <Stack spacing={0.75} sx={{ width: "100%" }}>
      {/* Header row */}
      <Stack direction="row" spacing={1} alignItems="center">
        {icon}
        <Typography variant="body2" fontWeight={700}>
          {label}
        </Typography>
        <Box sx={{ flex: 1 }} />
        <Typography variant="caption" color="text.secondary">
          {formatDistance(meters)}
          {meters != null && km < 10 ? ` • ${meters} m` : ""}
        </Typography>
      </Stack>

      {/* Bar */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: 22,
          borderRadius: 11,
          overflow: "hidden",
          border: `1px solid ${theme.palette.divider}`,
          bgcolor: 'transparent',
        }}
        aria-label={`${label}: ${formatDistance(meters)}`}
      >
        {/* Colored thresholds */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            display: "flex",
            width: "100%",
            height: "100%",
          }}
        >
          {thresholds.map((t, i) => {
            const prev = i === 0 ? 0 : thresholds[i - 1].toKilometers;
            const widthPercent =
              ((t.toKilometers - prev) / domainMaxKilometers) * 100;
            return (
              <Box
                key={i}
                sx={{
                  width: `${widthPercent}%`,
                  height: "100%",
                  flex: "0 0 auto",
                  bgcolor: alpha(t.color, 0.4),
                }}
              />
            );
          })}
        </Box>

        {/* Marker (always shown, even if >10 km) */}
        <Box
          sx={{
            position: "absolute",
            left: `calc(${clampValue(valuePercent, 0, 100)}% - 7px)`,
            top: -3,
            width: 14,
            height: 28,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              width: 0,
              height: 0,
              borderLeft: "7px solid transparent",
              borderRight: "7px solid transparent",
              borderBottom: `10px solid ${theme.palette.text.primary}`,
            }}
          />
          <Box
            sx={{
              position: "absolute",
              top: 10,
              width: 2,
              bottom: 3,
              bgcolor: theme.palette.text.primary,
              borderRadius: 1,
            }}
          />
        </Box>
      </Box>

      {/* Labels under bar */}
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        {thresholds.map((t, i) => (
          <Typography key={i} variant="caption" color="text.secondary">
            {t.label}
          </Typography>
        ))}
      </Stack>
    </Stack>
  );
};

const DistancesCard: React.FC<DistancesCardProps> = ({
  powerLineMeters,
  distributionMeters,
}) => {
  const theme = useTheme();
  const thresholds: Threshold[] = useMemo(
    () => [
      { toKilometers: 0.5, label: "≤0.5 km", color: theme.palette.success.main },
      { toKilometers: 1.0, label: "≤1 km", color: theme.palette.success.light },
      { toKilometers: 2.0, label: "≤2 km", color: theme.palette.primary.main },
      { toKilometers: 3.0, label: "≤3 km", color: theme.palette.primary.dark },
      { toKilometers: 5.0, label: "≤5 km", color: theme.palette.warning.main },
      { toKilometers: 7.5, label: "≤7.5 km", color: theme.palette.warning.dark },
      { toKilometers: 10.0, label: "≤10 km", color: theme.palette.error.main },
    ],
    [theme]
  );
  const domainMaxKilometers = 10;

  return (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <CardHeader title="Grid proximity" />
      <CardContent sx={{ p: 0 }}>
        <Stack spacing={2} sx={{ width: "100%", p: 2 }}>
          <Bar
            icon={<ElectricalServicesIcon color="info" />}
            label="Nearest power line"
            meters={powerLineMeters}
            thresholds={thresholds}
            domainMaxKilometers={domainMaxKilometers}
          />
          <Divider flexItem />
          <Bar
            icon={<CellTowerIcon color="success" />}
            label="Nearest distribution center"
            meters={distributionMeters}
            thresholds={thresholds}
            domainMaxKilometers={domainMaxKilometers}
          />
        </Stack>
      </CardContent>
    </Card>
  );
};

export default DistancesCard;
