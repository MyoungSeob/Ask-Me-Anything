import { Box, Button } from '@chakra-ui/react';

interface GoogleLoginButtonProps {
  onClick: () => void;
}
const GoogleLoginButton = function ({ onClick }: GoogleLoginButtonProps) {
  return (
    <Box>
      <Button
        size="lg"
        width="full"
        maxW="md"
        borderRadius="full"
        color="white"
        bgColor="#4285f4"
        colorScheme="white"
        leftIcon={
          <img
            src="/google.svg"
            alt="google 로고"
            style={{ backgroundColor: 'white', padding: '5px', borderRadius: '100px' }}
          />
        }
        onClick={onClick}
      >
        Google 계정으로 시작하기
      </Button>
    </Box>
  );
};

export default GoogleLoginButton;
