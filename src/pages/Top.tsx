import { Box, Stack, Button, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { JSX, useEffect, useState } from 'react';

const Top = () => {
  const navigate = useNavigate();
  const [hearts, setHearts] = useState<JSX.Element[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const id = Math.random().toString(36).substr(2, 9);
      const left = Math.random() * 100;
      const size = 20 + Math.random() * 20;
      const duration = 5 + Math.random() * 5;

      const heart = (
        <Box
          key={id}
          sx={{
            position: 'absolute',
            top: 0,
            left: `${left}vw`,
            width: `${size}px`,
            height: `${size}px`,
            backgroundImage: `url(${process.env.PUBLIC_URL}/images/heart.png)`, // ハート画像を用意しておく
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            animation: `fall ${duration}s linear`,
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />
      );
      setHearts(prev => [...prev, heart]);

      // 一定時間後に削除
      setTimeout(() => {
        setHearts(prev => prev.filter(h => h.key !== id));
      }, duration * 1000);
    }, 50); // 0.3秒ごとに新しいハート追加

    return () => clearInterval(interval);
  }, []);

  return (
    <Container
      disableGutters
      maxWidth={false}
      sx={{
        height: '100vh',
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: '#fff',
      }}
    >
      {/* ハートの雨背景（最背面） */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      >
        {hearts}
      </Box>

      {/* コンテンツ本体（前面） */}
      <Box
        sx={{
          position: 'relative',
          height: '100%',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          px: 2,
        }}
      >
        <Box sx={{ flex: 1 }} />

        <Box
          sx={{
            
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <img
            src={`${process.env.PUBLIC_URL}/images/pr_title.png`}
            alt="PartnerReminder"
            style={{ width: '90vw', height: 'auto', objectFit: 'contain' }}
          />
        </Box>

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
              onClick={() => navigate('/login')}
            >
              ログイン
            </Button>
            <Button
              variant="outlined"
              color="inherit"
              size="large"
              sx={{ minWidth: '30vw', height: '8vh' }}
              onClick={() => navigate('/register')}
            >
              新規登録
            </Button>
          </Stack>
        </Box>

        <Box sx={{ flex: 1 }} />
      </Box>

      {/* アニメーション定義 */}
      <style>
        {`
          @keyframes fall {
            0% {
              transform: translateY(-10vh);
              opacity: 1;
            }
            100% {
              transform: translateY(110vh);
              opacity: 0;
            }
          }
        `}
      </style>
    </Container>
  );
};

export default Top;
