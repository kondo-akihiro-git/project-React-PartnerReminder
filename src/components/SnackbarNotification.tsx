import { Snackbar, Alert } from '@mui/material';

interface SnackbarProps {
  open: boolean;
  onClose: () => void;
  message: string;
}

const SnackbarNotification: React.FC<SnackbarProps> = ({ open, onClose, message }) => (
  <Snackbar open={open} autoHideDuration={5000} onClose={onClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
    <Alert onClose={onClose} severity="info" sx={{ width: '100%' }}>
      {message}
    </Alert>
  </Snackbar>
);

export default SnackbarNotification;
