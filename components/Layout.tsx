import { useRouter } from 'next/router';

import { Box } from '@chakra-ui/react';
import type { ReactNode } from 'react';

import Footer from './Footer';
import Navbar from './Navbar';

// Types definition
interface Props {
  children?: ReactNode;
}

// Layout element with Footer and navbars
const Layout = ({ children }: Props) => {
  const router = useRouter();
  return (
    <>
      <header>
        <Navbar />
      </header>
      <Box fontFamily="Poppins">{children}</Box>
      <Box hidden={router.pathname !== '/'}>
        <footer>
          <Footer />
        </footer>
      </Box>
    </>
  );
};

export default Layout;
