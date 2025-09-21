"use client";
import React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CancelIcon from '@mui/icons-material/Cancel';
import Divider from '@mui/material/Divider';
import { alpha, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';

// ---- Types for assessment input ----
export interface AreaAssessment {
  trees?: { present?: boolean; details?: string };
  buildings?: { within2km?: boolean; searchRadiusKm?: number };
  envZones?: Array<{ type: string; details?: string }>;
  distances?: { powerlineKm?: number; substationKm?: number };
  temperature?: { avgC?: number; minC?: number; maxC?: number };
  sunshine?: { hoursPerDay?: number; cloudCoveragePercent?: number };
  wind?: { avgMetersPerSecond?: number; gustMetersPerSecond?: number; hubHeightMeters?: number };
  precipitation?: { mmPerDay?: number; hoursPerDay?: number };
}

export interface AllowanceRisksCardProps {
  data: AreaAssessment;
}

type AssessmentLists = { notes: string[]; warnings: string[]; risks: string[]; verdict: 'allowed' | 'review' | 'not-allowed' };

const computeAssessment = (data: AreaAssessment): AssessmentLists => {
  const notes: string[] = [];
  const warnings: string[] = [];
  const risks: string[] = [];

  let hasStrictProtectedZone = false;

  // Environmental protection zones
  if (data.envZones && data.envZones.length > 0) {
    for (const z of data.envZones) {
      const t = z.type?.toLowerCase() || '';
      if (t.includes('strict') || t.includes('natura') || t.includes('nature reserve') || t.includes('schutzgebiet (streng)')) {
        hasStrictProtectedZone = true;
        risks.push(`Strenges Schutzgebiet: ${z.details || z.type}`);
      } else {
        warnings.push(`Schutzgebiet berücksichtigt: ${z.details || z.type}`);
      }
    }
  } else {
    warnings.push('Informationen zu Schutzgebieten fehlen.');
  }

  // Buildings within 2 km
  if (data.buildings) {
    const { within2km, searchRadiusKm } = data.buildings;
    if (within2km === true) {
      warnings.push('Gebäude im Umkreis von 2 km – potenzielle Immissions- und Sichtbelastung.');
    } else if (within2km === false) {
      notes.push('Keine Gebäude innerhalb 2 km erkannt.');
    } else {
      if (typeof searchRadiusKm === 'number' && searchRadiusKm < 2) {
        warnings.push(`Gebäudedaten unsicher: Suchradius nur ${searchRadiusKm} km (< 2 km).`);
      } else {
        warnings.push('Gebäudedaten fehlen/unsicher.');
      }
    }
  } else {
    warnings.push('Gebäudedaten fehlen/unsicher.');
  }

  // Trees in area
  if (data.trees) {
    if (data.trees.present) {
      warnings.push(`Bäume im Gebiet – mögliche Verschattung (PV), Erschließung und Genehmigung (Rodung). ${data.trees.details ? `Hinweis: ${data.trees.details}` : ''}`.trim());
    } else {
      notes.push('Keine Bäume im ausgewählten Gebiet gemeldet.');
    }
  } else {
    notes.push('Keine Angaben zu Bäumen.');
  }

  // Grid distances
  const powerlineKm = data.distances?.powerlineKm;
  const substationKm = data.distances?.substationKm;
  const toDisplayKm = (v?: number) => (typeof v === 'number' ? `${v.toFixed(1)} km` : 'unbekannt');
  if (typeof powerlineKm !== 'number' && typeof substationKm !== 'number') {
    warnings.push('Distanzen zu Netzanschlusspunkten fehlen.');
  } else {
    const pl = typeof powerlineKm === 'number' ? powerlineKm : undefined;
    const ss = typeof substationKm === 'number' ? substationKm : undefined;
    const worst = Math.min(pl ?? Infinity, ss ?? Infinity);
    if (!isFinite(worst) || worst > 10) {
      risks.push('Netzanbindung weit entfernt (> 10 km) oder unbekannt – erhebliche Anschlusskosten möglich.');
    } else if (worst > 5) {
      warnings.push(`Netzanbindung entfernt (${worst.toFixed(1)} km) – erhöhte Kosten wahrscheinlich.`);
    } else {
      notes.push(`Günstige Netzanbindung (Leitung: ${toDisplayKm(pl)}, Umspannwerk: ${toDisplayKm(ss)}).`);
    }
  }

  // Temperature
  if (data.temperature) {
    const { avgC, minC, maxC } = data.temperature;
    if (typeof avgC === 'number') {
      if (avgC > 35) warnings.push(`Hohe Durchschnittstemperatur (${avgC.toFixed(1)} °C) – geringerer PV-Wirkungsgrad.`);
      if (avgC < -5) warnings.push(`Niedrige Durchschnittstemperatur (${avgC.toFixed(1)} °C) – potenzielle Vereisung/Heizbedarf.`);
      if (avgC >= 15 && avgC <= 25) notes.push('Angemessene Durchschnittstemperatur für PV-Betrieb.');
    } else {
      notes.push('Durchschnittstemperatur nicht angegeben.');
    }
    if (typeof maxC === 'number' && maxC > 45) warnings.push(`Sehr hohe Spitzentemperaturen (${maxC.toFixed(1)} °C) – Komponentenbelastung.`);
    if (typeof minC === 'number' && minC < -20) warnings.push(`Sehr niedrige Tiefsttemperaturen (${minC.toFixed(1)} °C) – Vereisungsrisiko für Wind.`);
  } else {
    notes.push('Temperaturdaten fehlen.');
  }

  // Sunshine / clouds
  if (data.sunshine) {
    const { hoursPerDay, cloudCoveragePercent } = data.sunshine;
    if (typeof hoursPerDay === 'number') {
      if (hoursPerDay < 3) warnings.push(`Wenige Sonnenstunden (${hoursPerDay.toFixed(1)} h/Tag) – geringer PV-Ertrag.`);
      if (hoursPerDay >= 6) notes.push(`Gute Sonnenscheindauer (${hoursPerDay.toFixed(1)} h/Tag).`);
    } else if (typeof cloudCoveragePercent === 'number') {
      if (cloudCoveragePercent > 70) warnings.push(`Hohe Bewölkung (${cloudCoveragePercent.toFixed(0)} %) – reduziert PV-Ertrag.`);
      if (cloudCoveragePercent < 40) notes.push(`Geringe Bewölkung (${cloudCoveragePercent.toFixed(0)} %).`);
    } else {
      warnings.push('Sonnenstunden/Bewölkung nicht angegeben.');
    }
  } else {
    warnings.push('Sonnenstunden/Bewölkung nicht angegeben.');
  }

  // Wind
  if (data.wind) {
    const { avgMetersPerSecond: v, gustMetersPerSecond: g } = data.wind;
    if (typeof v === 'number') {
      if (v < 4) warnings.push(`Geringe mittlere Windgeschwindigkeit (${v.toFixed(1)} m/s) – schwache Wind-Erträge.`);
      else if (v >= 6 && v <= 8) notes.push(`Gute mittlere Windgeschwindigkeit (${v.toFixed(1)} m/s).`);
      else if (v > 8) notes.push(`Sehr gute Windressource (${v.toFixed(1)} m/s).`);
    } else {
      warnings.push('Windgeschwindigkeit nicht angegeben.');
    }
    if (typeof g === 'number' && g > 25) warnings.push(`Hohe Böen (${g.toFixed(1)} m/s) – Lastspitzen/Abregelungen möglich.`);
  } else {
    warnings.push('Winddaten fehlen.');
  }

  // Precipitation
  if (data.precipitation) {
    const { mmPerDay, hoursPerDay } = data.precipitation;
    if (typeof hoursPerDay === 'number' && hoursPerDay > 12) warnings.push(`Lange Niederschlagsdauer (${hoursPerDay.toFixed(1)} h/Tag) – O&M-Ausfallzeiten.`);
    if (typeof mmPerDay === 'number' && mmPerDay > 20) warnings.push(`Starker Niederschlag (${mmPerDay.toFixed(1)} mm/Tag) – Baustellen-/Zufahrtsrisiken.`);
    if (typeof mmPerDay === 'number' && mmPerDay < 2) notes.push('Geringe Niederschläge.');
  } else {
    notes.push('Niederschlagsdaten fehlen.');
  }

  const verdict: AssessmentLists['verdict'] = hasStrictProtectedZone
    ? 'not-allowed'
    : (warnings.length > 0 || risks.length > 0) ? 'review' : 'allowed';

  return { notes, warnings, risks, verdict };
};

const AllowanceRisksCard: React.FC<AllowanceRisksCardProps> = ({ data }) => {
  const theme = useTheme();
  const { notes, warnings, risks, verdict } = computeAssessment(data);

  const chipProps = verdict === 'allowed'
    ? { color: 'success' as const, icon: <CheckCircleIcon />, label: 'ZULÄSSIG' }
    : verdict === 'not-allowed'
      ? { color: 'error' as const, icon: <CancelIcon />, label: 'NICHT ZULÄSSIG' }
      : { color: 'warning' as const, icon: <WarningAmberIcon />, label: 'PRÜFUNG ERFORDERLICH' };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardHeader title="Hinweise" />
      <CardContent sx={{ overflowY: 'auto' }}>
        <Stack spacing={2}>
          <Chip {...chipProps} sx={{ alignSelf: 'flex-start' }} />
          {notes.length > 0 && (<Box>
            <Typography variant="subtitle2" color="text.secondary">Hinweise</Typography>
            <List dense>
              {notes.length === 0 && (
                <Typography variant="caption" color="text.secondary">Keine Hinweise</Typography>
              )}
              {notes.map((n, i) => (
                <ListItem key={`${n}-${i}`} disablePadding>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <CheckCircleIcon sx={{ color: theme.palette.success.main }} fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary={n} />
                </ListItem>
              ))}
            </List>
          </Box>)}
          {notes.length > 0 && warnings.length > 0 && (
            <Divider sx={{ my: 0.5, borderColor: alpha(theme.palette.divider, 0.5) }} />
          )}
          {warnings.length > 0 && (<Box>

            <Typography variant="subtitle2" color="text.secondary">Warnungen</Typography>
            <List dense>
              {warnings.length === 0 && (
                <Typography variant="caption" color="text.secondary">Keine Warnungen</Typography>
              )}
              {warnings.map((w, i) => (
                <ListItem key={`${w}-${i}`} disablePadding>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <WarningAmberIcon color="warning" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary={w} />
                </ListItem>
              ))}
            </List>
          </Box>)}
          {risks.length > 0 && (<Box>
            <Divider sx={{ my: 0.5, borderColor: alpha(theme.palette.divider, 0.5) }} />

            <Typography variant="subtitle2" color="text.secondary">Risiken</Typography>
            <List dense>
              {risks.map((r, i) => (
                <ListItem key={`${r}-${i}`} disablePadding>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <CancelIcon color="error" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary={r} />
                </ListItem>
              ))}
            </List></Box>)}

        </Stack>
      </CardContent>
    </Card>
  );
};

export default AllowanceRisksCard;
