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


  useEffect(() => {
    fetch('http://localhost:8000/meetings')
      .then((res) => res.json())
      .then((data) => {
        const formatted = data.meetings.map((m: any[]) => ({
          id: m[0],
          title: m[1],
          location: m[2],
          date: m[3],
          image: m[4],
        }));
        formatted.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setMeetings(formatted);
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

  return (
    <Box p={4}>
      {/* Header */}
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
        {meetings.map((meeting) => (
          <Card
            key={meeting.id}
            sx={{ m: 1, cursor: 'pointer' }}
            onClick={() => navigate(`/meetings/${meeting.id}`)}
          >
            <CardHeader
              title={meeting.title || 'タイトルなし'}
              titleTypographyProps={{ variant: 'h6' }}
            />
            <CardContent>
              <Typography variant="body1" gutterBottom>
                {meeting.location}
              </Typography>
              <Typography variant="body2">{meeting.date}</Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
      <Fab
  color="inherit"
  sx={{ position: 'fixed', bottom: 20, right: 20 }}
  variant="extended"
  onClick={() => setOpenAddDialog(true)}
>
  <AddIcon sx={{ mr: 1 }} />
  追加
</Fab>
<AddDialog
  open={openAddDialog}
  onClose={() => setOpenAddDialog(false)}
  
/>


    </Box>
  );
};

export default MeetingList;
