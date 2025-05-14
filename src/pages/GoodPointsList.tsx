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
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';
import ListIcon from '@mui/icons-material/List';

interface GoodPoint {
  id: number;
  meeting_id: number;
  good_point: string;
  location: string;
  date: string;
}

const GoodPointsList = () => {
  const [goodPoints, setGoodPoints] = useState<GoodPoint[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();

  const fetchGoodPoints = async () => {
    const res = await fetch('http://localhost:8000/goodpoints');
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
            '&:hover': { boxShadow: 6, backgroundColor: '#f9f9f9' },
          }}
          onClick={() => navigate(`/meetings/${point.meeting_id}`)}
        >
          <CardContent>
            <Typography variant="subtitle1" gutterBottom>
              {point.good_point}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              場所: {point.location}  /  日付: {new Date(point.date).toLocaleDateString()}
            </Typography>
          </CardContent>
        </Card>
      ))}
            <Fab
        color="inherit"
        sx={{ position: 'fixed', bottom: 40, right: 20, width:150 }}
        variant="extended"
        onClick={() => navigate('/meetings')}
      >
        <ListIcon sx={{ mr: 1 }} />
        一覧
      </Fab>
    </Box>
  );
};

export default GoodPointsList;
