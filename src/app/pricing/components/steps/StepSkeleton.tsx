'use client';

import React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';

export default function StepSkeleton() {
  return (
    <Stack spacing={1} width="100%">
      <Typography variant="body2" color="text.secondary">
        Simuliere Datenexport in Gedanken-CSV…
      </Typography>
      <Skeleton variant="rectangular" height={10} sx={{ borderRadius: 20 }} />
      <Skeleton variant="rectangular" height={10} sx={{ borderRadius: 20, width: '80%' }} />
      <Skeleton variant="rectangular" height={10} sx={{ borderRadius: 20, width: '60%' }} />
    </Stack>
  );
}
