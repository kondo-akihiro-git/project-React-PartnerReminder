import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Box, Heading, Text, Stack, Image, HStack, Separator, Spinner, Textarea, Card, Input, Button, List } from '@chakra-ui/react';

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

    if (loading) return <Spinner size="xl" />;

    if (!meeting) return <Text>デート詳細が見つかりませんでした。</Text>;

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
                    <Text flexShrink="0" fontSize="lg">デート詳細</Text>
                    <Separator flex="1" />
                </HStack>
            </Stack>
            <Stack h="4" />
            <Stack>
                <Card.Root borderWidth="1px" borderRadius="lg" p={6} boxShadow="md">
                    <Card.Body>
                        <Stack gap={0}>
                            <Box mb={4}>
                                <Text fontWeight="bold" mb={1}>タイトル</Text>
                                <Input value={meeting.title} readOnly />
                            </Box>

                            <HStack align="center" mb={4}>
                                <Box w="50%">
                                    <Text fontWeight="bold" mb={1}>場所</Text>
                                    <Input value={meeting.location} readOnly />
                                </Box>
                                <Box w="50%">
                                    <Text fontWeight="bold" mb={1}>日付</Text>
                                    <Input value={meeting.date} readOnly />
                                </Box>
                            </HStack>

                            <Box mb={4}>
                                <Text fontWeight="bold" mb={1}>イベント</Text>
                                <Textarea value={String(meeting.event_names).replace(/\\n/g, '\n')} readOnly style={{ whiteSpace: 'pre-wrap' }} />
                            </Box>

                            <Box mb={4}>
                                <Text fontWeight="bold" mb={1}>話した話題</Text>
                                <Textarea value={String(meeting.talked_topics).replace(/\\n/g, '\n')} readOnly style={{ whiteSpace: 'pre-wrap' }} />
                            </Box>

                            <Box mb={4}>
                                <Text fontWeight="bold" mb={1}>彼女の服装</Text>
                                <Textarea value={String(meeting.partner_appearances).replace(/\\n/g, '\n')} readOnly style={{ whiteSpace: 'pre-wrap' }} />
                            </Box>

                            <Box mb={4}>
                                <Text fontWeight="bold" mb={1}>自分の服装</Text>
                                <Image
                                    src={`http://localhost:8000/${meeting.my_appearance_image_path}`}
                                    alt="自分の服装"
                                    h="10vh"
                                    objectFit="cover"
                                    borderRadius="md"
                                />
                            </Box>

                            <Box mb={4}>
                                <Text fontWeight="bold" mb={1}>相手の良いところ</Text>
                                <Textarea value={String(meeting.partner_good_points).replace(/\\n/g, '\n')} readOnly style={{ whiteSpace: 'pre-wrap' }} />
                            </Box>

                            <Box mb={4}>
                                <Text fontWeight="bold" mb={1}>次回に向けて</Text>
                                <Textarea value={String(meeting.todo_for_next).replace(/\\n/g, '\n')} readOnly style={{ whiteSpace: 'pre-wrap' }} />
                            </Box>
                        </Stack>
                    </Card.Body>
                </Card.Root>
            </Stack>


        </Box>
    );
};

export default MeetingDetail;
