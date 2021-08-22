// Packages
import { useRouter } from 'next/router';

// Types
import type { ReactNode } from 'react';

// Components
import { Box } from '@chakra-ui/react';
import Navbar from './Navbar';
import Footer from './Footer';

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
