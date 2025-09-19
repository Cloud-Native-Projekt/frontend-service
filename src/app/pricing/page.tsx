import React from 'react';
import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import CheckCircleRounded from '@mui/icons-material/CheckCircleRounded';
import RadioButtonUncheckedRounded from '@mui/icons-material/RadioButtonUncheckedRounded';
import InfoOutlined from '@mui/icons-material/InfoOutlined';
import { customThemeVars } from '@/theme';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Pricing • GreenGridGuide',
  description: 'Vergleiche unsere Pläne: von kostenlos (Deutschland-Daten) bis Enterprise mit globaler Tiefe und Integrationen.',
};

type FeatureValue = boolean | string | number;

interface Plan {
  id: string;
  name: string;
  price: string;
  period?: string;
  description: string;
  isPopular?: boolean;
  ctaLabel: string;
  tierNote?: string;
  meta?: Record<string, unknown>;
  reference: string;
}

interface FeatureDef {
  key: string;
  label: string;
  help?: string;
}

interface FeatureGroup {
  key: string;
  title: string;
  features: FeatureDef[];
}

// Pläne definieren
const plans: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    price: '€0',
    period: '/Monat',
    description: 'Ideal für ersten Einstieg. Fokus: Deutschland.',
    ctaLabel: 'Kostenlos weitermachen',
    tierNote: 'Nur DE-Daten',
    reference: '/'
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '€39',
    period: '/Monat',
    description: 'Erweitert für Teams mit mehr Regionen & Export.',
    ctaLabel: 'Pro aktivieren',
    isPopular: true,
    tierNote: 'Beliebtester Plan',
    reference: '/'
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 'Kontakt',
    description: 'Große Datentiefe, Compliance & Integrationen.',
    ctaLabel: 'Mit Vertrieb sprechen',
    tierNote: 'Individuell',
    reference: '/'
  },
];

// Feature-Gruppen definieren
const featureGroups: FeatureGroup[] = [
  {
    key: 'coverage',
    title: 'Datenabdeckung',
    features: [
      { key: 'geoScope', label: 'Geografische Abdeckung', help: 'Welche Länder & Regionen sind verfügbar.' },
      { key: 'historicalDepth', label: 'Historische Datentiefe', help: 'Zeiträume rückwirkender Daten.' },
      { key: 'updateFrequency', label: 'Aktualisierungsfrequenz', help: 'Wie oft Daten erneuert werden.' },
    ],
  },
  {
    key: 'analysis',
    title: 'Analyse & Funktionen',
    features: [
      { key: 'multiScenario', label: 'Szenario-Vergleiche', help: 'Mehrere Konfigurationen nebeneinander analysieren.' },
      { key: 'export', label: 'Datenexport', help: 'CSV/GeoJSON/Excel Export.' },
      { key: 'backup', label: 'Automatische Backups', help: 'Regelmäßige Sicherung deiner Ergebnisse.' },
      { key: 'apiAccess', label: 'API Zugriff', help: 'Programmatisch Daten abrufen.' },
    ],
  },
  {
    key: 'collaboration',
    title: 'Team & Zusammenarbeit',
    features: [
      { key: 'seatsIncluded', label: 'Inklusive Nutzer:innen', help: 'Anzahl enthaltene Benutzer-Konten.' },
      { key: 'roles', label: 'Rollen & Berechtigungen', help: 'Feingranulare Zugriffskontrollen.' },
      { key: 'sharing', label: 'Geteilte Projekte', help: 'Projekte für andere freigeben.' },
    ],
  },
  {
    key: 'support',
    title: 'Support & Compliance',
    features: [
      { key: 'supportLevel', label: 'Support Level', help: 'Antwortzeiten & Kanäle.' },
      { key: 'sla', label: 'SLA / Verfügbarkeit', help: 'Service Level Agreement Prozent.' },
      { key: 'compliance', label: 'Compliance & Audit', help: 'Erweiterte Prüf- & Audit-Funktionen.' },
    ],
  },
];

// Werte-Matrix planId -> featureKey -> value
const featureMatrix: Record<string, Record<string, FeatureValue>> = {
  free: {
    geoScope: 'Deutschland',
    historicalDepth: '6 Monate',
    updateFrequency: 'Monatlich',
    multiScenario: false,
    export: false,
    backup: false,
    apiAccess: false,
    seatsIncluded: 1,
    roles: false,
    sharing: false,
    supportLevel: 'Community',
    sla: false,
    compliance: false,
  },
  pro: {
    geoScope: 'Europa + UK',
    historicalDepth: '24 Monate',
    updateFrequency: 'Wöchentlich',
    multiScenario: true,
    export: true,
    backup: true,
    apiAccess: true,
    seatsIncluded: 5,
    roles: true,
    sharing: true,
    supportLevel: 'Priorisiert',
    sla: '99.5%',
    compliance: 'Basis-Logs',
  },
  enterprise: {
    geoScope: 'Global + Detailzonen',
    historicalDepth: '5 Jahre',
    updateFrequency: 'Täglich',
    multiScenario: true,
    export: 'Erweitert',
    backup: 'Versioniert',
    apiAccess: 'Erweitert + Webhooks',
    seatsIncluded: 20,
    roles: 'Granular',
    sharing: 'Domänenweit',
    supportLevel: 'Dedizierte Betreuung',
    sla: '99.9%',
    compliance: 'Audit Trails + DSGVO Reports',
  },
};

