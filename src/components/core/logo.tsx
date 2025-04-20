'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import { useColorScheme } from '@mui/material/styles';

import { NoSsr } from '@/components/core/no-ssr';

const HEIGHT = 60;
const WIDTH = 60;

type Color = 'dark' | 'light';

export interface LogoProps {
  color?: Color;
  _emblem?: boolean;
  height?: number;
  width?: number;
}

export function Logo({ color = 'dark', _emblem, height = HEIGHT, width = WIDTH }: LogoProps): React.JSX.Element {
  // Text-based logo instead of image
  return (
    <Box
      sx={{
        height: `${height}px`,
        width: `${width}px`,
        bgcolor: color === 'dark' ? 'primary.main' : 'primary.light',
        display: 'none',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 1,
      }}
    >
      <Box
        component="span"
        sx={{ color: color === 'dark' ? 'white' : 'primary.dark', fontWeight: 'bold', fontSize: '1.2rem' }}
      >
        ADMIN
      </Box>
    </Box>
  );
}

export interface DynamicLogoProps {
  colorDark?: Color;
  colorLight?: Color;
  emblem?: boolean;
  height?: number;
  width?: number;
}

export function DynamicLogo({
  colorDark = 'light',
  colorLight = 'dark',
  height = HEIGHT,
  width = WIDTH,
  ...props
}: DynamicLogoProps): React.JSX.Element {
  const { colorScheme } = useColorScheme();
  const color = colorScheme === 'dark' ? colorDark : colorLight;

  return (
    <NoSsr fallback={<Box sx={{ height: `${height}px`, width: `${width}px` }} />}>
      <Logo color={color} height={height} width={width} {...props} />
    </NoSsr>
  );
}
