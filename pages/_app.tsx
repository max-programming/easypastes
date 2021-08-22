// Packages
import NextNProgress from 'nextjs-progressbar';
import {
  Box,
  BoxProps,
  ChakraProvider,
  CSSReset,
  theme
} from '@chakra-ui/react';
import { ClerkProvider } from '@clerk/clerk-react';
import { motion } from 'framer-motion';
import { DefaultSeo } from 'next-seo';
import { useEffect } from 'react';

// Types
import type { AppProps } from 'next/app';

// Custom files
import importLangs from 'utils/importLangs';
import SEO from 'next-seo.config';

// CSS
import '@fontsource/poppins/400.css';
import '@fontsource/fira-code/500.css';
import 'styles/globals.css';

// Variables
const clerkFrontendApi = process.env.NEXT_PUBLIC_CLERK_FRONTEND_API;
const MotionBox = motion<BoxProps>(Box);

const MyApp = ({ Component, pageProps, router }: AppProps) => {
  useEffect(importLangs, []);

  return (
    <>
      <ClerkProvider
        frontendApi={clerkFrontendApi}
        navigate={to => router.push(to)}
      >
        <DefaultSeo {...SEO} />
        <ChakraProvider>
          <MotionBox
            key={router.route}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <CSSReset />
            <NextNProgress
              color={theme.colors.purple[500]}
              options={{ showSpinner: false }}
            />
            <Component {...pageProps} />
          </MotionBox>
        </ChakraProvider>
      </ClerkProvider>
    </>
  );
};

export default MyApp;
