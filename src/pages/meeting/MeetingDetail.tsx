import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Box, Typography, Stack, TextField, Divider, Card, CardContent, Fab } from '@mui/material';
import ListIcon from '@mui/icons-material/List';
import EditIcon from '@mui/icons-material/Edit';
import EditMeetingDialog from '../../components/EditMeetingDialog';
import Header from '../../components/LogoHeader';
import LoadingIndicator from '../../components/LoadingIndicator';
import SnackbarNotification from '../../components/SnackbarNotification';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

// ベースURLを環境変数から取得。なければlocalhostを使う
const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

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
  const [userName, setUserName] = useState('');
  const [menuFabOpen, setMenuFabOpen] = useState(false); // メニューFAB開閉用

  const toggleMenuFab = () => {
    setMenuFabOpen((prev) => !prev);
  };


  useEffect(() => {
    const token = sessionStorage.getItem("access_token");
    fetch(`${BASE_URL}/meetings/${meetingId}`, { credentials: "include",headers: {
    Authorization: `Bearer ${token}`,
  }, })
      .then((res) => res.json())
      .then((data) => {
        setMeeting(data.meeting);
        setLoading(false);
      });
  }, [meetingId]);

  useEffect(() => {
    const token = sessionStorage.getItem("access_token");
    fetch(`${BASE_URL}/me`, {
      credentials: 'include',headers: {
    Authorization: `Bearer ${token}`,
  },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.user?.name) {
          setUserName(data.user.name);
        }
      })
      .catch((err) => {
        console.error('ユーザー情報の取得に失敗しました', err);
      });
  }, []);

  const handleSave = () => {
    const token = sessionStorage.getItem("access_token");
    fetch(`${BASE_URL}/meetings/${meetingId}`, {
      method: 'PUT',
      credentials: "include",
      headers: { 'Content-Type': 'application/json',Authorization: `Bearer ${token}`, },
      body: JSON.stringify(editData),
    }).then(() => {
      setSnackbarOpen(true);
      setOpenEditDialog(false);

      // 🔄 更新後のデータを再取得
      fetch(`${BASE_URL}/meetings/${meetingId}`, { credentials: "include",headers: {
    Authorization: `Bearer ${token}`,
  }, })
        .then((res) => res.json())
        .then((data) => {
          setMeeting(data.meeting);
        });
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

  const handleLogout = async () => {
    try {
      const token = sessionStorage.getItem("access_token");
      const res = await fetch(`${BASE_URL}/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: {
    Authorization: `Bearer ${token}`,
  },
      });

      if (!res.ok) {
        throw new Error('ログアウトに失敗しました');
      }
      sessionStorage.removeItem("access_token");
      navigate('/login');
    } catch (error) {
      navigate('/login');
    }
  };
  const handleUserSettings = () => {
    navigate('/usersetting');
  };

  if (loading) return <LoadingIndicator />;
  if (!meeting) return <Typography>デート詳細が見つかりませんでした。</Typography>;

  return (
    <Box p={4}>
      <Header
        handleMenuClick={handleMenuClick}
        handleMenuClose={handleMenuClose}
        menuOpen={menuOpen}
        handleUserSettings={handleUserSettings}
        handleLogout={handleLogout}
        anchorEl={anchorEl}
        userName={userName}
      />
      <Box mb={2}>
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
                      ? `${meeting.my_appearance_image_path}`
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

            <Box onDoubleClick={() => {
              setEditData(meeting);
              setOpenEditDialog(true);
            }} sx={{ width: '100%', mt: '8px !important' }}>

              {/* ラベル部分 */}
              <Typography
                variant="caption"
              >
                デートの背景画像
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
                    meeting.meeting_photo
                      ? `${meeting.meeting_photo}`
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
                    height: '100%',  // 高さ固定で横幅いっぱいに広がる
                    objectFit: 'cover',  // 画像のトリミング
                    borderRadius: 2
                  }}
                />
              </Box>
            </Box>

          </Stack>
        </CardContent>
      </Card>

      <Fab
        color="inherit"
        sx={{ position: 'fixed', bottom: 40, right: 20 }}
        onClick={toggleMenuFab}
      >
        {menuFabOpen ? <CloseIcon /> : <MenuIcon />}
      </Fab>

      {menuFabOpen && (
        <>

          <Fab
            color="inherit"
            sx={{
              position: 'fixed', bottom: 110, right: 20, width: 200, backgroundColor: 'white',
              color: 'black', // アイコンの色を黒に（白背景のため）
              '&:hover': {
                backgroundColor: '#f0f0f0', // ホバー時の色も設定しておくと良い
              },
            }}
            variant="extended"
            onClick={() => navigate('/meetings')}
          >
            <ListIcon sx={{ mr: 1 }} />
            デート一覧
          </Fab>
          <Fab
            color="inherit"
            sx={{
              position: 'fixed', bottom: 180, right: 20, width: 200, backgroundColor: 'white',
              color: 'black', // アイコンの色を黒に（白背景のため）
              '&:hover': {
                backgroundColor: '#f0f0f0', // ホバー時の色も設定しておくと良い
              },
            }}
            variant="extended"
            onClick={() => {
              setEditData(meeting);
              setOpenEditDialog(true);
            }}
          >
            <EditIcon sx={{ mr: 1 }} />
            デート編集
          </Fab>
          <Fab
            color="inherit"
            sx={{
              position: 'fixed', bottom: 250, right: 20, width: 200, backgroundColor: 'white',
              color: 'black', // アイコンの色を黒に（白背景のため）
              '&:hover': {
                backgroundColor: '#f0f0f0', // ホバー時の色も設定しておくと良い
              },
            }}
            variant="extended"
            onClick={() => navigate('/goodpoints')}
          >
            <ThumbUpOffAltIcon sx={{ mr: 1 }} />
            良いところ一覧
          </Fab>
        </>
      )}

      <EditMeetingDialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        editData={editData}
        setEditData={setEditData}
        onSave={handleSave}
      />

      <SnackbarNotification open={snackbarOpen} onClose={() => setSnackbarOpen(false)} message="更新できました" severity='success' />
    </Box>
  );
};

export default MeetingDetail;
