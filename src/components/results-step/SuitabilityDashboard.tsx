"use client";
import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import LinearProgress from '@mui/material/LinearProgress';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import { AnalysisResult, Location } from '@/types';

interface SuitabilityData {
  coordinate: { lat: number; lng: number };
  temperature: { min: number; max: number; mean: number };
  windTemp: { min: number; max: number; mean: number };
  rating: number; // fallback rating (overridden by result.score when present)
  distancePowerLine: number;
  distanceDistributionCenter: number;
  allowed: boolean;
  notes: string[];
  riskFlags: string[];
}

interface SuitabilityDashboardProps {
  result: AnalysisResult | null;
  location: Location | null;
  onReset: () => void;
  onRecalculate?: () => void;
  recalculating?: boolean;
  // Optional custom metrics data (otherwise internal mock is used)
  dataOverride?: Partial<SuitabilityData>;
}

// Mock data generator (static for now)
const mockSuitability: SuitabilityData = {
  coordinate: { lat: 51.10342, lng: 10.26401 },
  temperature: { min: -5, max: 32, mean: 14 },
  windTemp: { min: -3, max: 28, mean: 12 },
  rating: 82,
  distancePowerLine: 950,
  distanceDistributionCenter: 6200,
  allowed: true,
  notes: [
    'Soil stability acceptable',
    'Access road within 1.2km',
    'No protected wildlife within 3km radius'
  ],
  riskFlags: ['Moderate icing risk in winter']
};

const StatCard: React.FC<{ title: string; primary: string | number; secondary?: string; accent?: React.ReactNode }> = ({ title, primary, secondary, accent }) => (
  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
    <CardContent>
      <Typography variant="overline" sx={{ letterSpacing: 0.6 }}>{title}</Typography>
      <Typography variant="h5" fontWeight={600}>{primary}</Typography>
      {secondary && <Typography variant="body2" color="text.secondary">{secondary}</Typography>}
      {accent && <Box mt={1}>{accent}</Box>}
    </CardContent>
  </Card>
);

const RangeStats: React.FC<{ label: string; data: { min: number; max: number; mean: number }; unit: string }> = ({ label, data, unit }) => (
  <StatCard
    title={label}
    primary={data.mean + unit}
    secondary={`min ${data.min}${unit}  •  max ${data.max}${unit}`}
    accent={<LinearProgress variant="determinate" value={((data.mean - data.min) / (data.max - data.min)) * 100} sx={{ height: 6, borderRadius: 3 }} />}
  />
);

const DistanceStat: React.FC<{ label: string; meters: number }> = ({ label, meters }) => (
  <StatCard
    title={label}
    primary={(meters / 1000).toFixed(2) + ' km'}
    secondary={`${meters} m`}
  />
);

const AllowedChip: React.FC<{ allowed: boolean }> = ({ allowed }) => (
  <Chip
    color={allowed ? 'success' : 'error'}
    variant="filled"
    label={allowed ? 'ALLOWED' : 'NOT ALLOWED'}
    icon={allowed ? <CheckCircleIcon /> : <CancelIcon />}
    sx={{ fontWeight: 600, borderRadius: 2 }}
  />
);

const RatingGauge: React.FC<{ value: number }> = ({ value }) => (
  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
    <CardHeader title={<Typography variant="overline">Overall Rating</Typography>} sx={{ pb: 0 }} />
    <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <Box mb={1}>
        <LinearProgress value={value} variant="determinate" sx={{ height: 12, borderRadius: 6 }} />
      </Box>
      <Typography variant="h4" fontWeight={700}>{value}<Typography component="span" variant="h6" ml={0.5}>/100</Typography></Typography>
    </CardContent>
  </Card>
);

