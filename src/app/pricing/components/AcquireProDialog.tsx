'use client';

import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import CheckCircleRounded from '@mui/icons-material/CheckCircleRounded';
import StepLinear from './steps/StepLinear';
import StepCircular from './steps/StepCircular';
import StepSkeleton from './steps/StepSkeleton';
import StepEmojiDots from './steps/StepEmojiDots';
import StepEnd from './steps/StepEnd';
import { customThemeVars } from '@/theme';

export interface AcquireProDialogProps {
  open: boolean;
  onClose: () => void;
}

interface StepDef {
  key: string;
  title: string;
  subtitle?: string;
  durationMs: number;
  render: () => React.ReactNode;
}

export default function AcquireProDialog({ open, onClose }: AcquireProDialogProps) {
  const steps = React.useMemo<StepDef[]>(() => [
    { key: 'spin-circles', title: 'Abbonement erstellen', subtitle: 'Wir wissen, wie das geht, versprochen', durationMs: 25000, render: () => <StepCircular /> },
    { key: 'fetch-features', title: 'Features zusammentragen', subtitle: 'Sammle Module, poliere Bits', durationMs: 50000, render: () => <StepLinear /> },
    { key: 'export-pretend', title: 'Export vorbereiten', subtitle: 'CSV? XLSX? Keine Ahnung.', durationMs: 10000, render: () => <StepSkeleton /> },
    { key: 'api-handshake', title: 'API Handshake', subtitle: 'Sei freundlich zu Endpunkten', durationMs: 15000, render: () => <StepEmojiDots /> },
    { key: 'fin', title: 'Tut uns Leid', subtitle: 'Danke trotzdem für das Geld', durationMs: 1000, render: () => <StepEnd /> },
  ], []);

  const [idx, setIdx] = React.useState(0);
  const isLast = idx >= steps.length - 1;

  React.useEffect(() => {
    if (!open) return;
    setIdx(0);
  }, [open]);

  React.useEffect(() => {
    if (!open) return;
    const current = steps[idx];
    if (!current) return;
    if (current.key === 'fin') return;
    const t = setTimeout(() => setIdx((i) => Math.min(i + 1, steps.length - 1)), current.durationMs);
    return () => clearTimeout(t);
  }, [open, idx, steps]);

  const step = steps[idx];

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs" aria-labelledby="acquire-pro-title">
      <DialogTitle id="acquire-pro-title">
        <Stack spacing={0.5}>
          <Typography variant="h6" fontWeight={700}>{step.title}</Typography>
          {step.subtitle && (
            <Typography variant="caption" color="text.secondary">{step.subtitle}</Typography>
          )}
        </Stack>
      </DialogTitle>
      <Divider />
      <DialogContent>
        <Stack spacing={customThemeVars.body.innerMargin.mobile}>
          {step.render()}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant={isLast ? 'contained' : 'text'} color={isLast ? 'primary' : 'inherit'}>
          {isLast ? 'Zurück zur Preisseite' : 'Abbrechen'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
