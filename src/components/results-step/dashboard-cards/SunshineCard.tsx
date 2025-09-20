"use client";
import React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';

export interface SunshineCardProps {
  past: { sunshine?: number; cloud?: number };
  future: { sunshine?: number; cloud?: number };
}

const Row: React.FC<{ label: string; data: { sunshine?: number; cloud?: number } }>
  = ({ label, data }) => {
    const sunshine = data.sunshine ?? 0;
    const cloud = data.cloud ?? undefined;
    const normalized = Math.max(0, Math.min(100, Math.round(((sunshine - 800) / (2200 - 800)) * 100)));
    return (
      <Stack spacing={1}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant="caption" sx={{ minWidth: 52 }} color="text.secondary">{label}</Typography>
          <Chip size="small" label={cloud == null ? 'Cloud: —' : `Cloud: ${cloud}%`} />
        </Stack>
        <LinearProgress variant="determinate" value={normalized} />
        <Typography variant="caption" color="text.secondary">Sunshine: {data.sunshine ?? '—'} h</Typography>
      </Stack>
    );
  };

const SunshineCard: React.FC<SunshineCardProps> = ({ past, future }) => {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardHeader title="Sunshine & Cloud Cover" />
      <CardContent>
        <Stack spacing={2}>
          <Row label="Past" data={past} />
          <Row label="Next" data={future} />
        </Stack>
      </CardContent>
    </Card>
  );
};

export default SunshineCard;
