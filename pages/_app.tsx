import type { AppProps } from 'next/app';

import { Box, BoxProps, CSSReset, ChakraProvider } from '@chakra-ui/react';
import {
  ClerkProvider,
  RedirectToSignIn,
  SignedIn,
  SignedOut
} from '@clerk/nextjs';
import { motion } from 'framer-motion';
import { DefaultSeo } from 'next-seo';
import SEO from 'next-seo.config';
import NextNProgress from 'nextjs-progressbar';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';

import importLangs from 'utils/importLangs';
import theme from 'utils/theme';

import '@fontsource/fira-code/500.css';
import '@fontsource/poppins/400.css';
import 'emoji-mart/css/emoji-mart.css';
import 'styles/globals.css';

const publicPages = [
  '/',
  '/sign-in/[[...index]]',
  '/sign-up/[[...index]]',
  '/pastes/[[...paste]]',
  '/user/pastes/[userId].tsx'
];

const MotionBox = motion<BoxProps>(Box);

const MyApp = ({ Component, pageProps, router }: AppProps) => {
  useEffect(importLangs, []);
  const isPublicPage = publicPages.includes(router.pathname);

  return (
    <>
      <ClerkProvider>
        <DefaultSeo {...SEO} />
        <ChakraProvider theme={theme}>
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
            <Toaster position="top-right" reverseOrder={false} />
            {isPublicPage ? (
              <Component {...pageProps} />
            ) : (
              <>
                <SignedIn>
                  <Component {...pageProps} />
                </SignedIn>
                <SignedOut>
                  <RedirectToSignIn />
                </SignedOut>
              </>
            )}
          </MotionBox>
        </ChakraProvider>
      </ClerkProvider>
    </>
  );
};

export default MyApp;
