"use client";
import React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EvStationIcon from '@mui/icons-material/EvStation';

export interface DistancesCardProps {
  powerLineMeters?: number;
  distributionMeters?: number;
}

const formatKm = (m?: number) => (m == null ? '—' : `${(m / 1000).toFixed(2)} km`);

const Row: React.FC<{ icon: React.ReactNode; label: string; meters?: number }>
  = ({ icon, label, meters }) => (
    <Stack direction="row" spacing={2} alignItems="center">
      {icon}
      <Stack>
        <Typography variant="body2" fontWeight={600}>{label}</Typography>
        <Typography variant="caption" color="text.secondary">{formatKm(meters)}{meters != null ? ` • ${meters} m` : ''}</Typography>
      </Stack>
    </Stack>
  );

const DistancesCard: React.FC<DistancesCardProps> = ({ powerLineMeters, distributionMeters }) => {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardHeader title="Grid proximity" />
      <CardContent>
        <Stack spacing={2}>
          <Row icon={<LocationOnIcon color="info" />} label="Nearest power line" meters={powerLineMeters} />
          <Row icon={<EvStationIcon color="success" />} label="Nearest distribution center" meters={distributionMeters} />
        </Stack>
      </CardContent>
    </Card>
  );
};

export default DistancesCard;
