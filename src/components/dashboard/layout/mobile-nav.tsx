'use client';

import * as React from 'react';
import RouterLink from 'next/link';
import { usePathname } from 'next/navigation';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import Stack from '@mui/material/Stack';

import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';
import { isNavItemActive } from '@/lib/is-nav-item-active';
import { Logo } from '@/components/core/logo';

import { navItems } from './config';
import { navIcons } from './nav-icons';

export interface MobileNavProps {
  onClose?: () => void;
  open?: boolean;
  items?: NavItemConfig[];
}

export function MobileNav({ open, onClose }: MobileNavProps): React.JSX.Element {
  const pathname = usePathname();

  return (
    <Drawer
      PaperProps={{
        sx: {
          '--MobileNav-background': 'var(--mui-palette-neutral-950)',
          '--MobileNav-color': 'var(--mui-palette-common-white)',
          '--NavItem-color': 'var(--mui-palette-neutral-300)',
          '--NavItem-hover-background': 'rgba(255, 255, 255, 0.04)',
          '--NavItem-active-background': 'var(--mui-palette-primary-main)',
          '--NavItem-active-color': 'var(--mui-palette-primary-contrastText)',
          '--NavItem-disabled-color': 'var(--mui-palette-neutral-500)',
          '--NavItem-icon-color': 'var(--mui-palette-neutral-400)',
          '--NavItem-icon-active-color': 'var(--mui-palette-primary-contrastText)',
          '--NavItem-icon-disabled-color': 'var(--mui-palette-neutral-600)',
          bgcolor: 'var(--MobileNav-background)',
          color: 'var(--MobileNav-color)',
          display: 'flex',
          flexDirection: 'column',
          maxWidth: '100%',
          scrollbarWidth: 'none',
          width: 'var(--MobileNav-width)',
          zIndex: 'var(--MobileNav-zIndex)',
          '&::-webkit-scrollbar': { display: 'none' },
        },
      }}
      onClose={onClose}
      open={open}
    >
      <Stack spacing={2} sx={{ p: 3 }}>
        <Box component={RouterLink} href={paths.dashboard.users} sx={{ display: 'inline-flex' }}>
          <Logo color="light" height={32} width={122} />
        </Box>
      </Stack>
      <Divider sx={{ borderColor: 'var(--mui-palette-neutral-700)' }} />
      <Box component="nav" sx={{ flex: '1 1 auto', p: '12px' }}>
        {renderNavItems({ pathname, items: navItems })}
      </Box>
    </Drawer>
  );
}

function renderNavItems({ items = [], pathname }: { items?: NavItemConfig[]; pathname: string }): React.JSX.Element {
  const children = items.reduce<React.ReactElement[]>((acc, curr) => {
    const { key, ...item } = curr;
    acc.push(<NavItem key={key} pathname={pathname} {...item} />);
    return acc;
  }, []);

  return (
    <Stack component="ul" spacing={1} sx={{ listStyle: 'none', m: 0, p: 0 }}>
      {children}
    </Stack>
  );
}

interface NavItemProps extends Omit<NavItemConfig, 'items'> {
  pathname: string;
}

function NavItem({ disabled, external, href, icon, matcher, pathname, title }: NavItemProps): React.JSX.Element {
  const active = isNavItemActive({ disabled, external, href, matcher, pathname });
  const Icon = icon ? navIcons[icon] : null;

  const content = (
    <>
      {Icon && (
        <Box
          sx={{
            alignItems: 'center',
            color: active ? 'var(--NavItem-icon-active-color)' : 'var(--NavItem-icon-color)',
            display: 'flex',
            justifyContent: 'center',
            ...(disabled && {
              color: 'var(--NavItem-icon-disabled-color)',
            }),
          }}
        >
          <Icon fontSize="var(--icon-fontSize-md)" />
        </Box>
      )}
      <Box sx={{ flexGrow: 1 }}>{title}</Box>
    </>
  );

  return (
    <li>
      {href ? (
        <Box
          component={RouterLink}
          href={href}
          sx={{
            alignItems: 'center',
            borderRadius: 1,
            color: active ? 'var(--NavItem-active-color)' : 'var(--NavItem-color)',
            cursor: 'pointer',
            display: 'flex',
            flexGrow: 1,
            gap: 1,
            p: '12px',
            textDecoration: 'none',
            ...(active && {
              bgcolor: 'var(--NavItem-active-background)',
            }),
            ...(disabled && {
              color: 'var(--NavItem-disabled-color)',
              cursor: 'not-allowed',
            }),
            '&:hover': {
              bgcolor: active ? 'var(--NavItem-active-background)' : 'var(--NavItem-hover-background)',
            },
          }}
        >
          {content}
        </Box>
      ) : (
        <Box
          sx={{
            alignItems: 'center',
            borderRadius: 1,
            color: active ? 'var(--NavItem-active-color)' : 'var(--NavItem-color)',
            cursor: 'pointer',
            display: 'flex',
            flexGrow: 1,
            gap: 1,
            p: '12px',
            textDecoration: 'none',
            ...(active && {
              bgcolor: 'var(--NavItem-active-background)',
            }),
            ...(disabled && {
              color: 'var(--NavItem-disabled-color)',
              cursor: 'not-allowed',
            }),
            '&:hover': {
              bgcolor: active ? 'var(--NavItem-active-background)' : 'var(--NavItem-hover-background)',
            },
          }}
        >
          {content}
        </Box>
      )}
    </li>
  );
}
