import * as React from 'react';
import { deleteQRCode, getQRCode, QRServiceError } from '@/services/qr-service';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from '@mui/material';
import { Download as DownloadIcon, Trash as TrashIcon, Upload as UploadIcon } from '@phosphor-icons/react';
import { useDropzone } from 'react-dropzone';

import { logger } from '@/lib/default-logger';

interface QRUploadDialogProps {
  open: boolean;
  onClose: () => void;
  onUpload: (file: File) => Promise<void>;
}

export function QRUploadDialog({ open, onClose, onUpload }: QRUploadDialogProps): React.JSX.Element {
  const [isUploading, setIsUploading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [currentQR, setCurrentQR] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  const loadQRCode = React.useCallback(async () => {
    try {
      setIsLoading(true);
      const qr = await getQRCode();
      setCurrentQR(qr?.qrCode || null);
    } catch (err) {
      logger.error('Failed to load QR code', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    if (open) {
      void loadQRCode();
    }
  }, [open, loadQRCode]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg'],
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024, // 5MB
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        try {
          setIsUploading(true);
          setError(null);
          await onUpload(acceptedFiles[0]);
          await loadQRCode();
        } catch (err) {
          if (err instanceof QRServiceError) {
            setError(err.message);
          } else {
            setError('An unexpected error occurred. Please try again.');
          }
        } finally {
          setIsUploading(false);
        }
      }
    },
  });

  const handleDelete = async () => {
    try {
      setIsUploading(true);
      await deleteQRCode();
      setCurrentQR(null);
    } catch (err) {
      setError('Failed to delete QR code. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = () => {
    if (currentQR) {
      const link = document.createElement('a');
      link.href = currentQR;
      link.download = 'qr-code.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>QR Code Management</DialogTitle>
      <DialogContent>
        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : currentQR ? (
          <Card
            variant="outlined"
            sx={{
              mt: 2,
              borderRadius: 2,
              overflow: 'hidden',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  maxWidth: '300px',
                  mx: 'auto',
                  mb: 3,
                  '&::after': {
                    content: '""',
                    display: 'block',
                    paddingBottom: '100%',
                  },
                }}
              >
                <img
                  src={currentQR}
                  alt="QR Code"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    borderRadius: '8px',
                  }}
                />
              </Box>
              <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<DownloadIcon />}
                  onClick={handleDownload}
                  disabled={isUploading}
                  sx={{
                    minWidth: '120px',
                    bgcolor: 'primary.main',
                    '&:hover': {
                      bgcolor: 'primary.dark',
                    },
                  }}
                >
                  Download
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<TrashIcon />}
                  onClick={handleDelete}
                  disabled={isUploading}
                  sx={{
                    minWidth: '120px',
                    borderColor: 'error.main',
                    color: 'error.main',
                    '&:hover': {
                      borderColor: 'error.dark',
                      bgcolor: 'error.light',
                    },
                  }}
                >
                  Delete
                </Button>
              </Stack>
            </CardContent>
          </Card>
        ) : (
          <Box
            {...getRootProps()}
            sx={{
              border: '2px dashed',
              borderColor: isDragActive ? 'primary.main' : 'divider',
              borderRadius: 2,
              p: 4,
              textAlign: 'center',
              cursor: isUploading ? 'not-allowed' : 'pointer',
              bgcolor: isDragActive ? 'action.hover' : 'background.paper',
              opacity: isUploading ? 0.7 : 1,
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                bgcolor: isUploading ? 'background.paper' : 'action.hover',
                borderColor: isUploading ? 'divider' : 'primary.main',
              },
            }}
          >
            <input {...getInputProps()} disabled={isUploading} />
            {isUploading ? (
              <CircularProgress size={40} />
            ) : (
              <UploadIcon
                fontSize="var(--icon-fontSize-lg)"
                style={{
                  color: isDragActive ? 'var(--mui-palette-primary-main)' : 'var(--mui-palette-text-secondary)',
                  marginBottom: '16px',
                }}
              />
            )}
            <Typography variant="h6" sx={{ mb: 1 }}>
              {isUploading
                ? 'Uploading QR code...'
                : isDragActive
                  ? 'Drop the QR code here'
                  : 'Drag & drop QR code here'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Supported formats: PNG, JPG, JPEG (max 5MB)
            </Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          disabled={isUploading}
          sx={{
            minWidth: '100px',
            color: 'text.secondary',
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
