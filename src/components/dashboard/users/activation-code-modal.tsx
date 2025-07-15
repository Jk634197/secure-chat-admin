import * as React from 'react';
import { generateActivation, type GenerateActivationResponse } from '@/services/activation';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Copy, Download } from '@phosphor-icons/react/dist/ssr';

interface ActivationCodeModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

// Duration options (copied from extend-expiration-dialog)
const durationOptions = [
  { value: '1 months', label: '1 Month', offset: 'months', hours: 24 * 30 }, // 720
  { value: '3 months', label: '3 Months', offset: 'months', hours: 24 * 30 * 3 }, // 2160
  { value: '9 months', label: '9 Months', offset: 'months', hours: 24 * 30 * 9 }, // 6480
  { value: '1 year', label: '1 Year', offset: 'year', hours: 24 * 365 }, // 8760
];

export function ActivationCodeModal({ open, onClose, onSuccess }: ActivationCodeModalProps): React.JSX.Element {
  const [activationData, setActivationData] = React.useState<GenerateActivationResponse | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [selectedDuration, setSelectedDuration] = React.useState<string>(durationOptions[0].value);
  const [hasGenerated, setHasGenerated] = React.useState(false);

  React.useEffect(() => {
    if (!open) {
      setActivationData(null);
      setError(null);
      setSelectedDuration(durationOptions[0].value);
      setHasGenerated(false);
    }
  }, [open]);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const selected = durationOptions.find((opt) => opt.value === selectedDuration);
      const expiresIn = selected ? selected.hours : 0;
      const response = await generateActivation(selectedDuration, expiresIn);
      if (response.success && response.statusCode === 200) {
        setActivationData(response.data);
        setHasGenerated(true);
      } else {
        setError(response.message || 'Failed to generate activation code');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate activation code');
    } finally {
      setLoading(false);
    }
  };

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
        <Stack spacing={2} sx={{ mt: 1 }}>
          {!hasGenerated && (
            <>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="duration-select-label">Select Duration</InputLabel>
                <Select
                  labelId="duration-select-label"
                  id="duration-select"
                  value={selectedDuration}
                  label="Select Duration"
                  onChange={(e) => {
                    setSelectedDuration(e.target.value);
                  }}
                >
                  {durationOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button
                variant="contained"
                color="primary"
                onClick={handleGenerate}
                disabled={loading}
                fullWidth
                sx={{ borderRadius: 2, fontWeight: 600, mt: 2 }}
              >
                {loading ? <CircularProgress size={20} /> : 'Generate'}
              </Button>
              <Button
                variant="outlined"
                color="primary"
                onClick={handleClose}
                fullWidth
                sx={{ borderRadius: 2, fontWeight: 600, mt: 1 }}
              >
                Close
              </Button>
            </>
          )}

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
                    width: 260,
                    height: 260,
                    background: 'white',
                    padding: 2,
                    borderRadius: 1,
                  }}
                />
                <Button startIcon={<Download />} onClick={handleDownloadQR} variant="contained" color="secondary">
                  Download QR
                </Button>
              </Stack>
              <Button
                variant="outlined"
                color="primary"
                onClick={handleClose}
                fullWidth
                sx={{ borderRadius: 2, fontWeight: 600, mt: 2 }}
              >
                Close
              </Button>
            </>
          )}
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
