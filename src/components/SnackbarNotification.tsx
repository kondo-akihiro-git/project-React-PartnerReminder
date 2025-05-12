import { Snackbar, Alert } from '@mui/material';

interface SnackbarProps {
  open: boolean;
  onClose: () => void;
}

const SnackbarNotification: React.FC<SnackbarProps> = ({ open, onClose }) => (
  <Snackbar open={open} autoHideDuration={3000} onClose={onClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
    <Alert onClose={onClose} severity="success" sx={{ width: '100%' }}>
      更新できました
    </Alert>
  </Snackbar>
);

export default SnackbarNotification;
