import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { Box, Heading, Text, Stack, Image, HStack, Separator, Spinner, Textarea, Card, Input, Button, List, Dialog, Portal, Field, CloseButton, DialogCloseTrigger, DialogTrigger, DialogRoot } from '@chakra-ui/react';
import { IconButton } from '@chakra-ui/react';
import AutoResizeTextarea from "../components/AutoResizeTextare";

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
    const [isEditDialogOpen, setEditDialogOpen] = useState(false);
    const [editedMeeting, setEditedMeeting] = useState<MeetingDetail | null>(null);


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

    // 画像アップロードの処理
    const handleImageUpload = async (file: File) => {
        const formData = new FormData();
        formData.append('image', file);
        const response = await fetch('http://localhost:8000/upload', {
            method: 'POST',
            body: formData,
        });
        const data = await response.json();
        return data.imagePath; // サーバーから返される画像のパスを返す
    };



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
                                {meeting.my_appearance_image_path && (
                                    <Image
                                        src={`http://localhost:8000/${meeting.my_appearance_image_path}`}
                                        alt="自分の服装"
                                        h="10vh"
                                        objectFit="cover"
                                        borderRadius="md"
                                    />
                                )}
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
            <IconButton
                value="de"
                aria-label="編集"
                position="fixed"
                bottom="20px"
                right="20px"

                minWidth="20%"
                colorScheme="teal"
                borderRadius="full"
                boxShadow="lg"
                size="lg"
                zIndex={1000}
                colorPalette="green"
                onClick={() => {
                    // 例えば編集画面へ遷移したい場合
                    navigate(`/meetings`);
                }}>
                デート一覧
            </IconButton>
            <IconButton
                value="de"
                aria-label="編集"
                position="fixed"
                bottom="90px"
                right="20px"

                minWidth="20%"
                colorScheme="teal"
                borderRadius="full"
                boxShadow="lg"
                size="lg"
                zIndex={1000}
                colorPalette="green"
                onClick={() => {
                    setEditedMeeting(meeting);
                    setEditDialogOpen(true);
                }}>
                デート編集
            </IconButton>



            {/* 編集ダイアログ */}
            {/* {editedMeeting && (
                <Dialog.Root open={isEditDialogOpen} onOpenChange={setEditDialogOpen}>
                    <Portal>
                    <Dialog.Backdrop onClick={() => setEditDialogOpen(false)} />

                        <Dialog.Positioner>
                            <Dialog.Content>
                                <Dialog.Header>
                                    <Dialog.Title>デートを編集</Dialog.Title>
                                </Dialog.Header>
                                <Dialog.Body>
                                    <Stack gap="4">
                                        <Field.Root>
                                            <Field.Label>タイトル</Field.Label>
                                            <Input

                                                value={editedMeeting.title}
                                                onChange={(e) =>
                                                    setEditedMeeting({ ...editedMeeting, title: e.target.value })
                                                }
                                            />
                                        </Field.Root>

                                        <Field.Root>
                                            <Field.Label>場所</Field.Label>
                                            <Input
                                                value={editedMeeting.location}
                                                onChange={(e) =>
                                                    setEditedMeeting({ ...editedMeeting, location: e.target.value })
                                                }
                                            />
                                        </Field.Root>

                                        <Field.Root>
                                            <Field.Label>日付</Field.Label>
                                            <Input
                                                type="date"
                                                value={editedMeeting.date}
                                                onChange={(e) =>
                                                    setEditedMeeting({ ...editedMeeting, date: e.target.value })
                                                }
                                            />
                                        </Field.Root>

                                        <Field.Root>
                                            <Field.Label>イベント</Field.Label>
                                            <AutoResizeTextarea
                                                value={editedMeeting.event_names}
                                                onChange={(e) =>
                                                    setEditedMeeting({ ...editedMeeting, event_names: e.target.value })
                                                }
                                            />
                                        </Field.Root>

                                        <Field.Root>
                                            <Field.Label>話した話題</Field.Label>
                                            <AutoResizeTextarea
                                                value={editedMeeting.talked_topics}
                                                onChange={(e) =>
                                                    setEditedMeeting({ ...editedMeeting, talked_topics: e.target.value })
                                                }
                                            />
                                        </Field.Root>
                                        <Field.Root>
                                            <Field.Label>彼女の服装</Field.Label>
                                            <AutoResizeTextarea
                                                value={editedMeeting.partner_appearances}
                                                onChange={(e) =>
                                                    setEditedMeeting({ ...editedMeeting, partner_appearances: e.target.value })
                                                }
                                            />
                                        </Field.Root>


                                        <Field.Root>
                                            <Field.Label>自分の服装</Field.Label>
                                            <Box>
                                                <Image
                                                    src={`http://localhost:8000/${editedMeeting.my_appearance_image_path}`}
                                                    alt="自分の服装"
                                                    h="10vh"
                                                    objectFit="cover"
                                                    borderRadius="md"
                                                />
                                                <Input
                                                    type="file"
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) {
                                                            // 画像アップロードの処理を追加
                                                            const formData = new FormData();
                                                            formData.append('image', file);
                                                            // ここでAPI経由でアップロード処理を行う
                                                        }
                                                    }}
                                                />
                                            </Box>
                                        </Field.Root>


                                        <Field.Root>
                                            <Field.Label>相手の良いところ</Field.Label>
                                            <AutoResizeTextarea
                                                value={editedMeeting.partner_good_points}
                                                onChange={(e) =>
                                                    setEditedMeeting({ ...editedMeeting, partner_good_points: e.target.value })
                                                }
                                            />
                                        </Field.Root>

                                        <Field.Root>
                                            <Field.Label>次回に向けて</Field.Label>
                                            <AutoResizeTextarea
                                                value={editedMeeting.todo_for_next}
                                                onChange={(e) =>
                                                    setEditedMeeting({ ...editedMeeting, todo_for_next: e.target.value })
                                                }
                                            />
                                        </Field.Root>

                                    </Stack>
                                </Dialog.Body>
                                <Dialog.Footer>
                                    <Dialog.ActionTrigger asChild>
                                    <Button variant="outline">キャンセル</Button>

                                    </Dialog.ActionTrigger>
                                    <Button
                                        colorScheme="teal"
                                        onClick={async () => {
                                            if (!editedMeeting) return;

                                            try {
                                                const res = await fetch(`http://localhost:8000/meetings/${meetingId}`, {
                                                    method: "PUT",
                                                    headers: {
                                                        "Content-Type": "application/json",
                                                    },
                                                    body: JSON.stringify(editedMeeting),
                                                });

                                                if (!res.ok) {
                                                    const errorData = await res.json();
                                                    console.error("更新エラー:", errorData);
                                                    alert("更新に失敗しました。");
                                                    return;
                                                }

                                                const result = await res.json();
                                                console.log("更新成功:", result);
                                                setMeeting(editedMeeting);  // ローカルステートも更新
                                                setEditDialogOpen(false);   // ダイアログを閉じる
                                            } catch (error) {
                                                console.error("通信エラー:", error);
                                                alert("通信エラーが発生しました。");
                                            }
                                        }}
                                    >
                                        保存
                                    </Button>

                                </Dialog.Footer>
                            </Dialog.Content>
                        </Dialog.Positioner>
                    </Portal>
                </Dialog.Root>
            )} */}
        </Box>



    );
};

export default MeetingDetail;
