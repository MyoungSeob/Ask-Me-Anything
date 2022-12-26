import {
  Avatar,
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Switch,
  Text,
  Textarea,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { TriangleDownIcon } from '@chakra-ui/icons';
import { GetServerSideProps, NextPage } from 'next';
import ResizeTextarea from 'react-textarea-autosize';
import { ChangeEvent, MouseEvent, useState } from 'react';
import axios, { AxiosResponse } from 'axios';
import { useQuery } from 'react-query';
import { ServiceLayout } from '@/components/ServiceLayout';
import { useAuth } from '@/contexts/auth_user.context';
import { InAuthUser } from '@/models/in_auth_user';
import MessageItem from '@/components/message_item';
import { InMessage } from '@/models/message/in_message';

interface Props {
  userInfo: InAuthUser | null;
  screenName: string;
}

async function postMessage({
  uid,
  message,
  author,
}: {
  uid: string;
  message: string;
  author?: {
    displayName: string;
    photoURL?: string;
  };
}) {
  if (message.length <= 0) {
    return {
      result: false,
      message: '메시지를 입력해주세요.',
    };
  }
  try {
    await fetch('/api/messages.add', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        uid,
        message,
        author,
      }),
    });
    return {
      result: true,
    };
  } catch (err) {
    console.error(err);
    return {
      result: false,
      message: '메시지 등록 실패',
    };
  }
}

