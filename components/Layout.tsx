import type { ReactNode } from 'react';
import Head from 'next/head';
import { Box, useMediaQuery } from '@chakra-ui/react';
import Navbar from './Navbar';
import { DefaultSeo } from 'next-seo';
import SEO from 'next-seo.config';

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
      <DefaultSeo
        {...SEO}
        title={
          title || 'Easy Pastes - Easiest Way to create and share code pastes'
        }
      />
      <header>
        <Navbar />
      </header>
      <Box fontFamily="Poppins">{children}</Box>
    </>
  );
};

export default Layout;
