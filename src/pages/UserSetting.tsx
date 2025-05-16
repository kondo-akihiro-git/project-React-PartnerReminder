import React, { useState, useEffect, JSX } from "react";
import {
  Box, Button, TextField, Typography, Card, CardContent, Stack,
  ButtonBase,
  InputAdornment,
  IconButton,
} from "@mui/material";
import axios from "axios";
import SnackbarNotification from "../components/SnackbarNotification";
import LoadingIndicator from "../components/LoadingIndicator";
import { useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const UserSetting: React.FC = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", password: "" });
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [showLoading, setShowLoading] = useState(false);
  const [hearts, setHearts] = useState<JSX.Element[]>([]);
const [showPassword, setShowPassword] = useState(false);

const handleClickShowPassword = () => {
  setShowPassword((prev) => !prev);
};

const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
  event.preventDefault();
};

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const fetchCurrentUser = async () => {
    try {
      const res = await axios.get("http://localhost:8000/me", { withCredentials: true });
      setUserId(res.data.user.id);
      setForm({
        name: res.data.user.name || "",
        password: "",
      });
    } catch {
      navigate("/login");
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

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
      setHearts((prev) => [...prev, heart]);

      setTimeout(() => {
        setHearts((prev) => prev.filter((h) => h.key !== id));
      }, duration * 1000);
    }, 150);

    return () => clearInterval(interval);
  }, []);

  const handleUpdate = async () => {
    if (userId === null) return;
    setShowLoading(true);
    try {
      await axios.put(`http://localhost:8000/users/${userId}`, {
        name: form.name,
        password: form.password,
      });
      setSnackbar({ open: true, message: "ユーザー情報を更新しました", severity: "success" });
    } catch {
      setSnackbar({ open: true, message: "ユーザー情報の更新に失敗しました", severity: "error" });
    }
    setShowLoading(false);
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return showLoading ? (
    <LoadingIndicator />
  ) : (
    <Box
      sx={{
        position: "relative",
        height: "100vh",
        overflow: "hidden",
        backgroundColor: "#f5f5f5",
      }}
    >
      {/* ハートの雨（背景） */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 0,
          pointerEvents: "none",
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
            <ButtonBase onClick={() => navigate("/")}>
              <img
                src={`${process.env.PUBLIC_URL}/images/pr_title.png`}
                alt="PartnerReminder"
                style={{ width: "50vw", height: "auto", objectFit: "contain" }}
              />
            </ButtonBase>
          </Stack>
          <Stack my={2}></Stack>

          <Card sx={{ width: "80vw", p: 2, borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom textAlign="center">
                ユーザー設定
              </Typography>

              <TextField
                fullWidth
                margin="normal"
                label="名前"
                name="name"
                value={form.name}
                onChange={handleChange}
              />

<TextField
  fullWidth
  margin="normal"
  label="パスワード"
  name="password"
  type={showPassword ? 'text' : 'password'}
  value={form.password}
  onChange={handleChange}
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

              <Button
                variant="contained"
                color="inherit"
                fullWidth
                sx={{ mt: 2 }}
                onClick={handleUpdate}
                disabled={!form.name || !form.password}
              >
                更新する
              </Button>

              <Box display="flex" justifyContent="flex-end" mt={2}>
                <Button variant="text" onClick={() => navigate("/meetings")}>
                  デート一覧へ戻る
                </Button>
              </Box>

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

export default UserSetting;
