import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Box, Text, Image, Heading, SimpleGrid, Card, Stack, Container, Separator, HStack, Button } from '@chakra-ui/react';
import { Header } from '@chakra-ui/react/dist/types/components/card/namespace';

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
        setMeetings(formatted);
      });
  }, []);

  return (
    <Box p={6}>
      <Stack direction="row">
        <Stack width="40%" h="20" direction="row" alignItems="center">
          <Heading fontSize="5vw" fontFamily="serif" onClick={() => navigate("/")}>PartnerReminder</Heading>
        </Stack>
        <Stack width="20%" h="20" />
        <Stack width="40%" h="20" direction="row" justifyContent="flex-end" alignItems="center">
          <Button
            minWidth="20vw"
            width="40%"
            fontSize="md"
            variant="surface"
          >
            ログアウト
          </Button>
          <Button
            minWidth="20vw"
            width="40%"
            fontSize="md"
            variant="surface"
          >
            ユーザー設定
          </Button>

        </Stack>
      </Stack>
      <Stack h="2" />
      <Stack>
        <HStack>
          <Separator flex="1" />
          <Text flexShrink="0" fontSize="lg">デート一覧</Text>
          <Separator flex="1" />
        </HStack>
      </Stack>
      <Stack>
        <SimpleGrid columns={[2, null, 3]}>
          {meetings.map((meeting) => (
            <Card.Root key={meeting.id} overflow="hidden" shadow="md" m={5}>
              <Card.Header>
                <Heading size="lg" mb={2}>
                  {meeting.title || 'タイトルなし'}
                </Heading>
              </Card.Header>
              <Card.Body>
                <Text mb={2}>{meeting.location}</Text>
                <Text>{meeting.date}</Text>
              </Card.Body>
            </Card.Root>
          ))}
        </SimpleGrid>
      </Stack>
    </Box>
  );
};

export default MeetingList;
