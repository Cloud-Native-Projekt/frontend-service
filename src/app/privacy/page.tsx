import React from 'react';
import type { Metadata } from 'next';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Image from 'next/image';
import { customThemeVars } from '@/theme';

export const metadata: Metadata = {
  title: 'Datenschutz • GreenGridGuide',
  description: 'Kurz & klar: Deine Daten. Unser Schutz. Mit Humor – aber ernst gemeint.',
};

export default function PrivacyPage() {
  return (
    <Stack minHeight="100dvh" direction="column" spacing={0} sx={{ overflow: 'hidden' }}>
      <Header />
      <Container component="main" sx={{ py: { xs: customThemeVars.body.innerMargin.mobile, sm: customThemeVars.body.innerMargin.desktop }, flexGrow: 1, display: 'flex', alignItems: 'flex-start' }}>
        <Card elevation={3} sx={{ maxWidth: 940, mx: 'auto', width: '100%' }}>
          <Box sx={{ position: 'relative', width: '100%', aspectRatio: '16 / 7', mb: 2, borderRadius: 2.7, overflow: 'hidden' }}>
            <Image
              src="https://media2.giphy.com/media/v1.Y2lkPTZjMDliOTUyYWhqM2dveHd6Z3N2YWVocjRraHVyN2ZkYnV1ajM2eWtkejJ2NThvaCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/14nR89kC0mcYU0/giphy.gif "
              alt="Animiertes Symbol für sehr entschlossenen Datenschutz (Tresor)"
              fill
              sizes="(max-width: 900px) 100vw, 900px"
              style={{ objectFit: 'cover' }}
              priority
            />
            <Box sx={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,0.55), rgba(0,0,0,0.05))',
              display: 'flex', alignItems: 'flex-end', p: { xs: 2.5, md: 3.5 }
            }}>
              <Typography variant="h3" component="h1" fontWeight={700} sx={{ color: 'white', textShadow: '0 2px 6px rgba(0,0,0,0.4)' }}>
                Datenschutz. Mit Stil.
              </Typography>
            </Box>
          </Box>
          <CardContent>
            <Stack spacing={3}>
              <Typography variant="body1" color="text.secondary">
                Kurz gesagt: Wir schützen deine Daten so, als würden sie jederzeit von Laser‑Haien bewacht. Hier das Wesentliche – ohne Roman.
              </Typography>
              <List disablePadding sx={{ width: '100%' }}>
                {[
                  'Ende‑zu‑Ende Denkweise: Verschlüsselung unterwegs & im Ruhezustand.',
                  'Least Privilege & Nachvollziehbarkeit: Wer etwas sieht, ist protokolliert.',
                  'Keine Weiterverkäufe. Keine heimlichen Datenreisen.',
                  'Schnelle Reaktion & Monitoring – paranoide Gelassenheit.',
                  'Du kannst Export oder Löschung anstoßen. Jederzeit.'
                ].map((text) => (
                  <ListItem key={text} sx={{ pl: 0 }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <CheckCircleRoundedIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={text}
                    />
                  </ListItem>
                ))}
              </List>
              <Typography variant="caption" color="text.secondary">
                Humor beiseite: Sicherheits- und Qualitätsmaßnahmen gibt es nicht, da wir keine Nutzerdaten speichern.
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      </Container>
      <Footer />
    </Stack>
  );
}
