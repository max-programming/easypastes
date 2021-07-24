import type { ReactNode } from 'react';
import Head from 'next/head';
import { Box, useMediaQuery } from '@chakra-ui/react';
import Navbar from './Navbar';

// Types definition
interface Props {
  children?: ReactNode;
  title?: string;
  links?: Array<{
    url: string;
    text: string;
  }>;
}

// Layout element with Footer and navbars
const Layout = ({ children, title, links }: Props) => {
  const [matches] = useMediaQuery('(prefers-color-scheme: dark)');
  return (
    <>
      <Head>
        <title>{title || 'Easy Tools'}</title>
      </Head>
      <header>
        <Navbar />
      </header>
      <Box fontFamily="Poppins">{children}</Box>
    </>
  );
};

export default Layout;
