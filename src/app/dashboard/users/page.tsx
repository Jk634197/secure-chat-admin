'use client';

import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { UsersTable } from '@/components/dashboard/users';

export default function UsersPage() {
  return (
    <Stack spacing={3}>
      <Stack direction="row" justifyContent="space-between" spacing={4}>
        <Stack spacing={1}>
          <Typography variant="h4">Users</Typography>
          <Stack alignItems="center" direction="row" spacing={1}>
            <Typography color="text.secondary" variant="body2">
              Manage your users
            </Typography>
          </Stack>
        </Stack>
      </Stack>
      <Card>
        <CardHeader title="User Management" />
        <Divider />
        <CardContent>
          <UsersTable />
        </CardContent>
      </Card>
    </Stack>
  );
}
