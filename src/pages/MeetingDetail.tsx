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
  Fab
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ListIcon from '@mui/icons-material/List';
import TextareaAutosize from '@mui/material/TextareaAutosize';


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
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography
          variant="h3"
          sx={{ fontFamily: 'serif', cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          PartnerReminder
        </Typography>
        <Stack direction="row" spacing={2}>
          <Button variant="outlined">ログアウト</Button>
          <Button variant="outlined">ユーザー設定</Button>
        </Stack>
      </Stack>

      {/* タイトル */}
      <Stack direction="row" alignItems="center" spacing={2} mb={3}>
        <Divider flexItem />
        <Typography variant="h6" sx={{ whiteSpace: 'nowrap' }}>デート詳細</Typography>
        <Divider flexItem />
      </Stack>

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
        onClick={() => alert('編集ダイアログは後で追加')}
      >
        <EditIcon />
      </Fab>
    </Box>
  );
};

export default MeetingDetail;
