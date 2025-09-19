"use client";
import React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import School from '@mui/icons-material/School';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <Box component="footer" sx={(theme) => ({
      mt: 'auto',
      bgcolor: theme.palette.background.paper,
      borderTop: `1px solid ${theme.palette.divider}`,
    })}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>GreenGridGuide</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Empowering sustainable choices with modern design principles.
            </Typography>
          </Box>
          <Box component="nav" aria-label="Footer navigation">
            <Stack direction="row" spacing={3} flexWrap="wrap" useFlexGap>
              <Link href="https://github.com/Cloud-Native-Projekt/documentation" target="_blank"
                rel="noopener noreferrer" underline="hover" color="text.primary" variant="body2">Docs</Link>
              <Link href="/support" underline="hover" color="text.primary" variant="body2">Support</Link>
              <Link href="/privacy" underline="hover" color="text.primary" variant="body2">Privacy</Link>
            </Stack>
          </Box>
          <Stack direction="row" spacing={1}>
            <IconButton
              color="inherit"
              size="small"
              aria-label="GitHub"
              component={Link}
              href="https://github.com/Cloud-Native-Projekt"
              target="_blank"
              rel="noopener noreferrer"
            >
              <GitHubIcon fontSize="small" />
            </IconButton>
            <IconButton
              color="inherit"
              size="small"
              aria-label="LinkedIn"
              component={Link}
              href="https://www.linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <LinkedInIcon fontSize="small" />
            </IconButton>
            <IconButton
              color="inherit"
              size="small"
              aria-label="CAS DHBW Lecture"
              component={Link}
              href="https://www.cas.dhbw.de/fileadmin/user_upload/Studium/Wirtschaft/M_W_WI_Modulhandbuch.pdf#page=119"
              target="_blank"
              rel="noopener noreferrer"
            >
              <School fontSize="small" />
            </IconButton>
          </Stack>
        </Stack>
        <Divider sx={{ my: 3 }} />
        <Typography variant="caption" color="text.secondary" display="block">
          © {year} GreenGridGuide. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
}
