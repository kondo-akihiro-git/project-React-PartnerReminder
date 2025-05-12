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
  Menu,
  ButtonBase
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
        <ButtonBase onClick={() => navigate('/')}>
          <Typography
            variant="h4"
            sx={{
              fontFamily: 'serif',
            }}
          >
            PartnerReminder
          </Typography>
        </ButtonBase>

        <Stack direction="column" spacing={1} sx={{ flexBasis: '30%' }} alignItems="flex-end">
          <Button
            onClick={handleMenuClick}
            sx={{
              minWidth: 120,
              maxWidth: 200,
              textTransform: 'none'
            }}
            color='inherit'
          >
            <SettingsIcon sx={{ mr: 0.5 }} />
            ユーザー設定
          </Button>
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
            {/* タイトル */}
            <Box onDoubleClick={() => {
              setEditData(meeting);
              setOpenEditDialog(true);
            }}>
              <TextField
                label="タイトル"
                value={meeting.title}
                fullWidth
                InputProps={{
                  readOnly: true,
                  sx: { pointerEvents: 'none', cursor: 'default' }
                }}
              />
            </Box>

            <Stack direction="row" spacing={2}>
              <Box onDoubleClick={() => {
                setEditData(meeting);
                setOpenEditDialog(true);
              }} sx={{ flex: 1 }}>
                <TextField label="場所" value={meeting.location} fullWidth InputProps={{
                  readOnly: true,
                  sx: { pointerEvents: 'none', cursor: 'default' }
                }} />
              </Box>
              <Box onDoubleClick={() => {
                setEditData(meeting);
                setOpenEditDialog(true);
              }} sx={{ flex: 1 }}>
                <TextField label="日付" value={meeting.date} fullWidth InputProps={{
                  readOnly: true,
                  sx: { pointerEvents: 'none', cursor: 'default' }
                }} />
              </Box>
            </Stack>

            <Box onDoubleClick={() => {
              setEditData(meeting);
              setOpenEditDialog(true);
            }}>
              <TextField
                label="イベント"
                value={meeting.event_names.replace(/\\n/g, '\n')}
                multiline
                fullWidth
                InputProps={{
                  readOnly: true,
                  sx: { pointerEvents: 'none', cursor: 'default' }
                }}
              />
            </Box>

            <Box onDoubleClick={() => {
              setEditData(meeting);
              setOpenEditDialog(true);
            }}>
              <TextField
                label="話した話題"
                value={meeting.talked_topics.replace(/\\n/g, '\n')}
                multiline
                fullWidth
                InputProps={{
                  readOnly: true,
                  sx: { pointerEvents: 'none', cursor: 'default' }
                }}
              />
            </Box>

            <Box onDoubleClick={() => {
              setEditData(meeting);
              setOpenEditDialog(true);
            }}>
              <TextField
                label="彼女の服装"
                value={meeting.partner_appearances.replace(/\\n/g, '\n')}
                multiline
                fullWidth
                InputProps={{
                  readOnly: true,
                  sx: { pointerEvents: 'none', cursor: 'default' }
                }}
              />
            </Box>

            <Box onDoubleClick={() => {
              setEditData(meeting);
              setOpenEditDialog(true);
            }} sx={{ width: '100%', mt: '8px !important' }}>

              {/* ラベル部分 */}
              <Typography
                variant="caption"
              >
                自分の服装
              </Typography>

              {/* 画像表示部分 */}
              <Box
                sx={{
                  width: '100%', // 横幅いっぱいに広げる
                  height: 300,  // 高さを固定
                  overflow: 'hidden',  // オーバーフローを隠す
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
                  src={`http://localhost:8000/files/${meeting.my_appearance_image_path.split('files/')[1]}`}
                  alt="自分の服装"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = 'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_960_720.jpg';
                  }}
                  sx={{
                    width: '100%',
                    height: '100%',  // 高さ固定で横幅いっぱいに広がる
                    objectFit: 'cover',  // 画像のトリミング
                    borderRadius: 2
                  }}
                />
              </Box>
            </Box>



            <Box onDoubleClick={() => {
              setEditData(meeting);
              setOpenEditDialog(true);
            }}>
              <TextField
                label="相手の良いところ"
                value={meeting.partner_good_points.replace(/\\n/g, '\n')}
                multiline
                fullWidth
                InputProps={{
                  readOnly: true,
                  sx: { pointerEvents: 'none', cursor: 'default' }
                }}
              />
            </Box>

            <Box onDoubleClick={() => {
              setEditData(meeting);
              setOpenEditDialog(true);
            }}>
              <TextField
                label="次回に向けて"
                value={meeting.todo_for_next.replace(/\\n/g, '\n')}
                multiline
                fullWidth
                InputProps={{
                  readOnly: true,
                  sx: { pointerEvents: 'none', cursor: 'default' }
                }}
              />
            </Box>

          </Stack>
        </CardContent>
      </Card>

      {/* ボタン */}
      <Fab
        color='inherit'
        sx={{ position: 'fixed', bottom: 20, right: 20 }}
        variant="extended"
        onClick={() => navigate('/meetings')}
      >
        <ListIcon sx={{ mr: 1 }} />
        一覧
      </Fab>
      <Fab
        color='inherit'
        sx={{ position: 'fixed', bottom: 90, right: 20 }}
        variant="extended"
        onClick={() => {
          setEditData(meeting); // 現在の内容でフォーム初期化
          setOpenEditDialog(true);
        }}
      >
        <EditIcon sx={{ mr: 1 }} />
        編集
      </Fab>

      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} fullWidth maxWidth="md" scroll="body" >
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
            <Typography
  variant="caption"
