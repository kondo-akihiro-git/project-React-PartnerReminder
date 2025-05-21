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
import Header from '../../components/LogoHeader';
import AddIcon from '@mui/icons-material/AddCircleOutline';
import AddDialog from '../../components/AddMeetingDialog';
import SnackbarNotification from '../../components/SnackbarNotification';
import DeleteIcon from '@mui/icons-material/Delete';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import SearchBar from '../../components/SearchBar';
import { useMemo } from 'react';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import EditNextModal from '../../components/EditNextModal';


interface Meeting {
  id: number;
  title: string | null;
  location: string;
  date: string;
  image: string | null;
}

// ベースURLを環境変数から取得。なければlocalhostを使う
const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

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
  const [editNextOpen, setEditNextOpen] = useState(false);
  const [userName, setUserName] = useState('');

  const [filters, setFilters] = useState({
    title: '',
    location: '',
    date: '',
  });
  const [nextMeetingDate, setNextMeetingDate] = useState<string>('---');
  const [nextMeetingDateRaw, setNextMeetingDateRaw] = useState<string | null>(null);


  const handleEditNextOpen = () => {
    setEditNextOpen(true);
  };

  const handleEditNextClose = () => {
    setEditNextOpen(false);
  };


  const fetchMeetings = async () => {
    const res = await fetch(`${BASE_URL}/meetings`,{credentials: "include"});
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

  const formatDateWithWeekday = (dateStr: string): string => {
    const date = new Date(dateStr);
    const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
    const month = date.getMonth() + 1; // 0始まりなので+1
    const day = date.getDate();
    const weekday = weekdays[date.getDay()];
    return `${month}/${day}(${weekday})`;
  };

  useEffect(() => {


    const fetchNextMeeting = async () => {
      try {
        const res = await fetch(`${BASE_URL}/next`,{credentials: "include"});
        const data = await res.json();
        if (data?.date) {
          setNextMeetingDateRaw(data.date);
          const formattedDate = formatDateWithWeekday(data.date);
          setNextMeetingDate(formattedDate);  // フォーマット済みで返ってくる想定
        }
      } catch (err) {
        console.error('次の予定の取得に失敗しました', err);
        setNextMeetingDateRaw(null);
        setNextMeetingDate('---');
      }
    };
    fetchNextMeeting();

    fetchMeetings();
  }, []);

useEffect(() => {
  fetch(`${BASE_URL}/me`, {
    credentials: 'include',
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
      const response = await fetch(`${BASE_URL}/meetings/delete`, {
        method: 'POST',
        credentials: "include",
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

  const handleLogout = async () => {
    try {
      const res = await fetch(`${BASE_URL}/logout`, {
        method: 'POST',
        credentials: 'include',  // Cookie送信のために必要
      });
      if (!res.ok) {
        throw new Error('ログアウトに失敗しました');
      }
      navigate('/login');
    } catch (error) {
      setSnackbarMessage('ログアウト処理でエラーが発生しました');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
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
        userName={userName}
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
            ? `${BASE_URL}/${meeting.image}`
            : `${BASE_URL}/files/no_image/no_image.jpg`;

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
                        textShadow: "1px 1px 15px gray,1px 1px 15px gray,1px 1px 15px gray"
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
                          textShadow: "1px 1px 15px gray,1px 1px 15px gray,1px 1px 15px gray"
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
                          textShadow: "1px 1px 15px gray,1px 1px 15px gray,1px 1px 15px gray"
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
            sx={{
              position: 'fixed', bottom: 40, right: 20, width: 200, backgroundColor: 'white',
              color: 'black', // アイコンの色を黒に（白背景のため）
              '&:hover': {
                backgroundColor: '#f0f0f0', // ホバー時の色も設定しておくと良い
              },
            }}
            variant="extended"
            onClick={() => setOpenAddDialog(true)}
          >
            <AddIcon sx={{ mr: 1 }} />
            デート追加
          </Fab>


          <Fab
            sx={{
              position: 'fixed', bottom: 110, right: 20, width: 200, backgroundColor: 'white',
              color: 'black', // アイコンの色を黒に（白背景のため）
              '&:hover': {
                backgroundColor: '#f0f0f0', // ホバー時の色も設定しておくと良い
              },
            }}
            variant="extended"
            onClick={handleDeleteClick}
          >
            <DeleteIcon sx={{ mr: 1 }} />
            デート削除
          </Fab>

          <Fab
            sx={{
              position: 'fixed', bottom: 180, right: 20, width: 200, backgroundColor: 'white',
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

          <Fab
            sx={{
              position: 'fixed', bottom: 250, right: 20, width: 200, backgroundColor: 'white',
              color: 'black', // アイコンの色を黒に（白背景のため）
              '&:hover': {
                backgroundColor: '#f0f0f0', // ホバー時の色も設定しておくと良い
              },
            }}
            variant="extended"
            onClick={handleEditNextOpen}
          >
            <CalendarMonthIcon sx={{ mr: 1 }} />
            次の予定：{nextMeetingDate}
          </Fab>
        </>
      )}

      {isDeleteMode && selectedMeetings.length > 0 && (

        <Fab
          color="error"
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
          sx={{
            position: 'fixed', bottom: 40, right: 20, width: 200, backgroundColor: 'white',
            color: 'black', // アイコンの色を黒に（白背景のため）
            '&:hover': {
              backgroundColor: '#f0f0f0', // ホバー時の色も設定しておくと良い
            },
          }}
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

      <EditNextModal
        open={editNextOpen}
        onClose={handleEditNextClose}

        onUpdated={(success) => {
          if(success){
          fetchMeetings();
          // 次回日付も再取得
          fetch(`${BASE_URL}/next`,{credentials: "include"})
            .then(res => res.json())
            .then(data => {
              if (data?.date) {
                const formatted = formatDateWithWeekday(data.date);
                setNextMeetingDate(formatted);
                setSnackbarMessage('次回の予定日を更新しました');
                setSnackbarSeverity('success');
                setSnackbarOpen(true);
              }else{

              }
            });
          }else{
                setSnackbarMessage('更新に失敗しました');
                setSnackbarSeverity('error');
                setSnackbarOpen(true);
          }
        }}
        initialDate={nextMeetingDateRaw}
        currentDate={new Date().toISOString().split('T')[0]} // デフォルトで今日
      />

    </Box>
  );
};

export default MeetingList;
