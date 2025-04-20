'use client';

import * as React from 'react';
import { Button } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Plus } from '@phosphor-icons/react/dist/ssr';

import { UsersTable } from '@/components/dashboard/users';
import { ActivationCodeModal } from '@/components/dashboard/users/activation-code-modal';

export default function UsersPage() {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [refreshKey, setRefreshKey] = React.useState(0);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSuccess = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <Stack spacing={3}>
      <Stack direction="row" justifyContent="space-between" spacing={4}>
        <Stack spacing={1}>
          <Typography variant="h4">Users Management</Typography>
          <Stack alignItems="center" direction="row" spacing={1}>
            <Typography color="text.secondary" variant="body2">
              Manage your users
            </Typography>
          </Stack>
        </Stack>
        <Stack>
          <Button
            variant="contained"
            startIcon={<Plus fontSize="var(--icon-fontSize-md)" fontWeight="var(--icon-fontWeight)" />}
            onClick={handleOpenModal}
          >
            Generate Activation Code
          </Button>
        </Stack>
      </Stack>
      <Card>
        <CardHeader title="All Users" />
        <Divider />
        <CardContent>
          <UsersTable key={refreshKey} />
        </CardContent>
      </Card>

      <ActivationCodeModal open={isModalOpen} onClose={handleCloseModal} onSuccess={handleSuccess} />
    </Stack>
  );
}
