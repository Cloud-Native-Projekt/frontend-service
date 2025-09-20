"use client";
import React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

export interface TemperatureCardProps {
  past: { min?: number; max?: number; mean?: number };
  future: { min?: number; max?: number; mean?: number };
}

const Bar: React.FC<{ label: string; data: { min?: number; max?: number; mean?: number } }>
  = ({ label, data }) => {
    const min = data.min ?? 0;
    const max = data.max ?? 0;
    const mean = data.mean ?? 0;
    const denom = Math.max(1, max - min);
    const value = max === min ? 0 : Math.round(((mean - min) / denom) * 100);
    return (
      <Stack direction="row" spacing={1} alignItems="center">
        <Typography variant="caption" sx={{ minWidth: 52 }} color="text.secondary">{label}</Typography>
        <LinearProgress variant="determinate" value={value} sx={{ flex: 1 }} />
        <Typography variant="caption" color="text.secondary" sx={{ minWidth: 110, textAlign: 'right' }}>
          {Number.isFinite(mean) ? `${mean.toFixed(1)} °C` : '—'}
        </Typography>
      </Stack>
    );
  };

const TemperatureCard: React.FC<TemperatureCardProps> = ({ past, future }) => {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardHeader title="Temperature (°C)" />
      <CardContent>
        <Stack spacing={1.5}>
          <Bar label="Past" data={past} />
          <Bar label="Next" data={future} />
        </Stack>
      </CardContent>
    </Card>
  );
};

export default TemperatureCard;
