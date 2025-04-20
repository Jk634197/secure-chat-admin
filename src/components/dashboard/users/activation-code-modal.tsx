import * as React from 'react';
import { generateActivation, type GenerateActivationResponse } from '@/services/activation';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Copy, Download } from '@phosphor-icons/react/dist/ssr';

interface ActivationCodeModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function ActivationCodeModal({ open, onClose, onSuccess }: ActivationCodeModalProps): React.JSX.Element {
  const [activationData, setActivationData] = React.useState<GenerateActivationResponse | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const generateCode = async () => {
      if (!open) return;

      try {
        setLoading(true);
        setError(null);
        const response = await generateActivation();
        if (response.success && response.statusCode === 200) {
          setActivationData(response.data);
        } else {
          setError(response.message || 'Failed to generate activation code');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to generate activation code');
      } finally {
        setLoading(false);
      }
    };

    void generateCode();
  }, [open]);

  const handleCopyCode = () => {
    if (activationData?.code) {
      void navigator.clipboard.writeText(activationData.code);
    }
  };

  const handleDownloadQR = () => {
    if (activationData?.qrCode) {
      const link = document.createElement('a');
      link.href = activationData.qrCode;
      link.download = `activation-code-${activationData.code}.png`;
      link.click();
    }
  };

  const handleClose = () => {
    onClose();
    onSuccess();
    setActivationData(null);
    setError(null);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: 'var(--mui-palette-background-paper)',
          backgroundImage: 'none',
        },
      }}
    >
      <DialogTitle>Create Activation Code</DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          )}

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}

          {activationData && (
            <>
              <Stack spacing={1}>
                <Typography variant="subtitle2" color="text.secondary">
                  E-mail
                </Typography>
                <TextField
                  value={activationData.email}
                  fullWidth
                  disabled
                  InputProps={{
                    readOnly: true,
                  }}
                />
                <Typography variant="subtitle2" color="text.secondary">
                  Activation code
                </Typography>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <TextField
                    value={activationData.code}
                    fullWidth
                    disabled
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                  <IconButton onClick={handleCopyCode}>
                    <Copy />
                  </IconButton>
                </Stack>
              </Stack>

              <Stack spacing={1} alignItems="center">
                <Typography variant="subtitle2" color="text.secondary" alignSelf="center">
                  Or
                </Typography>
                <Box
                  component="img"
                  src={activationData.qrCode}
                  alt="QR Code"
                  sx={{
                    width: 200,
                    height: 200,
                    background: 'white',
                    padding: 2,
                    borderRadius: 1,
                  }}
                />
                <Button startIcon={<Download />} onClick={handleDownloadQR} variant="contained" color="secondary">
                  Download QR
                </Button>
              </Stack>
            </>
          )}

          <Button variant="contained" onClick={handleClose} fullWidth sx={{ mt: 2 }}>
            Close
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
