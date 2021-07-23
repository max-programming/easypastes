import { useRouter } from 'next/router';
import { ChakraProvider, CSSReset, theme } from '@chakra-ui/react';
import { useEffect } from 'react';
import { ClerkProvider } from '@clerk/clerk-react';
import type { AppProps } from 'next/app';
import '@fontsource/poppins/400.css';
import '@fontsource/fira-code/500.css';
import 'styles/nprogress.css';
import 'styles/globals.css';
import NextNProgress from 'nextjs-progressbar';
import importLangs from 'utils/importLangs';

const clerkFrontendApi = process.env.NEXT_PUBLIC_CLERK_FRONTEND_API;

function MyApp({ Component, pageProps }: AppProps) {
	const router = useRouter();
	useEffect(importLangs, []);
	return (
		<ClerkProvider
			frontendApi={clerkFrontendApi}
			navigate={to => router.push(to)}
		>
			<ChakraProvider>
				<CSSReset />
				<NextNProgress color={theme.colors.purple[500]} />
				<Component {...pageProps} />
			</ChakraProvider>
		</ClerkProvider>
	);
}

export default MyApp;
