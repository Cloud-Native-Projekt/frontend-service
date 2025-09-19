'use client';

import React from 'react';
import Button, { ButtonProps } from '@mui/material/Button';
import AcquireProDialog from './AcquireProDialog';

interface ProAcquireCtaProps extends Omit<ButtonProps, 'onClick'> {
  label: string;
}

export default function ProAcquireCta({ label, ...btn }: ProAcquireCtaProps) {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button {...btn} onClick={() => setOpen(true)}>{label}</Button>
      <AcquireProDialog open={open} onClose={() => setOpen(false)} />
    </>
  );
}
