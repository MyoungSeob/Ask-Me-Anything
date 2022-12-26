import { Box, BoxProps } from '@chakra-ui/react';
import Head from 'next/head';
import GNB from './GNB';

interface Props {
  title: string;
  children: React.ReactNode;
}
export const ServiceLayout: React.FC<Props & BoxProps> = function ({
  title = 'blah x2, children',
  children,
  ...boxProps
}: Props) {
  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <Box {...boxProps}>
      <Head>
        <title>{title}</title>
      </Head>
      <GNB />
      {children}
    </Box>
  );
};
