import React from 'react';
import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Alert from '@mui/material/Alert';
import Tooltip from '@mui/material/Tooltip';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AutoAwesomeRounded from '@mui/icons-material/AutoAwesomeRounded';
import EmailRounded from '@mui/icons-material/EmailRounded';
import SupportAgentRounded from '@mui/icons-material/SupportAgentRounded';
import InfoOutlined from '@mui/icons-material/InfoOutlined';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Support • GreenGridGuide',
  description: 'Finde Antworten, entdecke Anleitungen und kontaktiere unser Team für weitergehende Unterstützung.',
};

interface Faq {
  q: string;
  a: string | React.ReactNode;
}

interface SupportLevelRow {
  feature: string;
  free: string | boolean;
  pro: string | boolean;
  enterprise: string | boolean;
  help?: string;
}

const faqs: Faq[] = [
  {
    q: 'Warum sehe ich nur deutsche Daten im Free Plan?',
    a: 'Der Free Plan dient als schneller Einstieg – wir konzentrieren uns dort auf Deutschland, um Performance & Relevanz hoch zu halten.',
  },
  {
    q: 'Wie kann ich Ergebnisse exportieren?',
    a: 'Ab dem Pro Plan kannst du Export (CSV, GeoJSON) im Ergebnisbereich auslösen. Enterprise erweitert dies um automatisierte Pipelines.',
  },
  {
    q: 'Bietet ihr API-Zugriff?',
    a: 'Ja – Pro mit Basis-Endpunkten, Enterprise mit erweiterten Raten und Webhooks.',
  },
  {
    q: 'Wie sicher sind meine Daten?',
    a: <Box>Ihre Daten sind wirklich extrem sicher. Mehr Informationen finden Sie <Link href="/privacy" color="secondary">in unserer Datenschutzerklärung</Link></Box>,
  },
];

const supportLevels: SupportLevelRow[] = [
  {
    feature: 'Antwortzeit',
    free: 'Community',
    pro: '<24h',
    enterprise: '<4h',
    help: 'Geschätzt innerhalb Geschäftszeiten (CET).',
  },
  {
    feature: 'Kontaktkanäle',
    free: 'FAQ',
    pro: 'E-Mail',
    enterprise: 'E-Mail + Call',
  },
  {
    feature: 'Onboarding',
    free: false,
    pro: 'Leitfaden',
    enterprise: 'Persönlich',
  },
  {
    feature: 'Account Review',
    free: false,
    pro: false,
    enterprise: 'Quartalsweise',
  },
  {
    feature: 'Priorisierte Roadmap',
    free: false,
    pro: false,
    enterprise: true,
  },
];

function renderCell(val: string | boolean) {
  if (typeof val === 'boolean') {
    return val ? '✔︎' : '—';
  }
  return val;
}

export default function SupportPage() {
  return (
    <Stack minHeight="100dvh" direction="column" sx={{ overflowX: 'hidden' }}>
      <Header />
      <Container sx={{ py: { xs: 6, md: 10 }, flexGrow: 1 }}>
        <Stack spacing={8}>
          {/* Hero + Search */}
          <Stack spacing={3} mx="auto" alignItems="center" textAlign="center">
            <Stack spacing={1}>
              <Typography variant="h3" fontWeight={700}>Support & Hilfe</Typography>
              <Typography variant="body1" color="text.secondary">
                Antworten finden, Funktionen verstehen, schneller weiterkommen.
              </Typography>
            </Stack>

            <Alert severity="success" icon={<AutoAwesomeRounded />} sx={{ maxWidth: 400 }}>
              Systemstatus: Alles läuft stabil. <Chip size="small" label="Operational" color="success" sx={{ ml: 1 }} />
            </Alert>
          </Stack>

          <Divider />

          {/* FAQ */}
          <Stack spacing={3}>
            <Typography variant="h5" fontWeight={700}>Häufige Fragen</Typography>
            <Stack>
              {faqs.map(f => (
                <Accordion key={f.q} disableGutters sx={{ '&:before': { display: 'none' }, borderRadius: 1, mb: 1, border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="subtitle2" fontWeight={600}>{f.q}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body2" color="text.secondary">{f.a}</Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Stack>
          </Stack>

          {/* Support Level Tabelle */}
          <Stack spacing={2}>
            <Typography variant="h6" fontWeight={700}>Support-Level Übersicht</Typography>
            <Box sx={{ overflowX: 'auto' }}>
              <Table size="small" sx={{ minWidth: 560 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Funktion</TableCell>
                    <TableCell align="center">Free</TableCell>
                    <TableCell align="center">Pro</TableCell>
                    <TableCell align="center">Enterprise</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {supportLevels.map(row => (
                    <TableRow key={row.feature} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                          <Typography variant="body2" fontWeight={500}>{row.feature}</Typography>
                          {row.help && (
                            <Tooltip title={row.help} arrow>
                              <InfoOutlined fontSize="inherit" color="action" style={{ cursor: 'help' }} />
                            </Tooltip>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell align="center"><Typography variant="caption">{renderCell(row.free)}</Typography></TableCell>
                      <TableCell align="center"><Typography variant="caption">{renderCell(row.pro)}</Typography></TableCell>
                      <TableCell align="center"><Typography variant="caption">{renderCell(row.enterprise)}</Typography></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Stack>

          {/* Kontakt / Eskalation */}
          <Card id="contact" sx={{ p: { xs: 2.5, md: 3 }, borderRadius: 4 }}>
            <CardContent>
              <Stack spacing={2} textAlign="center">
                <Typography variant="h6" fontWeight={600}>Noch Fragen oder spezielles Anliegen?</Typography>
                <Typography variant="body2" color="text.secondary">
                  Schreib uns – wir unterstützen dich bei Setup, Analyse oder Integration.
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
                  <Button variant="outlined" component={Link} href="mailto:support@greengrid.guide?subject=%5BGGG%5D%20Support-Anfrage&body=Hallo%20GreenGridGuide%20Team,%0A%0ABezug%3A%20%28kurz%20beschreiben%29%0ASchritte%20zur%20Reproduktion%3A%0AErwartetes%20Verhalten%3A%0ATats%C3%A4chliches%20Verhalten%3A%0A%0ADanke%21" startIcon={<EmailRounded />}>support@greengrid.guide</Button>
                  <Button variant="contained" component={Link} href="/pricing" startIcon={<SupportAgentRounded />}>Enterprise Kontakt</Button>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      </Container >
      <Footer />
    </Stack >
  );
}
