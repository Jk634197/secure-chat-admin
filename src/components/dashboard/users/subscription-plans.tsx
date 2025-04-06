'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';

interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
  createdAt: string;
}

const dummyPlans: SubscriptionPlan[] = [
  {
    id: '1',
    name: 'Basic',
    description: 'Essential features for small teams',
    price: 9.99,
    features: ['Up to 5 users', 'Basic support', '1GB storage'],
    createdAt: '2024-01-01',
  },
  {
    id: '2',
    name: 'Pro',
    description: 'Advanced features for growing teams',
    price: 19.99,
    features: ['Up to 20 users', 'Priority support', '10GB storage'],
    createdAt: '2024-01-02',
  },
  {
    id: '3',
    name: 'Enterprise',
    description: 'Complete solution for large organizations',
    price: 49.99,
    features: ['Unlimited users', '24/7 support', '100GB storage'],
    createdAt: '2024-01-03',
  },
];

export function SubscriptionPlans() {
  const [plans, setPlans] = React.useState<SubscriptionPlan[]>(dummyPlans);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [open, setOpen] = React.useState(false);
  const [newPlan, setNewPlan] = React.useState({
    name: '',
    description: '',
    price: '',
    features: '',
  });

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setNewPlan({
      name: '',
      description: '',
      price: '',
      features: '',
    });
  };

  const handleAddPlan = () => {
    const plan: SubscriptionPlan = {
      id: String(plans.length + 1),
      name: newPlan.name,
      description: newPlan.description,
      price: parseFloat(newPlan.price),
      features: newPlan.features.split(',').map((feature) => feature.trim()),
      createdAt: new Date().toISOString().split('T')[0],
    };

    setPlans([...plans, plan]);
    handleClose();
  };

  return (
    <Card>
      <CardHeader
        action={
          <Button startIcon={<PlusIcon />} variant="contained" onClick={handleClickOpen}>
            Add Plan
          </Button>
        }
        title="Subscription Plans"
      />
      <Divider />
      <CardContent>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Features</TableCell>
                <TableCell>Created At</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {plans.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((plan) => (
                <TableRow hover key={plan.id}>
                  <TableCell>{plan.name}</TableCell>
                  <TableCell>{plan.description}</TableCell>
                  <TableCell>${plan.price.toFixed(2)}</TableCell>
                  <TableCell>
                    <Stack spacing={1}>
                      {plan.features.map((feature, index) => (
                        <Typography key={index} variant="body2">
                          • {feature}
                        </Typography>
                      ))}
                    </Stack>
                  </TableCell>
                  <TableCell>{plan.createdAt}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
        <TablePagination
          component="div"
          count={plans.length}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          page={page}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </CardContent>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New Subscription Plan</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Plan Name"
              name="name"
              onChange={(e) => {
                setNewPlan({ ...newPlan, name: e.target.value });
              }}
              value={newPlan.name}
            />
            <TextField
              fullWidth
              label="Description"
              name="description"
              onChange={(e) => {
                setNewPlan({ ...newPlan, description: e.target.value });
              }}
              value={newPlan.description}
            />
            <TextField
              fullWidth
              label="Price"
              name="price"
              type="number"
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
              onChange={(e) => {
                setNewPlan({ ...newPlan, price: e.target.value });
              }}
              value={newPlan.price}
            />
            <TextField
              fullWidth
              label="Features"
              name="features"
              helperText="Separate features with commas"
              onChange={(e) => {
                setNewPlan({ ...newPlan, features: e.target.value });
              }}
              value={newPlan.features}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleAddPlan} variant="contained">
            Add Plan
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}
