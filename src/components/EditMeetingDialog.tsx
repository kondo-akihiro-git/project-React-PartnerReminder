import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Stack, Button, Box, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import CloseIcon from '@mui/icons-material/Close';


interface DialogProps {
  open: boolean;
  onClose: () => void;
  editData: any;
  setEditData: React.Dispatch<React.SetStateAction<any>>;
  onSave: () => void;
}
// ベースURLを環境変数から取得。なければlocalhostを使う
const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

const EditMeetingDialog: React.FC<DialogProps> = ({ open, onClose, editData, setEditData, onSave }) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" scroll="body">
      <DialogTitle>デート情報を編集</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2}>
          <TextField
            label="タイトル"
            value={editData?.title}
            onChange={(e) => setEditData({ ...editData, title: e.target.value })}
            fullWidth
          />
          <Stack direction="row" spacing={2}>
            <TextField
              label="場所"
              value={editData?.location}
              onChange={(e) => setEditData({ ...editData, location: e.target.value })}
              fullWidth
            />
            {/* <TextField
              label="日付"
              value={editData?.date}
              onChange={(e) => setEditData({ ...editData, date: e.target.value })}
              fullWidth
            /> */}
<LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="zh-cn">
  <DatePicker
    label="日付"
    format="MM/DD"
    value={editData?.date ? dayjs(editData.date) : null}
    onChange={(newValue) => {
      const formatted = newValue ? newValue.format('YYYY-MM-DD') : '';
      setEditData({ ...editData, date: formatted });
    }}
    slotProps={{
      textField: {
        required: true,
        fullWidth: true,
      },
    }}
  />
</LocalizationProvider>

          </Stack>
          <TextField
            label="イベント"
            value={editData?.event_names}
            onChange={(e) => setEditData({ ...editData, event_names: e.target.value })}
            fullWidth
            multiline
          />
          <TextField
            label="話した話題"
            value={editData?.talked_topics}
            onChange={(e) => setEditData({ ...editData, talked_topics: e.target.value })}
            fullWidth
            multiline
          />
          <TextField
            label="彼女の服装"
            value={editData?.partner_appearances}
            onChange={(e) => setEditData({ ...editData, partner_appearances: e.target.value })}
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
              marginTop: '0 !important',
            }}
          >
            <Box
              component="img"
              src={
                editData?.my_appearance_image_path
                  ? `${editData.my_appearance_image_path}`
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

          <Stack direction="row">
            <Box sx={{ flex: 5 }}>
              <Button variant="outlined" component="label" color='inherit' fullWidth>
                服装のアップロード
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const token = sessionStorage.getItem("access_token");
                      const formData = new FormData();
                      formData.append('file', file);
                      fetch(`${BASE_URL}/upload-image`, {
                        method: 'POST',
                        body: formData,
                        headers: {
        Authorization: `Bearer ${token}`,
      },
                      })
                        .then((res) => res.json())
                        .then((data) => {
                          setEditData({ ...editData, my_appearance_image_path: data.url });
                        });
                    }
                  }}
                />
              </Button>
            </Box>
            <Box sx={{ flex: 1, ml: 1 }}>
              <Button
                variant="outlined"
                color="inherit"
                onClick={() => setEditData({ ...editData, my_appearance_image_path: '' })}
                fullWidth
              >
                <CloseIcon/>
              </Button>
            </Box>
          </Stack>


          <TextField
            label="相手の良いところ"
            value={editData?.partner_good_points}
            onChange={(e) => setEditData({ ...editData, partner_good_points: e.target.value })}
            fullWidth
            multiline
          />
          <TextField
            label="次回に向けて"
            value={editData?.todo_for_next}
            onChange={(e) => setEditData({ ...editData, todo_for_next: e.target.value })}
            fullWidth
            multiline
          />

          <Typography variant="caption">デートの写真</Typography>
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
              marginTop: '0 !important',
            }}
          >
            <Box
              component="img"
              src={
                editData?.meeting_photo
                  ? `${editData.meeting_photo}`
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

          <Stack direction="row">
            <Box sx={{ flex: 5 }}>

              <Button variant="outlined" component="label" color='inherit' fullWidth>
                デート写真のアップロード
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const token = sessionStorage.getItem("access_token");
                      const formData = new FormData();
                      formData.append('file', file);
                      fetch(`${BASE_URL}/upload-image`, {
                        method: 'POST',
                        body: formData,
                        headers: {
        Authorization: `Bearer ${token}`,
      },
                      })
                        .then((res) => res.json())
                        .then((data) => {
                          setEditData({ ...editData, meeting_photo: data.url });
                        });
                    }
                  }}
                />
              </Button>

            </Box>
            <Box sx={{ flex: 1, ml: 1 }}>

              <Button
                variant="outlined"
                color="inherit"
                onClick={() => setEditData({ ...editData, meeting_photo: '' })}
                fullWidth
              >
                <CloseIcon/>
              </Button>

            </Box>
          </Stack>


        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 4, py: 3, justifyContent: 'flex-end', gap: 2 }}>
        <Button onClick={onClose} color="inherit" variant="text" size="large" sx={{ py: 1.2 }}>
          キャンセル
        </Button>
        <Button variant="contained" color="inherit" size="large" onClick={onSave} sx={{ py: 1.2 }}>
          更新
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditMeetingDialog;
