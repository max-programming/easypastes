import type { ReactNode } from 'react';
import { Box } from '@chakra-ui/react';
import Navbar from './Navbar';
import Footer from './Footer';
import { useRouter } from 'next/router';

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
