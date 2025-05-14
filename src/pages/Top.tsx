import { Box, Stack, Button, Typography, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Top = () => {
  const navigate = useNavigate();

  return (
    <Container
      disableGutters
      maxWidth={false}
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        px: 2,
      }}
    >
      {/* ロゴスペース（上部マージン） */}
      <Box sx={{ flex: 1 }} />

      {/* タイトル */}
      <Box
        sx={{
          height: '15vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <img
          src={`${process.env.PUBLIC_URL}/images/pr_title.png`}
          alt="PartnerReminder"
          width="90vw"
        />
      </Box>

      {/* ボタンエリア */}
      <Box
        sx={{
          height: '10vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          mt: 4,
        }}
      >
        <Stack direction="row" spacing={5}>
          <Button
            variant="outlined"
            color="inherit"
            size="large"
            sx={{ minWidth: '30vw', height: '8vh' }}
            onClick={() => navigate('/meetings')}
          >
            ログイン
          </Button>
          <Button
            variant="outlined"
            color="inherit"
            size="large"
            sx={{ minWidth: '30vw', height: '8vh' }}
            onClick={() => navigate('/meetings')}
          >
            新規登録
          </Button>
        </Stack>
      </Box>

      {/* フッター的スペース */}
      <Box sx={{ flex: 1 }} />
    </Container>
  );
};

export default Top;
