'use client';

import React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';

type Stage = { threshold: number; label: string };

const STAGES: Stage[] = [
  { label: 'Regionen erweitern: Europa + UK integrieren...', threshold: 0 },
  { label: '24 Monate Historie generieren...', threshold: 7 },
  { label: 'Wöchentliche Update-Jobs in ArgoCD manuell anstoßen...', threshold: 16 },
  { label: 'Margins und Paddings anpassen...', threshold: 23 },
  { label: 'Export (CSV/GeoJSON/Excel) aus Portfolio streichen...', threshold: 32 },
  { label: 'Automatische Backups googeln...', threshold: 40 },
  { label: 'API-Endpunkte mit Luft und Liebe absichern...', threshold: 49 },
  { label: 'Lizenzen von Chat-GPT generieren lassen...', threshold: 56 },
  { label: 'Rollen & Berechtigungen mocken...', threshold: 65 },
  { label: 'Ausrede für fehlende Features finden...', threshold: 73 },
  { label: 'Ausschreibung für Support generieren...', threshold: 85 },
  { label: 'Downtime im Trockner eingehen lassen...', threshold: 92 },
  { label: 'Studenten für die Log-Verfassung einstellen...', threshold: 97 },
  { label: 'Die bestellten Features sind jetzt DEFINITIV da!', threshold: 100 },
];

export default function StepLinear() {
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    let raf: number;
    const start = performance.now();
    const duration = 50000;

    const tick = (now: number) => {
      const elapsed = now - start;
      const t = Math.min(1, elapsed / duration);
      const wobble = (1 - t) * 1.2 * Math.sin(elapsed / 450);
      const value = Math.min(100, Math.max(0, t * 100 + wobble));
      setProgress(value);
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const currentIndex = React.useMemo(() => {
    // Prevent index from jumping back by always returning the highest reached stage
    let idx = 0;
    for (let i = 0; i < STAGES.length; i++) {
      if (progress >= STAGES[i].threshold) idx = i;
    }
    return idx;
  }, [progress]);

  return (
    <Stack spacing={1.5} alignItems="center" sx={{ width: '100%' }}>
      <Typography variant="body2" color="text.secondary" aria-live="polite">
        {STAGES[currentIndex].label}
      </Typography>

      <LinearProgress
        variant="determinate"
        value={progress}
        aria-label="Ladevorgang für Pro-Aktivierung"
        sx={{ width: '100%' }}
      />

    </Stack>
  );
}
