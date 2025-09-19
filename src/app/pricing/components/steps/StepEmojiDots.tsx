'use client';

import React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

export default function StepEmojiDots() {
  const [dots, setDots] = React.useState('');
  React.useEffect(() => {
    const id = setInterval(() => {
      setDots((d) => (d.length >= 7 ? '' : d + ' .'));
    }, 1400);
    return () => clearInterval(id);
  }, []);
  return (
    <Stack spacing={1} alignItems="center">
      <Typography variant="body2" color="text.secondary">
        Zähme freilaufende APIs{dots}
      </Typography>
      <Typography aria-hidden variant="h4" component="div">🤝</Typography>
      <Typography variant="caption" color="text.secondary" align="center">
        "Es gibt andere Welten als diese." – Jake Chambers
      </Typography>
    </Stack>
  );
}
