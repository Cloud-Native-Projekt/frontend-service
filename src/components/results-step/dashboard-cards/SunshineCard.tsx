"use client";
import React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import { alpha, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import ArrowUpward from '@mui/icons-material/ArrowUpward';
import ArrowDownward from '@mui/icons-material/ArrowDownward';
import Remove from '@mui/icons-material/Remove';

export interface SunshineCardProps {
  past: { sunshine?: number; cloud?: number };
  future: { sunshine?: number; cloud?: number };
}

// Helpers
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const ceilTo = (v: number, step: number) => Math.ceil(v / step) * step;

// Convert provided sunshine to hours/day.
// If input looks like seconds (weekly avg per day often > 48 secs), convert to hours; otherwise assume hours already.
const toHoursPerDay = (v?: number): number | undefined => {
  if (v == null || Number.isNaN(v)) return undefined;
  // Heuristic: values greater than 48 are likely seconds; convert seconds -> hours.
  return v > 48 ? v / 3600 : v;
};

// Color scale utilities: create a 10-step red→green palette using theme colors (error → warning → success → primary)
const hexToRgb = (hex: string): [number, number, number] => {
  let s = hex.replace('#', '');
  if (s.length === 3) s = s.split('').map((c) => c + c).join('');
  const n = parseInt(s, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
const rgbToHex = (r: number, g: number, b: number) => `#${[r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('')}`;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const lerpColor = (c1: string, c2: string, t: number) => {
  const [r1, g1, b1] = hexToRgb(c1);
  const [r2, g2, b2] = hexToRgb(c2);
  return rgbToHex(Math.round(lerp(r1, r2, t)), Math.round(lerp(g1, g2, t)), Math.round(lerp(b1, b2, t)));
};

const useSunshineScale = () => {
  const theme = useTheme();
  const stops = [theme.palette.error.main, theme.palette.warning.main, theme.palette.success.main, theme.palette.primary.main];
  const step = 1 / (stops.length - 1);
  return (t: number) => {
    const x = clamp(t, 0, 1);
    const i = Math.min(stops.length - 2, Math.floor(x / step));
    const localT = (x - i * step) / step;
    return lerpColor(stops[i], stops[i + 1], localT);
  };
};

const valueToStageColor = (hours: number | undefined, scale: (t: number) => string) => {
  if (hours == null || Number.isNaN(hours)) return undefined;
  const domainMax = 12; // stable reference for solar evaluation
  const t = clamp(hours / domainMax, 0, 1);
  return scale(t);
};

const Cloud = ({ x, y, s, opacity, fill }: { x: number; y: number; s: number; opacity: number; fill: string }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={opacity}>
    <circle cx={0} cy={0} r={12} fill={fill} />
    <circle cx={12} cy={4} r={10} fill={fill} />
    <circle cx={-12} cy={6} r={9} fill={fill} />
    <rect x={-20} y={8} width={40} height={10} rx={5} fill={fill} />
  </g>
);

const MetricWithClouds: React.FC<{ label: string; hours?: number; cloud?: number; isRow: boolean }> = ({ label, hours, cloud, isRow }) => {
  const theme = useTheme();
  const scale = useSunshineScale();
  const color = valueToStageColor(hours, scale) ?? theme.palette.text.disabled;
  const cvg = clamp(Math.round(cloud ?? 0), 0, 100);
  const bgOpacity = 0.06 + (cvg / 100) * 0.14; // subtle background hint
  const fgOpacity = clamp((cvg - 60) / 40, 0, 1) * 0.5; // overlays number when high cloud
  const cloudFill = alpha(theme.palette.text.primary, 0.18); // neutral md3-ish fill for clouds

  return (
    <Stack alignItems="center" spacing={0.5} sx={{ flex: 1, minWidth: 0 }}>
      <Box sx={{ position: 'relative', width: '100%', minHeight: { xs: 92, sm: 96, md: 104 } }}>
        {/* Background clouds */}
        <Box component="svg" viewBox="0 0 100 40" sx={{ position: 'absolute', inset: 0, zIndex: 0, width: '100%', height: '100%' }}>
          <Cloud x={20} y={24} s={1.1} opacity={bgOpacity} fill={cloudFill} />
          <Cloud x={52} y={18} s={1.2} opacity={bgOpacity} fill={cloudFill} />
          <Cloud x={84} y={26} s={1.0} opacity={bgOpacity} fill={cloudFill} />
        </Box>

        {/* Value */}
        <Stack alignItems="center" justifyContent="center" sx={{ position: 'absolute', inset: 0, zIndex: 1 }}>
          <Typography
            variant={isRow ? 'h4' : 'h3'}
            sx={{
              fontWeight: 800,
              lineHeight: 1.1,
              color,
              textAlign: 'center',
              px: 1,
              // gentle stroke for readability when overlapped by clouds
              textShadow: `${alpha(theme.palette.background.default, 0.9)} 0px 1px 1px`,
            }}
          >
            {hours == null || Number.isNaN(hours) ? '—' : `${hours.toFixed(1)} h/day`}
          </Typography>
        </Stack>

        {/* Foreground overlay clouds when coverage is high */}
        {fgOpacity > 0 && (
          <Box component="svg" viewBox="0 0 100 40" sx={{ position: 'absolute', inset: 0, zIndex: 2, width: '100%', height: '100%' }}>
            <Cloud x={50} y={20} s={1.6} opacity={fgOpacity} fill={cloudFill} />
          </Box>
        )}
      </Box>
      <Stack direction="row" spacing={1} alignItems="center">
        <Typography variant="caption" color="text.secondary">{label}</Typography>
        <Chip size="small" label={`Cloud: ${cvg}%`} />
      </Stack>
    </Stack>
  );
};

const SunshineCard: React.FC<SunshineCardProps> = ({ past, future }) => {
  const pastH = toHoursPerDay(past.sunshine);
  const futureH = toHoursPerDay(future.sunshine);

  const trend = (() => {
    if (typeof pastH !== 'number' || typeof futureH !== 'number') return { dir: 0, delta: 0 };
    const delta = +(futureH - pastH);
    const dir = Math.abs(delta) < 0.1 ? 0 : delta > 0 ? 1 : -1;
    return { dir, delta };
  })();

  const theme = useTheme();
  const isRow = useMediaQuery(theme.breakpoints.up('sm'));

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardHeader title="Sunshine (h/day)" />
      <CardContent sx={{ p: 0, overflow: 'hidden' }}>
        <Stack
          direction={isRow ? 'row' : 'column'}
          spacing={1}
          alignItems="center"
          divider={<Divider orientation={isRow ? 'vertical' : 'horizontal'} flexItem />}
          sx={{ width: '100%', flexWrap: 'wrap' }}
        >
          <MetricWithClouds label="Past" hours={pastH} cloud={past.cloud} isRow={isRow} />

          <Stack alignItems="center" spacing={0.25} sx={{ px: 1 }}>
            {trend.dir === 1 && <ArrowUpward sx={{ color: 'success.main', fontSize: 20 }} />}
            {trend.dir === -1 && <ArrowDownward sx={{ color: 'error.main', fontSize: 20 }} />}
            {trend.dir === 0 && <Remove sx={{ color: 'text.secondary', fontSize: 20 }} />}
            <Typography variant="caption" color="text.secondary">{`${trend.delta > 0 ? '+' : ''}${trend.delta.toFixed(1)} h/day`}</Typography>
            <Typography variant="caption" color="text.secondary">mean change</Typography>
          </Stack>

          <MetricWithClouds label="Next" hours={futureH} cloud={future.cloud} isRow={isRow} />
        </Stack>
      </CardContent>
    </Card>
  );
};

export default SunshineCard;