function renderValue(val: FeatureValue) {
  if (typeof val === 'boolean') {
    return val ? <CheckCircleRounded color="primary" fontSize="small" /> : <RadioButtonUncheckedRounded color="disabled" fontSize="small" />;
  }
  return <Typography variant="body2" component="span">{String(val)}</Typography>;
}

export default function PricingPage() {
  return (
    <Stack minHeight="100dvh" direction="column" sx={{ overflowX: 'hidden' }}>
      <Header />
      <Container sx={{ py: { xs: 6, md: 10 }, flexGrow: 1 }}>
        <Stack spacing={{ xs: customThemeVars.body.innerMargin.mobile, sm: customThemeVars.body.innerMargin.desktop }}>
          <Stack spacing={{ xs: customThemeVars.body.innerMargin.mobile, sm: customThemeVars.body.innerMargin.desktop }} textAlign="center" mx="auto">
            <Typography variant="h3" fontWeight={700}>Preise & Pläne</Typography>
            <Typography variant="body1" color="text.secondary">
              Wähle den Plan, der zu deinem Wachstum passt – starte kostenlos mit Deutschland-Daten und skaliere bis zur globalen Analyse.
            </Typography>
          </Stack>

          {/* Plan Cards */}
          <Box sx={{
            display: 'grid',
            gap: { xs: customThemeVars.body.innerMargin.mobile, sm: customThemeVars.body.innerMargin.desktop },
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }
          }}>
            {plans.map((plan) => (
              <Card key={plan.id} sx={{ position: 'relative', borderWidth: plan.isPopular ? 2 : 1, borderStyle: 'solid', borderColor: (plan.isPopular ? 'primary.main' : 'divider') }}>
                {plan.isPopular && (
                  <Chip label="Beliebt" color="primary" size="small" sx={{ position: 'absolute', top: 12, right: 12 }} />
                )}
                <CardContent>
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="h5" fontWeight={700}>{plan.name}</Typography>
                      <Typography variant="body2" color="text.secondary">{plan.description}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="h4" component="div" fontWeight={700}>{plan.price}<Typography component="span" variant="subtitle2" color="text.secondary" sx={{ ml: 0.5 }}>{plan.period}</Typography></Typography>
                      {plan.tierNote && (
                        <Typography variant="caption" color="text.secondary">{plan.tierNote}</Typography>
                      )}
                    </Box>
                    <Button variant={plan.isPopular ? 'contained' : 'outlined'} component={Link} href={plan.reference} fullWidth>{plan.ctaLabel}</Button>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Box>

          <Divider />

          {/* Feature Vergleich */}
          <Stack spacing={{ xs: customThemeVars.body.innerMargin.mobile, sm: customThemeVars.body.innerMargin.desktop }}>
            <Typography variant="h5" fontWeight={700}>Funktionsvergleich</Typography>
            {featureGroups.map((group) => (
              <Card key={group.key} variant="outlined">
                <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1.5 }}>{group.title}</Typography>
                <TableContainer>
                  <Table size="small" aria-label={`Feature Gruppe ${group.title}`} sx={{ tableLayout: 'fixed' }}>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ width: '30%' }}>Feature</TableCell>
                        {plans.map(p => (
                          <TableCell key={p.id} align="center">{p.name}</TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {group.features.map((f) => (
                        <TableRow key={f.key} hover>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                              <Typography variant="body2" fontWeight={500}>{f.label}</Typography>
                              {f.help && (
                                <Tooltip title={f.help} placement="top" arrow>
                                  <InfoOutlined fontSize="inherit" color="action" style={{ cursor: 'help' }} />
                                </Tooltip>
                              )}
                            </Box>
                          </TableCell>
                          {plans.map(p => (
                            <TableCell key={p.id} align="center">{renderValue(featureMatrix[p.id][f.key])}</TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Card>
            ))}
          </Stack>

          <Card sx={{ borderRadius: 3 }}>
            <Stack spacing={1.5} textAlign="center">
              <Typography variant="h6" fontWeight={600}>Individuelle Anforderungen?</Typography>
              <Typography variant="body2" color="text.secondary">Kontaktiere uns für maßgeschneiderte Integrationen, größere Nutzerzahlen oder spezielle Compliance-Anforderungen.</Typography>
              <Box>
                <Button variant="contained">Kontakt aufnehmen</Button>
              </Box>
            </Stack>
          </Card>
        </Stack>
      </Container>
      <Footer />
    </Stack>
  );
}
