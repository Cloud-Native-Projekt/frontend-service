"use client";
import React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';
import { alpha, useTheme } from '@mui/material/styles';
import type { Theme } from '@mui/material/styles';


export interface RainCardProps {
  past: { weekSum: number; hoursPerWeek?: number };
  future: { weekSum: number; hoursPerWeek?: number };
}

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

const DAY_HOURS = 24;
const DAY_BANDS: [number, number, number, number] = [2, 6, 12, DAY_HOURS];

const classifyHours = (theme: Theme, hoursPerDay?: number) => {
  if (hoursPerDay == null || Number.isNaN(hoursPerDay)) {
    return { label: 'Keine Daten', color: theme.palette.text.disabled };
  }
  if (hoursPerDay <= DAY_BANDS[0]) return { label: 'Niedrig', color: theme.palette.success.main };
  if (hoursPerDay <= DAY_BANDS[1]) return { label: 'Mittel', color: theme.palette.primary.main };
  if (hoursPerDay <= DAY_BANDS[2]) return { label: 'Hoch', color: theme.palette.warning.main };
  return { label: 'Sehr hoch', color: theme.palette.error.main };
};

const classifyIntensity = (theme: Theme, millimetersPerDay?: number, hoursPerDay?: number) => {
  if (millimetersPerDay == null || Number.isNaN(millimetersPerDay) || hoursPerDay == null || Number.isNaN(hoursPerDay)) {
    return { label: 'Keine Daten', rate: 0, color: theme.palette.text.disabled };
  }
  const rate = millimetersPerDay / Math.max(hoursPerDay, 0.0001);
  if (rate <= 0.01) return { label: 'Kein Regen', rate, color: theme.palette.text.disabled };
  if (rate < 0.5) return { label: 'Nieselregen', rate, color: theme.palette.success.light };
  if (rate < 1) return { label: 'Leicht', rate, color: theme.palette.primary.light };
  if (rate < 3) return { label: 'Mäßig', rate, color: theme.palette.warning.main };
  if (rate < 6) return { label: 'Stark', rate, color: theme.palette.warning.dark };
  return { label: 'Starkregen', rate, color: theme.palette.error.main };
};

const Meter: React.FC<{ label: string; weekSum: number; hoursPerWeek?: number }>
  = ({ label, weekSum, hoursPerWeek }) => {
    const theme = useTheme();
    const mmPerWeek = typeof weekSum === 'number' && !Number.isNaN(weekSum) ? weekSum : undefined;
    const mmPerDay = mmPerWeek != null ? mmPerWeek / 7 : undefined;
    const hPerWeek = typeof hoursPerWeek === 'number' && !Number.isNaN(hoursPerWeek) ? hoursPerWeek : undefined;
    const hPerDay = hPerWeek != null ? hPerWeek / 7 : undefined;
    const domain = DAY_HOURS; // per-day window reference (hours)
    const bandStops = DAY_BANDS;
    const hoursClass = classifyHours(theme, hPerDay);
    const intensity = classifyIntensity(theme, mmPerDay, hPerDay);
    const pct = hPerDay == null ? 0 : clamp((hPerDay / domain) * 100, 0, 100);
    const bands = [
      { to: bandStops[0], color: alpha(theme.palette.success.main, 0.35) },
      { to: bandStops[1], color: alpha(theme.palette.primary.main, 0.35) },
      { to: bandStops[2], color: alpha(theme.palette.warning.main, 0.35) },
      { to: bandStops[3], color: alpha(theme.palette.error.main, 0.35) },
    ];
    const rateText = intensity.rate ? intensity.rate.toFixed(1) : '—';
    const tip = `Geschätzte O&M-Ausfallzeit pro Tag: ${hoursClass.label}${hPerDay != null ? ` (${hPerDay.toFixed(1)} Std/Tag)` : ''}.\nRegenmuster: ${intensity.label}${intensity.rate ? ` (${rateText} mm/h)` : ''}.`;
    return (
      <Stack spacing={0.5} sx={{ width: '100%' }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant="body2" color="text.secondary" sx={{ minWidth: 44 }}>{label}</Typography>
          <Chip size="small" label={intensity.label} sx={{ bgcolor: alpha(intensity.color || theme.palette.text.disabled, 0.2) }} />
          <Box sx={{ flex: 1 }} />
          <Typography variant="caption" color="text.secondary">{mmPerDay?.toFixed(1) ?? '—'} mm/Tag • {hPerDay?.toFixed(1) ?? '—'} h/Tag {hPerDay ? `• ${(mmPerDay && hPerDay ? (mmPerDay / hPerDay).toFixed(1) : '—')} mm/h` : ''}</Typography>
        </Stack>
        <Tooltip title={tip} arrow>
          <Box sx={{ position: 'relative', width: '100%', height: 18, borderRadius: 9, overflow: 'hidden', bgcolor: theme.palette.action.hover, border: `1px solid ${theme.palette.divider}` }}>
            <Box sx={{ position: 'absolute', inset: 0, display: 'flex' }}>
              {bands.map((b, i) => {
                const prev = i === 0 ? 0 : bandStops[i - 1];
                const w = ((b.to - prev) / domain) * 100;
                return <Box key={i} sx={{ width: `${w}%`, height: '100%', bgcolor: b.color }} />
              })}
            </Box>

            {hPerDay != null && (
              <Box sx={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${pct}%`, bgcolor: alpha(hoursClass.color, 0.55) }} />
            )}
          </Box>
        </Tooltip>
      </Stack>
    );
  };

const RainCard: React.FC<RainCardProps> = ({ past, future }) => (
  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', pt: { xs: '8px', sm: '8px', md: '16px' } }}>
    <CardHeader title="Niederschlag" />
    <CardContent sx={{ p: 0 }}>
      <Stack spacing={1.25} sx={{ p: 2 }}>
        <Meter label="Vergangenheit" weekSum={past.weekSum} hoursPerWeek={past.hoursPerWeek} />
        <Meter label="Zukunft" weekSum={future.weekSum} hoursPerWeek={future.hoursPerWeek} />
      </Stack>
    </CardContent>
  </Card>
);

export default RainCard;
