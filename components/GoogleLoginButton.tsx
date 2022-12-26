import { Box, Button } from '@chakra-ui/react';
import { useAuth } from '@/contexts/auth_user.context';

interface GoogleLoginButtonProps {
  onClick: () => void;
}
const GoogleLoginButton = function ({ onClick }: GoogleLoginButtonProps) {
  const { authUser } = useAuth();
  const isOwner = authUser !== null;
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
          !isOwner ? (
            <img
              src="/google.svg"
              alt="google 로고"
              style={{ backgroundColor: 'white', padding: '5px', borderRadius: '100px' }}
            />
          ) : undefined
        }
        onClick={() => {
          if (isOwner) {
            window.location.href = `/${authUser.email?.replace('@gmail.com', '')}`;
            return;
          }
          onClick();
        }}
      >
        {isOwner ? '내 홈으로 이동' : 'Google 계정으로 시작하기'}
      </Button>
    </Box>
  );
};

export default GoogleLoginButton;
