import React, { useState, useEffect } from "react";
import {
  Box, Button, TextField, Typography, Card, CardContent, Stack,
  ButtonBase
} from "@mui/material";
import axios from "axios";
import SnackbarNotification from "../components/SnackbarNotification";
import LoadingIndicator from "../components/LoadingIndicator";
import { useNavigate } from "react-router-dom";

const UserSetting: React.FC = () => {
  const navigate = useNavigate();

const [userId, setUserId] = useState<string | null>(null); // ← ここを修正

  const [form, setForm] = useState({
    name: "",
    password: "",
  });

  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [showLoading, setShowLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const fetchUserData = async (uid: number) => {
    try {
      const res = await axios.get(`http://localhost:8000/users/${uid}`);
      setForm({
        name: res.data.user.name || "",
        password: "",
      });
    } catch {
      setSnackbar({ open: true, message: "ユーザー情報の取得に失敗しました", severity: "error" });
    }
  };

  useEffect(() => {
    const userId = localStorage.getItem("user_token");
    if (userId) {
      setUserId(userId);
    } else {
      navigate("/login"); // user_idがない場合ログイン画面へ
    }
  }, []);

  useEffect(() => {
    if (userId !== null) {
      fetchUserData(Number(userId));
    }
  }, [userId]);

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
        position: 'relative',
        height: '100vh',
        overflow: 'hidden',
        backgroundColor: '#f5f5f5',
      }}
    >
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100%"
        position="relative"
        zIndex={1}
      >
        <Box flexDirection="column" width="80vw" maxWidth={480}>
          <Stack alignItems="center" mb={2}>
            <ButtonBase onClick={() => navigate('/')}>
              <img
                src={`${process.env.PUBLIC_URL}/images/pr_title.png`}
                alt="PartnerReminder"
                style={{ width: '50vw', maxWidth: 240, height: 'auto', objectFit: 'contain' }}
              />
            </ButtonBase>
          </Stack>

          <Card sx={{ p: 2, borderRadius: 3 }}>
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
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
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
                <Button variant="text" onClick={() => navigate('/meetings')}>
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
    </Box>
  );
};

export default UserSetting;
