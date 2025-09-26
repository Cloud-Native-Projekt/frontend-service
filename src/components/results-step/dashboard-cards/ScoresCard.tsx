"use client";
import React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Link from 'next/link';

export interface ScoresCardProps {
  solar: number;
  wind: number;
  onResetStepper?: () => void;
}

const ScoresCard: React.FC<ScoresCardProps> = ({ solar, wind, onResetStepper }) => {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', pt: { xs: '8px', sm: '8px', md: '8px' } }}>
      <CardHeader title="Allgemein Bewertungen" />
      <CardContent>
        <Stack spacing={1.5}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Chip size="small" label="Solarenergie" color="warning" variant="outlined" />
            <LinearProgress value={solar} variant="determinate" sx={{ flex: 1 }} />
            <Typography variant="body2" sx={{ minWidth: 48, textAlign: 'right' }}>{solar}</Typography>
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <Chip size="small" label="Windenergie" color="info" variant="outlined" />
            <LinearProgress value={wind} variant="determinate" sx={{ flex: 1 }} />
            <Typography variant="body2" sx={{ minWidth: 48, textAlign: 'right' }}>{wind}</Typography>
          </Stack>
          <Stack direction="row" justifyContent="flex-end" sx={{ pt: 1 }}>
            {onResetStepper ? (
              <Button onClick={onResetStepper} variant="text" size="small">
                Zurück zur Auswahl
              </Button>
            ) : (
              <Button component={Link} href="/" variant="text" size="small">
                Zurück zur Auswahl
              </Button>
            )}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ScoresCard;