const UserHomePage: NextPage<Props> = function ({ userInfo, screenName }) {
  const [message, setMessage] = useState<string>('');
  const [isAnnonymous, setIsAnnonymous] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [messageList, setMessageList] = useState<InMessage[]>([]);
  const [messageListFetchTrigger, setMessageListFetchTrigger] = useState<boolean>(false);

  const toast = useToast();
  const { authUser } = useAuth();

  const fetchMessageInfo = async ({ uid, messageId }: { uid: string; messageId: string }) => {
    const response = await fetch(`/api/messages.info?uid=${uid}&messageId=${messageId}`);
    if (response.status === 200) {
      const data: InMessage = await response.json();
      setMessageList((prev) => {
        const findIndex = prev.findIndex((fv) => fv.id === data.id);
        if (findIndex >= 0) {
          const updateArr = [...prev];
          updateArr[findIndex] = data;
          return updateArr;
        }
        return prev;
      });
    }
  };

  useQuery(
    ['messageList', userInfo?.uid, page, messageListFetchTrigger],
    async () =>
      // eslint-disable-next-line no-return-await
      await axios.get<{
        totalElements: number;
        totalPages: number;
        page: number;
        size: number;
        content: InMessage[];
      }>(`/api/messages.list?uid=${userInfo?.uid}&page=${page}&size=10`),
    {
      keepPreviousData: true,
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        setTotalPage(data.data.totalPages);
        if (page === 1) {
          setMessageList([...data.data.content]);
          return;
        }
        setMessageList((prev) => [...prev, ...data.data.content]);
      },
    },
  );

  // useEffect(() => {
  //   if (userInfo === null) return;
  //   fetchMessageList(userInfo.uid);
  // }, [userInfo, messageListFetchTrigger, page]);

  const onTextareaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (e.currentTarget.value) {
      const lineCount = (e.currentTarget.value.match(/[^\n]*\n[^\n]*/gi)?.length ?? 1) + 1;
      if (lineCount > 7) {
        toast({
          title: '최대 7줄까지 작성 가능합니다.',
          position: 'top',
        });
      }
      setMessage(e.currentTarget.value);
    }
  };

  const onSwitchChange = (_: ChangeEvent<HTMLInputElement>) => {
    if (authUser === null) {
      toast({
        title: '로그인이 필요합니다.',
        position: 'top-right',
      });
      return;
    }
    setIsAnnonymous((prev) => !prev);
  };

  if (userInfo === null) {
    return <p>사용자를 찾을 수 없습니다.</p>;
  }

  const onButtonClick = async (_: MouseEvent<HTMLButtonElement>) => {
    const postData: {
      message: string;
      uid: string;
      author?: {
        displayName: string;
        photoURL?: string;
      };
    } = {
      message,
      uid: userInfo.uid,
    };
    if (isAnnonymous === false) {
      postData.author = {
        photoURL: authUser?.photoURL ?? 'https://bit.ly/broken-link',
        displayName: authUser?.displayName ?? 'annonymous',
      };
    }
    const messageResponse = await postMessage(postData);
    if (messageResponse.result === false) {
      toast({ title: '메시지 등록 실패', position: 'top-right' });
    }
    setMessage('');
    setPage(1);
    setTimeout(() => {
      setMessageListFetchTrigger((prev) => !prev);
    }, 50);
  };

  const isOwner = authUser !== null && authUser.uid === userInfo.uid;
  return (
    <ServiceLayout title={`${userInfo.displayName}의 홈`} minH="100vh" backgroundColor="gray.50">
      <Box maxW="md" mx="auto" pt="6">
        <Box borderWidth="1px" borderRadius="lg" overflow="hidden" mb="2" bg="white">
          <Flex p="6">
            <Avatar size="lg" src={userInfo.photoURL ?? 'https://bit.ly/broken-link'} mr="2" />
            <Flex direction="column" justify="center">
              <Text fontSize="md">{userInfo.displayName}</Text>
              <Text fontSize="xs">{userInfo.email}</Text>
            </Flex>
          </Flex>
        </Box>
        <Box borderWidth="1px" borderRadius="lg" overflow="hidden" mb="2" bg="white" p="2">
          <Flex align="center">
            <Avatar
              size="xs"
              src={isAnnonymous ? 'https://bit.ly/broken-link' : authUser?.photoURL ?? 'https://bit.ly/broken-link'}
              mr="2"
            />
            <Textarea
              bg="gray.100"
              border="none"
              placeholder="무엇이 궁금한가요?"
              resize="none"
              minH="unset"
              overflow="hidden"
              fontSize="xs"
              mr="2"
              as={ResizeTextarea}
              maxRows={7}
              value={message}
              onChange={onTextareaChange}
            />
            <Button
              bgColor="#FFB86C"
              color="white"
              colorScheme="yellow"
              variant="solid"
              size="sm"
              disabled={message.length === 0}
              onClick={onButtonClick}
            >
              등록
            </Button>
          </Flex>
          <FormControl display="flex" alignItems="center" mt="1">
            <Switch
              size="sm"
              colorScheme="orange"
              id="annonymous"
              mr="1"
              isChecked={isAnnonymous}
              onChange={onSwitchChange}
            />
            <FormLabel htmlFor="annonymous" mb="0" fontSize="xx-small">
              Annonymous
            </FormLabel>
          </FormControl>
        </Box>
        <VStack spacing="12px" mt="6">
          {messageList.map((messageData) => (
            <MessageItem
              displayName={userInfo.displayName ?? ''}
              item={messageData}
              uid={userInfo.uid}
              screenName={screenName}
              photoURL={userInfo.photoURL ?? 'https://bit.ly/broken-link'}
              isOwner={isOwner}
              key={`message-item-${userInfo.uid}-${messageData.id}`}
              onSendComplete={() => {
                fetchMessageInfo({ uid: userInfo.uid, messageId: messageData.id });
              }}
            />
          ))}
        </VStack>
        {totalPage > page && (
          <Button
            width="full"
            mt="2"
            fontSize="2xl"
            leftIcon={<TriangleDownIcon />}
            onClick={() => {
              setPage((prev) => prev + 1);
            }}
          >
            더보기
          </Button>
        )}
      </Box>
    </ServiceLayout>
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async ({ query }) => {
  const { screenName } = query;
  if (screenName === undefined) {
    return {
      props: {
        userInfo: null,
        screenName: '',
      },
    };
  }
  const screenNameToString = Array.isArray(screenName) ? screenName[0] : screenName;
  try {
    const protocol = process.env.PROTOCOL || 'http';
    const host = process.env.HOST || 'localhost';
    const port = process.env.PORT || '3000';
    const baseUrl = `${protocol}://${host}:${port}`;
    const userInfoResponse: AxiosResponse<InAuthUser> = await axios(`${baseUrl}/api/user.info/${screenName}`);
    // console.info(userInfoResponse.data);
    return {
      props: {
        userInfo: userInfoResponse.data ?? null,
        screenName: screenNameToString,
      },
    };
  } catch (err) {
    console.error(err);
    return {
      props: {
        userInfo: null,
        screenName: '',
      },
    };
  }
};

export default UserHomePage;
