import { useNavigate } from 'react-router-dom';
import { Box, Button, Center, Heading, Stack } from '@chakra-ui/react';

const Top = () => {
  const navigate = useNavigate();

  return (
    <Box p={6} >
      <Stack h="20vh" />
      <Stack h="40vh" alignItems='center' justifyContent="center">
        <Heading as="h1" fontSize="min(10vw, 30vh)" fontFamily="serif" mb={4}>
          Partner Reminder
        </Heading>
      </Stack>
      <Stack h="40vh" alignItems='center'>
        <Button
          minWidth="20vw"
          onClick={() => navigate('/meetings')}
          colorScheme="blue"
          size="lg"
          variant="solid"
        >
          デート一覧を見る
        </Button>
      </Stack>
    </Box>
  );
};

export default Top;
