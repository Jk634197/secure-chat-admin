import * as React from 'react';
import { activationService } from '@/services/activation';
import {
  Alert,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Radio,
  RadioGroup,
} from '@mui/material';

interface ExtendExpirationDialogProps {
  open: boolean;
  onClose: () => void;
  codeId: string;
  onSuccess?: () => void;
}

const durationOptions = [
  { value: '1 months', label: '1 Month', offset: 'months' },
  { value: '3 months', label: '3 Months', offset: 'months' },
  { value: '9 months', label: '9 Months', offset: 'months' },
  { value: '1 year', label: '1 Year', offset: 'year' },
];

export function ExtendExpirationDialog({
  open,
  onClose,
  codeId,
  onSuccess,
}: ExtendExpirationDialogProps): React.JSX.Element {
  const [selectedDuration, setSelectedDuration] = React.useState<string>('1 months');
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await activationService.extendExpiration(
        codeId,
        Number(selectedDuration.split(' ')[0]),
        selectedDuration.split(' ')[1]
      );

      if (response.success) {
        setSuccess(response?.data?.message ?? 'Expiration extended successfully');
        onSuccess?.();
      } else {
        setError(response.message || 'Failed to extend expiration');
      }
    } catch (err) {
      setError('An error occurred while extending expiration');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Extend Activation Expiration</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}
        <RadioGroup
          value={selectedDuration}
          onChange={(e) => {
            setSelectedDuration(e.target.value);
          }}
        >
          {durationOptions.map((option) => (
            <FormControlLabel key={option.value} value={option.value} control={<Radio />} label={option.label} />
          ))}
        </RadioGroup>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isLoading}
          startIcon={isLoading ? <CircularProgress size={20} /> : null}
        >
          Extend
        </Button>
      </DialogActions>
    </Dialog>
  );
}
