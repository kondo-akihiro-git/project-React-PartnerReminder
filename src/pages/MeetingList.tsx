import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Stack,
  Button,
  Divider,
  Card,
  CardHeader,
  CardContent,
  Fab,
} from '@mui/material';
import Header from '../components/Header';
import AddIcon from '@mui/icons-material/AddCircleOutline';
import AddDialog from '../components/AddDialog';
import SnackbarNotification from '../components/SnackbarNotification';
import DeleteIcon from '@mui/icons-material/Delete';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import SearchBar from '../components/SearchBar';
import { useMemo } from 'react';
import { kMaxLength } from 'buffer';

interface Meeting {
  id: number;
  title: string | null;
  location: string;
  date: string;
  image: string | null;
}

const MeetingList = () => {
  const navigate = useNavigate();
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);  // メニューの開閉状態を管理
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [isDeleteMode, setIsDeleteMode] = useState(false);  // 削除モード
  const [selectedMeetings, setSelectedMeetings] = useState<number[]>([]);  // 選択されたMeetingのIDを管理
  // MeetingList.tsx の useState に追加
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'info' | 'warning' | 'error'>('info');

  const [filters, setFilters] = useState({
    title: '',
    location: '',
    date: '',
  });


  const fetchMeetings = async () => {
    const res = await fetch('http://localhost:8000/meetings');
    const data = await res.json();
    const formatted = data.meetings.map((m: any[]) => ({
      id: m[0],
      title: m[1],
      location: m[2],
      date: m[3],
      image: m[4],
    }));
    formatted.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setMeetings(formatted);
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setMenuOpen(true);
  };

  const handleMenuClose = () => {
    setMenuOpen(false);
    setAnchorEl(null);
  };

  const handleDeleteClick = () => {
    setSnackbarMessage('削除対象を選択してください');
    setSnackbarSeverity('info');
    setSnackbarOpen(true);
    setIsDeleteMode(true);
  };

  const handleCardClick = (id: number) => {
    if (isDeleteMode) {
      setSelectedMeetings((prevSelected) =>
        prevSelected.includes(id)
          ? prevSelected.filter((meetingId) => meetingId !== id)
          : [...prevSelected, id]
      );
    } else {
      navigate(`/meetings/${id}`);
    }
  };

  const handleDeleteExecute = async () => {
    try {
      const response = await fetch('http://localhost:8000/meetings/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedMeetings }),
      });

      if (!response.ok) {
        throw new Error('削除に失敗しました');
      }

      setSnackbarMessage('削除に成功しました');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarMessage('削除中にエラーが発生しました');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setIsDeleteMode(false);
      setSelectedMeetings([]);
      fetchMeetings();
    }
  };

  const handleCancelDeleteMode = () => {
    setIsDeleteMode(false);
    setSelectedMeetings([]);
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };
  const handleClear = () => {
    setFilters({
      title: '',
      location: '',
      date: '',
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('user_token'); // トークンを削除
    navigate('/login'); // ログインページへリダイレクト
  };

  const handleUserSettings = () => {
    navigate('/usersetting'); 
  };

  const filteredMeetings = useMemo(() => {
    return meetings.filter((m) => {
      const matchTitle = m.title?.toLowerCase().includes(filters.title.toLowerCase()) ?? false;
      const matchLocation = m.location.toLowerCase().includes(filters.location.toLowerCase());
      const matchDate = filters.date ? m.date.startsWith(filters.date) : true;
      return matchTitle && matchLocation && matchDate;
    });
  }, [meetings, filters]);


  return (
    <Box p={4}>
      {/* Header */}
      <Header
        handleMenuClick={handleMenuClick}
        handleMenuClose={handleMenuClose}
        menuOpen={menuOpen}
        handleUserSettings={handleUserSettings}
        handleLogout={handleLogout}
        anchorEl={anchorEl}
      />
      <Box mb={2}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Divider sx={{ flex: 1 }} />
          <Typography variant="h6" noWrap>
            デート一覧
          </Typography>
          <Divider sx={{ flex: 1 }} />
        </Stack>
      </Box>

      <SearchBar filters={filters} onChange={handleFilterChange} onClear={handleClear} />

      {/* Meeting Cards Grid */}
      <Box
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(2, 1fr)',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
        }}
        gap={2}
        mt={3}
      >
        {filteredMeetings.map((meeting) => {
          const selectedIndex = selectedMeetings.indexOf(meeting.id);
          const imageUrl = meeting.image
            ? `http://localhost:8000/${meeting.image}`
            : 'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_960_720.jpg';

          return (
            <Box key={meeting.id} position="relative">
              <Card
                sx={{
                  m: 1,
                  height: 200,
                  cursor: isDeleteMode ? 'pointer' : 'default',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': { transform: 'scale(1.03)', boxShadow: 6 },
                  backgroundColor: selectedMeetings.includes(meeting.id)
                    ? 'rgba(0, 0, 0, 0.1)'
                    : 'transparent',
                  position: 'relative',
                  overflow: 'hidden',
                  // 背景画像（擬似要素）
                  '::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundImage: `url(${imageUrl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    opacity: 0.6,
                    zIndex: 0,
                  },
                  // 前面テキストを上に表示するためにzIndexを上げる
                  '& > *': {
                    position: 'relative',
                    zIndex: 1,
                  },
                }}
                onClick={() => handleCardClick(meeting.id)}
              >
                <Box
  m={{
    xs: 4, // スマホなどの小さい画面
    sm: 4, // タブレットなどの中サイズ
    md: 6, // デスクトップなどの通常サイズ以上
  }}
>
                  {/* タイトル */}
                  <Box>
<Typography
  
  fontWeight="bold"
  sx={{

        fontSize: {
      xs: '1.2rem', // スマホ
      sm: '1.3rem', // タブレット
      md: '1.4em',   // 通常画面
    },
    color: "white",
    textShadow:"1px 1px 15px gray,1px 1px 15px gray,1px 1px 15px gray"
  }}
>
  {meeting.title || 'タイトルなし'}
</Typography>
                  </Box>

                  <CardContent sx={{ pl: 0 }}>
                    {/* 場所 */}
                    <Box mt={1}>
                      <Typography
                        variant="body1"
                        fontWeight="bold"
                        sx={{
                          color: "white",
                          textShadow:"1px 1px 15px gray,1px 1px 15px gray,1px 1px 15px gray"
                        }}
                      >
                        {meeting.location}
                      </Typography>
                    </Box>

                    {/* 日付 */}
                    <Box mt={0.1}>
                      <Typography
                        variant="body2"
                        fontWeight="bold"
                        sx={{
                          color: "white",
                          textShadow:"1px 1px 15px gray,1px 1px 15px gray,1px 1px 15px gray"
                        }}
                      >
                        {meeting.date}
                      </Typography>
                    </Box>
                  </CardContent>
                </Box>


              </Card>

              {isDeleteMode && selectedIndex !== -1 && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: -10,
                    right: -10,
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    backgroundColor: 'gray',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '0.875rem',
                    zIndex: 10,
                    boxShadow: 3,
                  }}
                >
                  {selectedIndex + 1}
                </Box>
              )}
            </Box>
          );
        })}

      </Box>

      {!isDeleteMode && (
        <>
          <Fab
            color="inherit"
            sx={{ position: 'fixed', bottom: 40, right: 20, width: 200 }}
            variant="extended"
            onClick={() => setOpenAddDialog(true)}
          >
            <AddIcon sx={{ mr: 1 }} />
            デート追加
          </Fab>


          <Fab
            color="inherit"
            sx={{ position: 'fixed', bottom: 110, right: 20, width: 200 }}
            variant="extended"
            onClick={handleDeleteClick}
          >
            <DeleteIcon sx={{ mr: 1 }} />
            デート削除
          </Fab>

          <Fab
            color="inherit"
            sx={{ position: 'fixed', bottom: 180, right: 20, width: 200 }}
            variant="extended"
            onClick={() => navigate('/goodpoints')}
          >
            <ThumbUpOffAltIcon sx={{ mr: 1 }} />
            良いところ一覧
          </Fab>

          <Fab
            color="inherit"
            sx={{ position: 'fixed', bottom: 250, right: 20, width: 200 }}
            variant="extended"
            onClick={() => navigate('/goodpoints')}
          >
            <ThumbUpOffAltIcon sx={{ mr: 1 }} />
            次の予定：5/17(水)
          </Fab>
        </>
      )}

      {isDeleteMode && selectedMeetings.length > 0 && (

        <Fab
          color="inherit"
          sx={{ position: 'fixed', bottom: 110, right: 20, width: 200 }}
          variant="extended"
          onClick={handleDeleteExecute}
        >
          削除実行
        </Fab>

      )}

      {isDeleteMode && (

        <Fab
          color="inherit"
          sx={{ position: 'fixed', bottom: 40, right: 20, width: 200 }}
          variant="extended"
          onClick={handleCancelDeleteMode}
        >
          削除モード解除
        </Fab>

      )}

      <AddDialog
        open={openAddDialog}
        onClose={() => setOpenAddDialog(false)}
        onSaveSuccess={() => {
          fetchMeetings();
          setSnackbarMessage("追加できました")
          setSnackbarSeverity('success');
          setSnackbarOpen(true);
          setOpenAddDialog(false);
        }}
      />
      <SnackbarNotification open={snackbarOpen} onClose={() => setSnackbarOpen(false)} message={snackbarMessage} severity={snackbarSeverity} />
    </Box>
  );
};

export default MeetingList;
