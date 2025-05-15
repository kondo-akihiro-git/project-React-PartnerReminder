import React, { useState, useEffect } from "react";
import {
  Box, Button, TextField, Typography
} from "@mui/material";
import axios from "axios";
import SnackbarNotification from "../components/SnackbarNotification";
import LoadingIndicator from "../components/LoadingIndicator";
import { useNavigate } from "react-router-dom";

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
      setRedirectToLogin(true); // スナックバー閉じた後にローディング画面 → 遷移へ
    } catch {
      setSnackbar({ open: true, message: "登録に失敗しました", severity: "error" });
    }
  };

  // スナックバーが閉じられた後にローディング表示
  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });

    if (redirectToLogin) {
      setShowLoading(true);
    }
  };

  // ローディング画面を3秒表示した後にログインへ遷移
  useEffect(() => {
    if (showLoading) {
      const timer = setTimeout(() => {
        navigate("/login");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showLoading, navigate]);

return showLoading ? (
  <LoadingIndicator />
) : (
  <Box p={4} maxWidth={400} mx="auto">
    <Typography variant="h5" mb={2}>ユーザー登録</Typography>

    {step === "input" ? (
      <>
        <TextField fullWidth margin="normal" label="名前" name="name" value={form.name} onChange={handleChange} />
        <TextField fullWidth margin="normal" label="電話番号" name="phone" value={form.phone} onChange={handleChange} />
        <TextField fullWidth margin="normal" label="メールアドレス" name="email" value={form.email} onChange={handleChange} />
        <TextField fullWidth margin="normal" label="パスワード" type="password" name="password" value={form.password} onChange={handleChange} />
        <Button variant="contained" fullWidth onClick={sendVerificationEmail}>
          認証コードを送信
        </Button>
      </>
    ) : (
      <>
        <TextField fullWidth margin="normal" label="認証コード" name="code" value={form.code} onChange={handleChange} />
        <Button variant="contained" fullWidth onClick={handleRegister}>
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
  </Box>
);

};

export default Register;
