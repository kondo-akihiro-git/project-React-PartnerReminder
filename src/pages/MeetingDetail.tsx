import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Box, Typography, Stack, TextField, Divider, Card, CardContent, Button, Fab } from '@mui/material';
import ListIcon from '@mui/icons-material/List';
import EditIcon from '@mui/icons-material/Edit';
import EditMeetingDialog from '../components/Dialog';
import Header from '../components/Header';
import LoadingIndicator from '../components/LoadingIndicator';
import SnackbarNotification from '../components/SnackbarNotification';

const MeetingDetail = () => {
  const navigate = useNavigate();
  const { meetingId } = useParams<{ meetingId: string }>();
  const [meeting, setMeeting] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);  // メニューの開閉状態を管理
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  useEffect(() => {
    fetch(`http://localhost:8000/meetings/${meetingId}`)
      .then((res) => res.json())
      .then((data) => {
        setMeeting(data.meeting);
        setLoading(false);
      });
  }, [meetingId]);

  const handleSave = () => {
    fetch(`http://localhost:8000/meetings/${meetingId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editData),
    }).then(() => {
      setSnackbarOpen(true);
      setOpenEditDialog(false);
    });
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setMenuOpen(true);
  };

  const handleMenuClose = () => {
    setMenuOpen(false);
    setAnchorEl(null);
  };

  if (loading) return <LoadingIndicator />;
  if (!meeting) return <Typography>デート詳細が見つかりませんでした。</Typography>;

  return (
    <Box p={4}>
      <Header
        handleMenuClick={handleMenuClick}
        handleMenuClose={handleMenuClose}
        menuOpen={menuOpen}
        handleUserSettings={() => {}}
        handleLogout={() => {}}
        anchorEl={anchorEl}
      />
      <Box my={2}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Divider sx={{ flex: 1 }} />
          <Typography variant="h6" noWrap>デート詳細</Typography>
          <Divider sx={{ flex: 1 }} />
        </Stack>
      </Box>
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
                  src={
                    meeting.my_appearance_image_path
                      ? `http://localhost:8000/files/${meeting.my_appearance_image_path.split('files/')[1]}`
                      : 'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_960_720.jpg'
                  }
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
      <Fab
        color="inherit"
        sx={{ position: 'fixed', bottom: 20, right: 20 }}
        variant="extended"
        onClick={() => navigate('/meetings')}
      >
        <ListIcon sx={{ mr: 1 }} />
        一覧
      </Fab>
      <Fab
        color="inherit"
        sx={{ position: 'fixed', bottom: 90, right: 20 }}
        variant="extended"
        onClick={() => {
          setEditData(meeting);
          setOpenEditDialog(true);
        }}
      >
        <EditIcon sx={{ mr: 1 }} />
        編集
      </Fab>

      <EditMeetingDialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        editData={editData}
        setEditData={setEditData}
        onSave={handleSave}
      />

      <SnackbarNotification open={snackbarOpen} onClose={() => setSnackbarOpen(false)} />
    </Box>
  );
};

export default MeetingDetail;