>
  自分の服装
</Typography>

            {/* ダイアログ内の画像表示部分 */}
            <Box
              sx={{
                width: '100%', // 横幅いっぱいに広げる
                height: 300,   // 高さを固定
                overflow: 'hidden',  // オーバーフローを隠す
                border: '1px solid #ccc',
                borderRadius: 2,
                padding: 1,
                backgroundColor: '#fafafa',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: '0 !important'
              }}
            >
              <Box
                component="img"
                src={editData?.my_appearance_image_path
                  ? `http://localhost:8000/files/${editData.my_appearance_image_path.split('files/')[1]}`
                  : 'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_960_720.jpg'}  // my_appearance_image_pathがない場合、フォールバック画像を使用
                alt="自分の服装"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = 'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_960_720.jpg'; // エラー時のフォールバック画像
                }}
                sx={{
                  width: '100%',  // 横幅いっぱいに広がる
                  height: '100%', // 高さも100%に設定
                  objectFit: 'cover',  // 画像のトリミング
                  borderRadius: 2
                }}
              />
            </Box>


            <Button variant="outlined" component="label">
              自分の服装の画像を変更する
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const formData = new FormData();
                    formData.append('file', file);
                    fetch(`http://localhost:8000/upload-image`, {
                      method: 'POST',
                      body: formData,
                    })
                      .then((res) => res.json())
                      .then((data) => {
                        // 画像がアップロードされた後、パスを更新
                        setEditData({ ...editData!, my_appearance_image_path: data.filename });
                      });
                  }
                }}
              />
            </Button>

            <TextField label="相手の良いところ" value={editData?.partner_good_points.replace(/\\n/g, '\n')} onChange={(e) => setEditData({ ...editData!, partner_good_points: e.target.value })} fullWidth multiline />
            <TextField label="次回に向けて" value={editData?.todo_for_next.replace(/\\n/g, '\n')} onChange={(e) => setEditData({ ...editData!, todo_for_next: e.target.value })} fullWidth multiline />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 4, py: 3, justifyContent: 'flex-end', gap: 2 }}>
          <Button
            onClick={() => setOpenEditDialog(false)}
            color="inherit"
            variant="outlined"
            size="large"
            sx={{ minWidth: 160, py: 1.2 }}
          >
            キャンセル
          </Button>
          <Button
            variant="contained"
            color="inherit"
            size="large"
            sx={{ minWidth: 160, py: 1.2 }}
            onClick={() => {
              fetch(`http://localhost:8000/meetings/${meetingId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editData)
              })
                .then((res) => res.json())
                .then(() => fetch(`http://localhost:8000/meetings/${meetingId}`))
                .then((res) => res.json())
                .then((data) => {
                  setMeeting(data.meeting);
                  setOpenEditDialog(false);
                  setSnackbarOpen(true);
                });
            }}
          >
            更新
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
