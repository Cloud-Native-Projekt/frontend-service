"use client";
import React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

export interface ExtraCardProps {
  past: { precipitation_sum?: number; precipitation_hours?: number };
  future: { precipitation_sum?: number; precipitation_hours?: number };
}

const Row: React.FC<{ label: string; data: { precipitation_sum?: number; precipitation_hours?: number } }>
  = ({ label, data }) => (
    <Stack direction="row" justifyContent="space-between" alignItems="center">
      <Typography variant="body2" color="text.secondary">{label}</Typography>
      <Typography variant="body2">
        {data.precipitation_sum ?? '—'} mm · {data.precipitation_hours ?? '—'} h
      </Typography>
    </Stack>
  );

const ExtraCard: React.FC<ExtraCardProps> = ({ past, future }) => {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardHeader title="Precipitation" />
      <CardContent>
        <Stack spacing={1.5}>
          <Row label="Past" data={past} />
          <Row label="Next" data={future} />
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ExtraCard;
