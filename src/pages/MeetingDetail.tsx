import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Stack,
  TextField,
  Divider,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Fab,
  DialogActions,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Menu
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ListIcon from '@mui/icons-material/List';
import { Snackbar, Alert } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';


interface MeetingDetail {
  id: number;
  title: string;
  location: string;
  date: string;
  my_appearance_image_path: string;
  event_names: string;
  partner_appearances: string;
  talked_topics: string;
  partner_good_points: string;
  todo_for_next: string;
}

const MeetingDetail = () => {
  const navigate = useNavigate();
  const { meetingId } = useParams<{ meetingId: string }>();
  const [meeting, setMeeting] = useState<MeetingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editData, setEditData] = useState<MeetingDetail | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  // ステートと関数を追加
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);
  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const handleLogout = () => {
    handleMenuClose();
    // ログアウト処理をここに追加
  };
  const handleUserSettings = () => {
    handleMenuClose();
    // ユーザー設定画面に遷移など
  };


  useEffect(() => {
    fetch(`http://localhost:8000/meetings/${meetingId}`)
      .then((res) => res.json())
      .then((data) => {
        setMeeting(data.meeting);
        setLoading(false);
      });
  }, [meetingId]);

  if (loading) return <CircularProgress />;

  if (!meeting) return <Typography>デート詳細が見つかりませんでした。</Typography>;

  return (
    <Box p={4}>
      {/* ヘッダー */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
        <Typography
          variant="h4"
          sx={{
            fontFamily: 'serif',
            cursor: 'pointer',
            flexBasis: '80%' // PartnerReminderの幅を画面幅の70%に設定
          }}
          onClick={() => navigate('/')}
        >
          PartnerReminder
        </Typography>
        <Stack direction="column" spacing={1} sx={{ flexBasis: '10%' }}>
          <IconButton onClick={handleMenuClick}>
            <SettingsIcon /><Typography>setting</Typography>
          </IconButton>
          <Menu anchorEl={anchorEl} open={menuOpen} onClose={handleMenuClose}>
            <MenuItem onClick={handleUserSettings}>ユーザー設定</MenuItem>
            <MenuItem onClick={handleLogout}>ログアウト</MenuItem>
          </Menu>
        </Stack>
      </Stack>


      {/* タイトル */}
      <Box my={2}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Divider sx={{ flex: 1 }} />
          <Typography variant="h6" noWrap>
            デート詳細
          </Typography>
          <Divider sx={{ flex: 1 }} />
        </Stack>
      </Box>

      {/* 詳細カード */}
      <Card variant="outlined">
        <CardContent>
          <Stack spacing={3}>
            <TextField label="タイトル" value={meeting.title} fullWidth InputProps={{ readOnly: true }} />
            <Stack direction="row" spacing={2}>
              <TextField label="場所" value={meeting.location} fullWidth InputProps={{ readOnly: true }} />
              <TextField label="日付" value={meeting.date} fullWidth InputProps={{ readOnly: true }} />
            </Stack>
            <TextField
              label="イベント"
              value={meeting.event_names.replace(/\\n/g, '\n')}
              multiline

              fullWidth

              InputProps={{ readOnly: true }}
            />
            <TextField
              label="話した話題"
              value={meeting.talked_topics.replace(/\\n/g, '\n')}
              multiline

              fullWidth
              InputProps={{ readOnly: true }}
            />
            <TextField
              label="彼女の服装"
              value={meeting.partner_appearances.replace(/\\n/g, '\n')}
              multiline

              fullWidth
              InputProps={{ readOnly: true }}
            />
            {meeting.my_appearance_image_path && (
              <Box component="img"
                src={`http://localhost:8000/${meeting.my_appearance_image_path}`}
                alt="自分の服装"
                sx={{ height: '150px', objectFit: 'cover', borderRadius: 2 }}
              />
            )}
            <TextField
              label="相手の良いところ"
              value={meeting.partner_good_points.replace(/\\n/g, '\n')}
              multiline

              fullWidth
              InputProps={{ readOnly: true }}
            />
            <TextField
              label="次回に向けて"
              value={meeting.todo_for_next.replace(/\\n/g, '\n')}
              multiline

              fullWidth
              InputProps={{ readOnly: true }}
            />
          </Stack>
        </CardContent>
      </Card>

      {/* ボタン */}
      <Fab
        color="primary"
        sx={{ position: 'fixed', bottom: 20, right: 20 }}
        onClick={() => navigate('/meetings')}
      >
        <ListIcon />
      </Fab>
      <Fab
        color="secondary"
        sx={{ position: 'fixed', bottom: 90, right: 20 }}
        onClick={() => {
          setEditData(meeting); // 現在の内容でフォーム初期化
          setOpenEditDialog(true);
        }}
      >
        <EditIcon />
      </Fab>

      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} fullWidth maxWidth="md">
        <DialogTitle>デート情報を編集</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2}>
            <TextField label="タイトル" value={editData?.title} onChange={(e) => setEditData({ ...editData!, title: e.target.value })} fullWidth />
            <Stack direction="row" spacing={2}>
              <TextField label="場所" value={editData?.location} onChange={(e) => setEditData({ ...editData!, location: e.target.value })} fullWidth />
              <TextField label="日付" value={editData?.date} onChange={(e) => setEditData({ ...editData!, date: e.target.value })} fullWidth />
            </Stack>
            {/* 以下も同様に */}
            <TextField label="イベント" value={editData?.event_names.replace(/\\n/g, '\n')} onChange={(e) => setEditData({ ...editData!, event_names: e.target.value })} fullWidth multiline />
            <TextField label="話した話題" value={editData?.talked_topics.replace(/\\n/g, '\n')} onChange={(e) => setEditData({ ...editData!, talked_topics: e.target.value })} fullWidth multiline />
            <TextField label="彼女の服装" value={editData?.partner_appearances.replace(/\\n/g, '\n')} onChange={(e) => setEditData({ ...editData!, partner_appearances: e.target.value })} fullWidth multiline />
            <TextField label="相手の良いところ" value={editData?.partner_good_points.replace(/\\n/g, '\n')} onChange={(e) => setEditData({ ...editData!, partner_good_points: e.target.value })} fullWidth multiline />
            <TextField label="次回に向けて" value={editData?.todo_for_next.replace(/\\n/g, '\n')} onChange={(e) => setEditData({ ...editData!, todo_for_next: e.target.value })} fullWidth multiline />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>キャンセル</Button>
          <Button
            variant="contained"
            onClick={() => {
              fetch(`http://localhost:8000/meetings/${meetingId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editData)
              })
                .then((res) => res.json())
                .then((data) => {
                  setOpenEditDialog(false);
                  setSnackbarOpen(true);    // スナックバーを表示
                });

            }}
          >
            保存
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: '100%' }}>
          更新できました
        </Alert>
      </Snackbar>


    </Box>
  );
};

export default MeetingDetail;
