import * as React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import GlobalStyles from '@mui/material/GlobalStyles';

import { AuthGuard } from '@/components/auth/auth-guard';
import { MainNav } from '@/components/dashboard/layout/main-nav';
import { ThemeProvider } from '@/components/core/theme-provider/theme-provider';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps): React.JSX.Element {
  return (
    <AuthGuard>
      <ThemeProvider>
      <GlobalStyles
        styles={{
          body: {
            '--MainNav-height': '56px',
            '--MainNav-zIndex': 1000,
            '--MobileNav-width': '320px',
            '--MobileNav-zIndex': 1100,
            '--icon-fontWeight': '700',
          },
        }}
      />
      <Box
        sx={{
          bgcolor: 'var(--mui-palette-background-default)',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          minHeight: '100%',
        }}
      >
        <Box sx={{ display: 'flex', flex: '1 1 auto', flexDirection: 'column' }}>
          <MainNav />
          <main>
            <Container maxWidth="xl" sx={{ py: '24px' }}>
              {children}
            </Container>
          </main>
        </Box>
      </Box>
      </ThemeProvider>
    </AuthGuard>
  );
}
