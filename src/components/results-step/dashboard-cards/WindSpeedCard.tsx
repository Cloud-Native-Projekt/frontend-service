"use client";
import React from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { alpha, useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import ArrowUpward from "@mui/icons-material/ArrowUpward";
import ArrowDownward from "@mui/icons-material/ArrowDownward";
import Remove from "@mui/icons-material/Remove";

export interface WindSpeedCardProps {
  past: { min?: number; max?: number; mean?: number };
  future: { min?: number; max?: number; mean?: number };
}

// helpers
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const ceilTo = (v: number, step: number) => Math.ceil(v / step) * step;

type GaugeProps = {
  label: string;
  mean?: number;
  min?: number;
  max?: number;
  domainMin: number;
  domainMax: number;
  isRow: boolean;
};

const SpeedGauge: React.FC<GaugeProps> = React.memo(
  ({ label, mean, min, max, domainMin, domainMax, isRow }) => {
    const theme = useTheme();

    const safeMin = min == null ? undefined : clamp(min, domainMin, domainMax);
    const safeMax = max == null ? undefined : clamp(max, domainMin, domainMax);
    const safeMean = mean == null ? undefined : clamp(mean, domainMin, domainMax);

    // Geometry (smaller, responsive)
    const W = 100;
    const H = 45;
    const CX = W / 2;
    const CY = H;
    const STROKE = 8;
    const R = Math.min(W / 2, H) - STROKE / 2 - 4;

    const valueToAngle = (v: number) =>
      180 - ((v - domainMin) / (domainMax - domainMin)) * 180;

    const toXY = (deg: number, r = R) => {
      const rad = (deg * Math.PI) / 180;
      return { x: CX + r * Math.cos(rad), y: CY - r * Math.sin(rad) };
    };

    const arcPath = (startDeg: number, endDeg: number, r = R) => {
      const start = toXY(startDeg, r);
      const end = toXY(endDeg, r);
      const delta = Math.abs(endDeg - startDeg);
      const largeArc = delta > 180 ? 1 : 0;
      const sweep = endDeg < startDeg ? 1 : 0;
      return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} ${sweep} ${end.x} ${end.y}`;
    };

    // cutpoints
    const CUT_IN = 3.5;
    const OPTIMAL = 8;
    const redEnd = clamp(CUT_IN, domainMin, domainMax);
    const amberEnd = clamp(OPTIMAL, domainMin, domainMax);

    const redColor = alpha(theme.palette.error.main, 0.72);
    const amberColor = alpha(theme.palette.warning.main, 0.72);
    const greenColor = alpha(theme.palette.success.main, 0.72);
    const baseTrackColor = theme.palette.divider;

    const basePath = arcPath(180, 0, R);

    const TRIM = 0.8;
    const redPath = arcPath(180 - TRIM, valueToAngle(redEnd) + TRIM, R);
    const amberPath = arcPath(valueToAngle(redEnd) - TRIM, valueToAngle(amberEnd) + TRIM, R);
    const greenPath = arcPath(valueToAngle(amberEnd) - TRIM, 0 + TRIM, R);

    // Range & needle
    const hasRange = min != null && max != null && min <= max;
    const rInner = R - STROKE / 2 - 4;
    const rangePath = hasRange
      ? arcPath(
        valueToAngle(Math.min(safeMin ?? domainMin, safeMax ?? domainMin)),
        valueToAngle(Math.max(safeMin ?? domainMin, safeMax ?? domainMin)),
        rInner
      )
      : "";

    const hasMean = safeMean != null;
    const meanDeg = hasMean ? valueToAngle(safeMean!) : 0;
    const needleOuter = hasMean ? toXY(meanDeg, R + 1) : { x: 0, y: 0 };
    const needleInner = hasMean ? toXY(meanDeg, rInner - 4) : { x: CX, y: CY };

    const valueText = hasMean ? `${safeMean!.toFixed(1)} m/s` : "—";

    // formatted min/max (add "+" if outside gauge domain)
    const minText =
      min != null
        ? `${min.toFixed(1)}${min < domainMin ? "+" : ""}`
        : "—";
    const maxText =
      max != null
        ? `${max.toFixed(1)}${max > domainMax ? "+" : ""}`
        : "—";

    return (
      <Stack alignItems="center" spacing={0.25} sx={{ flex: 1, minWidth: 0 }}>
        <Box
          component="svg"
          viewBox={`0 0 ${W} ${H}`}
          sx={isRow ? { height: { xs: 60, sm: 72, md: 84 }, width: 'auto', maxWidth: '100%', display: 'block' } : { width: '100%', height: 'auto', display: 'block' }}
          preserveAspectRatio="xMidYMid meet"
        >
          <path d={basePath} stroke={baseTrackColor} strokeWidth={STROKE} fill="none" />
          <path d={redPath} stroke={redColor} strokeWidth={STROKE} fill="none" />
          <path d={amberPath} stroke={amberColor} strokeWidth={STROKE} fill="none" />
          <path d={greenPath} stroke={greenColor} strokeWidth={STROKE} fill="none" />
          {hasRange && (
            <path
              d={rangePath}
              stroke={theme.palette.primary.main}
              strokeWidth={Math.max(3, STROKE - 4)}
              fill="none"
              strokeLinecap="round"
            />
          )}
          {hasMean && (
            <>
              <line
                x1={needleInner.x}
                y1={needleInner.y}
                x2={needleOuter.x}
                y2={needleOuter.y}
                stroke={theme.palette.text.primary}
                strokeWidth={2}
                strokeLinecap="round"
              />
              <circle
                cx={CX}
                cy={CY}
                r={5}
                fill={theme.palette.background.paper}
                stroke={theme.palette.text.primary}
                strokeWidth={1.5}
              />
            </>
          )}
        </Box>

        <Typography variant="body2" fontWeight={600}>
          {valueText}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {label}: {minText} – {maxText} m/s
        </Typography>
      </Stack>
    );
  }
);

const WindSpeedCard: React.FC<WindSpeedCardProps> = ({ past, future }) => {
  const vals = [
    past.min,
    past.max,
    past.mean,
    future.min,
    future.max,
    future.mean,
  ].filter((v): v is number => typeof v === "number" && !Number.isNaN(v));
  const maxObserved = vals.length ? Math.max(...vals) : 12;
  const domainMin = 0;
  const domainMax = clamp(ceilTo(Math.max(12, maxObserved), 5), 12, 40);

  const trend = (() => {
    if (typeof past.mean !== "number" || typeof future.mean !== "number")
      return { dir: 0, delta: 0 };
    const delta = +(future.mean - past.mean);
    const dir = Math.abs(delta) < 0.25 ? 0 : delta > 0 ? 1 : -1;
    return { dir, delta };
  })();

  const theme = useTheme();
  const isRow = useMediaQuery(theme.breakpoints.up("sm"));

  return (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column", paddingTop: 0 }}>
      <CardHeader title="Wind Speed" />
      <CardContent sx={{ padding: 0, overflow: "hidden" }}>
        <Stack
          direction={isRow ? "row" : "column"}
          spacing={1}
          alignItems="center"
          divider={
            <Divider orientation={isRow ? "vertical" : "horizontal"} flexItem />
          }
          sx={{ width: "100%", flexWrap: "wrap" }}
        >
          <SpeedGauge
            label="Past"
            mean={past.mean}
            min={past.min}
            max={past.max}
            domainMin={domainMin}
            domainMax={domainMax}
            isRow={isRow}
          />

          <Stack alignItems="center" spacing={0.25} sx={{ px: 1 }}>
            {trend.dir === 1 && (
              <ArrowUpward sx={{ color: "success.main", fontSize: 20 }} />
            )}
            {trend.dir === -1 && (
              <ArrowDownward sx={{ color: "error.main", fontSize: 20 }} />
            )}
            {trend.dir === 0 && (
              <Remove sx={{ color: "text.secondary", fontSize: 20 }} />
            )}
            <Typography variant="caption" color="text.secondary">
              {typeof trend.delta === "number"
                ? `${trend.delta > 0 ? "+" : ""}${trend.delta.toFixed(1)} m/s`
                : "—"}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              mean change
            </Typography>
          </Stack>

          <SpeedGauge
            label="Next"
            mean={future.mean}
            min={future.min}
            max={future.max}
            domainMin={domainMin}
            domainMax={domainMax}
            isRow={isRow}
          />
        </Stack>
      </CardContent>
    </Card>
  );
};

export default WindSpeedCard;
