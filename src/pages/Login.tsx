import React, { JSX, useEffect, useState } from 'react';
import {
  Card, CardContent, Typography, TextField, Button, Box, Stack,
  ButtonBase,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { encryptUserId } from '../utils/crypto';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hearts, setHearts] = useState<JSX.Element[]>([]);
  const navigate = useNavigate();

const handleLogin = async () => {
  const res = await fetch('http://localhost:8000/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (res.ok) {
    const data = await res.json();
    const encryptedId = encryptUserId(data.user_id);
    localStorage.removeItem('user_token')
    localStorage.setItem('user_token', encryptedId);
    navigate('/meetings');
  } else {
    alert('ログイン失敗');
  }
};

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
            backgroundImage: `url(${process.env.PUBLIC_URL}/images/heart.png)`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            animation: `fall ${duration}s linear`,
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />
      );
      setHearts(prev => [...prev, heart]);

      setTimeout(() => {
        setHearts(prev => prev.filter(h => h.key !== id));
      }, duration * 1000);
    }, 150);

    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      sx={{
        position: 'relative',
        height: '100vh',
        overflow: 'hidden',
        backgroundColor: '#f5f5f5',
      }}
    >
      {/* ハートの雨（背景） */}
      <Box
        sx={{
          position: 'absolute',
          top: 0, left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      >
        {hearts}
      </Box>

      {/* メインコンテンツ（前面） */}
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100%"
        position="relative"
        zIndex={1}
      >
        <Box flexDirection="column">
          <Stack alignItems="center">
            <ButtonBase onClick={() => navigate('/')}>
              <img
                src={`${process.env.PUBLIC_URL}/images/pr_title.png`}
                alt="PartnerReminder"
                style={{ width: '50vw', height: 'auto', objectFit: 'contain' }}
              />
            </ButtonBase>
          </Stack>
          <Stack my={2}></Stack>
          <Card sx={{ width: "80vw", p: 2, borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom textAlign="center">
                ログイン
              </Typography>
              <TextField
                label="メールアドレス"
                fullWidth
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                label="パスワード"
                type="password"
                fullWidth
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                variant="contained"
                fullWidth
                sx={{ mt: 2 }}
                color='inherit'
                onClick={handleLogin}
              >
                ログイン
              </Button>
              <Box display="flex" justifyContent="flex-end" mt={2}>
                <Button variant="text" onClick={() => navigate('/register')}>
                  新規登録はこちら
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
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
    </Box>
  );
};

export default Login;
