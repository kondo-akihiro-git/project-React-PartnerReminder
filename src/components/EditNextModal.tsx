// src/components/EditNextModal.tsx
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from '@mui/material';
import { useEffect, useState } from 'react';

interface EditNextModalProps {
  open: boolean;
  onClose: () => void;
  initialDate: string | null;   
  onUpdated: (success: boolean) => void;
  currentDate: string;
}

// ベースURLを環境変数から取得。なければlocalhostを使う
const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

const EditNextModal = ({ open, onClose, initialDate,onUpdated, currentDate }: EditNextModalProps) => {
  const [newDate, setNewDate] = useState(initialDate);

  // 日付を "YYYY-MM-DD" 形式で表示するための変換
  const toInputDateFormat = (dateStr: string): string => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    // YYYY-MM-DD の形に整形
    return d.toISOString().slice(0, 10);
  };

    // open が変わるたびに初期値をセットし直す
  useEffect(() => {
    if (open) {
      setNewDate(initialDate);
    }
  }, [open, initialDate]);

  const handleSubmit = async () => {
    try {
      const res = await fetch(`${BASE_URL}/next`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: newDate }),
      });

      if (!res.ok) throw new Error('更新に失敗しました');

      onUpdated(true);
      onClose();
    } catch (error) {
      console.error('次回日付の更新エラー', error);
      onUpdated(false);
    }
  };

  return (
<Dialog
  open={open}
  onClose={onClose}
  sx={{
    '& .MuiDialog-paper': {
      width: {
        xs: '90%',  // スマホなどの小さい画面
        sm: '80%',
        md: '60%',
        lg: '50%',
        xl: '40%',  // すごく大きい画面では少しだけに
      },
      maxWidth: 'none',
    },
  }}
>
      <DialogTitle>次回デート日を更新</DialogTitle>
      <DialogContent>
        <TextField
          type="date"
          fullWidth
          value={newDate}
          onChange={(e) => setNewDate(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color='inherit'>キャンセル</Button>
        <Button onClick={handleSubmit} variant="contained"color='inherit'>保存</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditNextModal;
