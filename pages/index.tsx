import { NextPage } from 'next';
import { Box, Heading, Flex, Center } from '@chakra-ui/react';
import { ServiceLayout } from '@/components/ServiceLayout';
import GoogleLoginButton from '@/components/GoogleLoginButton';
import useFirebaseAuth from '@/hooks/use_firebase_auth';

const IndexPage: NextPage = function () {
  const { signInWithGoogle } = useFirebaseAuth();
  return (
    <ServiceLayout title="Blah x2" minH="100vh" backgroundColor="gray.100">
      <Box maxW="md" mx="auto" pt="10">
        <img src="/main_logo.svg" alt="메인 로고" />
        <Flex justify="center">
          <Heading>#BlahBlah</Heading>
        </Flex>
      </Box>
      <Center mt="20">
        <GoogleLoginButton onClick={signInWithGoogle} />
      </Center>
    </ServiceLayout>
  );
};

export default IndexPage;
