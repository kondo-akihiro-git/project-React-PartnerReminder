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
} from '@mui/material';

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

  return (
    <Box p={4}>
      {/* Header */}
      <Stack direction="row" spacing={2} alignItems="center" mb={2}>
        <Box width="40%" onClick={() => navigate('/')} sx={{ cursor: 'pointer' }}>
          <Typography variant="h3" fontFamily="serif">
            PartnerReminder
          </Typography>
        </Box>
        <Box width="20%" />
        <Stack direction="row" spacing={2} justifyContent="flex-end" width="40%">
          <Button variant="outlined" sx={{ minWidth: '20vw' }}>
            ログアウト
          </Button>
          <Button variant="outlined" sx={{ minWidth: '20vw' }}>
            ユーザー設定
          </Button>
        </Stack>
      </Stack>

      {/* Divider */}
      <Box my={2}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Divider sx={{ flex: 1 }} />
          <Typography variant="h6" noWrap>
            デート一覧
          </Typography>
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
    </Box>
  );
};

export default MeetingList;
