import { Snackbar, Alert } from '@mui/material';

interface SnackbarProps {
  open: boolean;
  onClose: () => void;
  message: string;
  severity?: 'success' | 'info' | 'warning' | 'error';
}

const SnackbarNotification: React.FC<SnackbarProps> = ({ open, onClose, message,severity = 'info' }) => (
  <Snackbar open={open} autoHideDuration={4000} onClose={onClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
    <Alert onClose={onClose} variant="filled" severity={severity} sx={{ width: '100%', fontSize: '1.1rem', padding: '12px 40px' }}>
      {message}
    </Alert>
  </Snackbar>
);

export default SnackbarNotification;
