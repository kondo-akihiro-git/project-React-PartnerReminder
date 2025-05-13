import { Box, Stack, Button, Typography, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Top = () => {
  const navigate = useNavigate();

  return (
    <Container sx={{ py: 6 }}>
      <Box sx={{ height: '20vh' }} />
      <Box
        sx={{
          height: '40vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Typography
          variant="h1"
          sx={{
            fontSize: 'min(10vw, 30vh)',
            fontFamily: 'serif',
            mb: 4,
          }}
        >
          Partner Reminder
        </Typography>
      </Box>
      <Box
        sx={{
          height: '40vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Button
          variant="contained"
          color="primary"
          size="large"
          sx={{ minWidth: '20vw' }}
          onClick={() => navigate('/meetings')}
        >
          デート一覧を見る
        </Button>
      </Box>
    </Container>
  );
};

export default Top;
