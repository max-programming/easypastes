import {
	Box,
	BoxProps,
	ChakraProvider,
	CSSReset,
	theme
} from '@chakra-ui/react';
import { useEffect } from 'react';
import { ClerkProvider } from '@clerk/clerk-react';
import type { AppProps } from 'next/app';
import '@fontsource/poppins/400.css';
import '@fontsource/fira-code/500.css';
import 'styles/globals.css';
import NextNProgress from 'nextjs-progressbar';
import importLangs from 'utils/importLangs';
import { motion } from 'framer-motion';

const clerkFrontendApi = process.env.NEXT_PUBLIC_CLERK_FRONTEND_API;

const MotionBox = motion<BoxProps>(Box);

function MyApp({ Component, pageProps, router }: AppProps) {
	useEffect(importLangs, []);
	return (
		<ClerkProvider
			frontendApi={clerkFrontendApi}
			navigate={to => router.push(to)}
		>
			<ChakraProvider>
				<MotionBox
					key={router.route}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
				>
					<CSSReset />
					<NextNProgress color={theme.colors.purple[500]} />
					<Component {...pageProps} />
				</MotionBox>
			</ChakraProvider>
		</ClerkProvider>
	);
}

export default MyApp;
