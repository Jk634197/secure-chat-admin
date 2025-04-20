'use client';

import * as React from 'react';
import { getActivations, type ActivationData } from '@/services/activation';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
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

export function UsersTable(): React.JSX.Element {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [_selectedUserId, setSelectedUserId] = React.useState<string | null>(null);
  const [users, setUsers] = React.useState<ActivationData[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await getActivations();
        const { success, data, statusCode } = response;
        if (success && statusCode === 200) setUsers(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };

    void fetchUsers();
  }, []);

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

  const getStatusColor = (status: ActivationData['status']) => {
    switch (status) {
      case 'ACTIVE':
        return 'success';
      case 'EXPIRED':
        return 'error';
      case 'SUSPENDED':
        return 'warning';
      case 'CLOSED':
        return 'error';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Card>
      <Box sx={{ overflowX: 'auto' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>SID</TableCell>
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
              <TableRow hover key={user?._id}>
                <TableCell>
                  <Typography variant="body2">{user?.userId?.sid}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{user?.userId?.username}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{user?.userId?.email}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{user?.code}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{dayjs(user?.expiresAt).format('MMM D, YYYY')}</Typography>
                </TableCell>
                <TableCell>
                  <Chip label={user?.status} color={getStatusColor(user?.status)} size="small" />
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    onClick={(e) => {
                      handleMenuOpen(e, user?._id);
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
