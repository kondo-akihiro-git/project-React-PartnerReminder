import React, { useState, useEffect, JSX } from "react";
import {
  Box, Button, TextField, Typography, Card, CardContent, Stack,
  ButtonBase,
  InputAdornment,
  IconButton
} from "@mui/material";
import axios from "axios";
import SnackbarNotification from "../../components/SnackbarNotification";
import LoadingIndicator from "../../components/LoadingIndicator";
import { useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const Register: React.FC = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    code: ""
  });

  const [step, setStep] = useState<"input" | "verify">("input");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [showLoading, setShowLoading] = useState(false);
  const [redirectToLogin, setRedirectToLogin] = useState(false);
const [showPassword, setShowPassword] = useState(false);

const isPasswordValid = (password: string) => {
  return (
    password.length > 0 &&
    /^[\x20-\x7E]*$/.test(password) && // 半角英数字記号のみ
    !/\s/.test(password) // スペース禁止
  );
};

const isPhoneValid = (phone: string) => {
  return /^[0-9]+$/.test(phone); // 数字のみ
};

const isFormValid = () => {
  return form.name && isPhoneValid(form.phone) && form.email && isPasswordValid(form.password);
};

const isCodeValid = () => {
  return form.code.length > 0;
};


const handleClickShowPassword = () => {
  setShowPassword((prev) => !prev);
};

const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
  event.preventDefault();
};


  // ハートの雨用
  const [hearts, setHearts] = useState<JSX.Element[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const sendVerificationEmail = async () => {
    try {
      await axios.post("http://localhost:8000/send_verification_code", { email: form.email });
      setForm(prev => ({ ...prev, code: "" }));
      setStep("verify");
      setSnackbar({ open: true, message: "認証コードを送信しました", severity: "success" });
    } catch {
      setSnackbar({ open: true, message: "認証コードの送信に失敗しました", severity: "error" });
    }
  };

  const handleRegister = async () => {
    try {
      await axios.post("http://localhost:8000/register", form);
      setSnackbar({ open: true, message: "登録に成功しました", severity: "success" });
      setRedirectToLogin(true);
    } catch {
      setSnackbar({ open: true, message: "登録に失敗しました", severity: "error" });
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
    if (redirectToLogin) {
      setShowLoading(true);
    }
  };

  useEffect(() => {
    if (showLoading) {
      const timer = setTimeout(() => {
        navigate("/login");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showLoading, navigate]);

  // ハートの雨エフェクト
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
            position: "absolute",
            top: 0,
            left: `${left}vw`,
            width: `${size}px`,
            height: `${size}px`,
            backgroundImage: `url(${process.env.PUBLIC_URL}/images/heart.png)`,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            animation: `fall ${duration}s linear`,
            pointerEvents: "none",
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

  return showLoading ? (
    <LoadingIndicator />
  ) : (
    <Box
      sx={{
        position: 'relative',
        height: '100vh',
        overflow: 'hidden',
        backgroundColor: '#f5f5f5',
      }}
    >
      {/* ハートの雨 */}
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

      {/* メインコンテンツ */}
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
                ユーザー登録
              </Typography>

              {step === "input" ? (
                <>
                  <TextField fullWidth margin="normal" label="名前" name="name" value={form.name} onChange={handleChange} />
                  <TextField fullWidth margin="normal" label="電話番号" name="phone" value={form.phone} onChange={handleChange} />
                  <TextField fullWidth margin="normal" label="メールアドレス" name="email" value={form.email} onChange={handleChange} />
<TextField
  fullWidth
  margin="normal"
  label="パスワード"
  name="password"
  type={showPassword ? 'text' : 'password'}
value={form.password} onChange={handleChange}

  error={!isPasswordValid(form.password) && form.password.length > 0}
  helperText={
    !isPasswordValid(form.password) && form.password.length > 0
      ? "半角英数字・記号のみ。スペース・全角不可。"
      : ""
  }

  InputProps={{
    endAdornment: (
      <InputAdornment position="end">
        <IconButton
          onClick={handleClickShowPassword}
          onMouseDown={handleMouseDownPassword}
          edge="end"
        >
          {showPassword ? <VisibilityOff /> : <Visibility />}
        </IconButton>
      </InputAdornment>
    ),
  }}
/>

                  <Button variant="contained" color="inherit" fullWidth sx={{ mt: 2 }} onClick={sendVerificationEmail}disabled={!isFormValid()}>
                    認証コードを送信
                  </Button>
                  <Box display="flex" justifyContent="flex-end" mt={2}>
                    <Button variant="text" onClick={() => navigate('/login')}>
                      ログインはこちら
                    </Button>
                  </Box>

                </>
              ) : (
                <>
                  <TextField fullWidth margin="normal" label="認証コード" name="code" value={form.code} onChange={handleChange} />
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{ mt: 2 }}
                    color="inherit" // ← Loginと統一
                    onClick={handleRegister}
                    disabled={!isCodeValid()}
                  >
                    登録
                  </Button>


                </>
              )}

              <SnackbarNotification
                open={snackbar.open}
                message={snackbar.message}
                severity={snackbar.severity as any}
                onClose={handleSnackbarClose}
              />
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

export default Register;
