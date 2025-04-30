import * as React from 'react';
import { useRouter } from 'next/navigation';
import { uploadQRCode } from '@/services/qr-service';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import ListItemIcon from '@mui/material/ListItemIcon';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import { QrCode as QrCodeIcon, SignOut as SignOutIcon } from '@phosphor-icons/react';

import { authClient } from '@/lib/auth/client';
import { logger } from '@/lib/default-logger';
import { useUser } from '@/hooks/use-user';
import { QRUploadDialog } from '@/components/dialogs/qr-upload-dialog';

export interface UserPopoverProps {
  anchorEl: Element | null;
  onClose: () => void;
  open: boolean;
}

export function UserPopover({ anchorEl, onClose, open }: UserPopoverProps): React.JSX.Element {
  const { checkSession, user } = useUser();
  const router = useRouter();
  const [isQRDialogOpen, setIsQRDialogOpen] = React.useState(false);

  const handleSignOut = React.useCallback(async (): Promise<void> => {
    try {
      const { error } = await authClient.signOut();

      if (error) {
        logger.error('Sign out error', error);
        return;
      }

      await checkSession?.();
      router.refresh();
    } catch (err) {
      logger.error('Sign out error', err);
    }
  }, [checkSession, router]);

  const handleQRUpload = async (file: File): Promise<void> => {
    try {
      await uploadQRCode(file);
      onClose();
    } catch (error) {
      logger.error('QR upload error', error);
      throw error;
    }
  };

  const fullName = user ? user?.username : '';
  const email = user?.email || '';

  return (
    <>
      <Popover
        anchorEl={anchorEl}
        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
        onClose={onClose}
        open={open}
        slotProps={{ paper: { sx: { width: '240px' } } }}
      >
        <Box sx={{ p: '16px 20px ' }}>
          <Typography variant="subtitle1">{fullName}</Typography>
          <Typography color="text.secondary" variant="body2">
            {email}
          </Typography>
        </Box>
        <Divider />
        <MenuList disablePadding sx={{ p: '8px', '& .MuiMenuItem-root': { borderRadius: 1 } }}>
          <MenuItem
            onClick={() => {
              setIsQRDialogOpen(true);
            }}
          >
            <ListItemIcon>
              <QrCodeIcon fontSize="var(--icon-fontSize-md)" />
            </ListItemIcon>
            Manage QR Code
          </MenuItem>
          <MenuItem onClick={handleSignOut}>
            <ListItemIcon>
              <SignOutIcon fontSize="var(--icon-fontSize-md)" />
            </ListItemIcon>
            Sign out
          </MenuItem>
        </MenuList>
      </Popover>
      <QRUploadDialog
        open={isQRDialogOpen}
        onClose={() => {
          setIsQRDialogOpen(false);
        }}
        onUpload={handleQRUpload}
      />
    </>
  );
}
