import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Divider,
  Stack,
  Fab,
} from '@mui/material';
import Header from '../../components/LogoHeader';
import { useNavigate } from 'react-router-dom';
import ListIcon from '@mui/icons-material/List';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';


interface GoodPoint {
  id: number;
  meeting_id: number;
  good_point: string;
  location: string;
  date: string;
  image: string;
}

// ベースURLを環境変数から取得。なければlocalhostを使う
const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

const GoodPointsList = () => {
  const [goodPoints, setGoodPoints] = useState<GoodPoint[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [userName, setUserName] = useState('');
  const [menuFabOpen, setMenuFabOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenuFab = () => {
    setMenuFabOpen((prev) => !prev);
  };

  const fetchGoodPoints = async () => {
    const token = sessionStorage.getItem("access_token");

    const res = await fetch(`${BASE_URL}/goodpoints`,{credentials: "include",headers: {
        Authorization: `Bearer ${token}`,
      },});
    const data = await res.json();
    // good_point が空文字や改行だけのものを除外
    const validPoints = data.goodpoints.goodpoints.filter((p: GoodPoint) =>
      p.good_point?.trim()
    );
    setGoodPoints(validPoints);
  };

  useEffect(() => {
    fetchGoodPoints();
  }, []);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setMenuOpen(true);
  };

  const handleMenuClose = () => {
    setMenuOpen(false);
    setAnchorEl(null);
  };

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
      <Box my={2}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Divider sx={{ flex: 1 }} />
          <Typography variant="h6" noWrap>
            彼女の良いところ一覧
          </Typography>
          <Divider sx={{ flex: 1 }} />
        </Stack>
      </Box>

      {goodPoints.map((point) => (

        <Card
          key={point.id}
          sx={{
            mb: 2,
            cursor: 'pointer',
            '&:hover': { transform: 'scale(1.01)', boxShadow: 6 },
            backgroundColor: point.image ? 'transparent' : 'white', // 空文字の場合は白背景
            position: 'relative', // 擬似要素を使うために relative positioning
            display: 'flex', // Flexboxを使ってコンテンツを中央に配置
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onClick={() => navigate(`/meetings/${point.meeting_id}`)}
        >
          {/* 擬似要素で画像の透明度を設定 */}
          {point.image && (
            <Box
              sx={{
                position: 'absolute', // 画像を背景のように配置
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundImage: `url(${point.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                opacity: 0.3, // 画像の透明度を設定
              }}
            />
          )}

          <CardContent sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
            <Box
              sx={{
                backgroundColor: 'white',
                padding: 2, // 余白を追加
                borderRadius: 1, // 角を丸く
                width: '90%', // カードの幅に対して適度な広さ
                textAlign: 'center', // テキストを中央揃え
                position: 'relative', // 白背景のBoxは画像の上に配置
              }}
            >
              <Typography variant="subtitle1" gutterBottom>
                {point.good_point}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                場所: {point.location}  /  日付: {new Date(point.date).toLocaleDateString()}
              </Typography>
            </Box>
          </CardContent>
        </Card>


      ))}

        {/* カードが空の場合のメッセージ */}
        {goodPoints.length === 0 && (
          <Box mt={4} textAlign="center">
            <Typography variant="body1" color="textSecondary">
              まだ登録されていません
            </Typography>
          </Box>
        )}

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
        sx={{ position: 'fixed', bottom: 110, right: 20, width: 200,backgroundColor: 'white',
    color: 'black', // アイコンの色を黒に（白背景のため）
    '&:hover': {
      backgroundColor: '#f0f0f0', // ホバー時の色も設定しておくと良い
    }, }}
        variant="extended"
        onClick={() => navigate('/meetings')}
      >
        <ListIcon sx={{ mr: 1 }} />
        デート一覧
      </Fab>

        </>
      )}

    </Box>
  );
};

export default GoodPointsList;
