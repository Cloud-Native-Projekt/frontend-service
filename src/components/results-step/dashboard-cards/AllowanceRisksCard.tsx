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

export interface AllowanceRisksCardProps {
  allowed: boolean;
  notes: string[];
  risks: string[];
}

const AllowanceRisksCard: React.FC<AllowanceRisksCardProps> = ({ allowed, notes, risks }) => {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardHeader title="Allowance & Risks" />
      <CardContent>
        <Stack spacing={2}>
          <Chip
            color={allowed ? 'success' : 'error'}
            label={allowed ? 'ALLOWED' : 'NOT ALLOWED'}
            icon={allowed ? <CheckCircleIcon /> : <CancelIcon />}
            sx={{ alignSelf: 'flex-start' }}
          />
          <Typography variant="subtitle2" color="text.secondary">Notes</Typography>
          <List dense>
            {notes.length === 0 && (
              <Typography variant="caption" color="text.secondary">No notes</Typography>
            )}
            {notes.map((n) => (
              <ListItem key={n} disablePadding>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <CheckCircleIcon color="success" fontSize="small" />
                </ListItemIcon>
                <ListItemText primary={n} primaryTypographyProps={{ variant: 'body2' }} />
              </ListItem>
            ))}
          </List>

          <Typography variant="subtitle2" color="text.secondary">Risks</Typography>
          <List dense>
            {risks.length === 0 && (
              <Typography variant="caption" color="text.secondary">No risks detected</Typography>
            )}
            {risks.map((r) => (
              <ListItem key={r} disablePadding>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <WarningAmberIcon color="warning" fontSize="small" />
                </ListItemIcon>
                <ListItemText primary={r} primaryTypographyProps={{ variant: 'body2' }} />
              </ListItem>
            ))}
          </List>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default AllowanceRisksCard;
