'use client';

import * as React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { CreditCard as CreditCardIcon } from '@phosphor-icons/react/dist/ssr/CreditCard';

import { SubscriptionPlans } from '@/components/dashboard/users/subscription-plans';

export default function SubscriptionPlansPage() {
  return (
    <Stack spacing={3}>
      <Stack direction="row" justifyContent="space-between" spacing={4}>
        <Stack spacing={1}>
          <Stack direction="row" spacing={1} alignItems="center">
            <CreditCardIcon size={24} />
            <Typography variant="h4">Subscription Plans</Typography>
          </Stack>
          <Stack alignItems="center" direction="row" spacing={1}>
            <Typography color="text.secondary" variant="body2">
              Manage your subscription plans
            </Typography>
          </Stack>
        </Stack>
      </Stack>
      <SubscriptionPlans />
    </Stack>
  );
}
