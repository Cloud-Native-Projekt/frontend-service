"use client";

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import Slide from '@mui/material/Slide';
import React from 'react';
import WindPowerRoundedIcon from '@mui/icons-material/WindPowerRounded';
import Link from 'next/link';
import { customThemeVars } from '@/theme';

interface HideOnScrollProps {
  children: React.ReactElement;
}

function HideOnScroll({ children }: HideOnScrollProps) {
  const trigger = useScrollTrigger();
  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

export default function Header() {
  return (
    <HideOnScroll>
      <AppBar position="sticky" color="primary" enableColorOnDark>
        <Toolbar sx={{ gap: 2 }}>
          <Link href="/" style={{ flexGrow: 1, display: 'flex', alignItems: 'center', gap: customThemeVars.body.innerMargin.mobile }}>
            <WindPowerRoundedIcon color='secondary' fontSize='large' sx={{ cursor: 'pointer' }} />
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1 }}>
              <Typography variant="h5" component="div" sx={{ cursor: 'pointer', fontWeight: 600 }}>
                GreenGridGuide
              </Typography>
              <Typography variant="h5" component="div" sx={{ display: { xs: 'none', sm: 'flex' }, fontSize: 21, cursor: 'pointer' }}>
                – Wind & Solar Potential Explorer
              </Typography>
            </Box>
          </Link>
          <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 1 }}>
            <Button color="inherit">Features</Button>
            <Button color="inherit">About</Button>
          </Box>
          <Button variant="outlined" color="inherit" component={Link} href="/pricing">
            Pricing
          </Button>
        </Toolbar>
      </AppBar>
    </HideOnScroll>
  );
}
