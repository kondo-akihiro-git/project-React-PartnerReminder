import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Stack,
    Button,
    Box,
    Typography,
  } from '@mui/material';
  import { useState } from 'react';

  
  interface AddDialogProps {
    open: boolean;
    onClose: () => void;
    onSaveSuccess: () => void;
  }


  // ベースURLを環境変数から取得。なければlocalhostを使う
const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';
  
  const AddDialog: React.FC<AddDialogProps> = ({ open, onClose,onSaveSuccess }) => {
    const [formData, setFormData] = useState<any>({
      title: '',
      location: '',
      date: '',
      event_names: '',
      talked_topics: '',
      partner_appearances: '',
      my_appearance_image_path: '',
      meeting_photo: '',
      partner_good_points: '',
      todo_for_next: '',
    });
  
    const handleSave = async () => {
      if (!formData.title || !formData.location || !formData.date) {
        alert('タイトル、場所、日付は必須です');
        return;
      }
  
      const res = await fetch(`${BASE_URL}/meetings`, {
        method: 'POST',
        credentials: "include",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
  
      if (res.ok) {
        onClose();
        onSaveSuccess();
      } else {
        const err = await res.json();
        console.error(err);
        alert('保存に失敗しました');
      }
    };
  
    const handleMyImageUpload = async (file: File) => {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch(`${BASE_URL}/upload-image`, {
        method: 'POST',
        body: fd,
      });
      const data = await res.json();
      setFormData((prev: any) => ({
        ...prev,
        my_appearance_image_path: data.url,
      }));
    };

    const handleBackImageUpload = async (file: File) => {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch(`${BASE_URL}/upload-image`, {
        method: 'POST',
        body: fd,
      });
      const data = await res.json();
      setFormData((prev: any) => ({
        ...prev,
        meeting_photo: data.url,
      }));
    };
  
    return (
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" scroll="body">
        <DialogTitle>新規デートを追加</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2}>
            <TextField
              label="タイトル"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              fullWidth
            />
            <Stack direction="row" spacing={2}>
              <TextField
                label="場所"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                fullWidth
              />
              <TextField
                label="日付"
                required
                type="date"
                InputLabelProps={{ shrink: true }}
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                fullWidth
              />
            </Stack>
            <TextField
              label="イベント"
              value={formData.event_names}
              onChange={(e) => setFormData({ ...formData, event_names: e.target.value })}
              fullWidth
              multiline
            />
            <TextField
              label="話した話題"
              value={formData.talked_topics}
              onChange={(e) => setFormData({ ...formData, talked_topics: e.target.value })}
              fullWidth
              multiline
            />
            <TextField
              label="彼女の服装"
              value={formData.partner_appearances}
              onChange={(e) => setFormData({ ...formData, partner_appearances: e.target.value })}
              fullWidth
              multiline
            />
            <Typography variant="caption">自分の服装</Typography>
            <Box
              sx={{
                width: '100%',
                height: 300,
                overflow: 'hidden',
                border: '1px solid #ccc',
                borderRadius: 2,
                padding: 1,
                backgroundColor: '#fafafa',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Box
                component="img"
                src={
                  formData.my_appearance_image_path
                    ? `${formData.my_appearance_image_path}`
                    : `${BASE_URL}/files/no_image/no_image.jpg`
                }
                alt="自分の服装"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = `${BASE_URL}/files/no_image/no_image.jpg`;
                }}
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: 2,
                }}
              />
            </Box>
            <Button variant="outlined" component="label" color="inherit">
              自分の服装の画像をアップロード
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleMyImageUpload(file);
                  }
                }}
              />
            </Button>
            <TextField
              label="相手の良いところ"
              value={formData.partner_good_points}
              onChange={(e) => setFormData({ ...formData, partner_good_points: e.target.value })}
              fullWidth
              multiline
            />
            <TextField
              label="次回に向けて"
              value={formData.todo_for_next}
              onChange={(e) => setFormData({ ...formData, todo_for_next: e.target.value })}
              fullWidth
              multiline
            />

            <Typography variant="caption">デート写真</Typography>
            <Box
              sx={{
                width: '100%',
                height: 300,
                overflow: 'hidden',
                border: '1px solid #ccc',
                borderRadius: 2,
                padding: 1,
                backgroundColor: '#fafafa',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Box
                component="img"
                src={
                  formData.meeting_photo
                    ? `${formData.meeting_photo}`
                    : `${BASE_URL}/files/no_image/no_image.jpg`
                }
                alt="デート写真"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = `${BASE_URL}/files/no_image/no_image.jpg`;
                }}
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: 2,
                }}
              />
            </Box>
            <Button variant="outlined" component="label" color="inherit">
              デート写真をアップロード
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleBackImageUpload(file);
                  }
                }}
              />
            </Button>

          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 4, py: 3, justifyContent: 'flex-end', gap: 2 }}>
          <Button onClick={onClose} color="inherit" variant="text" size="large" sx={{ minWidth: 160, py: 1.2 }}>
            キャンセル
          </Button>
          <Button
            variant="contained"
            color="inherit"
            size="large"
            onClick={handleSave}
            sx={{ minWidth: 160, py: 1.2 }}
          >
            追加
          </Button>
        </DialogActions>
      </Dialog>
    );
  };
  
  export default AddDialog;