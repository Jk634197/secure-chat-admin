'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { DotsThree as DotsThreeIcon } from '@phosphor-icons/react/dist/ssr/DotsThree';
import dayjs from 'dayjs';

export interface User {
  id: string;
  name: string;
  email: string;
  activationCode: string;
  subscriptionExpiration: Date;
  status: 'active' | 'expired' | 'pending';
}

const users = [
  {
    id: 'USR-001',
    name: 'John Doe',
    email: 'john.doe@example.com',
    activationCode: 'ACT-2024-001',
    subscriptionExpiration: dayjs().add(30, 'days').toDate(),
    status: 'active',
  },
  {
    id: 'USR-002',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    activationCode: 'ACT-2024-002',
    subscriptionExpiration: dayjs().add(60, 'days').toDate(),
    status: 'active',
  },
  {
    id: 'USR-003',
    name: 'Robert Johnson',
    email: 'robert.johnson@example.com',
    activationCode: 'ACT-2024-003',
    subscriptionExpiration: dayjs().add(90, 'days').toDate(),
    status: 'active',
  },
  {
    id: 'USR-004',
    name: 'Emily Davis',
    email: 'emily.davis@example.com',
    activationCode: 'ACT-2024-004',
    subscriptionExpiration: dayjs().subtract(5, 'days').toDate(),
    status: 'expired',
  },
  {
    id: 'USR-005',
    name: 'Michael Wilson',
    email: 'michael.wilson@example.com',
    activationCode: 'ACT-2024-005',
    subscriptionExpiration: dayjs().add(150, 'days').toDate(),
    status: 'active',
  },
  {
    id: 'USR-006',
    name: 'Sarah Brown',
    email: 'sarah.brown@example.com',
    activationCode: 'ACT-2024-006',
    subscriptionExpiration: dayjs().add(1, 'day').toDate(),
    status: 'pending',
  },
] satisfies User[];

export function UsersTable(): React.JSX.Element {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [_selectedUserId, setSelectedUserId] = React.useState<string | null>(null);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, userId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedUserId(userId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedUserId(null);
  };

  const getStatusColor = (status: User['status']) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'expired':
        return 'error';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <Card>
      <Box sx={{ overflowX: 'auto' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Activation Code</TableCell>
              <TableCell>Subscription Expiration</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user) => (
              <TableRow hover key={user.id}>
                <TableCell>
                  <Typography variant="body2">{user.id}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{user.name}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{user.email}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{user.activationCode}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{dayjs(user.subscriptionExpiration).format('MMM D, YYYY')}</Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    color={getStatusColor(user.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    onClick={(e) => {
                      handleMenuOpen(e, user.id);
                    }}
                  >
                    <DotsThreeIcon fontSize="var(--icon-fontSize-md)" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
      <TablePagination
        component="div"
        count={users.length}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: { width: 200 },
        }}
      >
        <MenuItem onClick={handleMenuClose}>View Details</MenuItem>
        <MenuItem onClick={handleMenuClose}>Edit User</MenuItem>
        <MenuItem onClick={handleMenuClose}>Extend Subscription</MenuItem>
        <MenuItem onClick={handleMenuClose}>Deactivate</MenuItem>
      </Menu>
    </Card>
  );
}