const SuitabilityDashboard: React.FC<SuitabilityDashboardProps> = ({
  result,
  location,
  onReset,
  onRecalculate,
  recalculating,
  dataOverride
}) => {
  // Merge overrides with mock baseline
  const data: SuitabilityData = {
    ...mockSuitability,
    ...dataOverride,
    coordinate: location ?? dataOverride?.coordinate ?? mockSuitability.coordinate,
    rating: result?.score ?? dataOverride?.rating ?? mockSuitability.rating,
  } as SuitabilityData;

  // Derive notes / risk from result.details when available (best-effort)
  const detailObj = result?.details as Record<string, unknown> | undefined;
  const dynamicNotes: string[] = Array.isArray(detailObj?.notes) ? detailObj!.notes : [];
  const dynamicRisks: string[] = Array.isArray(detailObj?.riskFlags) ? detailObj!.riskFlags : [];
  const notes = dynamicNotes.length ? dynamicNotes : data.notes;
  const riskFlags = dynamicRisks.length ? dynamicRisks : data.riskFlags;

  return (
    <Box sx={{ width: '100%', display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', md: 'repeat(12, 1fr)' } }}>
      {/* Summary / Actions (combined original ResultsStep card) */}
      <Box sx={{ gridColumn: { xs: '1', md: 'span 12' } }}>
        <Card sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Typography variant="h6" fontWeight={600}>Analyse-Ergebnis</Typography>
          {location && (
            <Typography variant="body2" color="text.secondary">
              Position: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
            </Typography>
          )}
          {result ? (
            <Typography variant="body2">
              Score: {result.score} · Zeit: {new Date(result.generatedAt).toLocaleTimeString()}
            </Typography>
          ) : (
            <Typography variant="body2" color="text.secondary">
              Kein Ergebnis geladen.
            </Typography>
          )}
          <Divider sx={{ my: 1 }} />
          <Stack direction="row" spacing={1}>
            <Button variant="contained" onClick={onReset}>Neuer Versuch</Button>
            {onRecalculate && (
              <Button
                variant="outlined"
                onClick={onRecalculate}
                disabled={recalculating}
              >
                {recalculating ? 'Aktualisiere...' : 'Neu berechnen'}
              </Button>
            )}
          </Stack>
        </Card>
      </Box>

      <Box sx={{ gridColumn: { xs: '1', md: 'span 3' } }}><RangeStats label="Air Temp" data={data.temperature} unit="°C" /></Box>
      <Box sx={{ gridColumn: { xs: '1', md: 'span 3' } }}><RangeStats label="Wind Temp" data={data.windTemp} unit="°C" /></Box>
      <Box sx={{ gridColumn: { xs: '1', md: 'span 3' } }}><DistanceStat label="Power Line" meters={data.distancePowerLine} /></Box>
      <Box sx={{ gridColumn: { xs: '1', md: 'span 3' } }}><DistanceStat label="Distribution Ctr" meters={data.distanceDistributionCenter} /></Box>
      <Box sx={{ gridColumn: { xs: '1', md: 'span 3' } }}><RatingGauge value={data.rating} /></Box>
      <Box sx={{ gridColumn: { xs: '1', md: 'span 3' } }}>
        <Card sx={{ height: '100%' }}>
          <CardContent>
            <Typography variant="overline">Status</Typography>
            <Box mt={1}><AllowedChip allowed={data.allowed} /></Box>
            <Typography variant="caption" color="text.secondary" display="block" mt={1}>
              Coordinate: {data.coordinate.lat.toFixed(4)}, {data.coordinate.lng.toFixed(4)}
            </Typography>
          </CardContent>
        </Card>
      </Box>
      <Box sx={{ gridColumn: { xs: '1', md: 'span 6' } }}>
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <CardHeader title={<Typography variant="overline">Notes</Typography>} sx={{ pb: 0 }} />
          <CardContent sx={{ pt: 1 }}>
            <List dense>
              {notes.map(n => (
                <ListItem key={n} disablePadding>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <CheckCircleIcon color="success" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary={n} primaryTypographyProps={{ variant: 'body2' }} />
                </ListItem>
              ))}
              {riskFlags.map(r => (
                <ListItem key={r} disablePadding>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <WarningAmberIcon color="warning" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary={r} primaryTypographyProps={{ variant: 'body2' }} />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default SuitabilityDashboard;
