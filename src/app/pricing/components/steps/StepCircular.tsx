'use client';

import React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CheckCircleRounded from '@mui/icons-material/CheckCircleRounded';
import RadioButtonUncheckedRounded from '@mui/icons-material/RadioButtonUncheckedRounded';
import CircularProgress from '@mui/material/CircularProgress';

type Stage = { label: string; duration: number };

const totalDuration = 20000;

const STAGES: Stage[] = [
  { label: 'Anfrage abgesendet', duration: 0.092 },
  { label: 'Metadaten über potenziellen User gesammelt', duration: 0.131 },
  { label: 'Backgroundcheck durchgeführt', duration: 0.157 },
  { label: 'Zahlungsdaten über Socual Media herausgefunden', duration: 0.263 },
  { label: 'Überweisung ohne Input vorbereitet', duration: 0.052 },
  { label: 'Trinkgeld in Höhe von 20€ überwiesen', duration: 0.131 },
  { label: 'Danksagung für genröse Spende per Brieftaube losgeschickt', duration: 0.131 },
  { label: 'Transaktionsvorbereitung abgeschlossen 🎉', duration: 0.039 },
];

export default function StepCircular() {
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    if (index >= STAGES.length - 1) return;
    const timer = window.setTimeout(() => setIndex((i) => i + 1), totalDuration * STAGES[index].duration);
    return () => window.clearTimeout(timer);
  }, [index]);

  return (
    <Stack spacing={1.5} alignItems="center" sx={{ width: '100%' }}>

      <Stack spacing={0.75} sx={{ width: '100%' }}>
        {STAGES.map((stage, i) => {
          const isDone = i < index;
          const isCurrent = i === index;
          const Icon = isDone ? CheckCircleRounded : RadioButtonUncheckedRounded;

          return (
            <Stack key={stage.label} direction="row" spacing={1} alignItems="center">
              {isCurrent ? (
                <CircularProgress size={16} />
              ) : (
                <Icon fontSize="small" color={isDone ? 'success' : 'disabled'} />
              )}
              <Typography
                variant="caption"
                color={isDone || isCurrent ? 'text.primary' : 'text.secondary'}
                sx={{ fontWeight: isCurrent ? 600 : 400 }}
              >
                {stage.label}
              </Typography>
            </Stack>
          );
        })}
      </Stack>
    </Stack>
  );
}
