"use client";
import React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { alpha, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import ArrowUpward from '@mui/icons-material/ArrowUpward';
import ArrowDownward from '@mui/icons-material/ArrowDownward';
import Remove from '@mui/icons-material/Remove';

export interface TemperatureCardProps {
  past: { min?: number; max?: number; mean?: number };
  future: { min?: number; max?: number; mean?: number };
}

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

const TemperatureGauge: React.FC<GaugeProps> = React.memo(({ label, mean, min, max, domainMin, domainMax, isRow }) => {
  const theme = useTheme();
  const safeMin = min == null ? undefined : clamp(min, domainMin, domainMax);
  const safeMax = max == null ? undefined : clamp(max, domainMin, domainMax);
  const safeMean = mean == null ? undefined : clamp(mean, domainMin, domainMax);

  // Compact geometry
  const W = 100, H = 45, CX = W / 2, CY = H, STROKE = 8;
  const R = Math.min(W / 2, H) - STROKE / 2 - 4;
  const toXY = (deg: number, r = R) => { const rad = (deg * Math.PI) / 180; return { x: CX + r * Math.cos(rad), y: CY - r * Math.sin(rad) }; };
  const valueToAngle = (v: number) => 180 - ((v - domainMin) / (domainMax - domainMin)) * 180;
  const arcPath = (start: number, end: number, r = R) => { const s = toXY(start, r), e = toXY(end, r); const large = Math.abs(end - start) > 180 ? 1 : 0; const sweep = end < start ? 1 : 0; return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} ${sweep} ${e.x} ${e.y}`; };

  // Temperature zones — 6 classic bands: very-cold, cold, cool, mild, warm, hot
  const base = theme.palette.divider;
  const TRIM = 0.6;
  const bounds = [
    domainMin,
    clamp(0, domainMin, domainMax),
    clamp(10, domainMin, domainMax),
    clamp(15, domainMin, domainMax),
    clamp(20, domainMin, domainMax),
    clamp(25, domainMin, domainMax),
    domainMax,
  ];
  const colors = [
    alpha(theme.palette.info.dark, 0.8),   // very cold
    alpha(theme.palette.info.main, 0.75),  // cold
    alpha(theme.palette.primary.main, 0.7),// cool
    alpha(theme.palette.success.main, 0.75),// mild
    alpha(theme.palette.warning.main, 0.8),// warm
    alpha(theme.palette.error.main, 0.8),  // hot
  ];
  const basePath = arcPath(180, 0, R);

  const hasRange = safeMin != null && safeMax != null && safeMin <= safeMax;
  const rInner = R - STROKE / 2 - 4;
  const rangePath = hasRange ? arcPath(valueToAngle(Math.min(safeMin!, safeMax!)), valueToAngle(Math.max(safeMin!, safeMax!)), rInner) : '';
  const hasMean = safeMean != null;
  const meanDeg = hasMean ? valueToAngle(safeMean!) : 0;
  const needleOuter = hasMean ? toXY(meanDeg, R + 1) : { x: 0, y: 0 };
  const needleInner = hasMean ? toXY(meanDeg, rInner - 4) : { x: CX, y: CY };

  const valueText = hasMean ? `${safeMean!.toFixed(1)} °C` : '—';
  const minText = min != null ? `${min.toFixed(1)}` : '—';
  const maxText = max != null ? `${max.toFixed(1)}` : '—';

  return (
    <Stack alignItems="center" spacing={0.25} sx={{ flex: 1, minWidth: 0 }}>
      <Box
        component="svg"
        viewBox={`0 0 ${W} ${H}`}
        sx={isRow ? { height: { xs: 60, sm: 72, md: 84 }, width: 'auto', maxWidth: '100%', display: 'block' } : { width: '100%', height: 'auto', display: 'block' }}
        preserveAspectRatio="xMidYMid meet"
      >
        <path d={basePath} stroke={base} strokeWidth={STROKE} fill="none" />
        {bounds.slice(0, -1).map((a, i) => {
          const b = bounds[i + 1];
          if (!(a < b)) return null;
          const start = valueToAngle(a) - TRIM;
          const end = valueToAngle(b) + TRIM;
          return <path key={i} d={arcPath(start, end, R)} stroke={colors[i]} strokeWidth={STROKE} fill="none" />;
        })}
        {/* small ticks at zone boundaries */}
        {bounds.slice(1, -1).map((v, i) => {
          const ang = valueToAngle(v);
          const p1 = toXY(ang, R - STROKE - 2);
          const p2 = toXY(ang, R - STROKE - 2 - 4);
          return <line key={`t${i}`} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke={theme.palette.text.disabled} strokeWidth={1} />;
        })}
        {hasRange && <path d={rangePath} stroke={theme.palette.primary.main} strokeWidth={Math.max(3, STROKE - 4)} fill="none" strokeLinecap="round" />}
        {hasMean && (<>
          <line x1={needleInner.x} y1={needleInner.y} x2={needleOuter.x} y2={needleOuter.y} stroke={theme.palette.text.primary} strokeWidth={2} strokeLinecap="round" />
          <circle cx={CX} cy={CY} r={5} fill={theme.palette.background.paper} stroke={theme.palette.text.primary} strokeWidth={1.5} />
        </>)}
      </Box>
      <Typography variant="body2" fontWeight={600}>{valueText}</Typography>
      <Typography variant="caption" color="text.secondary">{label}: {minText} – {maxText} °C</Typography>
    </Stack>
  );
});

TemperatureGauge.displayName = "TemperatureGauge";

const TemperatureCard: React.FC<TemperatureCardProps> = ({ past, future }) => {
  const vals = [past.min, past.max, past.mean, future.min, future.max, future.mean].filter((v): v is number => typeof v === 'number' && !Number.isNaN(v));
  const minObserved = vals.length ? Math.min(...vals) : 0;
  const maxObserved = vals.length ? Math.max(...vals) : 25;
  const domainMin = Math.min(-20, Math.floor(minObserved / 5) * 5);
  const domainMax = clamp(ceilTo(Math.max(25, maxObserved), 5), 25, 50);

  const trend = (() => {
    if (typeof past.mean !== 'number' || typeof future.mean !== 'number') return { dir: 0, delta: 0 };
    const delta = +(future.mean - past.mean);
    const dir = Math.abs(delta) < 0.25 ? 0 : delta > 0 ? 1 : -1;
    return { dir, delta };
  })();

  const theme = useTheme();
  const isRow = useMediaQuery(theme.breakpoints.up('sm'));

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', pt: { xs: '8px', sm: '8px', md: '16px' } }}>
      <CardHeader title="Temperatur (°C)" />
      <CardContent sx={{ p: 0, overflow: 'hidden' }}>
        <Stack
          direction={isRow ? 'row' : 'column'}
          spacing={1}
          alignItems="center"
          divider={<Divider orientation={isRow ? 'vertical' : 'horizontal'} flexItem />}
          sx={{ width: '100%', flexWrap: 'wrap' }}
        >
          <TemperatureGauge label="Vergangenheit" mean={past.mean} min={past.min} max={past.max} domainMin={domainMin} domainMax={domainMax} isRow={isRow} />

          <Stack alignItems="center" spacing={0.25} sx={{ px: 1 }}>
            {trend.dir === 1 && <ArrowUpward sx={{ color: 'error.main', fontSize: 20 }} />}
            {trend.dir === -1 && <ArrowDownward sx={{ color: 'info.main', fontSize: 20 }} />}
            {trend.dir === 0 && <Remove sx={{ color: 'text.secondary', fontSize: 20 }} />}
            <Typography variant="caption" color="text.secondary">{`${trend.delta > 0 ? '+' : ''}${trend.delta.toFixed(1)} °C`}</Typography>
            <Typography variant="caption" color="text.secondary">mittlere Änderung</Typography>
          </Stack>

          <TemperatureGauge label="Zukunft" mean={future.mean} min={future.min} max={future.max} domainMin={domainMin} domainMax={domainMax} isRow={isRow} />
        </Stack>
      </CardContent>
    </Card>
  );
};

export default TemperatureCard;
