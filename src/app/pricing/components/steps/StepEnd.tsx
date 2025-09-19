'use client';

import React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import ConstructionRounded from '@mui/icons-material/ConstructionRounded';

export default function StepEnd() {
  return (
    <Stack spacing={2} alignItems="center" textAlign="center" sx={{ width: '100%' }}>
      {/* Caution stripe */}
      <Box
        aria-hidden
        sx={(theme) => ({
          width: '100%',
          height: 6,
          borderRadius: 1,
          backgroundImage: `repeating-linear-gradient(45deg, ${theme.palette.warning.light}, ${theme.palette.warning.light} 10px, ${theme.palette.warning.main} 10px, ${theme.palette.warning.main} 20px)`,
        })}
      />

      <ConstructionRounded color="warning" />
      <Typography variant="h6" fontWeight={700}>Pro befindet sich im Aufbau</Typography>
      <Typography variant="body2" color="text.secondary" aria-live="polite">
        Entschuldigung: Pro ist noch nicht verfügbar.
      </Typography>

      {/* Construction illustration */}
      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', py: 2 }}>
        <ConstructionRounded color="warning" sx={{ fontSize: 64 }} />
      </Box>
    </Stack>
  );
}
