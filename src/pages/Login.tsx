import React, { useState } from 'react';
import { TextField, Button, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        const res = await fetch('http://localhost:8000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        if (res.ok) {
            const data = await res.json();
            localStorage.setItem('user_id', data.user_id);
            navigate('/meetings');
        } else {
            alert('ログイン失敗');
        }
    };

    return (
        <Container maxWidth="sm">
            <Typography variant="h4" gutterBottom>ログイン</Typography>
            <TextField label="メール" fullWidth margin="normal" value={email} onChange={e => setEmail(e.target.value)} />
            <TextField label="パスワード" type="password" fullWidth margin="normal" value={password} onChange={e => setPassword(e.target.value)} />
            <Button variant="contained" fullWidth onClick={handleLogin}>ログイン</Button>
        </Container>
    );
};

export default Login;
