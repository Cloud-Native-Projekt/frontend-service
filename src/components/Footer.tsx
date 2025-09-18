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
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

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
            <Typography variant="h6" sx={{ fontWeight: 600 }}>My App</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>Crafted with Material Design 3 cues.</Typography>
          </Box>
          <Stack direction="row" spacing={3} flexWrap="wrap" useFlexGap>
            <Link href="#" underline="hover" color="text.primary" variant="body2">Docs</Link>
            <Link href="#" underline="hover" color="text.primary" variant="body2">API</Link>
            <Link href="#" underline="hover" color="text.primary" variant="body2">Support</Link>
            <Link href="#" underline="hover" color="text.primary" variant="body2">Privacy</Link>
          </Stack>
          <Stack direction="row" spacing={1}>
            <IconButton color="inherit" size="small" aria-label="GitHub">
              <GitHubIcon fontSize="small" />
            </IconButton>
            <IconButton color="inherit" size="small" aria-label="Twitter">
              <TwitterIcon fontSize="small" />
            </IconButton>
            <IconButton color="inherit" size="small" aria-label="LinkedIn">
              <LinkedInIcon fontSize="small" />
            </IconButton>
          </Stack>
        </Stack>
        <Divider sx={{ my: 3 }} />
        <Typography variant="caption" color="text.secondary" display="block">
          © {year} My App. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
}
