"use client";
import React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';

export interface ScoresCardProps {
  solar: number;
  wind: number;
}

const ScoresCard: React.FC<ScoresCardProps> = ({ solar, wind }) => {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardHeader title="Area Scores" />
      <CardContent>
        <Stack spacing={2}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Chip size="small" label="Solar" color="warning" variant="outlined" />
            <LinearProgress value={solar} variant="determinate" sx={{ flex: 1 }} />
            <Typography variant="body2" sx={{ minWidth: 48, textAlign: 'right' }}>{solar}</Typography>
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <Chip size="small" label="Wind" color="info" variant="outlined" />
            <LinearProgress value={wind} variant="determinate" sx={{ flex: 1 }} />
            <Typography variant="body2" sx={{ minWidth: 48, textAlign: 'right' }}>{wind}</Typography>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ScoresCard;
